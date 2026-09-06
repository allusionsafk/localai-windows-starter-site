---
name: AFK AI site
description: Honest, local-first Windows AI landing page with light and dark themes and no third-party page origins.
colors:
  day-sky: "#f6f8fc"
  day-panel: "#ffffff"
  day-panel-2: "#f3f6fb"
  day-ink: "#0a0c14"
  day-muted: "#5b6980"
  day-line: "#dbe4f0"
  night-sky: "#090d18"
  night-panel: "#0f1627"
  night-panel-2: "#121b30"
  night-ink: "#eef2ff"
  night-muted: "#94a3b8"
  night-line: "#253049"
  accent-blue: "#2563eb"
  accent-blue-dark: "#7aa2ff"
  signal-emerald: "#10b981"
  signal-emerald-dark: "#5eead4"
  code-well: "#0b1020"
typography:
  display: "Bricolage Grotesque"
  body: "system-ui"
  mono: "IBM Plex Mono"
---

# AFK AI design system

## Creative north star

**The Honest Workbench**

AFK AI should look like software that has nothing to hide.

The page is bright and calm in light mode, deep and quiet in dark mode, with a
small number of deliberate signals:

- blue means action
- emerald means positive state
- neutral surfaces carry structure
- mono type marks machine facts
- product claims are paired with their tradeoffs

The design avoids decoration that makes the product look more mature than it
is.

## Foundations

### Color

| Role | Light | Dark |
|---|---|---|
| Page | `#f6f8fc` | `#090d18` |
| Panel | `#ffffff` | `#0f1627` |
| Secondary panel | `#f3f6fb` | `#121b30` |
| Text | `#0a0c14` | `#eef2ff` |
| Muted text | `#5b6980` | `#94a3b8` |
| Border | `#dbe4f0` | `#253049` |
| Action | `#2563eb` | `#7aa2ff` |
| Positive state | `#10b981` | `#5eead4` |

**Color is state.** Decorative color should be rare.

### Typography

**Display:** Bricolage Grotesque
**Body:** system UI stack
**Machine facts:** IBM Plex Mono

Use mono for:

- ports
- commands
- hashes
- model identifiers
- versions
- small machine-status labels

Do not use mono for normal prose.

### Shape

- card radius: `12px`
- pill radius: `9999px`
- soft hairline borders
- one restrained shadow voice
- no glassmorphism

## Hierarchy

### Hero

The hero should answer three questions immediately:

1. What is this?
2. Who is it for?
3. What do I click?

The headline stays:

> **Your AI. Your PC.**

The supporting copy should explain local inference without implying the product
is permanently offline.

### Sections

Use one clear idea per section.

Current hierarchy:

1. hero and download
2. how installation works
3. Control Center
4. local and network boundary
5. closing download CTA

Deep implementation detail belongs in GitHub docs, not in the first screen.

## Components

### Buttons

Primary buttons use the main ink/action contrast and pill shape.

Requirements:

- obvious focus state
- no hidden interaction
- no urgency tricks
- text says what happens

### Cards

Cards use:

- neutral panel background
- one-pixel border
- 12px radius
- restrained shadow
- generous internal padding

Cards should group information, not decorate empty space.

### Status chips

Use compact chips for real state such as:

- Friend Beta
- version
- local endpoint
- positive health state

Do not invent status signals simply to make the page look active.

### Code and machine facts

Code wells stay dark in both themes. This gives terminal material a stable
surface without turning the whole site into terminal cosplay.

### Progressive disclosure

Use `<details>` only when the secondary material is genuinely optional.

Do not hide a requirement or risk behind an expander.

## Copy rules

Public copy must be:

- accurate
- short
- calm
- specific
- readable by a non-expert

Avoid:

- em dashes
- hype adjectives
- fake certainty
- fake privacy absolutes
- fake screenshots
- fake testimonials
- vanity metrics
- countdowns or scarcity
- unexplained acronyms in the first screen

Use punctuation that reads cleanly in compact UI copy: periods, commas,
semicolons, colons, parentheses, and middle dots for short metadata groups.

## Privacy presentation

The page must distinguish:

**Local by design**

- model inference
- Open WebUI local account and chat database
- loopback user-facing services

**Network when needed or enabled**

- setup downloads
- model downloads
- updates
- optional web search
- optional online integrations

The current native Ollama host bind is not described as loopback-only.

## Accessibility

Maintain:

- semantic headings
- one primary `h1`
- skip link
- visible keyboard focus
- meaningful button labels
- sufficient contrast
- touch-friendly controls
- reduced-motion respect
- accessible theme control
- sensible reading order without CSS

Never use color as the only indicator of meaning.

## Content Security Policy

The public page is designed for a strict CSP.

Keep:

- scripts same-origin
- styles same-origin
- fonts self-hosted
- no inline scripts
- no inline event handlers
- no inline styles
- no third-party embeds or analytics

A visual enhancement is not worth weakening the CSP.

## Anti-references

Do not drift toward:

- SaaS gradient washes
- glass cards
- crypto or AI hype
- hacker-terminal cosplay
- giant feature matrices
- dark-pattern urgency
- decorative charts with no product evidence
- fake app screenshots

## Review checklist

Before shipping a public-facing change:

- Is every claim supported by current product behavior?
- Does the first screen still explain the product quickly?
- Is the download path still obvious?
- Is local-first wording precise?
- Are requirements visible?
- Is Friend Beta status visible?
- Did any third-party origin appear?
- Does light and dark mode still work?
- Did an em dash enter public copy?
- Did the change create visual noise without adding information?
