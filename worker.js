// Cloudflare Worker entry for the AFK-LocalAI site (Static Assets model).
//
// Static files live in ./public and are served automatically by the assets
// binding (including _headers processing). This Worker only handles the one
// dynamic route, /api/release, and delegates everything else to assets.
//
// Hardening (CCCS ITSM.60.005):
//   - GET/HEAD only; other methods on /api/release => 405.
//   - cache key is normalized (query string stripped) so `?x=1` cache-busting
//     can't bypass the edge cache and hammer the GitHub API (DoS vector).
//   - a per-isolate memory cache backs the edge cache, so GitHub sees at most
//     one request per isolate per TTL even where the Cache API is unavailable.
//   - installer_url must match the repo's own /releases/download/ path; a
//     compromised or malformed upstream response can't inject a foreign URL.
//   - generic error shape only; upstream error details are never echoed.
const REPO = 'allusionsafk/localai-windows-starter';
const DOWNLOAD_PREFIX = `https://github.com/${REPO}/releases/download/`;
const MEM_TTL_MS = 15 * 60 * 1000;

// Per-isolate second cache layer: { body: string, ts: number }. Only 200s.
let memCache = null;

// Test hook: isolates persist module state between handleRelease calls.
export function _resetMemCacheForTests() { memCache = null; }

function jsonResponse(body, status, isHead) {
  return new Response(isHead ? null : body, {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'x-content-type-options': 'nosniff',
      'content-security-policy': "default-src 'none'",
      'x-frame-options': 'DENY',
      'cache-control': status === 200
        ? 'public, max-age=900, s-maxage=900, stale-while-revalidate=3600'
        : 'public, max-age=60',
    },
  });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/api/release') {
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        return new Response('Method Not Allowed', { status: 405, headers: { allow: 'GET, HEAD' } });
      }
      return handleRelease(request, ctx);
    }
    // Everything else → static assets in ./public (index.html, _headers, etc.).
    return env.ASSETS.fetch(request);
  },
};

export async function handleRelease(request, ctx) {
  const isHead = request.method === 'HEAD';

  // Layer 1: per-isolate memory (works everywhere, including workers.dev).
  if (memCache && Date.now() - memCache.ts < MEM_TTL_MS) {
    return jsonResponse(memCache.body, 200, isHead);
  }

  // Layer 2: edge cache, keyed without the query string.
  const cache = caches.default;
  const keyUrl = new URL(request.url);
  keyUrl.search = '';
  const cacheKey = new Request(keyUrl.toString(), { method: 'GET' });

  const hit = await cache.match(cacheKey);
  if (hit) {
    const body = await hit.text();
    memCache = { body, ts: Date.now() };
    return jsonResponse(body, 200, isHead);
  }

  // Layer 3: the GitHub API.
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

  const body = JSON.stringify(payload);
  if (status === 200) {
    memCache = { body, ts: Date.now() };
    const cacheable = jsonResponse(body, 200, false);
    ctx.waitUntil(cache.put(cacheKey, cacheable));
  }
  return jsonResponse(body, status, isHead);
}
