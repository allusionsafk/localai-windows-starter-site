/* AFK AI site — all interactivity.

   Kept in an external file (not inline) so the Content-Security-Policy can set
   script-src 'self' with no 'unsafe-inline'. Any generated markup must use
   classes only (no style attributes) because style-src is also 'self'.

   The page deliberately has no release-fetching JavaScript. The download is a
   plain <a href="/download"> handled at the edge, so it works with JS disabled
   and cannot silently fall back to an older build. */
(function () {
  'use strict';

  var root = document.documentElement;
  var toast = document.getElementById('toast');

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () { toast.classList.remove('show'); }, 1500);
  }

  /* Theme: a stored choice wins, otherwise follow the OS preference.
     localStorage only, because this site sets no cookies. */
  var themeBtn = document.getElementById('themeBtn');
  var stored = null;
  try { stored = localStorage.getItem('afk-theme'); } catch (e) {}

  function applyTheme(theme) {
    root.dataset.theme = theme;
    if (themeBtn) {
      themeBtn.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
      );
    }
  }

  applyTheme(stored || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('afk-theme', next); } catch (e) {}
      showToast(next === 'dark' ? 'Dark theme' : 'Light theme');
    });
  }
})();
