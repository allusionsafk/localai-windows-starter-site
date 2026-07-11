// Cloudflare Worker entry for localai-windows-starter-site (Static Assets model).
//
// Static files live in ./public and are served automatically by the assets
// binding (including _headers processing). This Worker only handles the one
// dynamic route — GET /api/release — and delegates everything else to assets.
//
// Hardening (CCCS ITSM.60.005):
//   - GET-only; other methods on /api/release => 405.
//   - cache key is normalized (query string stripped) so `?x=1` cache-busting
//     can't bypass the edge cache and hammer the GitHub API (DoS vector).
//   - installer_url must match the repo's own /releases/download/ path — a
//     compromised/malformed upstream response can't inject a foreign URL.
//   - generic error shape only; upstream error details are never echoed.
const REPO = 'allusionsafk/localai-windows-starter';
const DOWNLOAD_PREFIX = `https://github.com/${REPO}/releases/download/`;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/api/release') {
      if (request.method !== 'GET') {
        return new Response('Method Not Allowed', { status: 405, headers: { allow: 'GET' } });
      }
      return handleRelease(request, ctx);
    }
    // Everything else → static assets in ./public (index.html, _headers, etc.).
    return env.ASSETS.fetch(request);
  },
};

export async function handleRelease(request, ctx) {
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

    const assets = Array.isArray(r.assets) ? r.assets : [];
    const installer =
      assets.find(a => /\.cmd$/i.test(a.name)) ||
      assets.find(a => /install/i.test(a.name)) ||
      assets[0];

    const installerUrl =
      installer && typeof installer.browser_download_url === 'string' &&
      installer.browser_download_url.startsWith(DOWNLOAD_PREFIX)
        ? installer.browser_download_url
        : null;

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
    status = 502;
    payload = { error: 'upstream_unavailable', html_url: `https://github.com/${REPO}/releases/latest` };
  }

  const res = new Response(JSON.stringify(payload), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'x-content-type-options': 'nosniff',
      'cache-control': status === 200
        ? 'public, max-age=900, s-maxage=900, stale-while-revalidate=3600'
        : 'public, max-age=60',
    },
  });

  if (status === 200) ctx.waitUntil(cache.put(cacheKey, res.clone()));
  return res;
}
