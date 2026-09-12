---
name: AFK AI site
description: Local-first Windows AI landing page with light and dark themes and no third-party page origins.
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

The site should present AFK AI as straightforward Windows software. Product status, requirements, privacy limits, and download behaviour should be easy to find without decorative complexity.

## Foundations

### Colour

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

Use colour to communicate hierarchy or state. Decorative colour should be limited.

### Typography

- Display: Bricolage Grotesque
- Body: system UI stack
- Technical values: IBM Plex Mono

Use the mono face for ports, commands, hashes, model identifiers, versions, and compact machine-status labels. Use the body face for normal prose.

### Shape

- card radius: `12px`
- pill radius: `9999px`
- one-pixel borders
- restrained shadows
- no glass effects

## Page hierarchy

The first screen should answer three questions:

1. What is AFK AI?
2. Who is it for?
3. Where is the download?

The current headline is:

> **Your AI. Your PC.**

Supporting copy must describe local inference without implying that the product is permanently offline.

Current section order:

1. hero and download
2. installation overview
3. Control Center
4. local and network behaviour
5. closing download action

Detailed implementation material belongs in GitHub documentation rather than the landing page.

## Components

### Buttons

Primary buttons need a visible focus state, clear action text, and no hidden interaction or urgency language.

### Cards

Cards use neutral surfaces, one-pixel borders, 12px radius, restrained shadow, and enough padding to separate groups of information.

### Status chips

Use chips only for real state such as Friend Beta status, version, local endpoint, or health state.

### Code and technical values

Code blocks use the dark code surface in both themes. This keeps technical material visually stable without making the overall page resemble a terminal.

### Progressive disclosure

Use `<details>` only for genuinely optional secondary material. Requirements and risks must remain visible without expansion.

## Copy

Public copy should be accurate, short, calm, specific, and readable by non-experts.

Avoid hype, fake certainty, privacy absolutes, invented metrics, fake screenshots, fake testimonials, countdowns, scarcity language, and unexplained acronyms in the first screen.

Use simple punctuation. Public copy should not use em dashes.

## Privacy presentation

Clearly separate local behaviour from network activity.

Local by design:

- model inference
- Open WebUI account and chat database
- loopback user-facing services

Network activity when needed or enabled:

- setup downloads
- model downloads
- updates
- optional web search
- optional online integrations

Do not describe the current native Ollama host bind as loopback-only.

## Accessibility

Maintain:

- semantic headings
- one primary `h1`
- a skip link
- visible keyboard focus
- meaningful button labels
- sufficient contrast
- touch-friendly controls
- reduced-motion support
- accessible theme controls
- sensible reading order without CSS

Do not use colour as the only indicator of meaning.

## Content Security Policy

Keep scripts, styles, fonts, and assets same-origin. Avoid inline scripts, inline event handlers, inline styles, third-party embeds, remote analytics, and remote fonts.

Visual changes should not weaken the Content Security Policy.

## Review checklist

Before shipping a public-facing change, confirm that:

- product claims match current behaviour
- the first screen explains the product quickly
- the download path is obvious
- local-first wording is precise
- requirements and Friend Beta status are visible
- no third-party page origin was added without review
- light and dark mode still work
- public copy contains no em dash
- the change adds useful information rather than visual noise
