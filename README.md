# AFK AI website

The public landing and download surface for
[**AFK AI for Windows**](https://github.com/allusionsafk/localai-windows-starter).

**Live site:** https://localai-windows-starter-site.allusionsafk.workers.dev/

[Support](SUPPORT.md) · [Contributing](CONTRIBUTING.md) · [Security](SECURITY.md) · [Product](PRODUCT.md) · [Design](DESIGN.md)

AFK AI is a local-first AI workspace for Windows. This repository keeps the
public site intentionally small: static HTML/CSS/JavaScript plus one Cloudflare
Worker route for the pinned Friend Beta installer.

## What this site guarantees

| Surface | Contract |
|---|---|
| Homepage | Static, no account system, no forms, no analytics |
| Download CTA | `/download` |
| Candidate | Friend Beta `0.1.7rc1` |
| Installer source | Exact pinned `v0.1.7rc1` tag blob |
| Integrity | SHA-256 verified before installer bytes are returned |
| Failure mode | Fail closed on upstream or hash mismatch |
| `releases/latest` | Not used for Friend Beta delivery |

The download route is intentionally independent of GitHub
`releases/latest`, which currently points at an older public release.

## Architecture

```text
.
├── .claude/
│   └── launch.json
├── .github/
│   ├── ISSUE_TEMPLATE/
│   └── pull_request_template.md
├── .impeccable/
│   ├── config.json
│   └── design.json
├── public/
│   ├── index.html
│   ├── assets/
│   │   ├── app.js
│   │   ├── site.css
│   │   ├── fonts/
│   │   └── og-image.png
│   ├── .well-known/security.txt
│   ├── _headers
│   └── robots.txt
├── tests/
├── CONTRIBUTING.md
├── DESIGN.md
├── PRODUCT.md
├── README.md
├── SECURITY.md
├── SUPPORT.md
├── package.json
├── package-lock.json
├── worker.js
└── wrangler.toml
```

The homepage has no build step. `worker.js` handles `/download`; static assets
are served from `public/`.

Repository documents and developer metadata sit outside `public/` and are not
part of the deployed webroot.

### Checked-in developer metadata

Two dot-directories are intentionally versioned:

- `.claude/launch.json` is a small local-development launcher for `wrangler dev`
- `.impeccable/` records design-system metadata and deliberate detector exceptions
  so future visual work can preserve the choices documented in [DESIGN.md](DESIGN.md)

Neither directory is required by the deployed website, and neither contains
runtime secrets or customer data. They are repository tooling, not public-site
assets.

## Local development

```bash
npm install
npm run dev
npm test
```

For a reproducible dependency install that follows the lockfile exactly, use
`npm ci` instead of `npm install`.

`npm run dev` starts Wrangler with the real Worker route.

A plain static server can preview the visual page, but `/download` will not
work. That is intentional. The site does not fall back to an unpinned installer.

## Deployment

### Cloudflare repository integration

1. Import the repository in **Workers & Pages**.
2. Use `npx wrangler deploy` as the deploy command.
3. No separate build command is required.
4. Keep the `public/` assets binding and `/download` Worker route intact.

If Cloudflare repository integration is configured to deploy `master`, pushes
to `master` can auto-deploy. The repository itself does not prove the active
Cloudflare dashboard configuration.

### Direct CLI deployment

```bash
npx wrangler deploy
```

A deployment is a separate operational action. Repository changes alone should
not be described as deployed unless the deployment is observed.

## Download integrity

`worker.js` accepts only `GET` and `HEAD` on `/download`.

For each request, it:

1. fetches the installer from the exact pinned Git tag URL
2. computes SHA-256 over the returned bytes
3. compares the result with the committed expected digest
4. serves `application/octet-stream` only on an exact match
5. fails closed if upstream retrieval fails or the digest differs
6. normalizes the cache key so query strings cannot bypass the check

The browser is never asked to discover a release dynamically.

## Security posture

The site intentionally has very little state and very little input.

- no user accounts
- no cookies or sessions
- no forms
- no database
- no analytics
- no inline scripts
- self-hosted fonts
- same-origin static assets
- restrictive Content Security Policy
- HSTS
- `X-Content-Type-Options`
- `X-Frame-Options: DENY`
- `Referrer-Policy`
- COOP/CORP
- restrictive `Permissions-Policy`
- `/.well-known/security.txt`

Security reports use the central website policy in
[SECURITY.md](SECURITY.md). General website-support routing is documented in
[SUPPORT.md](SUPPORT.md).

## Privacy wording

The site deliberately distinguishes **local inference** from **offline-only**.

AFK AI can keep model inference and Open WebUI chat history local. Setup and
model downloads use the internet. Optional web search sends queries to external
search providers through the local SearXNG service.

The page should never claim that AFK AI makes zero network requests or that
every listening socket is loopback-only.

## Product and design

The public voice and visual system are documented in:

- [PRODUCT.md](PRODUCT.md)
- [DESIGN.md](DESIGN.md)

Contribution and support boundaries are documented in:

- [CONTRIBUTING.md](CONTRIBUTING.md)
- [SUPPORT.md](SUPPORT.md)

Core design principles:

- honest product claims
- clean light and dark themes
- one strong blue action color
- emerald reserved for positive state
- self-hosted typography
- no third-party page dependencies
- no fake screenshots or vanity metrics
- no em dashes in public copy

## Credits

Built by [allusionsafk](https://github.com/allusionsafk).

AFK AI uses:

- [Ollama](https://ollama.com)
- [Open WebUI](https://github.com/open-webui/open-webui)
- [SearXNG](https://github.com/searxng/searxng)
- [Kokoro](https://github.com/remsky/Kokoro-FastAPI)
- [ComfyUI](https://github.com/comfyanonymous/ComfyUI)

Each project remains under its own license.

AFK AI is not affiliated with or endorsed by mudler/LocalAI or localai.io.

MIT licensed.
