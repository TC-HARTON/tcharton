// v1.15.1: asset cache refresh (Cloudflare wrangler hash 再計算トリガー / 6 .js 強制 re-upload)
/**
 * /dist/scripts/ga4.js
 * 外部化元: index.html line 255-269 等（GA4 DNT-aware loader）/ 全 21 HTML 同一内容
 * v1.15 / 2026-05-03 / Mozilla Observatory CSP 'unsafe-inline' → A+ 解消
 * 適用ページ: 21 件（全 HTML）
 * 依存: trusted-types.js（先行読込推奨 / TT policy 'default' で createScriptURL 許可）
 * 独自要素: idempotency guard window.__ga4Loaded で SPA 風遷移時の多重起動防止
 * privacy.html §6 公約準拠: navigator.doNotTrack === '1' で読込中止
 */
(function () {
  'use strict';
  if (window.__ga4Loaded) return;
  var dnt = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;
  if (dnt === '1' || dnt === 'yes') return;
  window.__ga4Loaded = true;
  var s = document.createElement('script');
  s.async = true;
  // require-trusted-types-for 'script' 適用環境（Chromium 系）では HTMLScriptElement.src への
  // 文字列直接代入が TypeError になるため createScriptURL ポリシー経由で TrustedScriptURL に変換。
  // trusted-types.js が先行ロードで default policy を登録済み。Safari (TT 非対応) はそのまま文字列代入。
  var url = 'https://www.googletagmanager.com/gtag/js?id=G-HKXN8TV6HG';
  s.src = (window.trustedTypes && window.trustedTypes.defaultPolicy)
    ? window.trustedTypes.defaultPolicy.createScriptURL(url)
    : url;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', 'G-HKXN8TV6HG');
})();
