# localai-windows-starter — website

Landing + docs site for [**localai-windows-starter**](https://github.com/allusionsafk/localai-windows-starter):
a private, local, ChatGPT-style AI workspace for Windows.

Static frontend + one Cloudflare Pages Function that serves live release info,
so the **Download** button and version badge stay current automatically.

## Layout

```
.
├── public/                 # the webroot — ONLY these files are served
│   ├── index.html          #   the page (self-contained; no build step)
│   ├── assets/app.js       #   all interactivity (external → strict CSP)
│   ├── _headers            #   CSP + HSTS + security headers (edge)
│   ├── robots.txt
│   └── .well-known/security.txt  # vulnerability-report contact (RFC 9116)
├── functions/api/release.js# GET /api/release → latest release + installer URL + sha256
├── LICENSE                 # MIT
├── wrangler.toml           # optional, for the CLI path
└── package.json            # optional, wrangler dev/deploy scripts
```

Repo-meta files (this README, `package.json`, `wrangler.toml`, `LICENSE`) sit
outside `public/` on purpose, so they are never served as public URLs.

## Local preview

```bash
npm install          # gets wrangler (dev dependency only)
npm run dev          # serves the site + the /api/release function locally
```

Plain static preview (no function): serve the `public/` folder with any static server.
Without the function, the page falls back to the static `releases/latest` link.

## Deploy to Cloudflare Pages (free)

**Option A — Git integration (recommended).**
1. Push this folder to a Git repo.
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
3. Pick the repo. Framework preset: **None**. Build command: **empty**.
   Build output directory: **`public`**. Save & deploy.
4. `functions/` is detected automatically, so `/api/release` goes live with it.

**Option B — Direct upload (CLI).**
```bash
npx wrangler pages deploy .
```
(Runs `wrangler login` first — your Cloudflare account, in your browser.)

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
- The release function is a **read-only, GET-only** proxy to the public GitHub
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
