// Cloudflare Pages Function — GET /api/release
// Server-side proxy to the GitHub Releases API for the public starter repo.
// Why a function instead of a direct browser call:
//   - keeps the browser off GitHub's per-IP unauth rate limit,
//   - lets us cache at the edge (efficiency),
//   - hands the frontend a clean {tag, installer_url, ...} shape.
//
// Hardening (ITSM.60.005 pass):
//   - cache key is normalized (query string stripped) so `?x=1` cache-busting
//     can't bypass the edge cache and hammer the GitHub API (DoS vector),
//   - installer_url must match the repo's own /releases/download/ path — a
//     compromised or malformed upstream response can't inject a foreign URL,
//   - the asset's SHA-256 digest is passed through so the page can display it.
const REPO = 'allusionsafk/localai-windows-starter';
const DOWNLOAD_PREFIX = `https://github.com/${REPO}/releases/download/`;

export async function onRequestGet(context) {
  const { request } = context;
  const cache = caches.default;

  // Normalize: same cache entry no matter what query string was appended.
  const keyUrl = new URL(request.url);
  keyUrl.search = '';
  const cacheKey = new Request(keyUrl.toString(), { method: 'GET' });

  const hit = await cache.match(cacheKey);
  if (hit) return hit;

  let payload;
  let status = 200;
  try {
    const gh = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
      headers: {
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'localai-windows-starter-site',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      cf: { cacheTtl: 900, cacheEverything: true },
    });

    if (!gh.ok) throw new Error(`upstream ${gh.status}`);
    const r = await gh.json();

    // Prefer the .cmd installer asset; fall back to the first asset, then the tag page.
    const assets = Array.isArray(r.assets) ? r.assets : [];
    const installer =
      assets.find(a => /\.cmd$/i.test(a.name)) ||
      assets.find(a => /install/i.test(a.name)) ||
      assets[0];

    // Only accept a download URL that lives under this repo's own releases.
    const installerUrl =
      installer && typeof installer.browser_download_url === 'string' &&
      installer.browser_download_url.startsWith(DOWNLOAD_PREFIX)
        ? installer.browser_download_url
        : null;

    // GitHub publishes the asset digest as "sha256:<hex>".
    const digest =
      installer && typeof installer.digest === 'string' &&
      /^sha256:[0-9a-f]{64}$/.test(installer.digest)
        ? installer.digest
        : null;

    payload = {
      tag: r.tag_name || null,
      name: r.name || null,
      html_url: r.html_url || `https://github.com/${REPO}/releases/latest`,
      published_at: r.published_at || null,
      prerelease: !!r.prerelease,
      installer_url: installerUrl,
      installer_name: installerUrl && installer ? installer.name : null,
      installer_sha256: installerUrl ? digest : null,
    };
  } catch (e) {
    // Generic failure shape only — never echo upstream error details.
    status = 502;
    payload = { error: 'upstream_unavailable', html_url: `https://github.com/${REPO}/releases/latest` };
  }

  const res = new Response(JSON.stringify(payload), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'x-content-type-options': 'nosniff',
      // Edge + browser cache 15 min; serve stale up to an hour while revalidating.
      'cache-control': status === 200
        ? 'public, max-age=900, s-maxage=900, stale-while-revalidate=3600'
        : 'public, max-age=60',
    },
  });

  if (status === 200) context.waitUntil(cache.put(cacheKey, res.clone()));
  return res;
}
