# PRD: Signal Personalization — Day One

## Problem

Signal shows the same AI briefing to every user. A skeptic getting the same content as a power user will churn. Personalization makes the briefing feel like it was written for them.

## Goal

Use onboarding quiz answers to filter, re-rank, and re-tone every briefing card on day one — before we have any behavioral data.

---

## What We Collect at Signup

5 questions. All required. Takes ~90 seconds.

| # | Question | Options | Signal Used For |
|---|---|---|---|
| 1 | How do you use AI today? | Skeptic / Curious / Active / Power user | Tone, depth, vocabulary |
| 2 | What's your primary goal with Signal? | Stay informed / Find tools / Make strategic decisions / Build with AI | Article selection, framing |
| 3 | What industry are you in? | See list below | Topic relevance — which stories surface |
| 4 | What best describes your role? | See list below | Framing — executive vs. hands-on vs. technical |
| 5 | Which AI tools do you already use? | Multi-select: ChatGPT, Copilot, Claude, Gemini, Cursor, Perplexity, Midjourney, None, Other | Avoid redundant "have you tried X" angles |

### Q3 — Industry (pick one)

Covers ~95% of knowledge workers likely to use Signal:

| Option | Captures |
|---|---|
| Technology / Software | SaaS, infra, dev tools, platforms |
| Financial Services | Banking, investing, fintech, insurance |
| Healthcare / Life Sciences | Hospitals, pharma, biotech, medical devices |
| Consulting / Professional Services | Strategy, accounting, legal, advisory |
| Media / Marketing / Creative | Agencies, publishers, brand, content |
| Education / Research | Universities, EdTech, think tanks, R&D |
| Retail / Consumer | E-commerce, CPG, hospitality |
| Government / Public Sector | Federal, state, policy, non-profit |
| Manufacturing / Industrial | Hardware, logistics, energy, construction |
| Other | Free-text capture |

### Q4 — Role (pick one)

Separates *what you do* from *where you work* — the two are independent signals:

| Option | Captures | Framing implication |
|---|---|---|
| Executive / C-Suite | CEO, CTO, VP, Director | Strategic, org-level impact, no tutorials |
| Product | PM, PO, designer | Roadmap angles, competitive moves |
| Engineering / Technical | SWE, data, ML, DevOps | Technical depth welcome, API/code angles |
| Sales / Revenue | AE, SDR, RevOps, CS | How AI changes pipeline, prospecting, retention |
| Marketing / Growth | Demand gen, content, brand | AI for copy, campaigns, analytics |
| Operations / Finance | BizOps, FP&A, procurement | Efficiency, cost, workflow automation angles |
| Research / Analyst | Data analyst, scientist, researcher | Methodology, benchmarks, evidence-based framing |
| Student / Early career | — | Foundational framing, career angle |
| Other | Free-text | — |

---

## How We Use It (Briefing API)

Each briefing card is generated with a personalization prompt prefix:

```
Personalize this article summary for:
- AI level: [skeptic | curious | active | power]
- Goal: [stay-informed | find-tools | strategic-decisions | build]
- Industry: [industry]
- Role: [role]
- Tools they already use: [list]

Tone rules by AI level:
- Skeptic: no jargon, lead with business impact, never recommend a new tool
- Curious: plain English, one concrete takeaway, light optimism
- Active: tactical, tool comparisons welcome, assume basic AI literacy
- Power: technical depth fine, skip basics, include model/API specifics if relevant

Framing rules by role:
- Executive: org-level impact, ROI, competitive risk — skip implementation details
- Product: feature/roadmap implications, what competitors are doing
- Engineering: technical depth, code/API angles welcome
- Sales/Marketing: pipeline, campaigns, customer-facing use cases
- Operations/Finance: efficiency, cost reduction, workflow automation
- Research/Analyst: methodology, evidence quality, benchmark context
- Student: career relevance, foundational context

Topic rules by industry:
- Financial Services: weight regulation, risk, fintech moves
- Healthcare: weight FDA/compliance angles, clinical workflow, patient data
- Consulting: weight client-facing use cases, firm strategy
- Media/Marketing: weight generative content, ad tech, creator tools
- Education: weight EdTech, research integrity, student use policy
```

This prefix is prepended to every `/api/briefing` call. Cost: ~150 extra tokens per card, negligible.

---

## Article Selection

Beyond tone, use the profile to filter which articles surface:

- **Skeptic + stay-informed**: business impact stories only, no tutorials
- **Power + build**: include developer-facing releases, API updates
- **Finance industry**: weight fintech, regulation, risk stories higher
- **Tools they use**: if they use Cursor, don't surface "intro to Cursor" articles

Implementation: score each RSS item against the profile before selecting the top 8.

---

## What We Don't Build Day One

- Behavioral click tracking (day 30+)
- LinkedIn OAuth enrichment (day 60+)
- Per-user article preference model (day 90+)

---

## Success Metrics

| Metric | Day-one target |
|---|---|
| Onboarding completion rate | >70% |
| Briefing open rate (return visit) | >40% |
| "This feels relevant" rating (optional thumbs) | >60% positive |

---

## Open Questions

1. Do we gate the briefing behind completing all 4 questions, or allow skipping?
   - Recommendation: gate it — partial profiles produce poor personalization and erode trust faster than a 60-second quiz does.
2. Do we let users edit their profile later?
   - Yes, settings page, low priority for day one.
