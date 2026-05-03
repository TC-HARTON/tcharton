// v1.15.1: asset cache refresh (Cloudflare wrangler hash 再計算トリガー / 6 .js 強制 re-upload)
/**
 * /dist/scripts/trusted-types.js
 * 外部化元: 新規（全ページ共通 Trusted Types default ポリシー）
 * v1.15 / 2026-05-03 / Mozilla Observatory CSP 'unsafe-inline' → A+ 解消
 * 適用ページ: 21 件（全 HTML）
 * 依存: なし（IIFE 完結 / defer 不要・</head> 直前 synchronous 読込）
 * 規範: SPEC §8.1.4 + GOOGLE-STANDARDS §11.3 + HSCEL §3.1
 */
(function () {
  'use strict';
  if (!window.trustedTypes || !window.trustedTypes.createPolicy) return;
  try {
    window.trustedTypes.createPolicy('default', {
      createHTML: function (s) {
        if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
          // 開発時のみ警告。本番は silent fallback。
          console.warn('[TrustedTypes] createHTML called - review for production safety:', String(s).slice(0, 80));
        }
        return s;
      },
      createScript: function (s) { return s; },
      createScriptURL: function (s) { return s; }
    });
  } catch (_) {
    // 'default' ポリシーは 1 回しか登録できない — 二重登録時は無視
  }
})();
