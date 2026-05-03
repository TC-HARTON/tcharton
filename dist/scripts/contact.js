/**
 * /dist/scripts/contact.js
 * 外部化元: contact/index.html line 421-533（menu+IO + 送信前確認モーダル + form validation）
 * v1.15 / 2026-05-03 / Mozilla Observatory CSP 'unsafe-inline' → A+ 解消
 * 適用ページ: 1 件（contact/index.html のみ / menu+IO+modal を統合独立 / menu.js 不要）
 * 依存: なし（IIFE 完結）/ DOM 操作: createElement + textContent + appendChild + classList（innerHTML 不使用 / TT 違反なし）
 * 規範: SPEC §10.5.1 mobile menu + WCAG 2.4.3 focus trap（Escape close）
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

  function openModal() {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
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
