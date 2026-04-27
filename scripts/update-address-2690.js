#!/usr/bin/env node
/**
 * update-address-2690.js — 住所を「沼津市大岡2690」に統一
 * 用途: scanner Sクラス必須条件 2 (NAP 完全一致) 達成のための番地公開
 *       INSTRUCTION-FROM-ROOT.md 連動 / 代表 2026-04-27 決定
 *
 * 実行: node scripts/update-address-2690.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

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
let modified = 0;

for (const f of files) {
  const orig = fs.readFileSync(f, 'utf-8');
  let s = orig;

  // 1. 可視 HTML「静岡県沼津市大岡」(数字続かない位置) → 「静岡県沼津市大岡2690」
  s = s.replace(/静岡県沼津市大岡(?![\d])/g, '静岡県沼津市大岡2690');

  // 2. JSON-LD streetAddress: "大岡" → "大岡2690"
  s = s.replace(/("streetAddress":\s*)"大岡"/g, '$1"大岡2690"');

  // 3. PostalAddress に postalCode 挿入（addressLocality 直後）
  // インデント保持のため再帰的に同じインデントを使う
  s = s.replace(
    /([ \t]+)"addressLocality":\s*"沼津市",\s*\n\1"streetAddress":/g,
    (m, indent) =>
      `${indent}"addressLocality": "沼津市",\n${indent}"postalCode": "410-0022",\n${indent}"streetAddress":`
  );

  // 4. 番地非公開クロージング除去（既に2690に置換済の場合は無効）
  s = s.replace(/静岡県沼津市大岡2690（詳細番地は契約時に開示）/g, '静岡県沼津市大岡2690');

  if (s !== orig) {
    fs.writeFileSync(f, s);
    console.log('✓', path.relative(ROOT, f));
    modified++;
  }
}

console.log(`\n更新: ${modified} ファイル`);
