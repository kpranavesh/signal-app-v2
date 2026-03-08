# Signal — Product Requirements Document

**Product:** Signal — Your AI briefing, zero noise. Hear it. Ask it. On the go.
**Author:** Product Team
**Date:** March 7, 2026
**Status:** Draft — Hackathon V1

---

## 1. Problem Statement

AI is evolving faster than any technology in history. Every week brings new models, tools, capabilities, and industry shifts. For the ~90% of professionals who are not engineers or AI researchers, this creates a compounding problem:

- **Too much noise:** Hundreds of AI announcements per week, most written for a technical audience. Non-technical people cannot distinguish breakthroughs from hype.
- **The treadmill effect:** By the time someone learns a tool or concept, the next thing has already arrived. This creates anxiety and learned helplessness — "I'll never catch up."
- **No practical bridge:** Even when someone hears about a new AI capability, they don't know how it applies to *their* job, *their* industry, or *their* daily workflow.
- **Trust deficit:** Every product claims to be "AI-powered." Without technical literacy, there is no way to evaluate what is genuinely useful vs. marketing.
- **Fear and avoidance:** The emotional layer — fear of job displacement, feeling "too late," identity anxiety — causes many people to disengage entirely.

**The result:** A growing AI literacy gap where technical people accelerate and everyone else falls further behind — not because they lack intelligence, but because no one is translating AI for them.

---

## 2. Vision

**Signal is the personalized AI briefing that tells you only what matters to *you* — and lets you listen, ask, and learn on the go.**

Based on your role, your industry, and your comfort level with AI, Signal curates, translates, and delivers the AI updates that are relevant to your world — in language you understand, with actions you can take. Signal is built mobile-first and audio-native: your briefing plays as a personalized audio conversation you can listen to on your commute, and when something sparks a question, you talk back. No typing, no screens — just a knowledgeable companion in your ear.

**One-line pitch:** "There's a million AI updates a week. Signal tells you which three actually matter to you — and you can listen on the way to work."

---

## 3. Target Users

Signal serves non-technical professionals across four primary segments:

### 3a. Knowledge Workers
- **Who:** Marketers, HR professionals, operations managers, salespeople, analysts, designers
- **Pain:** Expected to "use AI" at work but overwhelmed by options and unsure where to start
- **Need:** "Show me the 2-3 AI tools or updates that are relevant to my specific job function this week"

### 3b. Small Business Owners
- **Who:** Founders, freelancers, solo operators running businesses with <50 employees
- **Pain:** Know AI could save them time/money but don't have bandwidth to research
- **Need:** "Tell me what I can actually implement this week to run my business better"

### 3c. Executives & Leaders
- **Who:** Directors, VPs, C-suite, board members making strategic decisions
- **Pain:** Need to set AI strategy for their org without getting lost in technical details
- **Need:** "Give me the 30,000-foot view of what's shifting so I can make informed decisions"

### 3d. Curious Professionals
- **Who:** Teachers, healthcare workers, creatives, government employees, anyone who wants to stay informed
- **Pain:** General anxiety about AI, unsure what's real vs. hype, nowhere to ask "dumb questions"
- **Need:** "Help me understand AI at my own pace without making me feel stupid"

### 3e. Commuters & On-the-Go Consumers
- **Who:** Anyone with a daily commute (car, train, bus, walking) — spans all four segments above but represents a distinct usage context
- **Pain:** Have 20-60 minutes of "dead time" daily where they can't read screens but want to stay informed. Podcasts are too long and generic; newsletters pile up unread.
- **Need:** "Give me a 10-minute personalized audio briefing I can listen to on the way to work — and let me ask questions with my voice when something interests me"

---

## 4. User Stories

### Onboarding & Personalization
- As a new user, I want to tell Signal my role, industry, and how much I already know about AI, so my briefing is relevant from day one.
- As a user, I want to adjust my preferences over time as my interests or comfort level change, so Signal stays relevant.
- As a user, I want to tell Signal what I *don't* care about, so I can filter out noise on topics that aren't relevant to me.

### Content Consumption
- As a marketing manager, I want to see AI updates filtered for marketing and content creation, so I don't waste time reading about developments in robotics or chip manufacturing.
- As a small business owner, I want each update to include a plain-English explanation of *why it matters to me* and *what I could do about it*, so I can take action.
- As an executive, I want a weekly summary that highlights strategic shifts and competitive implications, so I can brief my leadership team.
- As a beginner, I want jargon explained inline (or avoided entirely), so I don't have to Google every other sentence.

### Learning & Progression
- As a user who started as a "curious beginner," I want Signal to gradually introduce more depth as I learn, so I grow my understanding over time.
- As a user, I want to bookmark updates that I want to revisit later, so I can build a personal reference library.
- As a user, I want to see "how to try this" prompts alongside news about new AI tools, so I can experiment without fear.

### Conversational Chat
- As a user reading my briefing, I want to tap on an item and ask "what does this actually mean for me?" so I can understand it in the context of my role without searching elsewhere.
- As a beginner, I want to ask follow-up questions like "can you explain that more simply?" without feeling judged, so I can learn at my own pace.
- As a small business owner, I want to ask "should I switch to this new tool?" and get a practical, honest answer based on my situation, so I can make decisions without hours of research.
- As a user who missed a few weeks, I want to say "catch me up" and get a personalized summary of what I missed, so I don't have to scroll through old briefings.
- As an executive, I want to ask "how does this compare to what our competitors might be doing?" so I can frame AI developments in strategic terms for my team.

### Mobile & Audio
- As a commuter, I want to press play and hear my personalized AI briefing as a natural-sounding audio conversation, so I can stay informed without looking at a screen.
- As a driver, I want to say "tell me more about that" or "skip to the next one" with my voice, so I can control my briefing hands-free.
- As a train commuter, I want the audio briefing to be 10-15 minutes by default, so it fits naturally into my ride.
- As a user on the go, I want to ask follow-up questions by voice and hear spoken answers, so the chat experience works without typing.
- As a user, I want to seamlessly switch between reading my briefing on screen and listening to it as audio, so I can pick up where I left off in either mode.
- As a user with AirPods, I want to start my briefing from my lock screen or watch, so I don't even need to open the app.

### Trust & Curation
- As a user, I want to know *why* Signal chose to show me something, so I trust the curation and understand the relevance.
- As a user, I want honest assessments of AI tools — including limitations — not just hype, so I can make informed decisions.

---

## 5. Key Features — V1 (Hackathon Scope)

### F1. Personalization Onboarding
A lightweight onboarding flow (3-5 steps) that captures:
- **Role** — What do you do? (select from curated list or describe in your own words)
- **Industry** — What sector do you work in?
- **AI comfort level** — Skeptic / Curious beginner / Active user / Power user
- **Goals** — Why are you here? (Stay informed / Find tools to use / Make strategic decisions / General curiosity)

This creates a user profile that drives all content personalization.

### F2. Personalized AI Briefing
The core product experience — a daily or weekly briefing that contains:
- **Top 3-5 updates** relevant to the user's role and industry
- **Plain-English summaries** adapted to the user's comfort level (a beginner sees simpler language than a power user)
- **"Why this matters to you"** — A one-line explainer connecting each update to the user's specific context
- **"Try this"** — Optional actionable suggestion for updates that involve tools the user could experiment with

### F3. Comfort-Level Adaptive Content
The same AI development is explained differently based on the user's level:
- **Beginner:** "A new AI tool lets you create professional videos just by typing what you want. Think of it like Canva, but for video."
- **Active user:** "OpenAI released Sora 2 with improved consistency and longer generation times. If you're already using Runway or Pika, this is a direct competitor worth testing for your marketing videos."

### F4. Topic & Noise Controls
- Users can mute topics they don't care about (e.g., "I don't care about AI chips" or "Skip anything about self-driving cars")
- Users can boost topics they want more of
- Explicit "this was useful" / "this wasn't relevant" feedback on each briefing item

### F5. Ask Signal — Conversational AI Chat
An always-available chat interface where users can have a conversation with Signal to go deeper on anything in their briefing — or ask about AI in general.

**Core behaviors:**
- **Context-aware:** The chat knows the user's role, industry, comfort level, and which briefing items they've seen. Users don't have to re-explain who they are.
- **Follow-up friendly:** Users can ask "wait, what does that mean?" or "how would I use this in my job?" and get answers tailored to their profile — not generic Wikipedia-style definitions.
- **Comfort-level matched:** Responses adapt to the user's level. A beginner asking "what is RAG?" gets an analogy. A power user gets a practical comparison of approaches.
- **Non-judgmental tone:** No question is too basic. The chat should feel like asking a knowledgeable friend, not Googling and getting a Stack Overflow answer written for engineers.

**Key interaction patterns:**
- **"Explain this"** — Tap any briefing item to start a chat about it. "Tell me more about this," "Why should I care?," "Is this actually useful?"
- **"What should I do?"** — Ask for practical next steps. "I'm a recruiter — how does this affect me?" "What's the easiest AI tool I can try today for writing job descriptions?"
- **"Compare / evaluate"** — "Is Gemini better than ChatGPT for my use case?" "Which AI writing tool is best for someone who isn't technical?"
- **"Catch me up"** — "I've been offline for two weeks — what did I miss?" Signal generates a personalized recap based on the user's profile.
- **"Explain like I'm..."** — Users can ask for a simpler (or deeper) explanation on the fly, even if their default comfort level is set differently.

**What the chat is NOT:**
- Not a general-purpose AI assistant (it won't write your emails or do your homework)
- Not a replacement for the briefing (it's a companion to it — deepens understanding, doesn't replace curation)
- Not a live search engine (it draws from Signal's curated content and knowledge base, not the open web)

### F6. Mobile-First Audio Experience
Signal is an **iOS-native, audio-first** app — built exclusively for iPhone, leveraging the Apple ecosystem (AirPods, Apple Watch, CarPlay) where audio consumption over-indexes.

**Audio Briefing ("Listen to your Signal")**
- Audio briefings are generated using **Google NotebookLM's Audio Overviews** — the user's curated briefing content is fed into NotebookLM to produce a natural, conversational audio discussion between two AI hosts. This leverages NotebookLM's proven ability to create engaging, podcast-style audio from source material without building a custom TTS pipeline.
- Briefing length adapts to user preferences: Quick (5 min), Standard (10-15 min), or Deep (20+ min).
- Each briefing item is introduced with context: "Here's something relevant to your role as a marketing manager..." followed by the summary and "why it matters to you."
- Users can say "tell me more" to expand on an item, "skip" to move on, or "save this" to bookmark.

**Voice Chat ("Talk to Signal")**
- The Ask Signal chat (F5) works fully by voice — users speak questions and hear spoken answers.
- Voice input is always available: tap the mic, use a wake word, or trigger from headphone controls / lock screen widget.
- Responses are optimized for audio: shorter, more conversational, no bullet lists or tables that don't work in spoken form.
- The conversation is continuous — users can interrupt, ask follow-ups, or change topics naturally.

**Mobile-Native Design**
- **Lock screen / notification widget:** Start today's briefing with one tap without opening the app.
- **Apple Watch companion:** Start, pause, skip briefings from the wrist.
- **Headphone controls:** Play/pause, skip item, "tell me more" mapped to standard headphone gestures.
- **Offline mode:** Briefings are pre-generated and cached so they play even in subway tunnels or airplane mode.
- **Background playback:** Briefing continues when the phone is locked or the user switches apps, just like a podcast.
- **Seamless read/listen toggle:** Users can switch between reading and listening at any point — the app tracks position across both modes.

### F7. Explore & Learn (Stretch)
- A searchable library of past briefings and explainers
- "Explain this to me" — tap any AI term or concept to get a plain-English explanation at your comfort level
- Bookmarking and personal collections

---

## 6. What V1 Is NOT

- **Not a social network or community** — V1 is a content product, not a forum
- **Not a course or certification** — Signal informs and suggests, it doesn't teach structured curricula
- **Not for developers** — If you can read a technical blog post, you're not our user
- **Not an AI tool directory** — We don't list every tool; we surface the ones that matter to you
- **Not real-time news** — We are a curated briefing, not a live feed

---

## 7. Success Metrics

| Metric | What it measures | V1 Target |
|--------|-----------------|-----------|
| Onboarding completion rate | Do users finish personalization setup? | >70% |
| Briefing open rate | Are users reading their briefings? | >50% weekly |
| "This was useful" rate | Is content hitting the mark? | >60% positive signals per briefing |
| Return rate (Week 2) | Do users come back after the first week? | >40% |
| Topic mute usage | Are users actively shaping their experience? | >25% of users adjust preferences |
| Comfort level progression | Are beginners becoming more confident over time? | Track self-reported level changes over 30 days |
| Chat engagement rate | What % of briefing readers open a chat conversation? | >20% of active users per week |
| Questions per session | Are users going deep or just trying it once? | >2 follow-ups per chat session |
| Chat-to-action rate | Do chat conversations lead to users trying a tool or changing preferences? | Track link clicks and preference updates originating from chat |
| Audio briefing play rate | What % of users listen to their briefing vs. only reading? | >30% of active users per week |
| Audio completion rate | Do listeners finish the full briefing? | >60% listen to at least 80% of briefing |
| Voice chat adoption | What % of chat interactions happen via voice vs. text? | >40% of chat sessions are voice-initiated |
| Commute-time engagement | Are users engaging during typical commute windows (7-9am, 5-7pm)? | >50% of audio plays occur during commute hours |
| Offline briefing pre-cache rate | Are briefings ready before the commute starts? | >90% of daily briefings cached by 6:30am local time |

---

## 8. Competitive Landscape

| Competitor | What they do | Signal's differentiation |
|------------|-------------|------------------------|
| The Neuron | Daily AI newsletter | One-size-fits-all. No personalization by role or comfort level. |
| TLDR AI | Daily AI news digest | Written for technical audience. Dense, jargon-heavy. |
| Ben's Bites | AI newsletter + community | Startup/builder focused. Not designed for non-technical users. |
| There's an AI for That | AI tool directory | Discovery tool, not a briefing. No curation or context. |
| ChatGPT / Perplexity | Ask questions about AI | Requires you to know what to ask. No proactive curation. No persistent user profile shaping responses. |
| Daily (podcast) | Daily news podcast, AI-generated | General news, not personalized. No interactivity — you can't ask follow-up questions. |
| Snacks Daily / Morning Brew Daily | Short-form audio business news | Not AI-focused. No personalization. No voice interaction. |
| NotebookLM Audio Overviews | Google's AI-generated audio summaries | **Used as Signal's audio engine** — we supply the curated, personalized source material and NotebookLM generates the conversational audio. Signal adds what NotebookLM lacks: personalization, curation, persistent user profile, and voice interactivity. |

**Signal's moat:** Role-based personalization + comfort-level adaptation + conversational depth + **audio-native, hands-free interaction**. Competitors either curate content (newsletters), answer questions (ChatGPT), or deliver audio (podcasts) — Signal is the only product that does all three with persistent context about who you are. No podcast lets you interrupt and ask "wait, what does that mean for my job?" No newsletter works when you're driving. Signal does both, in your ear, personalized to you.

---

## 9. Open Questions

- **Content sourcing:** Do we editorially curate content (higher quality, harder to scale) or use AI to aggregate and rewrite from sources (scalable, quality risk)?
- **Delivery channel:** Is V1 a web app, email digest, or both? Email has higher engagement for briefings; web app allows richer personalization.
- **Monetization (post-hackathon):** Freemium (basic briefing free, premium gets deeper analysis)? B2B (companies buy for teams)? Sponsorships?
- **Content freshness:** Daily vs. weekly briefing? Daily risks fatigue; weekly risks feeling stale.
- **Editorial voice:** Should Signal have a distinct personality/voice, or stay neutral and factual?
- **Audio voice identity:** Should Signal's voice be a single consistent persona (building familiarity) or offer multiple voice options? Male/female/neutral? Should it feel like a podcast host, a friend, or a news anchor?
- ~~**Platform priority:**~~ **Resolved — iOS-only.** iPhone + AirPods ecosystem is the ideal starting platform for an audio-first product.
- **Wake word vs. push-to-talk:** Should users be able to say "Hey Signal" hands-free, or is tap-to-speak sufficient for V1? Wake word adds engineering complexity but is critical for drivers.
- ~~**Audio generation pipeline:**~~ **Resolved — NotebookLM.** Audio briefings generated via Google NotebookLM Audio Overviews. Pre-generate overnight using curated briefing content as source input. Open question: NotebookLM API access and rate limits for production-scale generation.
- **Commute detection:** Should the app auto-suggest audio mode based on time-of-day or motion sensors, or keep it manual?

---

## 10. Risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Personalization requires critical mass of content per segment | Users in niche roles get thin briefings | Start with 8-10 broad roles, expand based on demand |
| Users don't complete onboarding | Core value prop never activates | Keep onboarding to <60 seconds, allow skipping with smart defaults |
| AI-generated summaries have accuracy issues | Trust erosion — fatal for this product | Human review layer for V1; clear sourcing and links to originals |
| "Signal" name conflict with Signal Messenger | Brand confusion | Evaluate naming risk; consider "Signal AI" or alternatives if needed |
| Chat responses produce inaccurate or misleading advice | Users make bad decisions based on AI hallucinations; trust collapse | Ground chat responses in Signal's curated content; cite sources; add disclaimers on tool recommendations; human review of common Q&A patterns |
| Chat becomes a general-purpose AI assistant | Product loses focus; users treat it as ChatGPT | Scope chat strictly to AI-related topics; redirect off-topic questions gracefully |
| NotebookLM dependency risk | Google changes API terms, pricing, or rate limits; audio generation becomes unreliable or expensive | Monitor NotebookLM API roadmap; maintain fallback TTS option (ElevenLabs or OpenAI TTS); negotiate enterprise terms early if volume grows |
| Audio voice quality feels robotic or uncanny | Users abandon audio for text; the commuter value prop collapses | NotebookLM already produces high-quality conversational audio; test with real commuters to validate tone and pacing preferences |
| Voice input accuracy in noisy environments | Commuters on trains/buses get frustrated with misheard queries | Use noise-canceling speech models; always offer text fallback; confirm ambiguous inputs before responding |
| Mobile app store approval and review cycles | Slower iteration vs. web; risk of rejection for AI content policies | Plan for 1-2 week review cycles; maintain web app as fallback; follow Apple/Google AI content guidelines closely |
| Audio content moderation at scale | Harder to moderate generated audio than text; risk of inappropriate content in spoken form | Generate audio from approved text summaries (text-first pipeline); add audio QA sampling |

---

*Next steps: Align on open questions, build hackathon prototype, define onboarding flow mockup.*