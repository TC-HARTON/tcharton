// v1.16: contact focus trap 完全実装（① v1.21 議題 β / WCAG 2.4.3 + 2.1.2 No Keyboard Trap 整合）
/**
 * /dist/scripts/contact.js
 * 外部化元: contact/index.html line 421-533（menu+IO + 送信前確認モーダル + form validation）
 * v1.15 / 2026-05-03 / Mozilla Observatory CSP 'unsafe-inline' → A+ 解消
 * v1.16 / 2026-05-03 / focus trap + 戻り focus + Tab cycle（WCAG 2.4.3 完全準拠）
 * 適用ページ: 1 件（contact/index.html のみ / menu+IO+modal を統合独立 / menu.js 不要）
 * 依存: なし（IIFE 完結）/ DOM 操作: createElement + textContent + appendChild + classList（innerHTML 不使用 / TT 違反なし）
 * 規範: SPEC §10.5.1 mobile menu + WCAG 2.4.3 Focus Order + 2.1.2 No Keyboard Trap + 2.4.7 Focus Visible
 */
(function () {
  'use strict';
  var btn = document.getElementById('menuToggle');
  var menu = document.getElementById('mobile-menu');
  if (btn && menu) {
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
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.fade-in').forEach(function (el) { io.observe(el); });

  // ========== 送信前確認モーダル ==========
  var form = document.getElementById('contactForm');
  var modal = document.getElementById('confirmModal');
  var overlay = document.getElementById('confirmOverlay');
  var closeBtn = document.getElementById('confirmClose');
  var backBtn = document.getElementById('confirmBack');
  var submitBtn = document.getElementById('confirmSubmit');
  var body = document.getElementById('confirmBody');
  var confirmBtn = document.getElementById('confirmBtn');

  // Reviewer B HIGH-1 修正: 全 DOM 要素の存在ガード（誤読込・HTML 改変による null 参照防止）
  if (!form || !modal || !confirmBtn || !submitBtn || !closeBtn || !backBtn || !overlay || !body) return;

  // ─── focus trap (v1.16 / WCAG 2.4.3 + 2.1.2) ───
  // 1. open 時: 直前 focus を保存 + モーダル内 1 番目の focusable へ移動
  // 2. Tab/Shift-Tab: モーダル内で循環（最後 → 最初 / 最初 → 最後）
  // 3. close 時: 保存した直前 focus に戻す
  // 4. Escape: 既存 close ロジック維持
  var lastFocused = null;
  var FOCUSABLE_SEL = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  // Reviewer B-HIGH-2 修正: offsetParent は position:fixed 子要素で null になる仕様
  // (CSSWG/MDN 仕様準拠) → 将来的な fixed 子要素の追加で Tab 循環が壊れないよう
  // computed style ベースの可視判定にフォールバック
  function isVisible(el) {
    if (el.hidden) return false;
    var s = window.getComputedStyle(el);
    return s.display !== 'none' && s.visibility !== 'hidden';
  }
  function getFocusable() {
    return Array.prototype.slice.call(modal.querySelectorAll(FOCUSABLE_SEL))
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

  function openModal() {
    lastFocused = document.activeElement;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    // layout 強制 flush で hidden 解除直後の offsetParent null を回避（rAF より同期確実）
    void modal.offsetHeight;
    var f = getFocusable();
    if (f.length > 0) f[0].focus();
    document.addEventListener('keydown', trapTab);
  }
  function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', trapTab);
    // Reviewer B-HIGH-1 修正: detached / disabled / 不可視要素への focus 失敗で
    // body へ落ちる WCAG 2.4.3 違反を防止（document.contains + disabled + 可視チェック）
    if (lastFocused
        && typeof lastFocused.focus === 'function'
        && document.contains(lastFocused)
        && !lastFocused.disabled
        && isVisible(lastFocused)) {
      lastFocused.focus();
    }
  }
  function buildRow(label, value) {
    if (!value) return null;
    var wrap = document.createElement('div');
    wrap.className = 'bg-dark-50 rounded-xl p-4';
    var l = document.createElement('p');
    l.className = 'text-xs text-dark-500 mb-1';
    l.textContent = label;
    var v = document.createElement('p');
    v.className = 'text-sm text-dark-900 break-words whitespace-pre-wrap';
    v.textContent = value;
    wrap.appendChild(l);
    wrap.appendChild(v);
    return wrap;
  }

  confirmBtn.addEventListener('click', function () {
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    var fd = new FormData(form);
    var interests = fd.getAll('interest[]');
    if (interests.length === 0) {
      alert('ご相談内容を 1 つ以上選択してください');
      return;
    }
    body.textContent = '';
    var rows = [
      ['お名前', fd.get('name')],
      ['会社名・屋号', fd.get('company')],
      ['メールアドレス', fd.get('email')],
      ['電話番号', fd.get('phone')],
      ['ご相談内容', interests.join('、')],
      ['詳細', fd.get('message')]
    ];
    rows.forEach(function (r) {
      var node = buildRow(r[0], r[1]);
      if (node) body.appendChild(node);
    });
    openModal();
  });

  submitBtn.addEventListener('click', function () {
    submitBtn.disabled = true;
    submitBtn.textContent = '送信中...';
    form.submit();
  });

  closeBtn.addEventListener('click', closeModal);
  backBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
})();
