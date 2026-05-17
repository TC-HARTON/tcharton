#!/usr/bin/env node
/**
 * gen-insights-hub.js — insights/index.html を _categories.json から自動生成
 *
 * 目的：記事追加 → ハブから自動可視化（手動同期事故の根絶）
 *
 * 入力: insights/_categories.json（カテゴリ + 記事リストの正本）
 * 出力: insights/index.html（hub HTML 全体）
 *
 * 使い方: node gen-insights-hub.js
 *
 * 運用ルール:
 * - 新記事追加時は _categories.json の対応カテゴリ articles[] に登録
 * - hub HTML を手動編集しない（次回 gen 実行で上書きされる）
 * - 件数バッジ・カテゴリ section は自動カウント・自動生成
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const HUB_PATH = path.join(ROOT, 'insights', 'index.html');
const CONFIG_PATH = path.join(ROOT, 'insights', '_categories.json');

const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// 記事カード 1 枚を HTML 化
function articleCard(art, articlesPath) {
  const url = `${articlesPath}${art.slug}/`;
  const ogp = `${articlesPath}${art.slug}/ogp.png`;
  return `          <li class="bg-white border border-dark-100 rounded-xl p-5 hover:border-teal-500 transition-colors">
            <a href="${url}" class="block group">
              <img src="${ogp}" alt="" width="1200" height="630" loading="lazy" class="w-full rounded-xl border border-dark-100">
              <h3 class="mt-4 font-display font-bold text-lg text-dark-900 group-hover:text-teal-700">${esc(art.title)}</h3>
              <p class="mt-2 text-sm text-dark-600">${esc(art.summary)}</p>
              <span class="mt-3 inline-block text-xs text-teal-700 group-hover:underline">記事を読む →</span>
            </a>
          </li>`;
}

// カテゴリ section 1 つを HTML 化
function categorySection(cat) {
  const path = cat.articlesPath || '/insights/';
  const cards = cat.articles.map(a => articleCard(a, path)).join('\n');
  return `      <section id="${cat.id}" aria-label="${esc(cat.name)}" class="mt-12">
        <h2 class="font-display text-2xl lg:text-3xl font-bold text-dark-900">${esc(cat.name)}</h2>
        <p class="mt-3 text-dark-600 leading-relaxed">${esc(cat.intro)}</p>
        <ul class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
${cards}
        </ul>
      </section>`;
}

// カテゴリ chip 1 つを HTML 化
function categoryChip(cat) {
  return `          <a href="#${cat.id}" class="inline-flex items-center gap-2 bg-white border border-teal-500 rounded-full px-5 py-3 text-sm font-medium text-dark-800 hover:bg-teal-600 hover:text-white transition-colors">${esc(cat.name)} <span class="text-xs">${cat.articles.length}</span></a>`;
}

// 全 hub HTML を組み立て
function buildHub() {
  const chips = config.categories.map(categoryChip).join('\n');
  const sections = config.categories.map(categorySection).join('\n\n');
  const totalArticles = config.categories.reduce((sum, c) => sum + c.articles.length, 0);

  return `<!DOCTYPE html>
<html lang="ja" class="no-js">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="/dist/scripts/js-marker.js?v=202605120100"></script>
  <title>Insights — WEB の知見｜T.C.HARTON</title>
  <meta name="description" content="${esc(config.intro.lead1)}">
  <meta name="author" content="T.C.HARTON">
  <meta property="og:title" content="Insights — WEB の知見｜T.C.HARTON">
  <meta property="og:description" content="${esc(config.intro.lead1)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://tcharton.com/insights/">
  <meta property="og:image" content="https://tcharton.com/ogp.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:alt" content="T.C.HARTON サービス紹介 OGP 画像（静岡発の高品質 WEB 制作と AI 予測）">
  <meta property="og:site_name" content="T.C.HARTON">
  <meta property="og:locale" content="ja_JP">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Insights — WEB の知見｜T.C.HARTON">
  <meta name="twitter:description" content="${esc(config.intro.lead1)}">
  <meta name="twitter:image" content="https://tcharton.com/ogp.png">

  <meta name="theme-color" content="#FFFFFF">
  <meta name="color-scheme" content="light">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">

  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' https://www.googletagmanager.com https://static.cloudflareinsights.com; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://www.google-analytics.com https://www.googletagmanager.com; connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://cloudflareinsights.com; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self' https://api.web3forms.com; require-trusted-types-for 'script'; trusted-types default; upgrade-insecure-requests">

  <link rel="canonical" href="https://tcharton.com/insights/">
  <link rel="sitemap" type="application/xml" href="/sitemap.xml">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">

  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
    {"@type":"ListItem","position":1,"name":"ホーム","item":"https://tcharton.com/"},
    {"@type":"ListItem","position":2,"name":"Insights","item":"https://tcharton.com/insights/"}
  ]}
  </script>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"CollectionPage","@id":"https://tcharton.com/insights/#collection","name":"Insights","description":"${esc(config.intro.lead1)}","url":"https://tcharton.com/insights/","inLanguage":"ja","publisher":{"@id":"https://tcharton.com/#organization"}}
  </script>

  <link rel="stylesheet" href="/dist/critical.css?v=202605161900">
  <link rel="stylesheet" data-defer-css media="print" href="/dist/output.css?v=202605161900" fetchpriority="high">
  <noscript><link rel="stylesheet" href="/dist/output.css?v=202605161900"></noscript>
  <link rel="dns-prefetch" href="https://www.googletagmanager.com">
  <link rel="dns-prefetch" href="https://www.google-analytics.com">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" data-defer-css media="print" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@300;400;500;700;900&display=swap">
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@300;400;500;700;900&display=swap"></noscript>
  <script src="/dist/scripts/css-loader.js?v=202605161800" defer></script>

  <script src="/dist/scripts/ga4.js?v=202605120100" defer></script>
  <script src="/dist/scripts/trusted-types.js?v=202605120100"></script>
</head>
<body class="bg-white text-dark-700 font-sans antialiased">
  <a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-teal-700 focus:text-white focus:px-4 focus:py-3 focus:rounded">メインコンテンツへスキップ</a>

  <header class="fixed top-0 left-0 right-0 z-40 bg-white/90 nav-blur border-b border-dark-100">
    <nav aria-label="メインナビゲーション" class="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
      <a href="/" class="flex items-center gap-2 text-dark-900 font-display font-bold text-xl py-3" aria-label="T.C.HARTON ホームへ">
        <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
          <rect width="28" height="28" rx="6" fill="#1B4965"/>
          <text x="14" y="20" text-anchor="middle" font-family="Inter, sans-serif" font-weight="800" font-size="14" fill="#fff">T</text>
        </svg>
        <span>T.C.HARTON</span>
      </a>
      <div class="hidden lg:flex items-center gap-7 text-sm" data-nosnippet>
        <a href="/services/web/" class="text-dark-700 hover:text-teal-700 py-3">WEB 制作</a>
        <a href="/services/ai-prediction/" class="text-dark-700 hover:text-teal-700 py-3">AI 予測</a>
        <a href="/pricing/" class="text-dark-700 hover:text-teal-700 py-3">料金</a>
        <a href="/cases/" class="text-dark-700 hover:text-teal-700 py-3">事例</a>
        <a href="/stella/" class="text-dark-700 hover:text-teal-700 py-3">Stella</a>
        <a href="/profile/" class="text-dark-700 hover:text-teal-700 py-3">プロフィール</a>
        <a href="/contact/" class="bg-teal-700 hover:bg-teal-600 text-white px-5 py-3 rounded-md font-medium">無料相談</a>
      </div>
      <button id="menuToggle" type="button" class="lg:hidden p-3 -mr-3 text-dark-700" aria-label="メニューを開く" aria-expanded="false" aria-controls="mobile-menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M3 6h18M3 12h18M3 18h18"/>
        </svg>
      </button>
    </nav>
  </header>

  <nav id="mobile-menu" class="mobile-menu fixed inset-0 z-50 bg-white" aria-label="モバイルナビゲーション" role="dialog" aria-modal="true">
    <div class="flex flex-col p-6 gap-2 overflow-y-auto h-full">
      <button id="menuClose" type="button" class="self-end p-3 -mt-2 -mr-2 text-dark-700 hover:text-teal-700" aria-label="メニューを閉じる">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M6 18L18 6"/></svg>
      </button>
      <a href="/services/web/" class="block py-4 px-2 text-lg text-dark-800 hover:text-teal-700 border-b border-dark-100">WEB 制作</a>
      <a href="/services/ai-prediction/" class="block py-4 px-2 text-lg text-dark-800 hover:text-teal-700 border-b border-dark-100">AI 予測</a>
      <a href="/pricing/" class="block py-4 px-2 text-lg text-dark-800 hover:text-teal-700 border-b border-dark-100">料金</a>
      <a href="/cases/" class="block py-4 px-2 text-lg text-dark-800 hover:text-teal-700 border-b border-dark-100">導入事例</a>
      <a href="/vision/" class="block py-4 px-2 text-lg text-dark-800 hover:text-teal-700 border-b border-dark-100">私たちの想い</a>
      <a href="/stella/" class="block py-4 px-2 text-lg text-dark-800 hover:text-teal-700 border-b border-dark-100">Stella（品質評価）</a>
      <a href="/faq/" class="block py-4 px-2 text-lg text-dark-800 hover:text-teal-700 border-b border-dark-100">FAQ</a>
      <a href="/methodology/" class="block py-4 px-2 text-lg text-dark-800 hover:text-teal-700 border-b border-dark-100">方法論・品質根拠</a>
      <a href="/profile/" class="block py-4 px-2 text-lg text-dark-800 hover:text-teal-700 border-b border-dark-100">代表プロフィール</a>
      <a href="/about/" class="block py-4 px-2 text-lg text-dark-800 hover:text-teal-700 border-b border-dark-100">会社情報</a>
      <a href="/news/" class="block py-4 px-2 text-lg text-dark-800 hover:text-teal-700 border-b border-dark-100">お知らせ</a>
      <a href="/contact/" class="mt-4 block bg-teal-700 hover:bg-teal-600 text-white text-center px-5 py-4 rounded-md font-medium text-lg">無料相談</a>
    </div>
  </nav>

  <main id="main" class="pt-16">
    <nav aria-label="パンくずリスト" class="max-w-5xl mx-auto px-4 lg:px-8 pt-20 pb-2 text-sm text-dark-500">
      <ol class="flex items-center gap-2 flex-wrap">
        <li><a href="/" class="hover:text-teal-700 py-3 inline-block">ホーム</a></li>
        <li aria-hidden="true">/</li>
        <li><span aria-current="page" class="text-dark-700">Insights</span></li>
      </ol>
    </nav>

    <article class="max-w-5xl mx-auto px-4 lg:px-8 py-12 lg:py-16 hero-content">
      <header>
        <p class="text-sm text-teal-700 font-display font-bold tracking-widest uppercase">Insights</p>
        <h1 class="mt-3 font-display text-4xl md:text-5xl font-extrabold text-dark-900 leading-tight tracking-tight">Insights</h1>
        <p class="mt-6 text-base sm:text-lg text-dark-700 leading-relaxed business-description max-w-3xl">${esc(config.intro.lead1)}</p>
      </header>

      <div class="mt-8 max-w-3xl text-dark-700 leading-relaxed">
        <p>${esc(config.intro.lead2)}</p>
      </div>

      <nav aria-label="カテゴリ" class="mt-10 bg-teal-50 border border-teal-100 rounded-xl p-6">
        <p class="text-sm text-teal-700 font-display font-bold tracking-widest uppercase">Categories</p>
        <p class="mt-2 font-display text-xl lg:text-2xl font-bold text-dark-900">カテゴリから探す</p>
        <p class="mt-2 text-sm text-dark-600">読みたいテーマへ 1 クリックで移動できます。全 ${totalArticles} 本（${config.categories.length} カテゴリ）。</p>
        <div class="mt-5 flex flex-wrap gap-3">
${chips}
        </div>
      </nav>

${sections}

      <section aria-label="お問い合わせ" class="mt-12 bg-teal-50 border-y border-teal-100 rounded-xl p-8 text-center">
        <p class="text-teal-700 font-display font-bold text-xs lg:text-sm tracking-widest uppercase">Free Diagnosis</p>
        <h2 class="mt-3 font-display text-xl lg:text-2xl font-bold text-dark-900">読むだけでなく、自分のサイトで確かめる</h2>
        <p class="mt-3 text-dark-700 text-sm leading-relaxed">無料診断では、ここで解説している項目を、あなたのサイトで機械検証してお見せします。診断だけで終わっても費用は一切かかりません。</p>
        <a href="/contact/" class="mt-6 inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-600 text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg">
          <span>1 分で無料診断を申し込む</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
        </a>
      </section>
    </article>
  </main>

  <footer class="bg-dark-900 text-dark-300 border-t border-dark-700">
    <div class="max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-16">
      <nav aria-label="フッターナビゲーション" class="grid grid-cols-2 md:grid-cols-4 gap-8" data-nosnippet>
        <div>
          <h3 class="font-display text-sm font-bold text-white uppercase tracking-wider">サービス</h3>
          <ul class="mt-4 space-y-2 text-sm">
            <li><a href="/services/web/" class="hover:text-white py-3 inline-block">WEB 制作</a></li>
            <li><a href="/services/ai-prediction/" class="hover:text-white py-3 inline-block">AI 予測</a></li>
            <li><a href="/pricing/" class="hover:text-white py-3 inline-block">料金</a></li>
          </ul>
        </div>
        <div>
          <h3 class="font-display text-sm font-bold text-white uppercase tracking-wider">信頼形成</h3>
          <ul class="mt-4 space-y-2 text-sm">
            <li><a href="/cases/" class="hover:text-white py-3 inline-block">導入事例</a></li>
            <li><a href="/faq/" class="hover:text-white py-3 inline-block">FAQ</a></li>
            <li><a href="/methodology/" class="hover:text-white py-3 inline-block">方法論・品質根拠</a></li>
            <li><a href="/profile/" class="hover:text-white py-3 inline-block">代表プロフィール</a></li>
            <li><a href="/vision/" class="hover:text-white py-3 inline-block">私たちの想い</a></li>
          </ul>
        </div>
        <div>
          <h3 class="font-display text-sm font-bold text-white uppercase tracking-wider">Stella</h3>
          <ul class="mt-4 space-y-2 text-sm">
            <li><a href="/stella/" class="hover:text-white py-3 inline-block">Stella ハブ</a></li>
            <li><a href="/stella/methodology/" class="hover:text-white py-3 inline-block">評価方法論</a></li>
            <li><a href="/stella/industries/" class="hover:text-white py-3 inline-block">業種別</a></li>
            <li><a href="/stella/regions/" class="hover:text-white py-3 inline-block">地域別</a></li>
          </ul>
        </div>
        <div>
          <h3 class="font-display text-sm font-bold text-white uppercase tracking-wider">事業者情報</h3>
          <ul class="mt-4 space-y-2 text-sm">
            <li><a href="/about/" class="hover:text-white py-3 inline-block">会社情報</a></li>
            <li><a href="/contact/" class="hover:text-white py-3 inline-block">お問い合わせ</a></li>
            <li><a href="/news/" class="hover:text-white py-3 inline-block">お知らせ</a></li>
            <li><a href="/legal/" class="hover:text-white py-3 inline-block">特定商取引法表記</a></li>
            <li><a href="/privacy/" class="hover:text-white py-3 inline-block">プライバシーポリシー</a></li>
          </ul>
        </div>
      </nav>
      <div class="mt-12 pt-8 border-t border-dark-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-sm">
        <p data-nosnippet class="flex items-center gap-3 flex-wrap"><span>© 2026 T.C.HARTON. All rights reserved.</span><span aria-hidden="true" class="text-dark-600">·</span><a href="https://note.com/harton_official" target="_blank" rel="noopener noreferrer" class="hover:text-white py-3 inline-block">note で日々の発信 <span aria-hidden="true">↗</span></a></p>
        <p class="text-dark-500" data-nosnippet>静岡県沼津市大岡2690 / T.C.HARTON 代表</p>
      </div>
    </div>
  </footer>
  <script src="/dist/scripts/menu.js?v=202605141500" defer></script>
</body>
</html>
`;
}

// 整合性検証：JSON 内 slug が実ファイルと一致するか
function validate() {
  const errors = [];
  for (const cat of config.categories) {
    const baseDir = (cat.articlesPath || '/insights/').replace(/^\/|\/$/g, '');
    for (const art of cat.articles) {
      const filePath = path.join(ROOT, baseDir, art.slug, 'index.html');
      if (!fs.existsSync(filePath)) {
        errors.push(`MISSING FILE: ${cat.id} → ${art.slug} (期待: ${filePath})`);
      }
    }
  }
  return errors;
}

(() => {
  const errors = validate();
  if (errors.length > 0) {
    console.error('❌ 整合性エラー（実ファイルが存在しない slug）:');
    errors.forEach(e => console.error('   ' + e));
    console.error('\n_categories.json を修正してから再実行してください。');
    process.exit(1);
  }

  const html = buildHub();
  fs.writeFileSync(HUB_PATH, html);

  const totalArticles = config.categories.reduce((sum, c) => sum + c.articles.length, 0);
  console.log(`✅ insights/index.html 生成完了`);
  console.log(`   カテゴリ: ${config.categories.length}`);
  console.log(`   記事総数: ${totalArticles}`);
  console.log(`   カテゴリ内訳:`);
  for (const cat of config.categories) {
    console.log(`     - ${cat.id.padEnd(15)}  ${String(cat.articles.length).padStart(2)} 本  (${cat.name})`);
  }
})();
