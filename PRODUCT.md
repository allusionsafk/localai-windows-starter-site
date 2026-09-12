# AFK AI website product brief

AFK AI is a local-first AI workspace for Windows. The website explains the product, its privacy model, current hardware expectations, and the Friend Beta download path.

## Audience

### First-time local AI users

They need:

- one clear download path
- understandable hardware requirements
- a plain description of what installation does
- precise privacy wording
- clear failure and recovery guidance

### Technical evaluators

They need:

- source links
- release and download integrity details
- accurate network behaviour
- support and security reporting paths
- implementation detail without marketing language

## Required answers

A visitor should be able to answer these questions quickly:

1. What is AFK AI?
2. What runs locally?
3. What can still use the internet?
4. What hardware and Windows features are required?
5. What does installation change?
6. What happens when the machine is not ready?
7. Where is support?
8. How is the installer pinned and verified?

## Writing style

Public copy should be calm, direct, and technically accurate.

Use short sentences. Put important tradeoffs near the feature they qualify. Explain technical requirements in normal language. State Friend Beta limitations plainly. Do not imply control over third-party behaviour that AFK AI does not own.

Avoid hype, urgency, vanity metrics, vague privacy claims, fake screenshots, fake testimonials, and unexplained jargon.

## Privacy wording

Do not describe AFK AI as offline-only or claim that it makes no network requests.

Current product behaviour includes:

- local model inference through Ollama
- local Open WebUI account and chat storage
- internet access for setup and model downloads
- optional web search using external providers
- a Docker-reachable Ollama host bind on Windows
- Windows Firewall controls for physical-network exposure
- optional remote access only when enabled by the user

## Visual direction

The site should be clean, restrained, and readable in light and dark mode.

Typography:

- Bricolage Grotesque for display text
- system UI for body copy
- IBM Plex Mono for ports, commands, hashes, versions, and model identifiers

Colour:

- blue for primary action
- emerald for positive state
- neutral surfaces for structure

Avoid decorative dashboards, glass effects, heavy gradients, fake technical styling, and visual elements that imply unsupported functionality.

## Design principles

1. Product claims stay close to their limits and requirements.
2. The public site remains a simple document with real anchors rather than a single-page application.
3. Fonts and assets remain self-hosted.
4. Technical identifiers use the mono typeface consistently.
5. Detailed implementation material belongs in GitHub documentation rather than the first screen.
6. Screenshots, metrics, testimonials, and product claims must be real and supportable.
