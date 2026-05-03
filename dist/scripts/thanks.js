/**
 * /dist/scripts/thanks.js
 * 外部化元: thanks.html line 243-268（IntersectionObserver fade-in + 10 秒 countdown 自動遷移）
 * v1.15 / 2026-05-03 / Mozilla Observatory CSP 'unsafe-inline' → A+ 解消
 * 適用ページ: 1 件（thanks.html のみ / menu なし / IO + countdown 統合）
 * 依存: なし（IIFE 完結）
 * Q-9 修正: threshold 0.1 → 0.15 統一（17 ページ menu.js / contact.js と一貫性確保 / S クラス整合性）
 * 規範: SPEC §7.3 prefers-reduced-motion（CSS 側で対応済）
 */
(function () {
  'use strict';
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.fade-in').forEach(function (el) { io.observe(el); });

  var sec = 10;
  var cd = document.getElementById('countdown');
  var timer = setInterval(function () {
    sec--;
    if (sec <= 0) {
      clearInterval(timer);
      window.location.href = '/';
    } else if (cd) {
      cd.textContent = sec + ' 秒後に自動でトップページへ移動します';
    }
  }, 1000);
})();
