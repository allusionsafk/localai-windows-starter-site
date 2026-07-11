/* localai-windows-starter site — all interactivity.
   Kept in an external file (not inline) so the Content-Security-Policy can set
   script-src 'self' with no 'unsafe-inline' for scripts. */
(function () {
  'use strict';
  var root = document.documentElement;
  var toast = document.getElementById('toast');

  function showToast(t) {
    if (!toast) return;
    toast.textContent = t;
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () { toast.classList.remove('show'); }, 1500);
  }

  /* Theme: follow the OS preference, let the button flip it. */
  var themeBtn = document.getElementById('themeBtn');
  root.dataset.theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      showToast('Theme updated');
    });
  }

  /* Copy buttons — copy the sibling <code> text. */
  document.querySelectorAll('.copy').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var code = btn.parentElement.querySelector('code');
      var text = code ? code.innerText : '';
      var done = function () {
        btn.textContent = 'Copied';
        btn.classList.add('done');
        showToast('Copied to clipboard');
        setTimeout(function () { btn.textContent = 'Copy'; btn.classList.remove('done'); }, 1200);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { showToast('Copy failed'); });
      } else {
        showToast('Copy not supported');
      }
    });
  });

  /* Install-method tabs. */
  document.querySelectorAll('.tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      document.querySelectorAll('[data-panel-tab]').forEach(function (p) { p.classList.add('hidden'); });
      var panel = document.querySelector('[data-panel-tab="' + tab.dataset.tab + '"]');
      if (panel) panel.classList.remove('hidden');
    });
  });

  /* Capability-tier chips. Values mirror the repo README's tier table. */
  var tiers = {
    S:   { vram: '≥16 GB', model: 'qwen2.5:14b class — ~14B dense @32k', size: '~12.5 GB', note: 'The biggest models that still stay fully on the GPU.' },
    A:   { vram: '12 GB', model: 'qwen3.5:9b-32k — ~9B dense @32k', size: '~9.5 GB', note: 'The sweet spot: a fast daily driver that runs 100% on the GPU.' },
    B:   { vram: '8 GB', model: 'qwen3.5:4b-16k — ~7B dense @16k', size: '~7.0 GB', note: 'Solid quality with a smaller context window.' },
    C:   { vram: '4 GB', model: 'qwen3.5:2b-8k — ~3B dense @8k', size: '~3.7 GB', note: 'Light but genuinely usable for everyday chat.' },
    CPU: { vram: 'none', model: 'qwen3.5:2b-8k (small models only)', size: '—', note: 'Runs without a GPU, but slow. The installer warns you honestly.' }
  };
  var tierOut = document.getElementById('tierOut');
  function renderTier(key) {
    var t = tiers[key];
    if (!t || !tierOut) return;
    tierOut.innerHTML =
      '<b>' + t.vram + '</b> → <b>' + escapeHtml(t.model) + '</b>' +
      (t.size !== '—' ? ' <span class="muted">(' + t.size + ' on GPU)</span>' : '') +
      '<br><span class="small muted">' + t.note + '</span>';
  }
  document.querySelectorAll('.chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      document.querySelectorAll('.chip').forEach(function (x) { x.classList.remove('active'); });
      chip.classList.add('active');
      renderTier(chip.dataset.tier);
    });
  });
  renderTier('A'); // default matches the active chip in the markup

  /* Live release info from the edge function. Keeps the download link + version
     current, and fills the releases card. Falls back gracefully if offline. */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function fmtDate(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  var relList = document.getElementById('releaseList');
  fetch('/api/release', { headers: { accept: 'application/json' } })
    .then(function (r) { if (!r.ok) throw new Error('status ' + r.status); return r.json(); })
    .then(function (data) {
      if (!data || !data.tag) throw new Error('empty');

      // Defense-in-depth: the function already validates these shapes, but never
      // wire a button to a URL outside the repo's own pages (blocks e.g. a
      // javascript: or foreign href if the upstream response were ever tampered).
      var DL = 'https://github.com/allusionsafk/localai-windows-starter/releases/download/';
      var REPO = 'https://github.com/allusionsafk/localai-windows-starter';
      if (data.installer_url && data.installer_url.indexOf(DL) !== 0) data.installer_url = null;
      if (!data.html_url || data.html_url.indexOf(REPO) !== 0) data.html_url = REPO + '/releases/latest';
      var sha = (typeof data.installer_sha256 === 'string' && /^sha256:[0-9a-f]{64}$/.test(data.installer_sha256))
        ? data.installer_sha256.slice(7) : null;

      // Point both download buttons at the actual installer asset when present.
      if (data.installer_url) {
        ['downloadBtn', 'downloadBtn2'].forEach(function (id) {
          var b = document.getElementById(id);
          if (b) { b.href = data.installer_url; }
        });
      }
      // Version badge in the hero.
      var badge = document.getElementById('verBadge');
      if (badge) { badge.textContent = data.tag; badge.hidden = false; }

      if (relList) {
        var d = fmtDate(data.published_at);
        relList.innerHTML =
          '<div class="rel-row">' +
            '<span class="rel-tag">' + escapeHtml(data.tag) + '</span>' +
            (data.prerelease ? '<span class="rel-pre">pre-release</span>' : '') +
            (d ? '<span class="rel-date">' + d + '</span>' : '') +
          '</div>' +
          (data.name ? '<p class="small muted" style="margin:10px 0 0">' + escapeHtml(data.name) + '</p>' : '') +
          '<div class="actions" style="margin-top:14px">' +
            '<a class="btn primary" href="' + escapeHtml(data.installer_url || data.html_url) + '" target="_blank" rel="noopener noreferrer">Download installer</a>' +
            '<a class="btn" href="' + escapeHtml(data.html_url) + '" target="_blank" rel="noopener noreferrer">Release notes</a>' +
          '</div>' +
          // Integrity: show the asset's SHA-256 so a downloaded file can be
          // verified (PowerShell: Get-FileHash '.\Install.Local.AI.cmd').
          (sha ? '<p class="small muted" style="margin:12px 0 0;font-family:var(--mono);font-size:.78rem;word-break:break-all">SHA-256 ' + escapeHtml(sha) + '</p>' : '');
      }
    })
    .catch(function () {
      if (relList) {
        relList.innerHTML = '<p class="small muted">Live release data is unavailable right now. Grab the latest build from the ' +
          '<a href="https://github.com/allusionsafk/localai-windows-starter/releases/latest" target="_blank" rel="noopener noreferrer">releases page</a>.</p>';
      }
    });
})();
