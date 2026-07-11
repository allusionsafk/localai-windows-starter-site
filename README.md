# localai-windows-starter — website

Landing + docs site for [**localai-windows-starter**](https://github.com/allusionsafk/localai-windows-starter):
a private, local, ChatGPT-style AI workspace for Windows.

Static frontend + one Cloudflare Pages Function that serves live release info,
so the **Download** button and version badge stay current automatically.

## Layout

```
.
├── index.html              # the page (self-contained; no build step)
├── assets/app.js           # all interactivity (external → strict CSP)
├── functions/api/release.js# GET /api/release → latest release + installer URL
├── _headers                # CSP + HSTS + security headers (edge)
├── robots.txt
├── LICENSE                 # MIT
├── wrangler.toml           # optional, for the CLI path
└── package.json            # optional, wrangler dev/deploy scripts
```

## Local preview

```bash
npm install          # gets wrangler (dev dependency only)
npm run dev          # serves the site + the /api/release function locally
```

Plain static preview (no function): open `index.html`, or run any static server.
Without the function, the page falls back to the static `releases/latest` link.

## Deploy to Cloudflare Pages (free)

**Option A — Git integration (recommended).**
1. Push this folder to a Git repo.
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
3. Pick the repo. Framework preset: **None**. Build command: **empty**.
   Build output directory: **`/`**. Save & deploy.
4. `functions/` is detected automatically, so `/api/release` goes live with it.

**Option B — Direct upload (CLI).**
```bash
npx wrangler pages deploy .
```
(Runs `wrangler login` first — your Cloudflare account, in your browser.)

## Security posture

- **CSP** with `script-src 'self'` — no inline scripts; all JS is in `assets/app.js`.
- **HSTS**, `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`,
  a locked-down `Permissions-Policy`, and COOP/CORP — see `_headers`.
- Only third-party origins are Google Fonts, pinned explicitly in the CSP.
- The release function is a **read-only** proxy to the public GitHub API with edge
  caching; it holds no secrets and takes no user input.

## Credits

Built by [allusionsafk](https://github.com/allusionsafk). The stack it documents
stands on [Ollama](https://ollama.com), [Open WebUI](https://github.com/open-webui/open-webui),
[SearXNG](https://github.com/searxng/searxng), [Kokoro](https://github.com/remsky/Kokoro-FastAPI),
and [ComfyUI](https://github.com/comfyanonymous/ComfyUI). Not affiliated with
mudler/LocalAI or localai.io.

MIT licensed.
