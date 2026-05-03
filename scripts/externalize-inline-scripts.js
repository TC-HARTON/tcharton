#!/usr/bin/env node
/**
 * scripts/externalize-inline-scripts.js
 * v1.15 / 2026-05-03 / Mozilla Observatory CSP 'unsafe-inline' → A+ 解消
 *
 * 21 HTML の inline <script> を以下の 6 .js への <script src defer> 参照に置換:
 *   /dist/scripts/trusted-types.js  → 全 21 ページ </head> 直前 (synchronous)
 *   /dist/scripts/ga4.js            → 全 21 ページ <head> 内 (defer)
 *   /dist/scripts/menu.js           → 17 ページ </body> 直前 (defer / 404/legal/privacy/contact/thanks 除外)
 *   /dist/scripts/simulator.js      → index.html のみ </body> 直前 (defer)
 *   /dist/scripts/contact.js        → contact のみ </body> 直前 (defer)
 *   /dist/scripts/thanks.js         → thanks のみ </body> 直前 (defer)
 *
 * 一括実行のための機械置換ツール。手動 Edit よりエラー率が低く atomic 実装に適する。
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// 全 21 ページ + 各ページに必要な body スクリプト
const PAGES = [
  // [path, body-script (or null)]
  ['index.html', ['menu.js', 'simulator.js']],
  ['404.html', null],
  ['thanks.html', ['thanks.js']],
  ['about/index.html', ['menu.js']],
  ['cases/index.html', ['menu.js']],
  ['contact/index.html', ['contact.js']],
  ['faq/index.html', ['menu.js']],
  ['legal/index.html', null],
  ['methodology/index.html', ['menu.js']],
  ['news/index.html', ['menu.js']],
  ['pricing/index.html', ['menu.js']],
  ['privacy/index.html', null],
  ['profile/index.html', ['menu.js']],
  ['services/web/index.html', ['menu.js']],
  ['services/web/sclass/index.html', ['menu.js']],
  ['services/web/industries/index.html', ['menu.js']],
  ['services/maintenance/index.html', ['menu.js']],
  ['services/maintenance/plans/index.html', ['menu.js']],
  ['services/maintenance/report-sample/index.html', ['menu.js']],
  ['services/ai-prediction/index.html', ['menu.js']],
  ['services/ai-prediction/inventory/index.html', ['menu.js']],
  ['services/ai-prediction/sales/index.html', ['menu.js']],
];

// ─── 削除対象正規表現 ───────────────────────────────────────────
// GA4 inline ブロック (HTML コメント `<!-- Google Analytics 4 ... -->` + 続く <script>...</script>)
const RE_GA4_INLINE = /\s*<!-- Google Analytics 4[\s\S]*?<\/script>\s*\n?/;
// body 末尾 inline <script>（type=application/ld+json は除外 / src 属性なし）
// 末尾 </body> 直前の <script>...</script>
const RE_BODY_INLINE = /\s*<script>\s*\n?\s*\(function[\s\S]*?<\/script>\s*\n?(?=\s*<\/body>)/;

// ─── 挿入する <script src> タグ ──────────────────────────────
const SRC_TRUSTED_TYPES = '  <script src="/dist/scripts/trusted-types.js"></script>\n';
const SRC_GA4           = '  <!-- GA4 DNT-aware (privacy.html §6 公約準拠) / v1.15 inline 外部化 -->\n  <script src="/dist/scripts/ga4.js" defer></script>\n';

function buildBodyScripts(scripts) {
  if (!scripts) return '';
  return '  ' + scripts.map(s => `<script src="/dist/scripts/${s}" defer></script>`).join('\n  ') + '\n';
}

// ─── 処理 ────────────────────────────────────────────────
let totalFiles = 0, totalGa4 = 0, totalBody = 0, totalErrors = 0;

for (const [rel, bodyScripts] of PAGES) {
  const fp = path.join(ROOT, rel);
  if (!fs.existsSync(fp)) {
    console.error(`❌ ファイル不在: ${rel}`);
    totalErrors++;
    continue;
  }

  let html = fs.readFileSync(fp, 'utf-8');
  const orig = html;

  // 1. GA4 inline 削除 + ga4.js + trusted-types.js 配置
  // </head> 直前に挿入（trusted-types は synchronous / ga4 は defer）
  if (RE_GA4_INLINE.test(html)) {
    html = html.replace(RE_GA4_INLINE, '\n');
    totalGa4++;
  }
  // </head> 直前に新タグ挿入（既存配置と統合 / link rel=stylesheet の後）
  // </head> の直前に SRC_GA4 + SRC_TRUSTED_TYPES を挿入
  if (!html.includes('/dist/scripts/ga4.js')) {
    html = html.replace(/(\n\s*)<\/head>/, `\n${SRC_GA4}${SRC_TRUSTED_TYPES}$1</head>`);
  }

  // 2. body 末尾 inline 削除 + page-specific .js 配置
  if (RE_BODY_INLINE.test(html)) {
    html = html.replace(RE_BODY_INLINE, '\n');
    totalBody++;
  }
  // </body> 直前に SRC_BODY を挿入
  if (bodyScripts) {
    const bodyTag = buildBodyScripts(bodyScripts);
    if (!html.includes(`/dist/scripts/${bodyScripts[0]}`)) {
      html = html.replace(/(\n)\s*<\/body>/, `\n${bodyTag}</body>`);
    }
  }

  if (html !== orig) {
    fs.writeFileSync(fp, html, 'utf-8');
    totalFiles++;
    console.log(`✅ ${rel}`);
  } else {
    console.log(`⏭️  ${rel} (変更なし)`);
  }
}

console.log(`\n=== 完了 ===`);
console.log(`変更ファイル: ${totalFiles} / ${PAGES.length}`);
console.log(`GA4 inline 削除: ${totalGa4}`);
console.log(`body inline 削除: ${totalBody}`);
console.log(`エラー: ${totalErrors}`);
process.exit(totalErrors > 0 ? 1 : 0);
