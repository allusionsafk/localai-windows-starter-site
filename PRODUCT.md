# Product

## Register

brand

## Users

Two audiences. First: a friend or stranger on Windows 11 with an NVIDIA GPU who was
told "you can run your own private ChatGPT at home" and wants the least-scary path to
it. They skim, they don't read; they need one download button, honest hardware talk,
and reassurance that nothing phones home. Second: the technically curious visitor who
evaluates the project's engineering before trusting an installer, and reads the
security contract, the CLI table, and the source links.

## Product Purpose

The public landing page for AFK-LocalAI (repo `allusionsafk/localai-windows-starter`).
One page that: explains what the stack is (Ollama + Open WebUI + SearXNG + Kokoro on
your own GPU), gets the visitor to the right install path for their comfort level,
sets honest hardware expectations (capability tiers), states the security contract,
and keeps the download link current via a cached edge function. Success: a visitor
downloads the installer knowing exactly what it will and will not do.

## Brand Personality

Honest, warm-technical, self-hosted pride. The voice states tradeoffs plainly
("CPU-only is slow; the installer says so instead of pretending otherwise") because
trust is the product. Aesthetic: clean bright surface (with a true dark theme), one
blue accent plus an emerald signal color, Bricolage Grotesque display type over a
system body stack, IBM Plex Mono for anything a machine would say. Zero third-party
origins: fonts self-hosted, no analytics, no trackers, CSP with no unsafe-inline.

## Anti-references

- SaaS gradient-wash landing pages with vanity metrics and glassmorphism.
- Crypto/AI hype sites: sparkle emoji, "revolutionary", dark-pattern urgency.
- Hacker-terminal cosplay (green CRT glow, scanlines).
- Docs-site blandness: the page is a pitch with proof, not a wiki.

## Design Principles

1. **Honesty is the aesthetic.** Every claim is verifiable in the repo; tradeoffs are
   stated next to features, not hidden in footnotes.
2. **One page, real anchors.** Everything reachable from the nav; no routing, no SPA.
3. **Zero third-party origins.** Self-hosted fonts and assets; CSP `style-src 'self'`,
   `script-src 'self'`; classes only, never inline styles.
4. **The machine speaks mono.** Commands, ports, model names, and hashes render in
   IBM Plex Mono; prose never does.
5. **Progressive disclosure.** Deep material (troubleshooting, hardware roadmap,
   side-project detail) lives in expandable details, not extra pages.
