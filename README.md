# AFK AI website

Public landing and download surface for [AFK AI for Windows](https://github.com/allusionsafk/localai-windows-starter).

**Live site:** https://localai-windows-starter-site.allusionsafk.workers.dev/

[Product](PRODUCT.md) · [Design](DESIGN.md) · [Support](SUPPORT.md) · [Security](SECURITY.md) · [Contributing](CONTRIBUTING.md)

The site is intentionally small: static HTML, CSS, and JavaScript, plus one Cloudflare Worker route for the pinned Friend Beta installer.

## Public contract

| Surface | Contract |
|---|---|
| Homepage | Static. No account system, forms, or analytics |
| Download route | `/download` |
| Pinned candidate | Friend Beta `0.1.7rc1` |
| Integrity | SHA-256 checked before installer bytes are returned |
| Failure mode | Fail closed on upstream or hash mismatch |
| Version authority | Website pin, not `releases/latest` |

The repository also serves a separate Adaptive Media page under `/adaptive-media/`. That page does not control the AFK AI download route.

## Structure

```text
public/
  index.html
  adaptive-media/index.html
  assets/
  .well-known/security.txt
  _headers
  robots.txt

worker.js
wrangler.toml
tests/
```

Repository documentation and development metadata sit outside `public/` and are not deployed as site content.

## Local development

```bash
npm ci
npm run dev
npm test
```

`npm run dev` starts Wrangler with the real Worker route. A plain static server can preview the page, but `/download` will not work. The site does not fall back to an unpinned installer.

## Deployment

Cloudflare Workers can deploy the repository directly with:

```bash
npx wrangler deploy
```

A repository commit is not proof of a live deployment. Deployment status should be verified separately.

## Download integrity

For `GET` or `HEAD` requests to `/download`, `worker.js`:

1. fetches the installer from the exact pinned tag
2. computes SHA-256 over the returned bytes
3. compares it with the committed digest
4. serves the file only on an exact match
5. fails closed if retrieval or verification fails

The browser does not discover a release dynamically.

## Security and privacy

The site has no accounts, cookies, forms, database, or analytics. Fonts and page assets are self-hosted. The deployed headers include a restrictive Content Security Policy and standard browser security controls.

AFK AI itself is local-first, not offline-only. Model inference and local chat storage can remain on the user's machine. Setup, model downloads, updates, optional web search, and integrations can use the internet.

See [SECURITY.md](SECURITY.md) for private vulnerability reporting and [SUPPORT.md](SUPPORT.md) for issue routing.

## Public copy rules

The site should stay direct and evidence-based:

- no fake screenshots
- no invented usage numbers or testimonials
- no vague privacy claims
- no unsupported platform or release claims
- technical detail only where it helps the visitor make a decision

## Licence

MIT. See [LICENSE](LICENSE).

---

**ALLUSIONS**  
Independent software by Jidan.  
[@allusionsafk](https://github.com/allusionsafk)
