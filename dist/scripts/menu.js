/**
 * /dist/scripts/menu.js
 * 外部化元: about/index.html line 528-558 等（mobile menu + IntersectionObserver fade-in）
 * v1.15 / 2026-05-03 / Mozilla Observatory CSP 'unsafe-inline' → A+ 解消
 * 適用ページ: 17 件（404 / legal / privacy / contact / thanks 除外）
 * 依存: なし（IIFE 完結）/ threshold: 0.15 統一
 * 規範: SPEC §10.5.1 mobile menu + §7.3 prefers-reduced-motion 対応
 */
(function () {
  'use strict';
  var btn = document.getElementById('menuToggle');
  var menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;
  btn.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    document.body.style.overflow = open ? 'hidden' : '';
  });
  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'メニューを開く');
      document.body.style.overflow = '';
    });
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.fade-in').forEach(function (el) { io.observe(el); });
})();
