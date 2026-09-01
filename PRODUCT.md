# Product

## AFK AI

AFK AI is a local-first AI workspace for Windows.

The website has one job: help a normal Windows user understand what AFK AI is,
what it keeps local, what still uses the internet, what hardware it expects, and
how to start the Friend Beta without hype or ambiguity.

## Audience

### The first-time local AI user

They have heard that a PC can run its own ChatGPT-style workspace, but they do
not want to become a Docker or WSL expert first.

They need:

- one obvious download path
- honest hardware requirements
- a clear explanation of what installation does
- precise privacy language
- understandable failure and recovery expectations

### The technical evaluator

They want to inspect the engineering before trusting an installer.

They need:

- source links
- release and download integrity
- network-boundary truth
- support and security reporting
- implementation details without marketing fog

## Product purpose

The landing page should let a visitor answer these questions quickly:

1. What is AFK AI?
2. Why would I run it locally?
3. What stays on my PC?
4. What still needs the internet?
5. What hardware and Windows features are required?
6. What does installation change?
7. What happens if my machine is not ready?
8. Where do I get help?
9. How is the installer pinned and verified?

Success means a visitor can download the Friend Beta knowing what it will and
will not do.

## Voice

**Honest. Calm. Technical without being hostile.**

The page can have personality, but trust comes before cleverness.

Good copy:

- states tradeoffs beside features
- distinguishes local-first from offline-only
- uses short sentences
- explains technical requirements in normal language
- admits Friend Beta limitations directly
- avoids pretending third-party behavior is controlled by AFK AI

Avoid:

- hype adjectives
- urgency tricks
- vanity metrics
- vague "private by magic" claims
- fake screenshots
- fake testimonials
- unexplained jargon
- em dashes

## Privacy language

Never say that "nothing phones home" or that AFK AI makes no network requests.

The accurate boundary is:

- local model inference can stay on the user's machine
- Open WebUI stores its local account and chat database on that machine
- setup and model downloads use the internet
- optional web search sends queries to external providers
- Ollama uses a Docker-reachable Windows host bind in the current architecture
- physical-network exposure is guarded separately by Windows Firewall logic
- remote access is an explicit opt-in

## Brand personality

AFK AI should feel like a well-made workbench:

- clean
- capable
- transparent
- quietly technical
- comfortable in light or dark mode
- confident enough not to oversell itself

Visual language:

- Bricolage Grotesque for display
- system UI for body copy
- IBM Plex Mono for machine facts
- blue for action
- emerald for positive state
- neutral surfaces for everything else

## Anti-references

Do not drift toward:

- SaaS gradient washes
- glassmorphism
- crypto or AI hype
- hacker-terminal cosplay
- giant documentation walls
- decorative dashboards that imply functionality the product does not have

## Design principles

1. **Honesty is part of the visual system.** Product claims and tradeoffs belong
   next to each other.
2. **One page, real anchors.** No SPA is needed for a compact product story.
3. **Zero third-party page origins.** Fonts and assets stay self-hosted.
4. **The machine speaks mono.** Ports, commands, hashes, and model identifiers
   use IBM Plex Mono.
5. **Progressive disclosure.** Deep technical detail belongs in GitHub docs, not
   in the first screen.
6. **No fake proof.** Never invent screenshots, testimonials, usage numbers, or
   unsupported claims to make the page feel more finished.
