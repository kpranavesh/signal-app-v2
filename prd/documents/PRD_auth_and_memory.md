# PRD: Auth & Memory System — Signal v2

**Status:** Draft
**Date:** 2026-03-08
**Scope:** Login, persistent user profile, social content source connections

---

## 1. Problem

Signal currently asks users to re-enter their profile (role, industry, comfort level, goals, tools) on every visit. There is no persistence, no identity, and no way to connect a user's existing reading sources. This creates friction and limits the personalisation ceiling — Signal can only score articles against generic keyword rules, not against the specific writers and topics a user already follows.

---

## 2. Goals

1. **Persistent identity** — profile survives page refresh, device switch, and session end.
2. **Zero-friction login** — Google OAuth as the primary path; email/password as fallback.
3. **Source connections** — users connect Medium and Substack (and optionally RSS) so Signal can surface content they already subscribe to, de-duplicated and ranked alongside the core feed.
4. **Profile memory** — every preference change (muted topics, boosted topics, comfort level edits) is saved automatically.

Non-goals for this release:
- Social graph / follow-other-users
- Full reader / inbox replacement
- Native mobile app

---

## 3. User Stories

### 3.1 Auth
| # | Story | Acceptance criteria |
|---|-------|---------------------|
| A1 | As a new user, I can sign up with my Google account in one click | OAuth flow completes, profile skeleton created, redirected to onboarding |
| A2 | As a new user, I can sign up with email + password | Email/password stored via Supabase Auth, email verification sent |
| A3 | As a returning user, my profile is loaded automatically when I open Signal | All fields pre-filled; no onboarding screen shown |
| A4 | As a user, I can sign out from a settings menu | Session cleared, profile wiped from client memory, redirected to login |
| A5 | As a user, my session persists across browser restarts (30-day refresh token) | Re-opening the app does not prompt login for 30 days |

### 3.2 Profile Memory
| # | Story | Acceptance criteria |
|---|-------|---------------------|
| P1 | As a returning user, my role, industry, comfort, goals, and AI tools are saved | Loaded from DB on login; no re-entry needed |
| P2 | As a user, topic mutes and boosts I set in a session persist to next visit | Written to DB on change, applied on next briefing fetch |
| P3 | As a user, I can edit any profile field from a settings panel | Changes saved in real time; next briefing reflects new values |

### 3.3 Social Source Connections
| # | Story | Acceptance criteria |
|---|-------|---------------------|
| S1 | As a user, I can connect my Medium account to import the publications/writers I follow | Medium RSS feeds for followed writers are fetched; articles appear in my briefing with "From your Medium" label |
| S2 | As a user, I can connect my Substack subscriptions | User provides their Substack email or username; Signal resolves followed newsletters → RSS; articles surface in briefing |
| S3 | As a user, I can add any custom RSS feed manually | URL input → validated → stored; articles included in scoring |
| S4 | As a user, connected sources show in a "My Sources" panel with enable/disable toggles | Toggling off a source removes it from the feed without deleting the connection |
| S5 | As a user, articles from my connected sources are clearly labelled by origin | Badge or tag indicating "Medium — Towards Data Science", "Substack — Import AI" etc. |
| S6 | As a user, connected-source articles are ranked by the same scoring model as core feeds | Relevance score applied identically; user's sources compete fairly with Signal's default feeds |

---

## 4. Functional Requirements

### 4.1 Authentication

**Provider:** Supabase Auth
**Methods:**
- Google OAuth (primary — one-click, no password)
- Email + password (secondary — with email verification)

**Session behaviour:**
- JWT issued on login; stored in `httpOnly` cookie (not `localStorage`) to prevent XSS token theft
- Refresh token TTL: 30 days
- On token expiry: silent refresh attempt; if that fails, redirect to `/login`

**Routes:**
- `/login` — public, shows Google button + email form
- `/` — protected; redirect to `/login` if no session
- `/api/briefing` — protected at API level (validate session token server-side)
- `/api/audio` — protected at API level

### 4.2 User Profile Table

```sql
CREATE TABLE user_profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT,
  role        TEXT,
  industry    TEXT,
  comfort     TEXT CHECK (comfort IN ('skeptic','beginner','active','power')),
  goals       TEXT[],
  ai_tools    TEXT[],
  topics_muted    TEXT[] DEFAULT '{}',
  topics_boosted  TEXT[] DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
```

- Row created on first login with nulls; populated during onboarding.
- `updated_at` bumped via Postgres trigger on any column change.
- RLS: user can only read/write their own row (`auth.uid() = id`).

### 4.3 Connected Sources Table

```sql
CREATE TABLE user_sources (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  type        TEXT CHECK (type IN ('medium','substack','rss')),
  label       TEXT,           -- display name e.g. "Towards Data Science"
  feed_url    TEXT NOT NULL,
  enabled     BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

- One row per feed URL.
- `enabled = FALSE` pauses fetching without deleting the connection.
- RLS: user can only read/write their own rows.

### 4.4 Source Resolution Logic

**Medium:**
Medium exposes RSS per user profile (`medium.com/@username/feed`) and per publication. The connection flow:
1. User enters their Medium username or profile URL.
2. Backend fetches `medium.com/@{username}/feed`, validates it parses, extracts the list of following (if accessible) or treats the user's own feed as a source.
3. Each followed publication resolved to its own feed URL and stored as separate `user_sources` rows.

_Note: Medium's public API is limited. The practical starting approach is asking users to paste the URL of each publication they want to follow, rather than automated discovery of all followings._

**Substack:**
Substack exposes RSS per newsletter (`{newsletter}.substack.com/feed`). The connection flow:
1. User enters the Substack newsletter URL or slug (e.g. `importai.substack.com`).
2. Backend validates the RSS endpoint is reachable.
3. Stored as a `user_sources` row with `type = 'substack'`.

For bulk import: prompt user to paste a list of Substack newsletter slugs, one per line. Batch validate and insert.

**Custom RSS:**
1. User pastes any RSS/Atom URL.
2. Backend validates it parses with `rss-parser`.
3. Stored with `type = 'rss'` and user-provided label.

### 4.5 Feed Fetching with Connected Sources

The existing `loadArticles()` function in `api/briefing/route.ts` fetches a static `FEEDS` array. With connected sources, the flow becomes:

1. Resolve session → get `user_id`
2. Fetch `user_sources` rows where `user_id = ? AND enabled = TRUE`
3. Merge with the global `FEEDS` array
4. Fetch all feeds in parallel (existing Promise.all pattern)
5. Score all articles with the user's profile (existing `scoreArticle()`)
6. Return top 8 as today, but tag articles from connected sources with their origin label

Article schema gains one field: `userSource: string | null` (null = Signal default feed, string = user's source label).

### 4.6 "My Sources" Settings Panel

A new section in the existing settings / profile panel:

```
My Sources
──────────────────────────────────────
[+ Add Medium]  [+ Add Substack]  [+ Add RSS feed]

  ✓  Towards Data Science  (Medium)         [Disable]  [Remove]
  ✓  Import AI  (Substack)                  [Disable]  [Remove]
  ✓  hackernoon.com/feed  (RSS)             [Disable]  [Remove]
  ✗  The Batch  (Substack)  — disabled      [Enable]   [Remove]
```

Toggle state written to `user_sources.enabled` immediately via optimistic UI.

---

## 5. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Security | Session cookie `httpOnly`, `Secure`, `SameSite=Lax`. No tokens in URL params or localStorage |
| Privacy | User email not exposed in client-side JS. Profile row only accessible via Supabase RLS to the owning user |
| Performance | Connected sources fetched in the same parallel Promise.all as core feeds — no extra latency budget. Feed timeout 8 s per source (existing `rss-parser` config) |
| Reliability | If a user's connected source fails to fetch, it is silently skipped (existing try/catch pattern). No failure of a personal feed breaks the core briefing |
| Scalability | No changes needed for <10k users. At 10k+, consider caching resolved feed URLs per source to avoid re-fetching on every request |
| Offline / error | If Supabase is unreachable at login, show "Service temporarily unavailable" — never silently continue as anonymous |

---

## 6. UX Flow

### New user
```
/ → redirect to /login
/login → Google button → OAuth → Supabase session
→ redirect to / → onboarding wizard (existing 5-step flow)
→ profile saved to DB on "Get my briefing" click
→ briefing loads
```

### Returning user
```
/ → session valid → profile loaded from DB → briefing fetches immediately
   (no onboarding; profile pre-filled if user opens settings)
```

### Connecting a source (existing user)
```
Settings panel → "My Sources" → "+ Add Substack"
→ modal: enter newsletter URL or slug
→ validate → show feed name and article count as preview
→ "Add source" → stored in user_sources → appears in next briefing
```

### Profile edit
```
Settings panel → edit any field inline → auto-saved on blur
→ "Refresh briefing" banner appears → user clicks → new briefing fetched
```

---

## 7. Tech Stack

| Concern | Choice | Reason |
|---------|--------|--------|
| Auth | Supabase Auth | Already using Supabase conventions; Google OAuth + email built-in; free tier covers 50k MAU |
| DB | Supabase Postgres | Same project; RLS keeps per-user data isolated without extra middleware |
| Session | Supabase `@supabase/ssr` cookie helper for Next.js | Handles server-side session reading in Route Handlers and Server Components |
| Source validation | Existing `rss-parser` | No new dep; already in the project |
| Client state | React `useState` + Supabase realtime (optional) | Profile changes small enough to not need a state library |

---

## 8. Out of Scope (v2 / Future)

- Twitter/X, LinkedIn, YouTube, or Podcast connections
- "Digest" email delivery of the briefing
- Team/org accounts and shared profiles
- Algorithmic learning from click-through (implicit feedback)
- Native mobile push notifications

---

## 9. Open Questions

| # | Question | Owner | Target |
|---|----------|-------|--------|
| Q1 | Medium API rate limits for RSS discovery — do we ask users to manually paste feed URLs or attempt automated discovery? | Engineering | Before build starts |
| Q2 | Should connected-source articles be subject to the same 120-article cap, or get a separate quota? | Product | Before briefing route change |
| Q3 | Does a user's connected sources replace some of Signal's default feeds, or always add on top? | Product | Before briefing route change |
| Q4 | What happens to a user's profile if they delete their Google account? Cascade delete or soft-delete + grace period? | Engineering | Before auth build |

---

## 10. Milestones

| Milestone | Scope | Rough size |
|-----------|-------|------------|
| M1 — Auth shell | Supabase project, Google OAuth, email/password login, `/login` page, protected routes, empty profile row on signup | 1–2 days |
| M2 — Profile persistence | `user_profiles` table, onboarding writes to DB, briefing reads from DB, settings panel edits | 1–2 days |
| M3 — Source connections | `user_sources` table, Substack + RSS add/remove UI, merge into `loadArticles()`, origin labelling on articles | 2–3 days |
| M4 — Medium resolution | Medium username → feed URL resolution, bulk paste flow | 1 day |
| M5 — Polish | Session edge cases, error states, mobile layout, performance pass | 1 day |

**Total estimate: 6–9 focused dev days**
