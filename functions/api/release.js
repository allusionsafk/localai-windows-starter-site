// Cloudflare Pages Function — GET /api/release
// Server-side proxy to the GitHub Releases API for the public starter repo.
// Why a function instead of a direct browser call:
//   - keeps the browser off GitHub's per-IP unauth rate limit,
//   - lets us cache at the edge (efficiency),
//   - hands the frontend a clean {tag, installer_url, ...} shape.
const REPO = 'allusionsafk/localai-windows-starter';

export async function onRequestGet(context) {
  const { request } = context;
  const cache = caches.default;
  const cacheKey = new Request(new URL(request.url).toString(), { method: 'GET' });

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

    payload = {
      tag: r.tag_name || null,
      name: r.name || null,
      html_url: r.html_url || `https://github.com/${REPO}/releases/latest`,
      published_at: r.published_at || null,
      prerelease: !!r.prerelease,
      installer_url: installer ? installer.browser_download_url : null,
      installer_name: installer ? installer.name : null,
    };
  } catch (e) {
    status = 502;
    payload = { error: 'upstream_unavailable', html_url: `https://github.com/${REPO}/releases/latest` };
  }

  const res = new Response(JSON.stringify(payload), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      // Edge + browser cache 15 min; serve stale up to an hour while revalidating.
      'cache-control': status === 200
        ? 'public, max-age=900, s-maxage=900, stale-while-revalidate=3600'
        : 'public, max-age=60',
    },
  });

  if (status === 200) context.waitUntil(cache.put(cacheKey, res.clone()));
  return res;
}
