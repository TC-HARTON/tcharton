#!/usr/bin/env node
/**
 * gen-areas-all-cities.js — 全 7 都市 × 業種 ロングテール構造を一括生成
 *
 * 出力:
 *   - /areas/{city}/{industry}/index.html × 78 ページ
 *   - /areas/{city}/index.html × 4 新都市（shizuoka/hamamatsu/shibuya/sapporo）
 *
 * 既存 /areas/{numazu,mishima,fuji,fujinomiya,susono,nagaizumi,shimizu}/ は上書き禁止
 * （Numazu hub のみ別途手動更新）
 *
 * Stella との使い分け：
 *   - 本ページ群 = HARTON 営業 LP（都市×業種 ロングテール）
 *   - /stella/ = 独立評価機関 / データ公開（CC BY 4.0）
 *   - 同じ scanner データを「営業根拠」として引用するが、トーン・CTA・立場が異なる
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DATA = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/areas-cities-industries.json'), 'utf-8'));

// 業種メタ（slug → name, industryEn pointer, character, key message, law）
const IND_META = {
  tax: { nameJa: '税理士・会計事務所', nameShort: '税理士', en: 'legal',
    char: '顧客との信頼関係が問われる相談業。E-E-A-T（経験・専門性・権威性・信頼性）が WEB の核',
    key: '相続・法人決算など高単価案件ほど Web の信頼設計が成約率を左右',
    law: '個人情報保護法（2022 改正）・税理士法（広告規制）' },
  lawyer: { nameJa: '弁護士', nameShort: '弁護士', en: 'legal',
    char: '緊急時の信頼が決め手の専門業。プロフィール開示と取扱分野の明示が必須',
    key: '専門分野・解決事例・初回相談料の透明化で問い合わせ率を底上げ',
    law: '弁護士法 §74（広告制限）・個人情報保護法' },
  shihoshoshi: { nameJa: '司法書士', nameShort: '司法書士', en: 'legal',
    char: '登記・相続など人生の重要場面で選ばれる業種',
    key: '個人情報保護法 + 取扱業務（相続・登記）の機械可読化で見込み客の不安を下げる',
    law: '司法書士法 / 個人情報保護法' },
  gyoseishoshi: { nameJa: '行政書士', nameShort: '行政書士', en: 'legal',
    char: '建設業許可・在留資格・補助金等 取扱業務が幅広い専門業',
    key: '基礎セキュリティ + 取扱業務 5-10 に絞った深い解説で専門性を可視化',
    law: '行政書士法（広告規制）/ 個人情報保護法' },
  realestate: { nameJa: '不動産仲介・売買', nameShort: '不動産', en: 'real-estate',
    char: '物件情報の鮮度 + 取引態様の明示が宅建業法で義務付けられる業種',
    key: '宅建業法準拠 + 物件 Schema + 更新フローの自動化で「おとり広告」リスクをゼロに',
    law: '宅建業法 §32 §34 §47 / 不動産公正競争規約' },
  restaurant: { nameJa: '飲食店', nameShort: '飲食店', en: 'restaurant',
    char: '「食べたい」と感じる写真 + Google マップ 1 タップ予約が来店誘導の核',
    key: 'Google ビジネスプロフィール最適化 + 24h 予約導線 + 多言語対応で来店誘導',
    law: '食品衛生法 / 食品表示法 / 景表法' },
  salon: { nameJa: '美容院・ヘアサロン', nameShort: '美容院', en: 'beauty',
    char: '施術写真 + 1 タップ予約 + スタッフプロフィール開示が来店動線の中心',
    key: 'WordPress セキュリティ強化 + HOT PEPPER 並行運用で指名予約率を上げる',
    law: '美容師法 / 特商法 / 景表法' },
  lodging: { nameJa: '宿泊施設・旅館・ホテル', nameShort: '宿泊施設', en: 'restaurant',
    char: '直予約 + インバウンド多言語が宿泊単価を最大化する重要業種',
    key: '直予約導線 + 多言語（英語・中国語）+ Google ビジネスプロフィール最適化で OTA 比率を下げる',
    law: '旅館業法 / 食品衛生法 / 景表法' },
  dental: { nameJa: '歯科医院・デンタルクリニック', nameShort: '歯科医院', en: 'clinic',
    char: '医療広告ガイドライン遵守必須。体験談・Before/After 写真は原則禁止',
    key: '医療広告ガイドライン自動チェック + 24h 予約 + WCAG 2.2 AA で高齢患者にも届く',
    law: '医療広告ガイドライン（厚労省）/ 薬機法 / 歯科医師法' },
  hospital: { nameJa: '病院・総合医療', nameShort: '病院', en: 'clinic',
    char: '緊急時のアクセシビリティ + 診療科目の機械可読化が公共的な責務',
    key: 'WCAG 2.2 AA 準拠 + HTTPS 全面化 + 診療科目 Schema で緊急時にも届く',
    law: '医療法 / 医療広告ガイドライン / 個人情報保護法（要配慮個人情報）' },
  cosmeticclinic: { nameJa: '美容クリニック・美容医療', nameShort: '美容クリニック', en: 'clinic',
    char: '医療広告ガイドライン + 薬機法の二重規制。違反リスクが極めて高い業種',
    key: '医療広告ガイドライン限定解除要件の機械チェック + 薬機法対応で行政指導リスクをゼロに',
    law: '医療広告ガイドライン（厚労省）/ 薬機法 / 美容医療指針' },
  clinic: { nameJa: 'クリニック・診療所', nameShort: 'クリニック', en: 'clinic',
    char: '一般内科・皮膚科・整形外科等。地域医療の入口を担う業種',
    key: '24h 予約 + 診療科目 Schema + 医療広告ガイドライン準拠で信頼設計',
    law: '医療広告ガイドライン（厚労省）/ 医師法' },
  juku: { nameJa: '学習塾・教育', nameShort: '学習塾', en: 'legal',
    char: '保護者の事前検索が長く深い業種。合格実績 / 講師紹介 / 月謝の透明性が決め手',
    key: '合格実績の年度別開示 + 講師プロフィール + 初月料金透明化で問合せ率向上',
    law: '景表法（合格率・実績表示）/ 特商法' },
};

// 都市メタ
const CITY_META = {
  numazu: { nameJa: '沼津市', region: '静岡県東部', hq: true, distance_min: 0, wp: '%E6%B2%BC%E6%B4%A5%E5%B8%82', accent: 'HARTON 本社所在地' },
  mishima: { nameJa: '三島市', region: '静岡県東部', distance_min: 15, wp: '%E4%B8%89%E5%B3%B6%E5%B8%82', accent: '新幹線停車駅 / 富士山湧水の街' },
  fuji: { nameJa: '富士市', region: '静岡県東部', distance_min: 30, wp: '%E5%AF%8C%E5%A3%AB%E5%B8%82', accent: '製紙・化学・物流の県内最大級工業都市' },
  shizuoka: { nameJa: '静岡市', region: '静岡県中部', distance_min: 70, remote: true, wp: '%E9%9D%99%E5%B2%A1%E5%B8%82', accent: '静岡県庁所在地 / 政令指定都市' },
  hamamatsu: { nameJa: '浜松市', region: '静岡県西部', distance_min: 120, remote: true, wp: '%E6%B5%9C%E6%9D%BE%E5%B8%82', accent: '製造業の中核都市（楽器・自動車・輸送機器）' },
  shibuya: { nameJa: '渋谷区', region: '東京都', distance_min: 90, remote: true, wp: '%E6%B8%8B%E8%B0%B7%E5%8C%BA', accent: '渋谷区は東京都心の事業集積地' },
  sapporo: { nameJa: '札幌市', region: '北海道', distance_min: null, remote: true, wp: '%E6%9C%AD%E5%B9%8C%E5%B8%82', accent: '北海道の中心都市・道内最大の経済圏' },
};

function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

function ngBreakdownHtml(sub) {
  return Object.entries(sub)
    .filter(([k, v]) => v > 0)
    .map(([k, v]) => `              <li class="flex justify-between text-sm"><span class="text-dark-700">${esc(k)}</span><span class="font-bold text-dark-900">${v} 件</span></li>`)
    .join('\n');
}

// 共通 head + nav + footer
const COMMON_HEAD = (title, description, canonical, ogImage, ogAlt) => `<!DOCTYPE html>
<html lang="ja" class="no-js">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="/dist/scripts/js-marker.js?v=202605120100"></script>
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="author" content="大内 達也">

  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:alt" content="${esc(ogAlt)}">
  <meta property="og:site_name" content="T.C.HARTON">
  <meta property="og:locale" content="ja_JP">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${ogImage}">

  <meta name="theme-color" content="#FFFFFF">
  <meta name="color-scheme" content="light">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">

  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' https://www.googletagmanager.com https://static.cloudflareinsights.com; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://www.google-analytics.com https://www.googletagmanager.com; connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://cloudflareinsights.com; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self' https://api.web3forms.com; require-trusted-types-for 'script'; trusted-types default; upgrade-insecure-requests">

  <link rel="canonical" href="${canonical}">
  <link rel="sitemap" type="application/xml" href="/sitemap.xml">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">`;

const COMMON_BODY_START = `  <link rel="stylesheet" href="/dist/output.css?v=202605141500">
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
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
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

  <main id="main" class="pt-16">`;

const COMMON_FOOTER = `  </main>

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
        <p class="text-dark-500" data-nosnippet>静岡県沼津市大岡2690 / 代表 大内 達也</p>
      </div>
    </div>
  </footer>
  <script src="/dist/scripts/menu.js?v=202605141500" defer></script>
</body>
</html>
`;

// ─── Industry page template ─────────────────────────────────────────
function industryPage(citySlug, industrySlug, scanData) {
  const city = CITY_META[citySlug];
  const ind = IND_META[industrySlug];
  if (!city || !ind) return null;
  const d = scanData;
  const finalRatio = d.median === 0 ? '> 90' : (90 / d.median).toFixed(1) + ' 倍';
  const ngHtml = ngBreakdownHtml(d.sub);
  const distanceText = city.hq ? '本社所在地（沼津市大岡 2690）'
    : (city.distance_min ? `沼津本社から車 ${city.distance_min} 分` : '全国対応');

  const title = `${city.nameJa}の${ind.nameJa} ホームページ制作｜実測 ${d.n} 社 中央値 ${d.median} 点｜T.C.HARTON`;
  const description = `${city.nameJa}の${ind.nameJa} ${d.n} 社の WEB サイト品質を機械検証した結果、中央値 ${d.median} 点 / 最高 ${d.max} 点 / 致命的 NG ${d.ng_pct}%。${ind.key}。${ind.law} 等の法令準拠込みで設計します。`;
  const canonical = `https://tcharton.com/areas/${citySlug}/${industrySlug}/`;
  const ogImage = `${canonical}ogp.png`;
  const ogAlt = `${city.nameJa}の${ind.nameJa} ホームページ制作 — T.C.HARTON`;

  const jsonLd = `<script type="application/ld+json">
  {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
    {"@type":"ListItem","position":1,"name":"ホーム","item":"https://tcharton.com/"},
    {"@type":"ListItem","position":2,"name":"対応エリア","item":"https://tcharton.com/areas/"},
    {"@type":"ListItem","position":3,"name":"${esc(city.nameJa)}","item":"https://tcharton.com/areas/${citySlug}/"},
    {"@type":"ListItem","position":4,"name":"${esc(ind.nameJa)}","item":"${canonical}"}
  ]}
  </script>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"Service","@id":"${canonical}#service","name":"${esc(city.nameJa)}の${esc(ind.nameJa)}向け ホームページ制作","description":${JSON.stringify(description)},"provider":{"@id":"https://tcharton.com/#organization"},"serviceType":"WEB 制作","audience":{"@type":"BusinessAudience","name":"${esc(city.nameJa)}内の${esc(ind.nameJa)}事業者"},"areaServed":{"@type":"City","name":"${esc(city.nameJa)}","sameAs":"https://ja.wikipedia.org/wiki/${city.wp}"}}
  </script>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"Article","@id":"${canonical}#article","headline":"${esc(city.nameJa)}の${esc(ind.nameJa)} ホームページ制作 — 実測 ${d.n} 社のデータと改善方針","description":${JSON.stringify(description)},"author":{"@type":"Person","name":"大内 達也","url":"https://tcharton.com/profile/"},"publisher":{"@id":"https://tcharton.com/#organization"},"datePublished":"2026-05-16","dateModified":"2026-05-16","inLanguage":"ja","url":"${canonical}","mainEntityOfPage":"${canonical}","image":"${ogImage}"}
  </script>`;

  return `${COMMON_HEAD(title, description, canonical, ogImage, ogAlt)}

  ${jsonLd}

${COMMON_BODY_START}
    <nav aria-label="パンくずリスト" class="max-w-3xl mx-auto px-4 lg:px-8 pt-20 pb-2 text-sm text-dark-500">
      <ol class="flex items-center gap-2 flex-wrap">
        <li><a href="/" class="hover:text-teal-700 py-3 inline-block">ホーム</a></li>
        <li aria-hidden="true">/</li>
        <li><a href="/areas/" class="hover:text-teal-700 py-3 inline-block">対応エリア</a></li>
        <li aria-hidden="true">/</li>
        <li><a href="/areas/${citySlug}/" class="hover:text-teal-700 py-3 inline-block">${esc(city.nameJa)}</a></li>
        <li aria-hidden="true">/</li>
        <li><span aria-current="page" class="text-dark-700">${esc(ind.nameJa)}</span></li>
      </ol>
    </nav>

    <article class="max-w-3xl mx-auto px-4 lg:px-8 py-12 lg:py-16 hero-content">
      <header>
        <p class="text-sm text-teal-700 font-display font-bold tracking-widest uppercase">${esc(city.nameJa)} × ${esc(ind.nameShort)} ／ 業界実測データ</p>
        <h1 class="mt-3 font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-dark-900 leading-tight tracking-tight">${esc(city.nameJa)}の${esc(ind.nameJa)} ホームページ制作</h1>
        <p class="mt-4 text-xs text-dark-500">
          <time datetime="2026-05-16">2026 年 5 月 16 日 公開</time>
          <span class="mx-2" aria-hidden="true">/</span>
          <time datetime="2026-05-16">最終更新 2026 年 5 月 16 日</time>
          <span class="mx-2" aria-hidden="true">/</span>
          <span>scanner per-industry 実測</span>
        </p>
      </header>

      <div class="mt-8 bg-teal-50 border-l-4 border-teal-700 rounded-r-lg p-6">
        <p class="text-sm font-bold text-teal-800 mb-2">${esc(city.nameJa)} ${esc(ind.nameShort)} 実測 ${d.n} 社 のデータ</p>
        <p class="text-dark-800 leading-relaxed">${esc(ind.char)}。${esc(city.nameJa)} <strong class="text-dark-900">${d.n} 社</strong>の WEB サイト品質を 4 軸機械検証した結果、中央値 <strong class="text-dark-900">${d.median} 点</strong>（100 点満点）/ 最高 ${d.max} 点 / 致命的 NG <strong class="text-dark-900">${d.ng_pct}%（${d.ng} 社）</strong>。HARTON 自社サイト（90 点）との差は <strong class="text-dark-900">${finalRatio}</strong>。${esc(ind.key)}。</p>
      </div>

      <div class="mt-8 grid sm:grid-cols-2 gap-4">
        <div class="bg-dark-50 border border-dark-200 rounded-xl p-5">
          <p class="text-xs text-dark-500 font-display font-bold tracking-widest uppercase">実測社数</p>
          <p class="mt-2 font-display text-3xl font-bold text-dark-900">${d.n} <span class="text-base font-bold">社</span></p>
          <p class="mt-1 text-xs text-dark-500">${esc(city.nameJa)}内 ${esc(ind.nameJa)}</p>
        </div>
        <div class="bg-dark-50 border border-dark-200 rounded-xl p-5">
          <p class="text-xs text-dark-500 font-display font-bold tracking-widest uppercase">中央値</p>
          <p class="mt-2 font-display text-3xl font-bold text-dark-900">${d.median} <span class="text-base font-bold">点</span></p>
          <p class="mt-1 text-xs text-dark-500">100 点満点 / 平均 ${d.mean}</p>
        </div>
        <div class="bg-dark-50 border border-dark-200 rounded-xl p-5">
          <p class="text-xs text-dark-500 font-display font-bold tracking-widest uppercase">最高得点</p>
          <p class="mt-2 font-display text-3xl font-bold text-dark-900">${d.max} <span class="text-base font-bold">点</span></p>
          <p class="mt-1 text-xs text-dark-500">${esc(city.nameJa)}内 ${esc(ind.nameShort)} トップ</p>
        </div>
        <div class="bg-dark-50 border border-dark-200 rounded-xl p-5">
          <p class="text-xs text-dark-500 font-display font-bold tracking-widest uppercase">致命的 NG</p>
          <p class="mt-2 font-display text-3xl font-bold text-red-600">${d.ng_pct}<span class="text-base font-bold">%</span></p>
          <p class="mt-1 text-xs text-dark-500">${d.ng} 社 / ${d.n} 社</p>
        </div>
      </div>

      ${ngHtml ? `<section aria-label="致命的 NG 内訳" class="mt-10 bg-red-50 border border-red-200 rounded-xl p-6">
        <h2 class="font-display font-bold text-lg text-red-800 mb-4">致命的 NG の内訳（${d.ng} 社で検出）</h2>
        <ul class="space-y-2">
${ngHtml}
        </ul>
        <p class="mt-4 text-xs text-dark-500">出典: scanner per-industry latest（${esc(city.nameJa)} ${esc(ind.nameShort)} ${d.n} 社 / 2026-05-11 スキャン）</p>
      </section>` : ''}

      <section aria-label="業種特性" class="mt-12">
        <h2 class="font-display text-2xl lg:text-3xl font-bold text-dark-900">${esc(ind.nameJa)}に固有の WEB 設計要件</h2>
        <div class="mt-5 space-y-4 text-dark-700 leading-relaxed">
          <p>${esc(ind.char)}。${esc(city.nameJa)}のデータで見ると、中央値 ${d.median} 点・致命的 NG ${d.ng_pct}% という現状は改善余地が大きいことを示しています。</p>
          <p>${esc(ind.key)}。${esc(ind.law)} 等の法令準拠が前提です。</p>
        </div>
      </section>

      <section aria-label="HARTON の解決アプローチ" class="mt-12">
        <h2 class="font-display text-2xl lg:text-3xl font-bold text-dark-900">HARTON の対応範囲（${esc(city.nameJa)}）</h2>
        <div class="mt-5 space-y-4 text-dark-700 leading-relaxed">
          <p>HARTON は沼津市大岡を本拠地に、${esc(city.nameJa)}の${esc(ind.nameJa)}事業者の WEB 制作を支援します（${distanceText}）。本サイト tcharton.com 自身が機械検証 90 点（業界中央 ${d.median} 点の <strong class="text-dark-900">${finalRatio}</strong>）の実証体です。</p>
          <div class="space-y-2 text-dark-700">
            <p>・<strong class="text-dark-900">致命的 NG 即時解消</strong> — HTTPS 化 / WP 管理面パス変更 / CMS バージョン情報削除（1-3 日 / +15 点）</p>
            <p>・<strong class="text-dark-900">業種別法令準拠</strong> — ${esc(ind.law)} の機械チェック</p>
            <p>・<strong class="text-dark-900">構造化データ完備</strong> — Service / LocalBusiness / FAQPage / Article で AI 検索引用率向上</p>
            <p>・<strong class="text-dark-900">継続改善</strong> — 月次 Stella 機械検証で品質維持</p>
          </div>
        </div>
        <div class="mt-6 callout-highlight rounded-r-lg p-5">
          <p class="text-sm text-dark-700 leading-relaxed"><strong class="text-dark-900">業種別の詳細実装ガイド</strong>は <a href="/services/web/industries/${ind.en}/" class="text-teal-700 underline hover:text-teal-500">${esc(ind.nameJa)}向け WEB 制作詳細ページ</a>を参照してください。料金プランは <a href="/pricing/" class="text-teal-700 underline hover:text-teal-500">料金ページ</a>で確認できます。</p>
        </div>
      </section>

      <section aria-label="独立評価機関のデータ参照" class="mt-12 bg-dark-50 border-l-4 border-dark-400 rounded-r-lg p-6">
        <h2 class="font-display font-bold text-lg text-dark-900 mb-2">中立データとしての参照</h2>
        <p class="text-sm text-dark-700 leading-relaxed">本ページで引用している機械検証データは、HARTON が運営する独立評価機関 <a href="/stella/" class="text-teal-700 underline hover:text-teal-500">Stella</a> が CC BY 4.0 ライセンスで公開しています。業界全体の集計・他都市比較・改善ガイドは <a href="/stella/industries/" class="text-teal-700 underline hover:text-teal-500">Stella 業種別データ</a> / <a href="/stella/comparison/regions/shizuoka/" class="text-teal-700 underline hover:text-teal-500">地域別比較</a>を参照してください。</p>
      </section>

      <section aria-label="関連 Insights" class="mt-12">
        <h2 class="font-display text-xl lg:text-2xl font-bold text-dark-900">関連 Insights 記事</h2>
        <ul class="mt-4 space-y-2 text-sm">
          <li><a href="/insights/local-seo-guide/" class="text-teal-700 underline hover:text-teal-500 py-2 inline-block">ローカル SEO 実装ガイド — ${esc(city.nameJa)} × ${esc(ind.nameShort)} で勝つ</a></li>
          <li><a href="/insights/google-business-profile/" class="text-teal-700 underline hover:text-teal-500 py-2 inline-block">Google ビジネスプロフィール — 地方事業者の必須設定</a></li>
          <li><a href="/insights/from-17-to-90-points/" class="text-teal-700 underline hover:text-teal-500 py-2 inline-block">中央 ${d.median} 点を 90 点超へ — 業界トップを取りに行く 10 ステップ</a></li>
          <li><a href="/insights/jpx-prime-1553-deep-dive/" class="text-teal-700 underline hover:text-teal-500 py-2 inline-block">東証プライム 1,553 社の WEB 品質を機械検証して見えた真実</a></li>
        </ul>
      </section>

      <section aria-label="出典" class="mt-12 border-t border-dark-200 pt-8">
        <h2 class="font-display text-lg font-bold text-dark-900">出典</h2>
        <ul class="mt-4 space-y-2 text-xs text-dark-500 break-words">
          <li>HARTON scanner per-industry latest — ${esc(city.nameJa)} ${esc(ind.nameShort)} ${d.n} 社 / スキャン基準日 2026-05-11 / 出典: <a href="/stella/" class="text-teal-700 underline">Stella サブセクション（CC BY 4.0）</a></li>
          <li>関連法令: ${esc(ind.law)}</li>
          <li>業種別 WEB 制作詳細: <a href="/services/web/industries/${ind.en}/" class="text-teal-700 underline">/services/web/industries/${ind.en}/</a></li>
        </ul>
      </section>

      <section aria-label="お問い合わせ" class="mt-12 bg-teal-50 border-y border-teal-100 rounded-xl p-8 text-center">
        <p class="text-teal-700 font-display font-bold text-xs lg:text-sm tracking-widest uppercase">Free Diagnosis</p>
        <h2 class="mt-3 font-display text-xl lg:text-2xl font-bold text-dark-900">${esc(city.nameJa)}の${esc(ind.nameJa)} 専門 無料診断</h2>
        <p class="mt-3 text-dark-700 text-sm leading-relaxed">自社サイトのスコアを業界中央 ${d.median} 点と比較し、改善点をお見せします。診断のみで終わっても費用は一切かかりません。</p>
        <a href="/contact/" class="mt-6 inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-600 text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg">
          <span>1 分で無料診断を申し込む</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
        </a>
      </section>
    </article>
${COMMON_FOOTER}`;
}

// ─── City hub page template (for new cities only) ───────────────────
function cityHubPage(citySlug, cityData) {
  const city = CITY_META[citySlug];
  const inds = cityData.industries;
  const n_total = Object.values(inds).reduce((s, i) => s + i.n, 0);
  const all_scores_count = Object.keys(inds).length;
  const total_ng = Object.values(inds).reduce((s, i) => s + i.ng, 0);
  const ng_pct = (total_ng / n_total * 100).toFixed(1);

  const title = `${city.nameJa}の WEB 制作｜${all_scores_count} 業種 ${n_total} 社 実測｜T.C.HARTON`;
  const description = `${city.nameJa}の中小企業向け WEB 制作。${city.nameJa}内 ${all_scores_count} 業種 ${n_total} 社の機械検証実測データに基づき、業種別ロングテールページを提供します。`;
  const canonical = `https://tcharton.com/areas/${citySlug}/`;
  const ogImage = `${canonical}ogp.png`;
  const ogAlt = `${city.nameJa}の WEB 制作 — T.C.HARTON Areas`;

  const industryCards = Object.entries(inds).map(([slug, d]) => {
    const ind = IND_META[slug];
    if (!ind) return '';
    return `          <a href="/areas/${citySlug}/${slug}/" class="block bg-white border border-dark-200 hover:border-teal-700 rounded-xl p-4 transition-all hover:shadow-md">
            <p class="font-display font-bold text-dark-900 text-sm">${esc(ind.nameJa)}</p>
            <p class="mt-1 text-xs text-dark-500">n=${d.n} / 中央値 ${d.median} 点 / NG ${d.ng_pct}%</p>
          </a>`;
  }).filter(Boolean).join('\n');

  const distanceText = city.hq ? '本社所在地' : (city.distance_min ? `沼津本社から車 約 ${city.distance_min} 分` : '全国対応');

  return `${COMMON_HEAD(title, description, canonical, ogImage, ogAlt)}

  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
    {"@type":"ListItem","position":1,"name":"ホーム","item":"https://tcharton.com/"},
    {"@type":"ListItem","position":2,"name":"対応エリア","item":"https://tcharton.com/areas/"},
    {"@type":"ListItem","position":3,"name":"${esc(city.nameJa)}","item":"${canonical}"}
  ]}
  </script>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"LocalBusiness","@id":"${canonical}#localbusiness","name":"T.C.HARTON","url":"https://tcharton.com/","areaServed":[{"@type":"City","name":"${esc(city.nameJa)}","sameAs":"https://ja.wikipedia.org/wiki/${city.wp}"}],"founder":{"@type":"Person","name":"大内 達也"},"description":"${esc(city.nameJa)}の WEB 制作"}
  </script>

${COMMON_BODY_START}
    <nav aria-label="パンくずリスト" class="max-w-3xl mx-auto px-4 lg:px-8 pt-20 pb-2 text-sm text-dark-500">
      <ol class="flex items-center gap-2 flex-wrap">
        <li><a href="/" class="hover:text-teal-700 py-3 inline-block">ホーム</a></li>
        <li aria-hidden="true">/</li>
        <li><a href="/areas/" class="hover:text-teal-700 py-3 inline-block">対応エリア</a></li>
        <li aria-hidden="true">/</li>
        <li><span aria-current="page" class="text-dark-700">${esc(city.nameJa)}</span></li>
      </ol>
    </nav>

    <article class="max-w-3xl mx-auto px-4 lg:px-8 py-12 lg:py-16 hero-content">
      <header>
        <p class="text-sm text-teal-700 font-display font-bold tracking-widest uppercase">Areas ／ ${esc(city.region)}</p>
        <h1 class="mt-3 font-display text-4xl md:text-5xl font-extrabold text-dark-900 leading-tight tracking-tight">${esc(city.nameJa)}の WEB 制作</h1>
        <p class="mt-4 text-xs text-dark-500">
          <time datetime="2026-05-16">2026 年 5 月 16 日 公開</time>
          <span class="mx-2" aria-hidden="true">/</span>
          <span>${esc(distanceText)}</span>
        </p>
      </header>

      <div class="mt-8 bg-teal-50 border-l-4 border-teal-700 rounded-r-lg p-6">
        <p class="text-sm font-bold text-teal-800 mb-2">${esc(city.nameJa)}の概要</p>
        <p class="text-dark-800 leading-relaxed">${esc(city.accent)}。${esc(city.nameJa)}内 <strong class="text-dark-900">${all_scores_count} 業種 ${n_total} 社</strong>の WEB サイト品質を機械検証実測しており、業種別ロングテールページで個別データを公開しています。</p>
      </div>

      <section aria-label="業種別ページ" class="mt-12">
        <h2 class="font-display text-2xl lg:text-3xl font-bold text-dark-900">${esc(city.nameJa)} × 業種別 WEB 品質実測ページ</h2>
        <p class="mt-4 text-dark-700 leading-relaxed">${esc(city.nameJa)}内 ${all_scores_count} 業種の per-industry スキャン実測値に基づくロングテールページ。各ページは中央値・最高得点・致命的 NG 内訳と HARTON の解決アプローチを掲載しています。</p>
        <div class="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
${industryCards}
        </div>
        <p class="mt-4 text-xs text-dark-500">${esc(city.nameJa)} ${all_scores_count} 業種合計 ${n_total} 社 / 致命的 NG ${total_ng} 社 ${ng_pct}%。出典: scanner per-industry latest（2026-05-11）</p>
      </section>

      <section aria-label="独立評価機関のデータ参照" class="mt-12 bg-dark-50 border-l-4 border-dark-400 rounded-r-lg p-6">
        <h2 class="font-display font-bold text-lg text-dark-900 mb-2">中立データとしての参照</h2>
        <p class="text-sm text-dark-700 leading-relaxed">本ページで引用している機械検証データは、HARTON が運営する独立評価機関 <a href="/stella/" class="text-teal-700 underline hover:text-teal-500">Stella</a> が CC BY 4.0 ライセンスで公開しています。地域別比較は <a href="/stella/comparison/regions/shizuoka/" class="text-teal-700 underline hover:text-teal-500">Stella 地域別比較</a>を参照してください。</p>
      </section>

      <section aria-label="お問い合わせ" class="mt-12 bg-teal-50 border-y border-teal-100 rounded-xl p-8 text-center">
        <p class="text-teal-700 font-display font-bold text-xs lg:text-sm tracking-widest uppercase">Free Diagnosis</p>
        <h2 class="mt-3 font-display text-xl lg:text-2xl font-bold text-dark-900">${esc(city.nameJa)}の WEB 制作・改善は HARTON へ</h2>
        <p class="mt-3 text-dark-700 text-sm leading-relaxed">業界中央値との比較レポートを無料でお見せします。診断のみで終わっても費用は一切かかりません。</p>
        <a href="/contact/" class="mt-6 inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-600 text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg">
          <span>1 分で無料診断を申し込む</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
        </a>
      </section>
    </article>
${COMMON_FOOTER}`;
}

// ─── Main: generate all pages ───────────────────────────────────────
(() => {
  let totalIndustryPages = 0, totalHubs = 0;
  const NEW_CITIES = ['shizuoka', 'hamamatsu', 'shibuya', 'sapporo'];

  for (const [citySlug, cityData] of Object.entries(DATA)) {
    // Industry pages（全 7 都市）
    for (const [industrySlug, scanData] of Object.entries(cityData.industries)) {
      const html = industryPage(citySlug, industrySlug, scanData);
      if (!html) continue;
      const outDir = path.join(ROOT, 'areas', citySlug, industrySlug);
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, 'index.html'), html);
      totalIndustryPages++;
    }

    // 新 hub（4 都市）
    if (NEW_CITIES.includes(citySlug)) {
      const html = cityHubPage(citySlug, cityData);
      const outDir = path.join(ROOT, 'areas', citySlug);
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, 'index.html'), html);
      totalHubs++;
      console.log(`✅ HUB    /areas/${citySlug}/  (${Object.keys(cityData.industries).length} 業種 / ${Object.values(cityData.industries).reduce((s,i)=>s+i.n,0)} 社)`);
    }
  }

  console.log(`\n${totalIndustryPages} industry pages + ${totalHubs} new city hubs generated`);
})();
