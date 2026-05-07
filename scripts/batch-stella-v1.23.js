#!/usr/bin/env node
/**
 * scripts/batch-stella-v1.23.js
 * v1.23 / 2026-05-07 / Stella ブランド統一 + 旧 certification.tcharton.com 削除
 *
 * 処理:
 *   1. 全 HTML で「HARTON Certified」→「HARTON Stella」一括置換
 *      (例外: brandHistory 言及部 = 「HARTON Stella（旧: HARTON Certified）」形式に変換)
 *   2. 「HARTON S-Class Certified」→「HARTON Stella S-Class」(methodology 等)
 *   3. URL 「https://certification.tcharton.com」→ リンク削除 + テキスト「stella.tcharton.com（準備中）」
 *   4. テキスト 「certification.tcharton.com」→「stella.tcharton.com」
 *   5. SVG <desc> / aria-label / alt 内の「HARTON Certified」も同期
 *
 * 起源: HANDOVER v1.30 §43.3 + 代表確定 UX-UI-DIRECTIVE-V1 line 4/7
 * 安全策: --dry-run で diff 確認 / idempotent (再実行で害なし)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DRY_RUN = process.argv.includes('--dry-run');

// 全 HTML 列挙
function findHtml(dir, list) {
  list = list || [];
  const SKIP = new Set(['node_modules', '.git', '.wrangler', 'dist', 'config', 'scripts', 'src', '.claude']);
  fs.readdirSync(dir, { withFileTypes: true }).forEach(e => {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (!SKIP.has(e.name)) findHtml(fp, list);
    } else if (e.name.endsWith('.html')) {
      list.push(fp);
    }
  });
  return list;
}

const allHtml = findHtml(ROOT);
let stats = { stellaText: 0, urlRemoved: 0, urlText: 0, sclass: 0, files: 0 };

allHtml.forEach(fp => {
  const rel = path.relative(ROOT, fp).replace(/\\/g, '/');
  let html = fs.readFileSync(fp, 'utf-8');
  const orig = html;

  // (1) <a href="https://certification.tcharton.com..."> リンク削除 + テキスト「stella.tcharton.com（準備中）」化
  // パターン: <a href="https://certification.tcharton.com[^"]*"[^>]*>...</a>
  html = html.replace(
    /<a\s+href="https:\/\/certification\.tcharton\.com[^"]*"[^>]*>([\s\S]*?)<\/a>/g,
    (match, inner) => {
      stats.urlRemoved++;
      // 内側テキストが "certification.tcharton.com" 自体のリンクなら「stella.tcharton.com（準備中）」に
      // それ以外（説明テキストへのリンク）は inner テキスト + 注記
      if (/^certification\.tcharton\.com$/.test(inner.trim())) {
        return 'stella.tcharton.com（準備中）';
      }
      return inner + '（stella.tcharton.com 準備中）';
    }
  );

  // (2) テキスト「certification.tcharton.com」→「stella.tcharton.com」
  // (already-replaced 部分は (1) で処理済み / 単独テキスト残存のみ対象)
  const beforeUrlText = html;
  html = html.replace(/certification\.tcharton\.com/g, 'stella.tcharton.com');
  if (html !== beforeUrlText) stats.urlText++;

  // (3) 「HARTON S-Class Certified」→「HARTON Stella S-Class」 (先に処理 / Certified 単独より前)
  const beforeSclass = html;
  html = html.replace(/HARTON S-Class Certified/g, 'HARTON Stella S-Class');
  if (html !== beforeSclass) stats.sclass++;

  // (4) ブランドマニフェスト言及部 (歴史的) → 「HARTON Stella（旧: HARTON Certified）ブランドマニフェスト」
  html = html.replace(
    /HARTON Certified\s*ブランドマニフェスト/g,
    'HARTON Stella（旧: HARTON Certified）ブランドマニフェスト'
  );

  // (5) 残「HARTON Certified」→「HARTON Stella」一括
  // Reviewer B-I-1 採用: lookbehind で「（旧: HARTON Certified）」内側を保護
  // 「HARTON Stella（旧: HARTON Certified）」を再実行で「HARTON Stella（旧: HARTON Stella）」に破壊するバグを構造排除
  const beforeStella = html;
  html = html.replace(/(?<!（旧:\s)HARTON Certified(?!）)/g, 'HARTON Stella');
  if (html !== beforeStella) stats.stellaText++;

  if (html !== orig) {
    stats.files++;
    if (DRY_RUN) {
      console.log(`[DRY] would write: ${rel}`);
    } else {
      fs.writeFileSync(fp, html, 'utf-8');
      console.log(`✓ ${rel}`);
    }
  }
});

// canonical.json は手動更新済 (本スクリプト対象外)

console.log(`\n=== batch-stella-v1.23 ${DRY_RUN ? 'DRY-RUN' : '実行'} 完了 ===`);
console.log(`  ファイル変更: ${stats.files} / 検査 ${allHtml.length}`);
console.log(`  Stella テキスト置換: ${stats.stellaText}`);
console.log(`  S-Class Certified → Stella S-Class: ${stats.sclass}`);
console.log(`  URL 削除 (リンク → 準備中 text): ${stats.urlRemoved}`);
console.log(`  URL テキスト置換: ${stats.urlText}`);
