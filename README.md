# AFK AI website

The landing and docs site for [**localai-windows-starter**](https://github.com/allusionsafk/localai-windows-starter),
AFK AI's private, ChatGPT-style AI workspace for Windows.

Static assets plus one small Cloudflare Worker that serves the pinned friend-beta
installer, so the **Download** button hands over bytes this site has verified.

Deployed as a **Cloudflare Worker with static assets** (`wrangler deploy`). The
static files in `public/` are served directly; the Worker only runs for the
`/download` route.

## Layout

```
.
├── public/                 # static assets, served directly by the assets binding
│   ├── index.html          #   the page (self-contained; no build step)
│   ├── assets/app.js       #   all interactivity (external file → strict CSP)
│   ├── _headers            #   CSP + HSTS + security headers
│   ├── robots.txt
│   └── .well-known/security.txt  # vulnerability-report contact (RFC 9116)
├── tests/test-worker.mjs   # unit suite for the release Worker
├── worker.js               # GET /download → the pinned v0.1.7rc1 installer, SHA-256 verified
├── wrangler.toml           # name, main = worker.js, [assets] directory = ./public
├── LICENSE                 # MIT
└── package.json            # wrangler dev/deploy/test scripts
```

Repo-meta files (this README, `package.json`, `wrangler.toml`, `LICENSE`) sit
outside `public/` on purpose, so they are never served as public URLs.

## Local preview

```bash
npm install          # gets wrangler (dev dependency only)
npm run dev          # wrangler dev: serves public/ + the /download Worker route
npm test             # unit suite for worker.js
```

Plain static preview (no Worker): serve the `public/` folder with any static
server. Without the Worker, the page falls back to the `releases/latest` link.

## Deploy to Cloudflare (free)

**Git integration (recommended).**
1. Push this repo to GitHub.
2. Cloudflare dashboard → **Workers & Pages → Create → Import a repository** →
   pick the repo. Deploy command: **`npx wrangler deploy`** (the default). No
   build command needed. The `[assets]` binding in `wrangler.toml` serves
   `public/`; the Worker handles `/download`. Auto-deploys on push to `master`.

**Direct upload (CLI).**
```bash
npx wrangler deploy      # runs `wrangler login` first (your Cloudflare account)
```

## Security posture

Audited against CCCS **ITSM.60.005** (Security considerations for your website).
Most of that guidance targets dynamic sites; this site's strongest control is
architectural: **no accounts, no cookies, no sessions, no forms, no database,
no user input anywhere**.

In code:
- **CSP** with `script-src 'self'`: no inline scripts; all JS is in `assets/app.js`.
- **HSTS**, `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`,
  a locked-down `Permissions-Policy`, and COOP/CORP. See `public/_headers`.
- The only third-party origins are Google Fonts, pinned explicitly in the CSP.
- The release Worker is a **read-only, GET/HEAD-only** proxy to the public GitHub
  API: normalized edge-cache key (query-string cache-busting can't bypass it),
  installer URL validated against the repo's own `/releases/download/` path
  (server-side *and* client-side), generic error shape (no upstream details),
  no secrets, no user input.
- **Download integrity**: the installer's SHA-256 (from the GitHub API) is shown
  next to the download so users can verify with `Get-FileHash`.
- `/.well-known/security.txt` publishes the vulnerability-report channel.
- The webroot is `public/` only; repo-meta files are never served.

### Post-deploy hardening (Cloudflare dashboard, one-time)

1. **SSL/TLS → Edge Certificates → Minimum TLS Version: 1.2** (TLS 1.3 stays
   enabled above it; the Cloudflare default minimum is 1.0). Applies when a
   custom domain is attached; plain `workers.dev` is already HTTPS-only.
2. **SSL/TLS → Always Use HTTPS: On** (custom domains).
3. Turn on **MFA** for the Cloudflare account *and* the GitHub account that owns
   the repo. They are this site's real admin interfaces.
4. Watch **Workers & Pages → your project → Analytics/Logs** for anomalies;
   Cloudflare's free tier includes baseline DDoS protection in front of it all.

## Credits

Built by [allusionsafk](https://github.com/allusionsafk). The stack it documents
stands on [Ollama](https://ollama.com), [Open WebUI](https://github.com/open-webui/open-webui),
[SearXNG](https://github.com/searxng/searxng), [Kokoro](https://github.com/remsky/Kokoro-FastAPI),
and [ComfyUI](https://github.com/comfyanonymous/ComfyUI). Not affiliated with
mudler/LocalAI or localai.io; AFK-LocalAI is an independent project.

MIT licensed.
