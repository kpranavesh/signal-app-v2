"""
Signal API Tester
-----------------
Hits the live briefing endpoint with varied profiles and checks for:
  1. Cache freshness     — each response has a unique timestamp
  2. Claude running      — whySource is "claude", not "fallback"
  3. Profile diversity   — different profiles return different article sets
  4. Score movement      — same article should score differently across profiles
  5. Article recency     — top articles are within the last 14 days
  6. Why-it-matters uniqueness — no two articles share the same explanation

Usage:
  python tests/signal_tester.py                         # hits production
  python tests/signal_tester.py --url http://localhost:3000  # hits local dev
"""

import argparse
import json
import random
import sys
import time
from datetime import datetime, timezone
from itertools import combinations
from typing import Optional

import requests

# ── Test profiles ──────────────────────────────────────────────────────────────
# Deliberately varied to stress-test scoring and caching

PROFILES = [
    {
        "label": "Legal/Compliance — Education",
        "role": "Legal / Compliance",
        "industry": "Education / Research",
        "comfort": "skeptic",
        "goal": "strategic-decisions",
        "aiTools": "",
    },
    {
        "label": "Engineer — Tech (power user, builds)",
        "role": "Engineering / Technical",
        "industry": "Technology / Software",
        "comfort": "power",
        "goal": "build",
        "aiTools": "ChatGPT,Cursor",
    },
    {
        "label": "Marketer — Media",
        "role": "Marketing / Growth",
        "industry": "Media / Marketing / Creative",
        "comfort": "active",
        "goal": "find-tools",
        "aiTools": "ChatGPT",
    },
    {
        "label": "Executive — Finance",
        "role": "Executive / Leadership",
        "industry": "Financial Services",
        "comfort": "skeptic",
        "goal": "strategic-decisions",
        "aiTools": "",
    },
    {
        "label": "HR — Healthcare",
        "role": "HR / People",
        "industry": "Healthcare / Life Sciences",
        "comfort": "beginner",
        "goal": "stay-informed",
        "aiTools": "",
    },
    {
        "label": "Student — no tools yet",
        "role": "Student / Early career",
        "industry": "Education / Research",
        "comfort": "beginner",
        "goal": "curiosity",
        "aiTools": "",
    },
]


# ── Helpers ────────────────────────────────────────────────────────────────────

def fetch(base_url: str, profile: dict) -> dict:
    params = {
        "role":     profile["role"],
        "industry": profile["industry"],
        "comfort":  profile["comfort"],
        "goal":     profile["goal"],
        "aiTools":  profile.get("aiTools", ""),
        "_t":       str(int(time.time() * 1000)),
    }
    resp = requests.get(
        f"{base_url}/api/briefing",
        params=params,
        headers={"Cache-Control": "no-cache", "Pragma": "no-cache"},
        timeout=40,
    )
    resp.raise_for_status()
    return resp.json()


def article_ids(result: dict) -> set:
    return {item["id"] for item in result.get("items", [])}


def article_scores(result: dict) -> dict:
    return {item["id"]: item.get("relevanceScore", 0) for item in result.get("items", [])}


def why_texts(result: dict) -> list:
    return [item.get("whyItMatters", "") for item in result.get("items", [])]


def age_days(published: Optional[str]) -> Optional[float]:
    if not published:
        return None
    try:
        dt = datetime.fromisoformat(published.replace("Z", "+00:00"))
        return (datetime.now(timezone.utc) - dt).total_seconds() / 86400
    except Exception:
        return None


PASS = "\033[92m✓\033[0m"
FAIL = "\033[91m✗\033[0m"
WARN = "\033[93m~\033[0m"


def check(label: str, passed: bool, detail: str = "") -> bool:
    icon = PASS if passed else FAIL
    print(f"  {icon}  {label}" + (f"  →  {detail}" if detail else ""))
    return passed


# ── Tests ──────────────────────────────────────────────────────────────────────

def test_cache_freshness(base_url: str, profile: dict) -> bool:
    """Two back-to-back requests must return different timestamps."""
    r1 = fetch(base_url, profile)
    time.sleep(0.3)
    r2 = fetch(base_url, profile)
    ts1 = r1.get("_debug", {}).get("ts", 0)
    ts2 = r2.get("_debug", {}).get("ts", 0)
    return check(
        "Cache freshness (same profile, 2 requests → different ts)",
        ts1 != ts2 and ts1 != 0,
        f"ts1={ts1}  ts2={ts2}",
    )


def test_why_source(base_url: str, profile: dict) -> bool:
    """whySource should be 'claude', not 'fallback'."""
    r = fetch(base_url, profile)
    source = r.get("_debug", {}).get("whySource", "unknown")
    return check(
        "Claude running (whySource == 'claude')",
        source == "claude",
        f"whySource={source}",
    )


def test_profile_diversity(results: dict) -> bool:
    """Different profiles must not return identical article sets."""
    labels = list(results.keys())
    all_pass = True
    for a, b in combinations(labels, 2):
        ids_a = article_ids(results[a])
        ids_b = article_ids(results[b])
        overlap = len(ids_a & ids_b)
        total   = len(ids_a | ids_b)
        pct     = overlap / total if total else 1.0
        passed  = pct < 0.90  # allow up to 90% overlap (top news will overlap)
        r = check(
            f"Profile diversity: {a[:30]} vs {b[:30]}",
            passed,
            f"{overlap}/{len(ids_a)} articles overlap ({pct:.0%})",
        )
        all_pass = all_pass and r
    return all_pass


def test_score_movement(results: dict) -> bool:
    """The same article should score differently for different profiles."""
    all_scores = {}
    for label, result in results.items():
        for article_id, score in article_scores(result).items():
            all_scores.setdefault(article_id, []).append(score)

    shared = {aid: scores for aid, scores in all_scores.items() if len(scores) > 1}
    if not shared:
        return check("Score movement", False, "No articles shared across profiles to compare")

    moved = sum(1 for scores in shared.values() if max(scores) - min(scores) >= 5)
    pct = moved / len(shared)
    return check(
        "Score movement (same article, different scores per profile)",
        pct >= 0.3,
        f"{moved}/{len(shared)} shared articles ({pct:.0%}) show ≥5pt spread",
    )


def test_article_recency(results: dict) -> bool:
    """Top 3 articles per profile should be ≤14 days old."""
    all_pass = True
    for label, result in results.items():
        items = result.get("items", [])[:3]
        ages  = [age_days(i.get("published")) for i in items]
        stale = [a for a in ages if a is not None and a > 14]
        passed = len(stale) == 0
        r = check(
            f"Recency ({label[:35]})",
            passed,
            f"ages: {[f'{a:.1f}d' if a else '?' for a in ages]}",
        )
        all_pass = all_pass and r
    return all_pass


def test_why_uniqueness(results: dict) -> bool:
    """Within a single profile's briefing, all 'why it matters' must be distinct."""
    all_pass = True
    for label, result in results.items():
        texts = why_texts(result)
        unique = len(set(texts))
        total  = len(texts)
        passed = unique == total
        r = check(
            f"Why-it-matters unique ({label[:35]})",
            passed,
            f"{unique}/{total} unique",
        )
        all_pass = all_pass and r
    return all_pass


# ── Runner ─────────────────────────────────────────────────────────────────────

def run(base_url: str, sample: Optional[int] = None):
    profiles = PROFILES if sample is None else random.sample(PROFILES, min(sample, len(PROFILES)))

    print(f"\n{'='*65}")
    print(f"  Signal API Tester  ->  {base_url}")
    print(f"  Profiles: {len(profiles)}   Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*65}\n")

    results = {}
    print("Fetching briefings…")
    for p in profiles:
        try:
            t0 = time.time()
            data = fetch(base_url, p)
            elapsed = time.time() - t0
            n = len(data.get("items", []))
            src = data.get("_debug", {}).get("whySource", "?")
            print(f"  {p['label'][:45]:<45}  {n} items  {src:<8}  {elapsed:.1f}s")
            results[p["label"]] = data
        except Exception as e:
            print(f"  \033[91mERROR\033[0m  {p['label']}: {e}")

    if not results:
        print("\n\033[91mAll requests failed. Is the server running?\033[0m")
        sys.exit(1)

    first_label   = list(results.keys())[0]
    first_profile = profiles[0]

    print(f"\n{'─'*65}")
    print("TEST RESULTS")
    print(f"{'─'*65}")

    scores = []
    scores.append(int(test_cache_freshness(base_url, first_profile)))
    scores.append(test_why_source(base_url, first_profile))
    scores.append(test_why_uniqueness(results))
    scores.append(test_profile_diversity(results))
    scores.append(test_score_movement(results))
    scores.append(test_article_recency(results))

    passed = sum(scores)
    total  = len(scores)

    print(f"\n{'─'*65}")
    print(f"  {passed}/{total} checks passed", end="")
    if passed == total:
        print("  \033[92m— all good\033[0m")
    elif passed >= total * 0.7:
        print("  \033[93m— some issues\033[0m")
    else:
        print("  \033[91m— failing\033[0m")
    print(f"{'='*65}\n")

    # Dump one sample briefing for manual inspection
    sample_result = results[first_label]
    print(f"Sample briefing for: {first_label}")
    print(f"  ts={sample_result.get('_debug', {}).get('ts')}  whySource={sample_result.get('_debug', {}).get('whySource')}")
    for i, item in enumerate(sample_result.get("items", [])[:3], 1):
        age = age_days(item.get("published"))
        print(f"  {i}. [{item.get('relevanceScore', '?')}%] {item['title'][:60]}")
        print(f"     {item.get('whyItMatters', '')[:100]}")
        print(f"     age: {f'{age:.1f}d' if age else '?'}  source: {item.get('source')}")
    print()

    return passed == total


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Signal API tester")
    parser.add_argument("--url", default="https://signal-app-beta.vercel.app", help="Base URL to test")
    parser.add_argument("--sample", type=int, default=None, help="Test N random profiles instead of all")
    args = parser.parse_args()

    ok = run(args.url, args.sample)
    sys.exit(0 if ok else 1)
