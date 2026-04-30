#!/usr/bin/env node
/**
 * update-additionalType-q.js — JSON-LD additionalType を Wikidata 一次取得済 6 Q に統一
 *
 * 経緯: SPEC §4.2 #1.2 許可リスト verbatim 信頼で Q189210 (Web app) を「Web design」として投入
 *       → Wikidata 一次取得で誤り判明（正しくは Q190637）+ Q193563 は仏国立図書館
 *       → 一次検証済 6 Q に差替 (LLMO entity 解決精度最大化)
 *
 * 対象: index / about / services/web / services/maintenance / services/ai-prediction の 5 ファイル
 *
 * 実行: node scripts/update-additionalType-q.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// Wikidata 一次取得済 6 Q (2026-05-01 verbatim 検証)
const NEW_Q_ARRAY = `[
      "https://www.wikidata.org/wiki/Q190637",
      "https://www.wikidata.org/wiki/Q11661",
      "https://www.wikidata.org/wiki/Q11660",
      "https://www.wikidata.org/wiki/Q2539",
      "https://www.wikidata.org/wiki/Q80993",
      "https://www.wikidata.org/wiki/Q1540863"
    ]`;

// 旧 3 Q 配列 (Q189210/Q11661/Q11660) を新 6 Q に差替
const OLD_PATTERN = /\[\s*"https:\/\/www\.wikidata\.org\/wiki\/Q189210",\s*"https:\/\/www\.wikidata\.org\/wiki\/Q11661",\s*"https:\/\/www\.wikidata\.org\/wiki\/Q11660"\s*\]/g;

const targets = [
  'index.html',
  'about/index.html',
  'services/web/index.html',
  'services/maintenance/index.html',
  'services/ai-prediction/index.html',
];

let modified = 0;
for (const t of targets) {
  const fp = path.join(ROOT, t);
  const orig = fs.readFileSync(fp, 'utf-8');
  if (!OLD_PATTERN.test(orig)) {
    console.log(`✗ ${t}: 旧 Q 配列パターン不一致`);
    OLD_PATTERN.lastIndex = 0;
    continue;
  }
  OLD_PATTERN.lastIndex = 0;
  const next = orig.replace(OLD_PATTERN, NEW_Q_ARRAY);
  if (next === orig) { console.log(`✗ ${t}: 置換無し`); continue; }
  fs.writeFileSync(fp, next);
  console.log(`✓ ${t}`);
  modified++;
}

console.log(`\n更新: ${modified} / ${targets.length} ファイル`);
process.exit(modified === targets.length ? 0 : 1);
