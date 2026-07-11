// Unit-test worker.js handleRelease() with mocked Cloudflare runtime globals.
// Run via `npm test` (from the repo root, so the relative import resolves).
import { handleRelease, _resetMemCacheForTests } from '../worker.js';

globalThis.caches = { default: { match: async () => undefined, put: async () => {} } };
const ctx = { waitUntil() {} };

function ghResponse(assets) {
  return {
    ok: true,
    async json() {
      return {
        tag_name: 'v0.1.1',
        name: 'v0.1.1 — private local AI for Windows',
        html_url: 'https://github.com/allusionsafk/localai-windows-starter/releases/tag/v0.1.1',
        published_at: '2026-07-10T14:22:11Z',
        prerelease: false,
        assets,
      };
    },
  };
}

const GOOD_ASSET = {
  name: 'Install.Local.AI.cmd',
  browser_download_url: 'https://github.com/allusionsafk/localai-windows-starter/releases/download/v0.1.1/Install.Local.AI.cmd',
  digest: 'sha256:461bef931cdbc95c11037ce55f4ae5fef5715abd546558f94a323e7855ed6b46',
};

let pass = 0, fail = 0;
function check(name, cond) { (cond ? (pass++, console.log('  ok  ' + name)) : (fail++, console.log('FAIL  ' + name))); }

// --- Case 1: legitimate release ---
_resetMemCacheForTests();
globalThis.fetch = async () => ghResponse([GOOD_ASSET]);
let res = await handleRelease(new Request('https://site/api/release?x=1'), ctx);
let b = await res.json();
console.log('Case 1 — legitimate release:');
check('status 200', res.status === 200);
check('nosniff header', res.headers.get('x-content-type-options') === 'nosniff');
check("CSP default-src 'none' on JSON", res.headers.get('content-security-policy') === "default-src 'none'");
check('x-frame-options DENY on JSON', res.headers.get('x-frame-options') === 'DENY');
check('tag v0.1.1', b.tag === 'v0.1.1');
check('installer_url is the repo asset', b.installer_url === GOOD_ASSET.browser_download_url);
check('sha256 passed through', b.installer_sha256 === GOOD_ASSET.digest);

// --- Case 2: hostile upstream (foreign URL + bad digest) must be rejected ---
_resetMemCacheForTests();
globalThis.fetch = async () => ghResponse([{
  name: 'Install.Local.AI.cmd',
  browser_download_url: 'https://evil.example.com/Install.Local.AI.cmd',
  digest: 'sha256:zzz',
}]);
res = await handleRelease(new Request('https://site/api/release'), ctx);
b = await res.json();
console.log('Case 2 — hostile upstream:');
check('foreign installer_url rejected (null)', b.installer_url === null);
check('bad digest rejected (null)', b.installer_sha256 === null);
check('tag still surfaced', b.tag === 'v0.1.1');

// --- Case 3: upstream failure => generic 502, no detail leak ---
_resetMemCacheForTests();
globalThis.fetch = async () => ({ ok: false, status: 503, async json() { return {}; } });
res = await handleRelease(new Request('https://site/api/release'), ctx);
b = await res.json();
console.log('Case 3 — upstream failure:');
check('status 502', res.status === 502);
check('generic error only', b.error === 'upstream_unavailable' && !('upstream' in b));
check('fallback html_url present', b.html_url === 'https://github.com/allusionsafk/localai-windows-starter/releases/latest');

// --- Case 4: HEAD returns headers only, no body ---
_resetMemCacheForTests();
globalThis.fetch = async () => ghResponse([GOOD_ASSET]);
res = await handleRelease(new Request('https://site/api/release', { method: 'HEAD' }), ctx);
const headText = await res.text();
console.log('Case 4 — HEAD support:');
check('HEAD status 200', res.status === 200);
check('HEAD body empty', headText === '');
check('HEAD keeps content-type', res.headers.get('content-type') === 'application/json; charset=utf-8');

// --- Case 5: memory cache means one upstream fetch for repeat requests ---
_resetMemCacheForTests();
let fetchCount = 0;
globalThis.fetch = async () => { fetchCount++; return ghResponse([GOOD_ASSET]); };
const r1 = await handleRelease(new Request('https://site/api/release'), ctx);
const r2 = await handleRelease(new Request('https://site/api/release?y=2'), ctx);
const b1 = await r1.text(), b2 = await r2.text();
console.log('Case 5 — memory cache:');
check('single upstream fetch for two requests', fetchCount === 1);
check('identical bodies from cache', b1 === b2 && b1.includes('v0.1.1'));

// --- Case 6: failures are NOT memory-cached ---
_resetMemCacheForTests();
fetchCount = 0;
globalThis.fetch = async () => { fetchCount++; return { ok: false, status: 503, async json() { return {}; } }; };
await handleRelease(new Request('https://site/api/release'), ctx);
await handleRelease(new Request('https://site/api/release'), ctx);
console.log('Case 6 — 502 not cached:');
check('failed responses retried, not cached', fetchCount === 2);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
