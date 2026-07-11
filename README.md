# localai-windows-starter — website

Landing + docs site for [**localai-windows-starter**](https://github.com/allusionsafk/localai-windows-starter):
a private, local, ChatGPT-style AI workspace for Windows.

Static assets + one small Cloudflare Worker that serves live release info, so
the **Download** button and version badge stay current automatically.

Deployed as a **Cloudflare Worker with static assets** (`wrangler deploy`). The
static files in `public/` are served directly; the Worker only runs for the
`/api/release` route.

## Layout

```
.
├── public/                 # static assets — served directly by the assets binding
│   ├── index.html          #   the page (self-contained; no build step)
│   ├── assets/app.js       #   all interactivity (external → strict CSP)
│   ├── _headers            #   CSP + HSTS + security headers
│   ├── robots.txt
│   └── .well-known/security.txt  # vulnerability-report contact (RFC 9116)
├── worker.js               # GET /api/release → latest release + installer URL + sha256
├── wrangler.toml           # name, main = worker.js, [assets] directory = ./public
├── LICENSE                 # MIT
└── package.json            # wrangler dev/deploy scripts
```

Repo-meta files (this README, `package.json`, `wrangler.toml`, `LICENSE`) sit
outside `public/` on purpose, so they are never served as public URLs.

## Local preview

```bash
npm install          # gets wrangler (dev dependency only)
npm run dev          # wrangler dev — serves public/ + the /api/release Worker route
```

Plain static preview (no Worker): serve the `public/` folder with any static
server. Without the Worker, the page falls back to the `releases/latest` link.

## Deploy to Cloudflare (free)

**Git integration (recommended).**
1. Push this repo to GitHub.
2. Cloudflare dashboard → **Workers & Pages → Create → Import a repository** →
   pick the repo. Deploy command: **`npx wrangler deploy`** (the default). No
   build command needed. The `[assets]` binding in `wrangler.toml` serves
   `public/`; the Worker handles `/api/release`. Auto-deploys on push to `master`.

**Direct upload (CLI).**
```bash
npx wrangler deploy      # runs `wrangler login` first — your Cloudflare account
```

## Security posture

Audited against CCCS **ITSM.60.005** (Security considerations for your website).
Most of that guidance targets dynamic sites; this site's strongest control is
architectural — **no accounts, no cookies, no sessions, no forms, no database,
no user input anywhere**.

In code:
- **CSP** with `script-src 'self'` — no inline scripts; all JS is in `assets/app.js`.
- **HSTS**, `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`,
  a locked-down `Permissions-Policy`, and COOP/CORP — see `public/_headers`.
- Only third-party origins are Google Fonts, pinned explicitly in the CSP.
- The release Worker is a **read-only, GET-only** proxy to the public GitHub
  API: normalized edge-cache key (query-string cache-busting can't bypass it),
  installer URL validated against the repo's own `/releases/download/` path
  (server-side *and* client-side), generic error shape (no upstream details),
  no secrets, no user input.
- **Download integrity**: the installer's SHA-256 (from the GitHub API) is shown
  next to the download so users can verify with `Get-FileHash`.
- `/.well-known/security.txt` publishes the vulnerability-report channel.
- Webroot is `public/` only — repo-meta files are never served.

### Post-deploy hardening (Cloudflare dashboard — one-time)

1. **SSL/TLS → Edge Certificates → Minimum TLS Version: 1.2** (TLS 1.3 stays
   enabled above it; the Cloudflare default minimum is 1.0).
2. **SSL/TLS → Always Use HTTPS: On.**
3. Turn on **MFA** for the Cloudflare account *and* the GitHub account that owns
   the repo — they are this site's real admin interfaces.
4. Watch **Workers & Pages → your project → Analytics/Logs** for anomalies;
   Cloudflare's free tier includes baseline DDoS protection in front of it all.

## Credits

Built by [allusionsafk](https://github.com/allusionsafk). The stack it documents
stands on [Ollama](https://ollama.com), [Open WebUI](https://github.com/open-webui/open-webui),
[SearXNG](https://github.com/searxng/searxng), [Kokoro](https://github.com/remsky/Kokoro-FastAPI),
and [ComfyUI](https://github.com/comfyanonymous/ComfyUI). Not affiliated with
mudler/LocalAI or localai.io.

MIT licensed.
