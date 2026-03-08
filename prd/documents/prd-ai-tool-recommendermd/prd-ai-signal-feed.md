# PRD: AI Signal Feed

## Problem Statement

The AI landscape moves fast. Every week brings new model releases, feature updates, pricing changes, and capability shifts across Claude, ChatGPT, Gemini, and dozens of other tools. For non-technical users, this creates two problems:

1. **Information overload**: Changelogs, blog posts, and X threads are written for developers. A marketing manager doesn't know what "128k context window" means or why it matters to them.
2. **Missed opportunities**: Important updates that could transform a user's workflow get buried in noise they can't parse.

There is no product today that takes the firehose of AI product updates and translates them into **"here's what changed, here's what it means for you, here's what to do about it."**

## Target User

Any non-technical person who uses (or wants to use) AI tools in their daily work or personal life. They don't read Hacker News. They don't follow AI researchers on X. They just want to know: **what's new, and should I care?**

Personas:
- **Sarah, freelance copywriter**: Uses ChatGPT for drafts. Doesn't know Claude exists. Missed that GPT-4o added free image generation.
- **Marcus, small business owner**: Heard AI can help with invoicing and customer emails. Overwhelmed by options. Doesn't know where to start.
- **Priya, operations manager**: Uses Gemini through Google Workspace. Doesn't realize she could automate her weekly reports.

## User Stories

- As a non-technical user, I want to see AI product updates in plain language so I can understand what changed without reading technical docs.
- As a user of multiple AI tools, I want updates filtered to the tools I actually use so I'm not drowning in irrelevant news.
- As someone exploring AI, I want to understand the practical impact of updates ("you can now do X") rather than technical specs ("we increased throughput by 40%").
- As a busy professional, I want a daily or weekly digest so I can stay current in under 5 minutes.

## Functional Requirements

### Core Feed Experience
- **Plain-language summaries**: Every AI product update is rewritten in simple, jargon-free language. Technical terms are either removed or explained inline.
- **Impact tags**: Each update is tagged with who it affects and how: "Saves you time," "New capability," "Price change," "You should try this."
- **Tool coverage**: Launch with the top 10 AI products (Claude, ChatGPT, Gemini, Midjourney, Perplexity, Copilot, Notion AI, Jasper, Runway, ElevenLabs). Expand based on user demand.
- **Source linking**: Every summary links back to the original announcement for users who want the full details.

### Personalization
- **Onboarding quiz**: 3-5 questions during signup to understand what tools the user already uses, what they use AI for (writing, images, research, coding, business ops), and their comfort level.
- **Tool following**: Users can "follow" specific AI tools to prioritize those updates in their feed.
- **Relevance scoring**: Updates are ranked by relevance to the user's profile. A copywriter sees writing tool updates first; a marketer sees analytics and content tools first.
- **"Not relevant" feedback**: Users can dismiss updates to improve future relevance.

### Digest Delivery
- **In-app feed**: Scrollable, chronological feed with filters (by tool, by impact type, by date).
- **Email digest**: Optional daily or weekly email with top 3-5 updates, personalized to the user's profile.
- **Push notifications**: Optional alerts for high-impact updates ("ChatGPT is now free for your use case" or "Claude can now read your spreadsheets").

### "What Does This Mean for Me?" Cards
- Each major update includes a card explaining: (1) what changed in one sentence, (2) who this matters to, (3) a concrete example of how to use it, (4) a link to try it.
- Example: *"Claude can now analyze CSV files you upload. If you work with spreadsheets, you can now ask Claude to find trends, clean data, or create summaries. Try it: upload your last sales report and ask 'what are the top 3 trends?'"*

## Scope

### V1 (Launch)
- Plain-language feed covering top 10 AI tools
- Onboarding quiz and basic personalization
- Weekly email digest
- Web app (responsive, mobile-friendly)

### V2 (Post-Launch)
- Push notifications
- Daily digest option
- User-submitted "how I use this" tips attached to updates
- Community upvoting on update relevance

### Out of Scope
- AI tool reviews or comparisons (separate feature)
- Tutorial content (covered in separate PRD)
- Direct integration with AI tools (no in-app usage)

## Success Metrics

| Metric | Target | Rationale |
|--------|--------|-----------|
| Weekly Active Readers | 10,000 within 3 months of launch | Core engagement signal |
| Email digest open rate | >40% | Shows content is valued |
| "Not relevant" dismiss rate | <15% of feed items | Personalization is working |
| Time on feed per session | 3-5 minutes | Users are reading, not bouncing |
| NPS | >50 | Users would recommend to peers |

## Open Questions

1. **Content sourcing**: Do we build automated pipelines to scrape changelogs and use AI to rewrite them, or start with a human editorial team? Trade-off: speed/scale vs. quality/trust.
2. **Monetization**: Is this a free product (growth funnel) or a subscription? If subscription, what's the free tier?
3. **Competitive moat**: Newsletters like "The Rundown AI" exist but are generic and developer-leaning. Our differentiation is personalization + plain language. Is that enough?
4. **Content liability**: If we misrepresent an update (e.g., say a feature is free when it's paid), what's our correction process?

## Risks

- **Content freshness**: AI updates happen daily. If our feed lags by more than 48 hours, users will find the info elsewhere.
- **Accuracy at scale**: AI-generated summaries of AI product updates could introduce errors. Need a human review step, at least for V1.
- **Platform dependency**: We're summarizing other companies' announcements. If a major player (e.g., OpenAI) objects or restricts access to their changelogs, we need a mitigation plan.