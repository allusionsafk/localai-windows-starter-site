// Unit-test worker.js handleRelease() with mocked Cloudflare runtime globals.
import { handleRelease } from 'file:///C:/Users/jidan/localai-site/worker.js';

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

let pass = 0, fail = 0;
function check(name, cond) { (cond ? (pass++, console.log('  ok  ' + name)) : (fail++, console.log('FAIL  ' + name))); }

// --- Case 1: legitimate release ---
globalThis.fetch = async () => ghResponse([{
  name: 'Install.Local.AI.cmd',
  browser_download_url: 'https://github.com/allusionsafk/localai-windows-starter/releases/download/v0.1.1/Install.Local.AI.cmd',
  digest: 'sha256:461bef931cdbc95c11037ce55f4ae5fef5715abd546558f94a323e7855ed6b46',
}]);
let res = await handleRelease(new Request('https://site/api/release?x=1'), ctx);
let b = await res.json();
console.log('Case 1 — legitimate release:');
check('status 200', res.status === 200);
check('nosniff header', res.headers.get('x-content-type-options') === 'nosniff');
check('tag v0.1.1', b.tag === 'v0.1.1');
check('installer_url is the repo asset', b.installer_url === 'https://github.com/allusionsafk/localai-windows-starter/releases/download/v0.1.1/Install.Local.AI.cmd');
check('sha256 passed through', b.installer_sha256 === 'sha256:461bef931cdbc95c11037ce55f4ae5fef5715abd546558f94a323e7855ed6b46');

// --- Case 2: hostile upstream (foreign URL + bad digest) must be rejected ---
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
globalThis.fetch = async () => ({ ok: false, status: 503, async json() { return {}; } });
res = await handleRelease(new Request('https://site/api/release'), ctx);
b = await res.json();
console.log('Case 3 — upstream failure:');
check('status 502', res.status === 502);
check('generic error only', b.error === 'upstream_unavailable' && !('upstream' in b));
check('fallback html_url present', b.html_url === 'https://github.com/allusionsafk/localai-windows-starter/releases/latest');

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
