# prd-ai-tool-recommender.md

# PRD: Personalized AI Tool Recommender

## Problem Statement

There are now hundreds of AI tools. A non-technical user facing this landscape has no way to answer the basic question: **"Which AI tool should I use for what I need?"**

Current discovery methods all fail non-technical users:
- **Google search**: Returns SEO-optimized listicles ("Top 50 AI Tools in 2026!") that are overwhelming, ad-driven, and not personalized.
- **Word of mouth**: Limited to whatever one friend or colleague happens to use. "Just use ChatGPT" is the default answer regardless of the actual need.
- **Product websites**: Every AI tool claims to do everything. Marketing copy doesn't help users understand real strengths and trade-offs.
- **Review sites (G2, Capterra)**: Written by and for enterprise buyers and developers. Ratings don't reflect the non-technical user experience.

Users need a **personalized recommendation engine** that understands what they're trying to do, what they've already tried, and what fits their budget and comfort level — then gives them a clear, honest answer.

## Target User

Non-technical consumers at a decision point:
- **First-timer**: "I want to try AI. Where do I start?"
- **Switcher**: "I use ChatGPT but I'm not happy with it. What else is out there?"
- **Expander**: "I use AI for writing. Can it also help me with [images / research / data analysis]?"
- **Evaluator**: "My company wants to adopt an AI tool. Which one is right for our team?"

Personas:
- **Lisa, nonprofit director**: Needs AI for grant writing, donor communications, and data reporting. Budget is tight. Doesn't know if free tiers are sufficient or if she needs a paid plan.
- **James, content creator**: Uses Midjourney for images but needs a text tool. Tried ChatGPT, found it too generic. Doesn't know Claude, Gemini, or Perplexity exist.
- **Nadia, HR manager**: Wants to use AI for job descriptions, interview prep, and employee handbook updates. Her company blocks certain tools for compliance reasons. Needs something that works within constraints.

## User Stories

- As a non-technical user, I want to describe what I need in plain language and get a specific tool recommendation so I don't have to research dozens of options.
- As someone with budget constraints, I want to see pricing breakdowns and free tier limits so I can make an informed decision.
- As a user who tried a tool and didn't like it, I want to explain what went wrong and get a better alternative.
- As someone using AI for one task, I want to discover which tools are best for adjacent tasks I haven't tried yet.

## Functional Requirements

### Recommendation Quiz
- **Conversational format**: Not a traditional form. A short, chat-style flow that asks 4-6 questions:
  1. What do you want to use AI for? (Pick from categories: Writing, Images, Research, Data/Spreadsheets, Coding, Business Operations, Creative Projects, Personal/Fun)
  2. Can you describe a specific task? (Free text: "I want to write better cold outreach emails")
  3. Have you used any AI tools before? (Yes/No + which ones and what you liked/disliked)
  4. What's your budget? (Free only / Up to $20/mo / Up to $50/mo / Budget isn't a constraint)
  5. Any requirements? (Works on mobile / Team collaboration / Data privacy / Offline access)
- **Instant results**: After the quiz, users see a ranked list of 2-3 recommendations with clear reasoning.

### Recommendation Cards
Each recommendation includes:
- **Tool name and one-line description** in plain language
- **Why it's recommended for you**: Specific to their stated use case. "Claude is great for long-form writing because it can work with documents up to 200 pages — perfect for the grant writing you described."
- **Pricing summary**: What the free tier gets you, what paid unlocks, monthly cost.
- **Strengths and limitations**: Honest, balanced. "Great at X, but weaker at Y compared to alternatives."
- **Getting started link**: Deep link to the relevant tutorial in our Guided Onboarding product (cross-product integration).
- **User rating**: Average rating from other non-technical users on our platform (not developer reviews from elsewhere).

### Comparison View
- Users can select 2-3 tools and see a side-by-side comparison.
- Comparison dimensions: price, best use cases, ease of use, mobile support, free tier limits, data privacy approach.
- Written in plain language. No spec sheets. No "supports function calling" — instead "can connect to other apps and take actions for you."

### Re-recommendation
- If a user comes back and says "I tried Tool X and it didn't work for me," the system asks what went wrong and provides a revised recommendation.
- Tracks user tool history so future recommendations account for what they've already tried.

### Community Signals
- **"People like you also use"**: Anonymous, aggregated data showing what tools other users with similar profiles chose.
- **User-submitted tips**: Short tips like "I use Claude for first drafts and Grammarly for editing — they pair well together."
- **Satisfaction tracking**: After 30 days, follow up with users to ask if the recommendation worked. Feed this back into the ranking algorithm.

## Scope

### V1 (Launch)
- Recommendation quiz covering 15 AI tools across 6 use-case categories
- Recommendation cards with pricing, strengths/limitations, and getting-started links
- Side-by-side comparison for 2-3 tools
- Web app, responsive design
- Cross-links to Guided Onboarding tutorials

### V2 (Post-Launch)
- Re-recommendation flow for users who tried and didn't like a tool
- Community signals ("people like you" and user tips)
- 30-day follow-up satisfaction tracking
- API for embedding recommendations in partner sites
- Expanded to 30+ tools

### Out of Scope
- Enterprise procurement workflows (RFP generation, security reviews, vendor management)
- In-depth product reviews or editorial content (we recommend, we don't review)
- Price tracking or deal alerts
- Direct tool reselling or affiliate-first model (recommendations must be unbiased)

## Success Metrics

| Metric | Target | Rationale |
|--------|--------|-----------|
| Quiz completion rate | >70% | Quiz is short enough and engaging enough to finish |
| Click-through to recommended tool | >50% | Recommendations are compelling |
| Tutorial start rate (from recommendation) | >30% | Cross-product funnel is working |
| 30-day satisfaction ("Was this the right tool for you?") | >65% say yes | Recommendations are actually good |
| Return visits for new use case | >25% within 60 days | Users come back when they have a new need |

## Open Questions

1. **Monetization vs. trust**: Affiliate revenue from AI tools could fund the product but creates bias incentives. Do we go ad-free/affiliate-free and monetize via subscription, or accept affiliate revenue with full disclosure? This is a fundamental brand decision.
2. **Data sourcing for recommendations**: Where do we get reliable, current data on tool capabilities, pricing, and limitations? Scraping product pages? Partnerships with AI companies? Manual research team?
3. **Handling rapid change**: AI tool capabilities shift monthly. A recommendation that's correct today may be wrong in 6 weeks. What's the update process — automated monitoring, user-reported inaccuracies, or editorial review cycles?
4. **"Best for you" liability**: If we recommend a tool and the user has a bad experience (e.g., data privacy issue), what's our liability? Do we need disclaimers, or do we vet tools before including them?

## Risks

- **Perceived bias**: Users will assume we're being paid to recommend specific tools. Transparency about our methodology and revenue model is critical from day one.
- **Data accuracy**: Pricing pages change, features launch and deprecate, free tiers shrink. Stale data in recommendations directly erodes trust.
- **Cold start for community signals**: "People like you" data requires meaningful user volume. V1 will need to rely on editorial recommendations until we have enough data.
- **Tool landscape fragmentation**: New AI tools launch weekly. We need a clear inclusion criteria (minimum user base, stability, track record) to avoid recommending fly-by-night products.