---
name: AFK-LocalAI site
description: Bright, honest landing page for a self-hosted local AI stack; true dark theme; zero third-party origins.
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
  code-comment: "#7f8db0"
  code-text: "#e6ecff"
  copy-done: "#22c55e"
  footage-red: "#ef4444"
typography:
  display:
    fontFamily: "Bricolage Grotesque, system-ui, Segoe UI, sans-serif"
    fontSize: "clamp(3rem, 6vw, 4.4rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Bricolage Grotesque, system-ui, Segoe UI, sans-serif"
    fontSize: "clamp(2rem, 3vw, 2.8rem)"
    fontWeight: 700
    letterSpacing: "-0.04em"
  body:
    fontFamily: "system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1rem"
    lineHeight: 1.55
  lede:
    fontFamily: "system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1.05rem"
    lineHeight: 1.65
  label:
    fontFamily: "system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
    fontSize: "0.82rem"
    letterSpacing: "0.12em"
  mono:
    fontFamily: "IBM Plex Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "0.9rem"
    fontWeight: 400
rounded:
  radius: "12px"
  pill: "9999px"
  phone: "34px"
spacing:
  gutter: "24px"
  card-pad: "28px"
  section-top: "80px"
  grid-gap: "20px"
components:
  button:
    backgroundColor: "{colors.day-panel}"
    rounded: "{rounded.pill}"
    padding: "10px 13px"
  button-primary:
    backgroundColor: "{colors.day-ink}"
    textColor: "{colors.day-sky}"
    rounded: "{rounded.pill}"
  card:
    backgroundColor: "{colors.day-panel}"
    rounded: "{rounded.radius}"
    padding: "{spacing.card-pad}"
  code-block:
    backgroundColor: "{colors.code-well}"
    textColor: "{colors.code-text}"
    rounded: "{rounded.radius}"
    padding: "18px"
---

# Design System: AFK-LocalAI site

## 1. Overview

**Creative North Star: "The Honest Workbench"**

A bright, airy landing page whose credibility IS the aesthetic: every claim is
verifiable, every tradeoff stated in place, every machine fact set in mono. The
page pairs a friendly display face (Bricolage Grotesque) with a plain system
body stack, one blue accent, and an emerald signal color. A true dark theme
mirrors the light theme through CSS variables; code blocks stay dark in both.

It explicitly rejects: SaaS gradient-wash and vanity metrics, crypto/AI hype
urgency, hacker-terminal cosplay, and docs-site blandness.

**Key Characteristics:**
- Zero third-party origins: self-hosted fonts, no analytics, CSP `'self'` only.
- Class-only styling; no inline styles ever (CSP has no unsafe-inline).
- One page, real anchors, progressive disclosure via `<details>`.
- Honest copy: no em dashes, no hype adjectives, tradeoffs beside features.

## 2. Colors

Twin palettes, one accent. Light "day" surfaces mirror dark "night" surfaces
one-for-one through CSS variables.

### Primary
- **Accent Blue** (#2563eb light / #7aa2ff dark): links' hover halo, active
  chips, focus outlines, step numbers. Never used as a fill wash.

### Secondary
- **Signal Emerald** (#10b981 light / #5eead4 dark): the live status dot,
  positive signals, small highlights inside the ValClip footage mock.

### Neutral
- **Day Sky / Night Sky** (#f6f8fc / #090d18): page background with a faint
  radial blue tint at the top.
- **Panels** (#ffffff, #f3f6fb / #0f1627, #121b30): cards, tab wells.
- **Ink** (#0a0c14 / #eef2ff) and **Muted** (#5b6980 / #94a3b8): text pair.
- **Line** (#dbe4f0 / #253049): hairlines, borders, table rules.
- **Code Well** (#0b1020, comments #7f8db0, text #e6ecff): code blocks keep
  this dark surface in both themes; it reads as "terminal", not as a theme leak.
- **Footage Red** (#ef4444 alpha variants): used only inside the ValClip phone
  mock to depict kill-feed highlights; never in page chrome.

**The Color-Is-State Rule.** If something is colored, it carries meaning
(status, action, focus). Decoration stays neutral.

## 3. Typography

**Display Font:** Bricolage Grotesque (self-hosted variable woff2, 400-800)
**Body Font:** system-ui stack (Segoe UI first; the OS voice)
**Label/Mono Font:** IBM Plex Mono (self-hosted 400/500/600)

**Character:** Warm-technical. The display face has personality without being
a costume; the body is deliberately plain; mono is reserved for anything a
machine would say.

### Hierarchy
- **Display** (700, clamp(3rem, 6vw, 4.4rem), 0.98, -0.04em): hero h1 only.
- **Headline** (700, clamp(2rem, 3vw, 2.8rem), -0.04em): section h2.
- **Lede** (1.05rem, 1.65): section subs, max 64-68ch.
- **Body** (1rem, 1.55): everything else; `.small` is 0.9rem/1.6.
- **Kicker** (0.82rem, uppercase, +0.12em, muted): one per section, a
  deliberate brand system carried from launch.
- **Mono** (0.9rem in code blocks): commands, ports, models, hashes, minis.

**The Machine-Speaks-Mono Rule.** Commands, ports, model names, and hashes are
always mono; prose never is.

## 4. Elevation

Soft and singular: one shadow voice (`0 10px 30px -10px rgb(0 0 0 / 0.08)`
light, deeper in dark) on cards and panels, hairline borders doing most of the
structural work. Section separation is a 1px gradient rule, not a shadow.
Hovers lift 1-2px with a border-color shift toward the accent.

## 5. Components

### Buttons
- **Shape:** full pill (9999px), 1px line border.
- **Primary:** ink background, page-background text; hover brightens.
- **Ghost:** transparent background.
- **Hover:** translateY(-1px) + accent-tinted border, 0.18s ease.

### Chips & Tabs
- Pill toggles; active state tints the fill with 16% accent and strengthens
  the border. Tabs sit in a panel-2 pill well; roving arrow-key tablist.

### Cards
- Panel background at 96% opacity, 1px line border, 12px radius, the single
  soft shadow, 28px padding via `.pad`.

### Code blocks
- Always-dark well (#0b1020) with a floating pill Copy button; comments in
  #7f8db0. Copy success flips the button green and fires the toast.

### Steps (`.steps`)
- Numbered circles (34px, mono digits, 12% accent fill, 30% accent border)
  beside a bold mini-heading and muted body. Used only for true sequences.

### Phone mock (`.phone`)
- Signature component: a 9:19 phone frame (panel bg, 34px radius) holding a
  fixed-dark "footage" screen with hook text, kill-feed rows, crosshair,
  karaoke caption, and kill counter. Footage colors never react to theme.

### See-more expander (`.seemore`)
- A card-shaped `<details>`: bold summary row with a mono +/− indicator,
  two-column body on desktop.

## 6. Do's and Don'ts

### Do:
- **Do** keep every port, command, and model name in IBM Plex Mono.
- **Do** state the honest tradeoff next to every capability claim.
- **Do** use classes for all styling; the CSP forbids inline styles.
- **Do** mirror any new light-theme value with a dark-theme counterpart.
- **Do** keep sequences numbered only when order genuinely matters.

### Don't:
- **Don't** add any third-party origin (fonts, scripts, images, embeds).
- **Don't** use em dashes in copy, hype adjectives, or urgency patterns.
- **Don't** ship "SaaS gradient-wash, vanity metrics, glassmorphism" (the
  PRODUCT.md anti-references) anywhere on the page.
- **Don't** color decoration; color is state, action, or focus.
- **Don't** let the footage mock's reds/teals leak into page chrome.
