# AFK AI website

The public landing site for [**AFK AI for Windows**](https://github.com/allusionsafk/localai-windows-starter),
a local-first, ChatGPT-style AI workspace for Windows.

**Live site:** https://localai-windows-starter-site.allusionsafk.workers.dev/

The site is intentionally small: static assets plus one Cloudflare Worker route
that serves the pinned friend-beta installer only after verifying its SHA-256.
The homepage itself has no analytics, account system, cookies, forms, or database.

## Current friend-beta contract

- Public status: **Friend Beta 0.1.7rc1**
- Download CTA: `/download`
- Installer source: exact pinned `v0.1.7rc1` tag blob
- Download integrity: verified server-side before executable bytes are returned
- On hash mismatch or upstream failure: fail closed with no installer bytes served

The site's download route is deliberately independent of GitHub's
`releases/latest`, which still points at an older public release.

## Deployment

Deployed as a **Cloudflare Worker with static assets** (`wrangler deploy`). The
static files in `public/` are served directly; `worker.js` only handles
`/download`.

```text
.
├── public/                      # static webroot
│   ├── index.html               # landing page; no build step
│   ├── assets/app.js            # theme + small UI behaviour
│   ├── assets/site.css          # styles
│   ├── assets/fonts/            # self-hosted fonts
│   ├── _headers                 # CSP + HSTS + security headers
│   ├── robots.txt
│   └── .well-known/security.txt # RFC 9116 security contact
├── tests/test-worker.mjs        # download/integrity route tests
├── worker.js                    # GET/HEAD /download → pinned, SHA-256-verified installer
├── wrangler.toml                # Worker + static-assets binding
├── LICENSE                      # MIT
└── package.json                 # dev/deploy/test scripts
```

Repository metadata (`README.md`, `DESIGN.md`, `PRODUCT.md`, `package.json`,
`wrangler.toml`, `LICENSE`) sits outside `public/` so it is not served as part
of the website.

## Local preview

```bash
npm install
npm run dev     # wrangler dev: public/ + the real /download Worker route
npm test        # worker/download integrity tests
```

A plain static server can preview `public/`, but `/download` will not work
without the Worker. That is intentional: the page does **not** fall back to an
unpinned or `releases/latest` installer.

## Deploy to Cloudflare

### Git integration

1. Import the repository in **Workers & Pages**.
2. Deploy command: `npx wrangler deploy`.
3. No separate build command is required.
4. The assets binding in `wrangler.toml` serves `public/`; the Worker owns only
   `/download`.

The current setup auto-deploys `master` through Cloudflare's repository
integration.

### Direct CLI deploy

```bash
npx wrangler deploy
```

## Security posture

The site is intentionally low-state and low-input:

- no user accounts;
- no cookies or sessions;
- no forms;
- no database;
- no analytics script;
- no inline scripts;
- self-hosted fonts and same-origin static assets;
- `script-src 'self'` CSP;
- HSTS, `X-Content-Type-Options`, `X-Frame-Options: DENY`,
  `Referrer-Policy`, COOP/CORP, and a restrictive `Permissions-Policy`;
- `/.well-known/security.txt` for vulnerability reports.

### Download route

`worker.js` accepts only `GET` and `HEAD` on `/download`.

The route:

1. fetches the installer from the exact pinned Git tag URL;
2. computes SHA-256 over the returned bytes;
3. compares it with the committed expected digest;
4. serves the bytes as `application/octet-stream` only on an exact match;
5. fails closed with a generic error if the upstream fails or the digest differs;
6. normalizes the cache key so query strings cannot bypass integrity checking.

The browser is not asked to trust a dynamically discovered release. Integrity
checking happens on the Worker before the installer is served.

## Privacy wording

The website intentionally distinguishes **local inference** from **offline-only**.
AFK AI's model inference and chat history are local, but setup/model downloads
use the internet, and optional web search sends search queries to external
search providers through the local SearXNG service. The landing page should not
claim that the product makes zero network requests.

## Post-deploy hardening

For a future custom domain:

1. Set minimum TLS to 1.2 or newer.
2. Keep **Always Use HTTPS** enabled.
3. Require MFA on both the Cloudflare and GitHub accounts that can deploy.
4. Watch Worker logs/analytics for unusual download-route failures.

`workers.dev` is already HTTPS-only.

## Credits

Built by [allusionsafk](https://github.com/allusionsafk). AFK AI stands on
[Ollama](https://ollama.com),
[Open WebUI](https://github.com/open-webui/open-webui),
[SearXNG](https://github.com/searxng/searxng),
[Kokoro](https://github.com/remsky/Kokoro-FastAPI), and
[ComfyUI](https://github.com/comfyanonymous/ComfyUI), each under its own
licence.

AFK AI is not affiliated with, or endorsed by, mudler/LocalAI or localai.io.
The repository's `localai-*` names are historical/internal naming, not a claim
of affiliation.

MIT licensed.
