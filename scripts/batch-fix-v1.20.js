#!/usr/bin/env node
/**
 * scripts/batch-fix-v1.20.js
 * v1.20 / 2026-05-04 / 7 視点並列検証 35 件解消の 22 ページ波及修正
 *
 * 処理:
 *  1. 全 HTML から「制作集団」「第三者認定機関」表現を canonical 表現に置換
 *  2. service ハブ 3 ページ + 各個別サービスページの ProfessionalService JSON-LD を @id reference 化
 *  3. desktop nav に /methodology/ リンクを追加 (mobile/footer は既に存在)
 *  4. dateModified を今日付け (2026-05-04) に統一更新
 *  5. sitemap.xml lastmod を今日付けに統一
 *
 * 起源: 7 視点並列検証 (P1-P7) で検出された CRITICAL 10 + HIGH 25 のうち
 *       22 ページ波及対象を atomic 一括処理 (代表「ウンザリ」fatigue 構造解消)
 *
 * 安全策: dry-run mode (--dry-run) で diff のみ表示して実書き込みなし
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
// Reviewer A-CRITICAL-1: TODAY を動的化（再実行時の誤日付書き込み防止）
const TODAY = new Date().toISOString().slice(0, 10);
const DRY_RUN = process.argv.includes('--dry-run');
const PS_ID = 'https://tcharton.com/#professional-service';

// 全 HTML 列挙 (再帰)
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

const TEXT_REPLACEMENTS = [
  // Q1 Q2: 「第三者認定機関」「制作集団」「唯一」表現排除 → canonical 表現
  [/第三者認定機関 HARTON Certified/g, 'HARTON Certified（自社運営の認定機関 / 機械検証で第三者性を確保）'],
  [/静岡県東部唯一の制作集団/g, '静岡県東部の S クラス制作パートナー'],
  [/業界唯一の制作集団/g, '静岡県東部の S クラス制作パートナー'],
  // SPEC バージョン参照分散統一 (v3.5 が現行)
  [/SPEC v3\.2 \/ 2,?554 検証項目/g, 'SPEC v3.5 / 2,554 検証項目'],
  [/SPEC v3\.2/g, 'SPEC v3.5'],
  [/SPEC v3\.4\.2/g, 'SPEC v3.5'],
  [/SPEC v3\.4(?!\.)/g, 'SPEC v3.5']
];

let stats = { textChanged: 0, dateChanged: 0, navChanged: 0, psChanged: 0, files: 0 };
const allHtml = findHtml(ROOT);

allHtml.forEach(fp => {
  const rel = path.relative(ROOT, fp).replace(/\\/g, '/');
  let html = fs.readFileSync(fp, 'utf-8');
  const orig = html;

  // (1) テキスト置換
  TEXT_REPLACEMENTS.forEach(([from, to]) => {
    html = html.replace(from, to);
  });
  if (html !== orig) stats.textChanged++;

  // (2) dateModified 全件統一
  const dateBefore = html;
  html = html.replace(/itemprop=["']dateModified["']\s+datetime=["']\d{4}-\d{2}-\d{2}["']/g,
    `itemprop="dateModified" datetime="${TODAY}"`);
  // 表示テキストも同期 (「最終更新 YYYY年M月D日」)
  const todayDisplay = TODAY.replace(/^(\d{4})-(\d{2})-(\d{2})$/, (_, y, m, d) =>
    `${y}年${parseInt(m, 10)}月${parseInt(d, 10)}日`);
  html = html.replace(/最終更新 \d{4}年\d{1,2}月\d{1,2}日/g, `最終更新 ${todayDisplay}`);
  // JSON-LD 内 "dateModified": "YYYY-MM-DD"
  html = html.replace(/"dateModified"\s*:\s*"\d{4}-\d{2}-\d{2}"/g,
    `"dateModified": "${TODAY}"`);
  if (html !== dateBefore) stats.dateChanged++;

  // (3) desktop nav に /methodology/ 追加
  // 既存パターン: <a href="/profile/" class="text-dark-300 hover:text-white py-3">プロフィール</a>
  // この直前 (/services/ai-prediction/ or /pricing/) と直後 (/cases/ or /profile/) の関係性に依存しないよう
  // まず /methodology/ がデスクトップ nav に既に存在するかチェック
  const navBefore = html;
  // hidden lg:flex ブロック内に /methodology/ が無ければ追加
  // パターン: <div class="hidden lg:flex items-center gap-8" data-nosnippet>...</div>
  html = html.replace(
    /(<div class="hidden lg:flex items-center gap-8"[^>]*>)([\s\S]*?)(<\/div>)/g,
    (match, openTag, content, closeTag) => {
      if (content.includes('/methodology/')) return match; // 既に存在
      // /pricing/ の直後に /methodology/ を追加
      const insertion = '\n        <a href="/methodology/" class="text-dark-300 hover:text-white py-3">方法論</a>';
      const updated = content.replace(
        /(<a href="\/pricing\/"[^>]*>料金<\/a>)/,
        `$1${insertion}`
      );
      return openTag + updated + closeTag;
    }
  );
  if (html !== navBefore) stats.navChanged++;

  // (4) ProfessionalService 集約 (index.html 以外で ProfessionalService schema を持つ場合 @id reference 化)
  // Reviewer B-C-1: idempotent guard — すでに @id reference 化済 (PS_ID 含有) なら skip
  if (rel !== 'index.html') {
    const psBlockRe = /<script type="application\/ld\+json">\s*\{\s*"@context"\s*:\s*"https:\/\/schema\.org"\s*,\s*"@type"\s*:\s*"ProfessionalService"[\s\S]*?<\/script>/;
    const m = html.match(psBlockRe);
    // 既に @id reference 済（PS_ID を含む完了形）なら処理 skip
    if (m && !m[0].includes(PS_ID)) {
      const replacement = '<script type="application/ld+json">\n  {\n    "@context": "https://schema.org",\n    "@type": "ProfessionalService",\n    "@id": "' + PS_ID + '"\n  }\n  </script>';
      html = html.replace(psBlockRe, replacement);
      stats.psChanged++;
    }
  }

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

// (5) sitemap.xml lastmod 統一
const smPath = path.join(ROOT, 'sitemap.xml');
if (fs.existsSync(smPath)) {
  const sm = fs.readFileSync(smPath, 'utf-8');
  const updated = sm.replace(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g,
    `<lastmod>${TODAY}</lastmod>`);
  if (updated !== sm) {
    if (DRY_RUN) console.log('[DRY] would write: sitemap.xml');
    else { fs.writeFileSync(smPath, updated, 'utf-8'); console.log('✓ sitemap.xml'); }
  }
}

console.log(`\n=== batch-fix-v1.20 ${DRY_RUN ? 'DRY-RUN' : '実行'} 完了 ===`);
console.log(`  ファイル変更: ${stats.files} / 検査 ${allHtml.length}`);
console.log(`  text 置換: ${stats.textChanged} / dateModified 更新: ${stats.dateChanged}`);
console.log(`  desktop nav 追加: ${stats.navChanged} / ProfessionalService @id 化: ${stats.psChanged}`);
