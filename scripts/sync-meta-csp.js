#!/usr/bin/env node
/**
 * sync-meta-csp.js — 21 HTML の meta CSP を _headers の HTTP ヘッダ CSP と整合
 * 用途: HANDOVER-S-CLASS-FIX.md タスク 1.2（一回限りの整備スクリプト）
 *
 * 変更点:
 *   1. form-action を 'self' https://api.web3forms.com に統一（contact 以外も統一）
 *   2. upgrade-insecure-requests を末尾に追加
 *
 * 非変更点:
 *   - frame-ancestors は meta では無視されるため記載しない（HTTP ヘッダ側で配信）
 *
 * 実行: node scripts/sync-meta-csp.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// 統一後の CSP 値（_headers の Content-Security-Policy から frame-ancestors を除いたもの）
const NEW_CSP =
  "default-src 'self'; " +
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://static.cloudflareinsights.com; " +
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
  "font-src 'self' https://fonts.gstatic.com; " +
  "img-src 'self' data: https://www.google-analytics.com https://www.googletagmanager.com; " +
  "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://cloudflareinsights.com; " +
  "frame-src 'none'; " +
  "object-src 'none'; " +
  "base-uri 'self'; " +
  "form-action 'self' https://api.web3forms.com; " +
  "upgrade-insecure-requests";

// content 属性は二重引用符 " で囲まれており、CSP 値内に ' が含まれるため
// 否定文字クラスは [^"] のみ。\2 経由のバックリファレンスは値内の ' に当たって誤マッチする
const META_RX = /(<meta\s+http-equiv="Content-Security-Policy"\s+content=")([^"]*)("\s*\/?>)/i;

function findHtml(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) findHtml(p, out);
    else if (e.isFile() && e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const files = findHtml(ROOT);
let updated = 0, skipped = 0, errors = 0;

for (const f of files) {
  const orig = fs.readFileSync(f, 'utf-8');
  if (!META_RX.test(orig)) { skipped++; continue; }
  const next = orig.replace(META_RX, (_, prefix, _content, suffix) =>
    `${prefix}${NEW_CSP}${suffix}`);
  if (next === orig) { skipped++; continue; }
  fs.writeFileSync(f, next);
  console.log('✓', path.relative(ROOT, f));
  updated++;
}

console.log(`\n更新: ${updated} / 対象なし: ${skipped} / エラー: ${errors}`);
process.exit(errors === 0 ? 0 : 1);
