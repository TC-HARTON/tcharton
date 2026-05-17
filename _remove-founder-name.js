#!/usr/bin/env node
/**
 * _remove-founder-name.js — 大内達也 表記の一括削除 (代表 2026-05-17 指示)
 *
 * 例外: about/index.html / privacy/index.html / legal/index.html のみ保持。
 * profile/index.html および その他全ページ は visible 表記から「大内達也」を削除。
 *
 * 削除対象 (visible + screen-reader):
 *   - body 内 plain text
 *   - <cite> <dd> <a> 等の inline text
 *   - alt="代表 大内 達也" → alt="T.C.HARTON 代表"
 *   - aria-label="代表 大内 達也 ..." → aria-label="代表 ..."
 *   - <meta name="author" content="大内 達也">
 *   - JSON-LD "founder":{"@type":"Person","name":"大内 達也",...} → 削除 (key=founder 除去)
 *
 * 保持:
 *   - 隠し input value 中の autoresponse_body 等 (recruit メール署名)
 *     → これは "T.C.HARTON 大内 達也" → "T.C.HARTON" に短縮
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const ALLOWED = new Set(['about/index.html', 'privacy/index.html', 'legal/index.html']);

function walk(dir, out=[]) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (['node_modules', '.git', '.claude'].includes(e.name)) continue;
      walk(p, out);
    } else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const files = walk(ROOT);
let touched = 0, skipped = 0;

for (const f of files) {
  const rel = path.relative(ROOT, f).replace(/\\/g, '/');
  if (ALLOWED.has(rel)) { skipped++; continue; }

  let c = fs.readFileSync(f, 'utf-8');
  const orig = c;

  // 1. JSON-LD founder field 削除 (Schema.org Person reference)
  // パターン: ,"founder":{"@type":"Person","name":"大内 達也"[,"url":"..."]?}
  c = c.replace(/,"founder":\{[^{}]*"name":"大内\s*達也"[^{}]*\}/g, '');
  c = c.replace(/"founder":\{[^{}]*"name":"大内\s*達也"[^{}]*\},/g, '');

  // 2. <meta name="author" content="大内 達也"> 削除 (line + trailing newline)
  c = c.replace(/\s*<meta\s+name="author"\s+content="大内\s*達也">\s*\n/g, '\n');
  c = c.replace(/<meta\s+name="author"\s+content="大内\s*達也">/g, '');

  // 3. alt 属性: "代表 大内 達也" → "T.C.HARTON 代表"
  c = c.replace(/alt="([^"]*)大内\s*達也([^"]*)"/g, (m, before, after) => {
    let result = (before + after).trim();
    if (result.includes('代表')) return `alt="T.C.HARTON 代表"`;
    return `alt="T.C.HARTON 代表"`;
  });

  // 4. aria-label: "代表 大内 達也 プロフィールへ" 等 → "代表プロフィールへ"
  c = c.replace(/aria-label="([^"]*)大内\s*達也([^"]*)"/g, (m, before, after) => {
    let inner = (before + after).replace(/代表\s+/g, '代表').replace(/\s+/g, ' ').trim();
    if (!inner.includes('代表')) inner = '代表 ' + inner;
    return `aria-label="${inner}"`;
  });

  // 5. hidden input value (recruit メール署名等) "T.C.HARTON 大内 達也 / ..." → "T.C.HARTON / ..."
  c = c.replace(/T\.C\.HARTON\s+大内\s*達也\s*\//g, 'T.C.HARTON /');

  // 6. visible 本文: 「代表 大内 達也」「代表 大内達也」 → 「T.C.HARTON 代表」
  // 順序重要: 長いパターンから先に
  c = c.replace(/T\.C\.HARTON\s+代表\s+大内\s*達也（[^）]*）/g, 'T.C.HARTON 代表');
  c = c.replace(/T\.C\.HARTON\s+代表\s+大内\s*達也/g, 'T.C.HARTON 代表');
  c = c.replace(/代表\s+大内\s*達也（[^）]*）/g, 'T.C.HARTON 代表');
  c = c.replace(/代表\s+大内\s*達也/g, 'T.C.HARTON 代表');

  // 7. 単独「大内 達也（おおうち たつや）」「大内 達也」「大内達也」 → 「T.C.HARTON 代表」
  c = c.replace(/大内\s*達也（おおうち\s*たつや）/g, 'T.C.HARTON 代表');
  c = c.replace(/大内\s*達也/g, 'T.C.HARTON 代表');
  c = c.replace(/大内達也/g, 'T.C.HARTON 代表');

  // 8. 連続改行整理
  c = c.replace(/\n{3,}/g, '\n\n');

  if (c !== orig) {
    fs.writeFileSync(f, c, 'utf-8');
    touched++;
  }
}

console.log(`大内達也 削除完了: ${touched} files updated, ${skipped} files skipped (allowed: about/privacy/legal)`);
