# PRD: Guided Onboarding & Tutorials

## Problem Statement

Most AI tools today assume technical fluency. CLIs require terminal knowledge. Even "simple" web interfaces use jargon ("system prompt," "temperature," "tokens") that alienates non-technical users. The result:

1. **Setup friction kills adoption**: A non-technical user who hears "install the CLI" will close the tab. They don't know what a CLI is, let alone how to use one.
2. **No bridge from curiosity to capability**: Millions of people are AI-curious but stuck at "I signed up, now what?" There's no guided path from zero to productive.
3. **Tool-specific tutorials are scattered**: Every AI product has its own docs, YouTube channels, and community forums. None of them meet non-technical users where they are.

This product provides **step-by-step, visual, jargon-free tutorials** that take a non-technical user from "I've never used AI" to "I just automated my weekly report."

## Target User

Non-technical consumers who fall into three stages:
- **Curious**: Heard about AI, haven't tried it. Need to understand what's possible before committing.
- **Stuck**: Signed up for an AI tool but hit a wall. Can't figure out how to get useful output.
- **Ready to level up**: Using one AI tool for basic tasks. Want to do more but don't know what's possible.

Personas:
- **David, real estate agent**: Wants to use AI for listing descriptions and client emails. Downloaded ChatGPT app but only uses it for "write me an email" — doesn't know about custom instructions, image analysis, or voice mode.
- **Aisha, teacher**: Wants to create lesson plans with AI. Tried Claude but didn't know how to give it enough context. Got generic outputs and gave up.
- **Tom, retiree**: Tech-comfortable (uses iPad, email, online banking) but not tech-savvy. Curious about AI for travel planning and hobby research. Intimidated by the interfaces.

## User Stories

- As a non-technical user, I want tutorials that assume I know nothing so I don't feel stupid when I get stuck.
- As someone exploring AI tools, I want to see what each tool can do with real examples before I sign up.
- As a user who got stuck, I want guided walkthroughs that show me exactly where to click and what to type.
- As someone who uses AI for one thing, I want to discover new use cases relevant to my work or interests.

## Functional Requirements

### Tutorial Library
- **Use-case organized, not tool-organized**: Tutorials are grouped by what users want to accomplish ("Write better emails," "Analyze a spreadsheet," "Create images for my business") rather than by tool.
- **Multi-tool coverage**: Each use case shows how to accomplish it in 2-3 different AI tools, with a recommendation for which tool is best for that task.
- **Difficulty levels**: Beginner (first time using AI), Intermediate (comfortable with basics), Advanced (power user techniques). Clear labels so users self-select.
- **Visual walkthroughs**: Annotated screenshots, short GIF demos, or embedded video clips showing exactly what the user should see at each step.

### "Should I Use the CLI or the Web App?" Decision Engine
- Many AI tools (Claude, GitHub Copilot, etc.) offer both CLI and web interfaces. Non-technical users don't know which to choose.
- **Decision flow**: A simple questionnaire ("Do you write code? Do you work in a terminal? Do you prefer typing or clicking?") that recommends the right interface.
- **Default recommendation**: For non-technical users, always default to web/GUI interfaces. Only recommend CLI if the user explicitly indicates developer comfort.
- **Migration guides**: For users who started on CLI and want to move to a GUI (or vice versa), provide step-by-step migration paths.

### Interactive Setup Wizards
- **Account creation walkthroughs**: Step-by-step guides for signing up for each major AI tool, with annotated screenshots of every screen.
- **First prompt templates**: After setup, give users their first 5 prompts to try, personalized to their stated use case. Not generic — specific. "Paste your last client email and say: 'Rewrite this to be more professional and concise.'"
- **Checkpoint validation**: After each step, ask the user "Did this work? Do you see [X] on your screen?" to catch issues early.

### Learning Paths
- **Role-based paths**: "AI for Writers," "AI for Small Business," "AI for Students," "AI for Job Seekers" — curated sequences of tutorials that build on each other.
- **Progress tracking**: Users can see what they've completed, where they are, and what's next. Badge/achievement system for motivation.
- **Time estimates**: Each tutorial shows estimated completion time (e.g., "5 min read," "15 min hands-on").

### Content Format
- **Written guides with screenshots** (primary format): Accessible, searchable, skimmable.
- **Short video walkthroughs** (secondary): 2-5 minute videos for complex multi-step processes.
- **Interactive sandboxes** (V2): Embedded practice environments where users can try prompts without leaving the tutorial.

## Scope

### V1 (Launch)
- 30 tutorials covering 10 use cases across 5 AI tools (Claude, ChatGPT, Gemini, Midjourney, Perplexity)
- 3 role-based learning paths (Writers, Small Business, Students)
- CLI vs. Web App decision flow
- Account setup wizards for top 5 tools
- Web app with responsive design

### V2 (Post-Launch)
- Interactive sandboxes for hands-on practice
- Community-contributed tutorials with editorial review
- Video walkthroughs for top 10 tutorials
- Progress tracking and badges
- Additional learning paths based on user demand

### Out of Scope
- Teaching users to code or use developer tools
- In-depth prompt engineering courses (this is practical, not academic)
- Certifications or formal credentialing
- Tool-specific customer support (we guide, we don't troubleshoot their bugs)

## Success Metrics

| Metric | Target | Rationale |
|--------|--------|-----------|
| Tutorial completion rate | >60% | Users finish what they start |
| Setup wizard success rate | >80% | Users successfully set up the tool |
| Return within 7 days | >40% | Users come back to learn more |
| Use case discovery (users try a new use case after a tutorial) | >30% | We're expanding what users do with AI |
| NPS on tutorials | >55 | Content is genuinely helpful |

## Open Questions

1. **Content creation model**: Do we write all tutorials in-house, partner with AI companies for co-branded content, or open a community contribution model?
2. **Update cadence**: AI tool UIs change frequently. How do we keep screenshots and walkthroughs current? Automated screenshot testing? Community flagging?
3. **Localization**: Is English-only sufficient for V1, or is multi-language critical for the "broad consumer" audience?
4. **Relationship with AI companies**: Do we need permission to create setup guides for their products? Is there a partnership opportunity (e.g., referral revenue)?

## Risks

- **Content staleness**: AI products update their UIs frequently. A tutorial with outdated screenshots actively harms trust. Need a content freshness process.
- **Scope creep into education**: The line between "tutorial" and "course" is blurry. Need to stay practical and action-oriented, not academic.
- **Platform bias perception**: If we recommend Tool A over Tool B for a use case, we may face accusations of bias. Need transparent recommendation criteria.