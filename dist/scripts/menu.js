// v1.20: 検証 fatigue 構造的解消 — menu.js に Escape close + focus trap + inert background 追加
/**
 * /dist/scripts/menu.js
 * 外部化元: about/index.html line 528-558 等（mobile menu + IntersectionObserver fade-in）
 * v1.15 / 2026-05-03 / Mozilla Observatory CSP 'unsafe-inline' → A+ 解消
 * v1.20 / 2026-05-04 / WCAG 2.1.2 No Keyboard Trap + 2.4.3 Focus Order + APG Dialog Pattern 完全準拠
 * 適用ページ: 17 件（404 / legal / privacy / contact / thanks 除外）
 * 依存: なし（IIFE 完結）/ threshold: 0.15 統一
 * 規範: SPEC §10.5.1 mobile menu + §7.3 prefers-reduced-motion 対応 + WCAG 2.2 AA
 *
 * v1.20 追加機能 (P1-C-2 + P6-H-1 + P7-H-3 三重連動解消):
 *   - Escape キーでメニュー閉鎖 + 戻り focus = WCAG 2.1.2
 *   - Tab/Shift-Tab 循環 = WCAG 2.4.3 / APG Dialog Pattern
 *   - inert 属性で背景コンテンツを操作不可化 = aria-modal=true 意味論と整合
 */
(function () {
  'use strict';
  var btn = document.getElementById('menuToggle');
  var menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  // ─── focus trap (v1.20 / contact.js パターン踏襲) ───
  var lastFocused = null;
  var FOCUSABLE_SEL = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function isVisible(el) {
    if (el.hidden) return false;
    var s = window.getComputedStyle(el);
    return s.display !== 'none' && s.visibility !== 'hidden';
  }
  function getFocusable() {
    return Array.prototype.slice.call(menu.querySelectorAll(FOCUSABLE_SEL))
      .filter(isVisible);
  }
  function trapTab(e) {
    if (e.key !== 'Tab') return;
    var f = getFocusable();
    if (f.length === 0) { e.preventDefault(); return; }
    var first = f[0];
    var last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  // ─── 背景 inert toggle (v1.20 / SR がモーダル背景を読み飛ばす整合性確保) ───
  // Reviewer A-Important-2 / B: openMenu 内で動的に評価 → 後続の動的 DOM 追加にも対応
  // また <script> 等の非表示要素も inert 適用されるが視覚的影響なし（仕様準拠）
  function getInertTargets() {
    return Array.prototype.slice.call(document.body.children)
      .filter(function (el) { return el !== menu; });
  }
  var inertApplied = [];
  function setInert(on) {
    if (on) {
      inertApplied = getInertTargets();
      inertApplied.forEach(function (el) { el.setAttribute('inert', ''); });
    } else {
      inertApplied.forEach(function (el) { el.removeAttribute('inert'); });
      inertApplied = [];
    }
  }

  function openMenu() {
    lastFocused = document.activeElement;
    menu.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'メニューを閉じる');
    document.body.style.overflow = 'hidden';
    setInert(true);
    // layout flush で開幕直後の focus 失敗回避
    void menu.offsetHeight;
    var f = getFocusable();
    if (f.length > 0) f[0].focus();
    document.addEventListener('keydown', onKeydown);
  }
  function closeMenu() {
    menu.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'メニューを開く');
    document.body.style.overflow = '';
    setInert(false);
    document.removeEventListener('keydown', onKeydown);
    if (lastFocused
        && typeof lastFocused.focus === 'function'
        && document.contains(lastFocused)
        && !lastFocused.disabled
        && isVisible(lastFocused)) {
      lastFocused.focus();
    } else {
      btn.focus();
    }
  }
  function onKeydown(e) {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      e.preventDefault();
      closeMenu();
      return;
    }
    trapTab(e);
  }

  btn.addEventListener('click', function () {
    if (menu.classList.contains('open')) closeMenu();
    else openMenu();
  });
  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      // リンククリックによる遷移は menu close で a11y 状態をクリア
      closeMenu();
    });
  });

  // ─── IntersectionObserver fade-in (既存維持) ───
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
