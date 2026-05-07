#!/usr/bin/env node
/**
 * scripts/update-date-modified.js
 * v1.20 / 2026-05-04 / pre-commit hook から呼ばれる dateModified 自動更新
 *
 * 動作:
 *   1. git diff --cached --name-only で staged HTML を取得
 *   2. 各ファイルの itemprop="dateModified" datetime / 「最終更新 YYYY年M月D日」/ JSON-LD "dateModified"
 *      を当日 (ISO 8601) に書き換え
 *   3. 変更があればファイルを書き戻し + git add で再 staging
 *
 * 起源: 7 視点並列検証 P5-H-3 + P7-H-2 (dateModified 陳腐化) の構造的解消
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TODAY = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
const TODAY_DISPLAY = TODAY.replace(/^(\d{4})-(\d{2})-(\d{2})$/, (_, y, m, d) =>
  `${y}年${parseInt(m, 10)}月${parseInt(d, 10)}日`);

// repo root
const ROOT = execSync('git rev-parse --show-toplevel', { encoding: 'utf-8' }).trim();
process.chdir(ROOT);

let staged;
try {
  // Reviewer B-H-1: rename (R) は --name-only で旧パス出力されるリスクのため除外
  staged = execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf-8' })
    .trim().split('\n').filter(f => f.endsWith('.html'));
} catch (e) {
  process.exit(0);
}
if (staged.length === 0) process.exit(0);

let updated = 0;
staged.forEach(rel => {
  const fp = path.join(ROOT, rel);
  if (!fs.existsSync(fp)) return;
  let html = fs.readFileSync(fp, 'utf-8');
  const orig = html;

  // <time itemprop="dateModified" datetime="YYYY-MM-DD">最終更新 YYYY年M月D日</time>
  html = html.replace(
    /(itemprop=["']dateModified["']\s+datetime=["'])\d{4}-\d{2}-\d{2}(["'][^>]*>)最終更新\s+\d{4}年\d{1,2}月\d{1,2}日/g,
    `$1${TODAY}$2最終更新 ${TODAY_DISPLAY}`
  );
  // datetime のみ
  html = html.replace(
    /itemprop=["']dateModified["']\s+datetime=["']\d{4}-\d{2}-\d{2}["']/g,
    `itemprop="dateModified" datetime="${TODAY}"`
  );
  // JSON-LD "dateModified"
  html = html.replace(
    /"dateModified"\s*:\s*"\d{4}-\d{2}-\d{2}"/g,
    `"dateModified": "${TODAY}"`
  );

  if (html !== orig) {
    fs.writeFileSync(fp, html, 'utf-8');
    execSync(`git add "${rel}"`, { stdio: 'pipe' });
    updated++;
  }
});

if (updated > 0) {
  console.log(`[pre-commit] dateModified 自動更新: ${updated} ファイル → ${TODAY}`);
}
