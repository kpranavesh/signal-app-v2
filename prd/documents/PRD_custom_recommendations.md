# PRD: Custom Recommendation Controls — Signal v2

**Status:** Draft
**Date:** 2026-03-08
**Classification:** Advanced feature (surfaced after onboarding; not blocking core briefing)
**Depends on:** PRD_auth_and_memory.md (requires login + profile persistence)

---

## 1. Problem

Signal's scoring model is invisible. Users see a ranked briefing but have no way to understand why an article appeared, why something they care about is missing, or how to reshape future results. The only current mechanism — `topicsMuted` and `topicsBoosted` on the profile — is never exposed in the UI and has no effect on the scoring engine's keyword weights.

As users connect their own sources (Medium, Substack, custom RSS from the auth PRD), the feed grows. Without controls, the briefing becomes a black box that users cannot trust or tune.

---

## 2. Goals

1. Give users direct, permanent control over what rises and what disappears in their feed.
2. Make the scoring model transparent — every article shows the signal that surfaced it.
3. Apply mutes and boosts across all sources: Signal defaults and user-connected feeds alike.
4. Keep the controls advanced/optional — the core briefing works without touching them.

Non-goals:
- Replacing the keyword scoring model with a learned model (future work)
- Per-article manual rating / thumbs up (future work; implicit feedback)
- Team-level or shared preference profiles

---

## 3. Core Concepts

### Signal (noun)
A named pattern that can either amplify or suppress articles. A signal is any of:
- A **topic tag** (e.g. "Policy & society", "Design & creative tools")
- A **source** (e.g. "openai", "the-verge", or a connected Substack slug)
- A **keyword or phrase** (e.g. "layoffs", "GPT-5", "regulation")
- An **author** (byline string match — useful for Substack/Medium where bylines are present)

### Boost
A signal with positive weight (+10 to +30 points added to `scoreArticle()`). Articles matching a boosted signal rank higher in the briefing.

### Mute
A signal with weight `-100` — effectively a hard filter. Articles matching a muted signal are removed from the briefing entirely before the top-N cut.

### Signal Strength
For boosts, users choose: **Low (+10)**, **Medium (+20)**, **High (+30)**. Mutes are always total (no partial mute).

---

## 4. User Stories

### 4.1 Mutes

| # | Story | Acceptance criteria |
|---|-------|---------------------|
| M1 | As a user, I can mute a topic from an article card directly | "Mute this topic" button on each card → topic added to mutes → article and siblings removed from current and future briefings |
| M2 | As a user, I can mute a source from an article card | "Mute this source" → source added to mutes → all articles from that source removed |
| M3 | As a user, I can mute a keyword phrase | Settings → Mutes → type keyword → save → articles whose title or summary contains that phrase are excluded |
| M4 | As a user, I can see all my active mutes in one list | Settings → Mutes tab shows every muted topic, source, and keyword |
| M5 | As a user, I can remove a mute at any time | Unmuting a topic/source immediately restores those articles on next briefing refresh |

### 4.2 Boosts

| # | Story | Acceptance criteria |
|---|-------|---------------------|
| B1 | As a user, I can boost a topic from an article card | "See more like this" → topic added to boosts at Medium strength |
| B2 | As a user, I can boost a source | "Prioritise this source" → source boosted; articles from it rank higher |
| B3 | As a user, I can boost a keyword phrase | Settings → Boosts → type keyword + choose strength → save |
| B4 | As a user, I can set boost strength: Low / Medium / High | Strength picker shown in settings panel; defaults to Medium for in-card actions |
| B5 | As a user, I can see all my active boosts in one list | Settings → Boosts tab shows every boosted topic, source, keyword, and their current strength |
| B6 | As a user, I can adjust boost strength after creation | Inline strength picker in the boosts list |
| B7 | As a user, I can remove a boost at any time | Removing a boost returns that topic/source to neutral weight |

### 4.3 Transparency

| # | Story | Acceptance criteria |
|---|-------|---------------------|
| T1 | As a user, I can see why an article appeared | Each article has a "Why this?" toggle that shows the scoring breakdown (existing `explain()` output) |
| T2 | As a user, I can see which of my signals fired for an article | Breakdown highlights rows where a user-defined boost/mute contributed |
| T3 | As a user, I can act on the explanation directly | "Why this?" panel has "Mute topic" and "Boost topic" buttons inline |

### 4.4 Feed Source Controls

| # | Story | Acceptance criteria |
|---|-------|---------------------|
| F1 | As a user, I can toggle any connected source on/off | Covered in auth PRD; restated here as it interacts with boost/mute logic |
| F2 | As a user, I can boost a connected Substack or Medium source to always appear | Boosting a user source sets its articles' base score +30 before other factors |
| F3 | As a user, I can see a preview of what a mute or boost would do | "Preview" button on a pending change shows which current briefing articles would be added or removed |

---

## 5. Functional Requirements

### 5.1 Data Model

New table alongside `user_profiles`:

```sql
CREATE TABLE user_signals (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  type        TEXT CHECK (type IN ('topic','source','keyword','author')),
  value       TEXT NOT NULL,           -- e.g. "Policy & society", "the-verge", "GPT-5"
  action      TEXT CHECK (action IN ('boost','mute')),
  strength    INTEGER DEFAULT 20       -- boost points: 10 | 20 | 30. Mutes always -100
                CHECK (strength IN (10, 20, 30)),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Unique constraint: one signal per (user, type, value) — no duplicates
CREATE UNIQUE INDEX user_signals_unique ON user_signals (user_id, type, value);
```

RLS: user can only read/write their own rows (`auth.uid() = user_id`).

### 5.2 Scoring Engine Changes

The recommender's `scoreArticle()` function in `recommender/score.ts` gains a new parameter:

```ts
export function scoreArticle(
  profile: UserProfile,
  article: Article,
  signals?: UserSignal[],   // NEW — user's custom boosts and mutes
): { score: number; breakdown: ScoreFactor[] }
```

Processing order within `scoreArticle()`:

1. Run all existing keyword/role/industry factors (unchanged).
2. Apply user signals — loop through `signals`:
   - **Mute:** if signal matches, add `{ factor: "user:mute — {type}:{value}", points: -100 }`
   - **Boost:** if signal matches, add `{ factor: "user:boost — {type}:{value}", points: signal.strength }`
3. Clamp to 0–100 as before (muted articles will hit 0 and be filtered pre-sort).

Match logic per signal type:
- `topic` → `article.topic === signal.value` (exact)
- `source` → `article.source === signal.value` (exact)
- `keyword` → `(article.title + " " + article.summary).toLowerCase().includes(signal.value.toLowerCase())`
- `author` → `article.author?.toLowerCase().includes(signal.value.toLowerCase())` (requires `author` field added to `Article` type)

Post-scoring filter in `recommend()`: remove any article where `score === 0` before the top-N cut (muted articles effectively disappear).

### 5.3 API Changes

`GET /api/briefing` gains signal loading:

```
1. Read session → user_id
2. Fetch user_profiles row  (existing)
3. Fetch user_sources rows  (from auth PRD)
4. Fetch user_signals rows  (NEW)
5. loadArticles() across all feeds  (existing + connected sources from auth PRD)
6. recommend(profile, articles, 8, signals)  (signals passed through)
7. Return briefing + _debug.signalsApplied count
```

The `_debug` object gains:
```json
{
  "signalsApplied": 5,
  "mutes": ["Policy & society", "openai"],
  "boosts": [{ "value": "importai.substack.com", "strength": 30 }]
}
```

### 5.4 UI — Signal Controls

#### In-card quick actions (per article card)
Three-dot menu or hover actions expose:
- **Mute topic** — mutes `article.topic`
- **Mute source** — mutes `article.source`
- **See more like this** — boosts `article.topic` at Medium strength
- **Why this?** — inline scoring breakdown

All quick actions write to `user_signals` immediately and re-rank the visible briefing client-side without a full API reload (optimistic update). A brief "Muted: Policy & society — Undo" toast appears for 5 seconds.

#### Settings panel — "Feed Controls" tab

Three sub-tabs: **Boosts**, **Mutes**, **Preview**

**Boosts tab:**
```
Active boosts
──────────────────────────────────────────────────
  [Topic]   Design & creative tools   ●●○  Medium    [Edit] [Remove]
  [Source]  importai.substack.com     ●●●  High      [Edit] [Remove]
  [Keyword] multimodal                ●○○  Low       [Edit] [Remove]

+ Add boost  [ Type: Topic ▾ ]  [ Enter value... ]  [ ●●○ Medium ▾ ]  [Add]
```

**Mutes tab:**
```
Active mutes
──────────────────────────────────────────────────
  [Topic]   Policy & society          [Remove]
  [Source]  deadline.com              [Remove]
  [Keyword] layoffs                   [Remove]

+ Add mute  [ Type: Topic ▾ ]  [ Enter value... ]  [Mute]
```

**Preview tab:**
Shows the current briefing re-ranked with all active signals applied, side-by-side with a neutral (no signals) ranking. Diff highlights articles that moved up, down, or were removed. This is a read-only view — no API call; computed client-side from the last fetched article pool.

### 5.5 Autocomplete for Signal Values

When adding a boost/mute:
- **Topic** type: dropdown of all known topics (Signal defaults + user source topic labels)
- **Source** type: dropdown of all active sources (Signal defaults + user's connected sources)
- **Keyword**: free-text only
- **Author**: free-text only

Autocomplete values derived from the last fetched article pool (client-side, no extra API call).

---

## 6. Signal Precedence Rules

When a user has conflicting signals on the same article:

| Conflict | Rule |
|----------|------|
| Mute + Boost on same topic | Mute wins — article is suppressed |
| Two boosts on same article (different types, e.g. source + keyword) | Both fire — scores stack up to the 100 cap |
| User mute conflicts with high relevance score | Mute always wins — score goes to 0 regardless of other factors |

---

## 7. Edge Cases

| Scenario | Behaviour |
|----------|-----------|
| User mutes all topics | Briefing shows empty state: "All topics are muted. Remove a mute in Feed Controls to see articles." |
| User boosts a source that has no articles this session | Boost stored; has no visible effect until that source publishes |
| Keyword mute is a very common word (e.g. "AI") | Allowed — user's choice. Warning shown: "This keyword appears in most articles and may empty your briefing." shown at save time if >80% of the last fetched pool would be removed |
| User has no signals | `signals` array is empty; `scoreArticle()` behaves exactly as today |
| Signal for a source that user later disconnects | Signal persisted; has no effect while source is disconnected. If source is reconnected, signal re-applies |

---

## 8. What Doesn't Change

- The core scoring model's keyword rules (role, industry, comfort, goal, recency) are unchanged. User signals are an additive layer on top.
- Users without an account (anonymous) get no signal controls — the feature requires login.
- The onboarding flow is unchanged — signal controls are not mentioned during onboarding.

---

## 9. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Performance | `user_signals` rows fetched in the same DB round-trip as `user_profiles` (single Supabase query). Target <20 ms added latency |
| Persistence | All signals saved to Supabase; survive session end, device switch |
| Undo | Every quick-action mute/boost shows a 5-second undo toast. Undo writes a DELETE to `user_signals` |
| Limits | Max 50 boosts + 50 mutes per user (UI shows count; disables "Add" at limit with message) |
| Privacy | Signal values stored in plain text in Supabase; covered by same RLS as profile |

---

## 10. Relationship to Auth PRD

This PRD depends on:
- `user_profiles` table and RLS (M2 of auth PRD)
- Session-aware `/api/briefing` route (M1 of auth PRD)
- `user_sources` table for source autocomplete (M3 of auth PRD)

Build order: Auth PRD milestones M1–M3 must be complete before this PRD's build starts.

---

## 11. Milestones

| Milestone | Scope | Rough size |
|-----------|-------|------------|
| C1 — Data layer | `user_signals` table, RLS, Supabase client helpers for CRUD | 0.5 days |
| C2 — Scoring engine | `scoreArticle()` accepts `signals[]`, mute/boost logic, updated `recommend()` filter | 0.5 days |
| C3 — API wiring | `/api/briefing` fetches signals, passes to scorer, `_debug` output | 0.5 days |
| C4 — In-card actions | Three-dot menu, mute/boost quick actions, "Why this?" breakdown, undo toast | 1–2 days |
| C5 — Settings panel | Boosts tab, Mutes tab, autocomplete, strength picker, remove/edit | 1–2 days |
| C6 — Preview tab | Client-side diff view, side-by-side ranking comparison | 1 day |
| C7 — Edge case handling | Empty briefing state, common-keyword warning, signal limit enforcement | 0.5 days |

**Total estimate: 5–7 focused dev days** (after auth PRD is complete)
