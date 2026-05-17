#!/usr/bin/env node
/**
 * gen-numazu-results.js — 沼津 v3.9.8 全件結果ページ /areas/numazu/results/ 生成
 *
 * 代表 2026-05-17 指示:
 *   - 沼津 12 業種 166 社の全社名 (リンク付) + 点数 + 等級
 *   - 70+ B / 80+ A / 90+ S / 致命的 NG > 0 → 0 点扱い
 *   - 全件掲載 (n=166)
 *
 * データソース: src/data/numazu-results-v398.json (12 CSV から集約)
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DATA = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/numazu-results-v398.json'), 'utf-8'));

function esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function escAttr(s) { return esc(s); }

// 等級バッジ → 色クラス
const CLS_STYLE = {
  S: 'bg-green-100 text-green-800 border-green-300',
  A: 'bg-teal-100 text-teal-800 border-teal-300',
  B: 'bg-blue-100 text-blue-800 border-blue-300',
  '-': 'bg-amber-50 text-amber-800 border-amber-300',
  NG: 'bg-red-50 text-red-800 border-red-300'
};
const CLS_LABEL = { S: 'S', A: 'A', B: 'B', '-': '–', NG: 'NG' };

// summary
let totS=0,totA=0,totB=0,totUnder=0,totNG=0,totAll=0;
for (const v of Object.values(DATA.industries)) {
  for (const c of v.companies) {
    totAll++;
    if (c.ng>0) totNG++;
    else if (c.cls==='S') totS++;
    else if (c.cls==='A') totA++;
    else if (c.cls==='B') totB++;
    else totUnder++;
  }
}

function companyRow(c) {
  const isNG = c.ng > 0;
  const cls = isNG ? 'NG' : c.cls;
  const score = isNG ? 0 : c.adj;
  const badgeCls = CLS_STYLE[cls];
  const badgeLabel = CLS_LABEL[cls];
  const linkSafe = c.url && c.url.startsWith('http');
  const linkHtml = linkSafe
    ? `<a href="${escAttr(c.url)}" rel="noopener noreferrer" target="_blank" class="text-teal-700 underline hover:text-teal-500 break-all">${esc(c.name||'(社名未取得)')}</a>`
    : `<span class="text-dark-700">${esc(c.name||'(社名未取得)')}</span>`;
  const ngNote = isNG ? `<span class="ml-2 text-xs text-red-700">(致命的 NG ${c.ng} 件 → 0 点補正)</span>` : '';
  return `              <tr class="border-t border-dark-100">
                <td class="py-2 pr-3 align-top">${linkHtml}${ngNote}</td>
                <td class="py-2 pr-3 align-top text-right font-mono font-bold ${isNG?'text-red-700':'text-dark-900'}">${score}</td>
                <td class="py-2 align-top"><span class="inline-block ${badgeCls} border rounded px-2 py-0.5 text-xs font-bold">${badgeLabel}</span></td>
              </tr>`;
}

function industrySection(slug, v) {
  const sCount = v.companies.filter(c => c.ng===0 && c.cls==='S').length;
  const aCount = v.companies.filter(c => c.ng===0 && c.cls==='A').length;
  const bCount = v.companies.filter(c => c.ng===0 && c.cls==='B').length;
  const ngCount = v.companies.filter(c => c.ng>0).length;
  const under = v.n - sCount - aCount - bCount - ngCount;
  return `
      <section id="industry-${slug}" aria-label="${esc(v.nameJa)} ${v.n} 社の結果" class="mt-12">
        <header class="mb-4">
          <h2 class="font-display text-2xl lg:text-3xl font-bold text-dark-900">${esc(v.nameJa)} <span class="text-base text-dark-500 font-normal">(n=${v.n})</span></h2>
          <p class="mt-2 text-sm text-dark-600">内訳: S級 <strong>${sCount}</strong> / A級 <strong>${aCount}</strong> / B級 <strong>${bCount}</strong> / 70点未満 <strong>${under}</strong> / 致命的NG <strong class="text-red-700">${ngCount}</strong></p>
        </header>
        <div class="overflow-x-auto bg-white border border-dark-200 rounded-xl">
          <table class="w-full text-sm">
            <caption class="sr-only">${esc(v.nameJa)} ${v.n} 社の機械検証結果一覧（社名・点数・等級）</caption>
            <thead class="bg-dark-50 text-dark-700 text-xs uppercase tracking-wider">
              <tr>
                <th scope="col" class="py-2 pl-4 pr-3 text-left font-semibold">社名 (公式サイト)</th>
                <th scope="col" class="py-2 pr-3 text-right font-semibold w-20">点数</th>
                <th scope="col" class="py-2 pr-4 text-left font-semibold w-16">等級</th>
              </tr>
            </thead>
            <tbody class="text-dark-800">
${v.companies.map(c => companyRow(c).replace('<td class="py-2 pr-3 align-top">', '<td class="py-2 pl-4 pr-3 align-top">').replace('<td class="py-2 align-top">', '<td class="py-2 pr-4 align-top">')).join('\n')}
            </tbody>
          </table>
        </div>
      </section>`;
}

const canonical = 'https://tcharton.com/areas/numazu/results/';
const title = '沼津 166 社 機械検証 全件結果 (S/A/B 等級)｜T.C.HARTON';
const description = '沼津市内 12 業種 166 社の WEB サイト品質を機械検証した結果一覧。社名・公式 URL・100 点満点スコア・S/A/B 等級を全件公開。致命的 NG は 0 点補正で表示。';

const html = `<!DOCTYPE html>
<html lang="ja" class="no-js">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="/dist/scripts/js-marker.js?v=202605120100"></script>
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="author" content="T.C.HARTON">

  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="https://tcharton.com/areas/numazu/ogp.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:alt" content="沼津 12 業種 166 社 機械検証 全件結果 — T.C.HARTON">
  <meta property="og:site_name" content="T.C.HARTON">
  <meta property="og:locale" content="ja_JP">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="https://tcharton.com/areas/numazu/ogp.png">

  <meta name="theme-color" content="#FFFFFF">
  <meta name="color-scheme" content="light">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' https://www.googletagmanager.com https://static.cloudflareinsights.com; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://www.google-analytics.com https://www.googletagmanager.com; connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://cloudflareinsights.com; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self' https://api.web3forms.com; require-trusted-types-for 'script'; trusted-types default; upgrade-insecure-requests">

  <link rel="canonical" href="${canonical}">
  <link rel="sitemap" type="application/xml" href="/sitemap.xml">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">

  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
    {"@type":"ListItem","position":1,"name":"ホーム","item":"https://tcharton.com/"},
    {"@type":"ListItem","position":2,"name":"対応エリア","item":"https://tcharton.com/areas/"},
    {"@type":"ListItem","position":3,"name":"沼津市","item":"https://tcharton.com/areas/numazu/"},
    {"@type":"ListItem","position":4,"name":"全件結果","item":"${canonical}"}
  ]}
  </script>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"Dataset","name":"沼津市 12 業種 166 社 WEB 品質機械検証結果","description":"${esc(description)}","creator":{"@type":"Organization","name":"T.C.HARTON","url":"https://tcharton.com/"},"license":"https://creativecommons.org/licenses/by/4.0/","datePublished":"2026-05-17","spatialCoverage":{"@type":"City","name":"沼津市"},"variableMeasured":["総合スコア (100点満点 4軸)","致命的NG件数","等級 (S/A/B)"],"distribution":{"@type":"DataDownload","contentUrl":"${canonical}","encodingFormat":"text/html"}}
  </script>

  <link rel="stylesheet" href="/dist/critical.css?v=202605161900">
  <link rel="stylesheet" data-defer-css media="print" href="/dist/output.css?v=202605161900" fetchpriority="high">
  <noscript><link rel="stylesheet" href="/dist/output.css?v=202605161900"></noscript>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" data-defer-css media="print" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@300;400;500;700;900&display=swap">
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@300;400;500;700;900&display=swap"></noscript>
  <script src="/dist/scripts/css-loader.js?v=202605161800" defer></script>

  <script src="/dist/scripts/ga4.js?v=202605120100" defer></script>
  <script src="/dist/scripts/trusted-types.js?v=202605120100"></script>
</head>
<body class="bg-white text-dark-700 font-sans antialiased">
  <a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 bg-teal-700 text-white px-4 py-2 rounded">メインコンテンツへスキップ</a>

  <header class="fixed top-0 inset-x-0 z-40 nav-blur" role="banner">
    <nav class="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16" aria-label="グローバルナビゲーション">
      <a href="/" class="flex items-center gap-2" aria-label="T.C.HARTON ホーム">
        <span class="font-display text-xl font-bold tracking-tight text-teal-700">T.C.HARTON</span>
      </a>
      <ul class="hidden lg:flex items-center gap-7 text-sm font-medium text-dark-700">
        <li><a href="/services/web/" class="hover:text-teal-700">WEB 制作</a></li>
        <li><a href="/services/ai-prediction/" class="hover:text-teal-700">AI 予測</a></li>
        <li><a href="/pricing/" class="hover:text-teal-700">料金</a></li>
        <li><a href="/cases/" class="hover:text-teal-700">事例</a></li>
        <li><a href="/vision/" class="hover:text-teal-700">想い</a></li>
        <li><a href="/faq/" class="hover:text-teal-700">FAQ</a></li>
        <li><a href="/contact/" class="ml-2 bg-teal-700 hover:bg-teal-600 text-white px-5 py-2 rounded-md">無料相談</a></li>
      </ul>
      <button id="menuOpen" type="button" class="lg:hidden p-3 -mr-2 text-dark-700 hover:text-teal-700" aria-label="メニューを開く" aria-controls="mobile-menu" aria-expanded="false">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
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
      <a href="/faq/" class="block py-4 px-2 text-lg text-dark-800 hover:text-teal-700 border-b border-dark-100">FAQ</a>
      <a href="/methodology/" class="block py-4 px-2 text-lg text-dark-800 hover:text-teal-700 border-b border-dark-100">方法論・品質根拠</a>
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
        <li><a href="/areas/" class="hover:text-teal-700 py-3 inline-block">対応エリア</a></li>
        <li aria-hidden="true">/</li>
        <li><a href="/areas/numazu/" class="hover:text-teal-700 py-3 inline-block">沼津市</a></li>
        <li aria-hidden="true">/</li>
        <li><span aria-current="page" class="text-dark-700">全件結果</span></li>
      </ol>
    </nav>

    <article class="max-w-5xl mx-auto px-4 lg:px-8 py-12 lg:py-16">
      <header>
        <p class="text-sm text-teal-700 font-display font-bold tracking-widest uppercase">Numazu Full Results</p>
        <h1 class="mt-3 font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-dark-900 leading-tight tracking-tight">沼津市 12 業種 166 社<br>機械検証 全件結果</h1>
        <p class="mt-4 text-xs text-dark-500">
          <time datetime="2026-05-17">2026 年 5 月 17 日 公開</time>
          <span class="mx-2" aria-hidden="true">/</span>
          <span>scanner v3.9.8 / Google PSI v5 lighthouseResult verbatim</span>
        </p>
      </header>

      <!-- 評価基準 -->
      <div class="mt-8 bg-teal-50 border-l-4 border-teal-700 rounded-r-lg p-6">
        <p class="text-sm font-bold text-teal-800 mb-2">評価基準</p>
        <ul class="text-sm text-dark-800 leading-relaxed space-y-1">
          <li>● <strong class="text-dark-900">100 点満点</strong> (4 軸: Velocity / Logic / Reach / Inclusion)</li>
          <li>● <strong class="text-dark-900">90 点以上 = S 級</strong> / 80 点以上 = A 級 / 70 点以上 = B 級</li>
          <li>● <strong class="text-red-700">致命的 NG (HTTPS 非対応 / SSL 失効 / WP 管理面露出 / CMS バージョン露出 等) が 1 件以上検出された場合は 0 点扱い</strong></li>
        </ul>
      </div>

      <!-- 全体サマリ -->
      <section aria-label="全体サマリ" class="mt-10">
        <h2 class="font-display text-xl font-bold text-dark-900 mb-4">全体サマリ (n=${totAll})</h2>
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div class="bg-green-50 border border-green-300 rounded-xl p-4 text-center">
            <p class="font-display text-3xl font-extrabold text-green-700">${totS}</p>
            <p class="mt-1 text-xs text-green-800 font-semibold tracking-wider uppercase">S 級 (90+)</p>
          </div>
          <div class="bg-teal-50 border border-teal-300 rounded-xl p-4 text-center">
            <p class="font-display text-3xl font-extrabold text-teal-700">${totA}</p>
            <p class="mt-1 text-xs text-teal-800 font-semibold tracking-wider uppercase">A 級 (80-89)</p>
          </div>
          <div class="bg-blue-50 border border-blue-300 rounded-xl p-4 text-center">
            <p class="font-display text-3xl font-extrabold text-blue-700">${totB}</p>
            <p class="mt-1 text-xs text-blue-800 font-semibold tracking-wider uppercase">B 級 (70-79)</p>
          </div>
          <div class="bg-amber-50 border border-amber-300 rounded-xl p-4 text-center">
            <p class="font-display text-3xl font-extrabold text-amber-700">${totUnder}</p>
            <p class="mt-1 text-xs text-amber-800 font-semibold tracking-wider uppercase">70 点未満</p>
          </div>
          <div class="bg-red-50 border border-red-300 rounded-xl p-4 text-center">
            <p class="font-display text-3xl font-extrabold text-red-700">${totNG}</p>
            <p class="mt-1 text-xs text-red-800 font-semibold tracking-wider uppercase">致命的 NG (0 点)</p>
          </div>
        </div>
      </section>

      <!-- 業種別目次 -->
      <nav aria-label="業種ジャンプ" class="mt-8 bg-dark-50 border border-dark-200 rounded-xl p-4">
        <p class="text-xs text-dark-600 font-bold mb-2">業種別ジャンプ</p>
        <ul class="flex flex-wrap gap-2 text-sm">
${Object.entries(DATA.industries).map(([slug,v])=>`          <li><a href="#industry-${slug}" class="px-3 py-1 bg-white border border-dark-300 rounded hover:border-teal-700 hover:text-teal-700">${esc(v.nameJa)} (${v.n})</a></li>`).join('\n')}
        </ul>
      </nav>

${Object.entries(DATA.industries).map(([slug,v])=>industrySection(slug,v)).join('\n')}

      <!-- 出典 -->
      <section aria-label="出典" class="mt-12 text-xs text-dark-600 bg-dark-50 border border-dark-200 rounded-xl p-5">
        <h2 class="font-display text-sm font-bold text-dark-800 mb-2">出典・データ典拠</h2>
        <ul class="space-y-1 list-disc list-inside">
          <li>scanner v3.9.8 / 沼津 12 業種 (cosmeticclinic / dental / gyoseishoshi / hospital / juku / lawyer / lodging / realestate / restaurant / salon / shihoshoshi / tax)</li>
          <li>2026-05-17 スキャン基準日 / Google PSI v5 lighthouseResult verbatim</li>
          <li>業種母集団: <a href="https://www.google.com/maps" rel="noopener noreferrer" target="_blank" class="text-teal-700 underline">Google マップ Places API</a> 沼津市内 検索結果 (各業種 primary_type フィルタ済)</li>
          <li>致命的 NG 定義: HTTPS 非対応 / SSL 証明書失効 or 不一致 / WordPress 管理画面 URL 露出 / CMS バージョン情報露出 / 改ざん検知エンドポイント不在 のいずれか 1 件以上</li>
          <li>ライセンス: <a href="https://creativecommons.org/licenses/by/4.0/deed.ja" rel="noopener noreferrer" target="_blank" class="text-teal-700 underline">CC BY 4.0</a> (引用時は <a href="${canonical}" class="text-teal-700 underline">本ページ URL</a> 明記)</li>
        </ul>
      </section>

      <!-- 関連ページ -->
      <section aria-label="関連ページ" class="mt-12">
        <h2 class="font-display text-xl font-bold text-dark-900 mb-4">関連ページ</h2>
        <div class="grid sm:grid-cols-3 gap-4">
          <a href="/areas/numazu/" class="block bg-white border border-dark-200 hover:border-teal-700 rounded-xl p-5 transition-all hover:shadow-md">
            <p class="text-xs text-teal-700 font-display font-bold tracking-widest uppercase">沼津市ハブ</p>
            <h3 class="mt-2 font-display text-lg font-bold text-dark-900">沼津市 WEB 制作</h3>
            <p class="mt-2 text-sm text-dark-700">業種別ロングテール・対応範囲</p>
          </a>
          <a href="/methodology/" class="block bg-white border border-dark-200 hover:border-teal-700 rounded-xl p-5 transition-all hover:shadow-md">
            <p class="text-xs text-teal-700 font-display font-bold tracking-widest uppercase">Methodology</p>
            <h3 class="mt-2 font-display text-lg font-bold text-dark-900">方法論・品質根拠</h3>
            <p class="mt-2 text-sm text-dark-700">scanner v3.9.8 アルゴリズム</p>
          </a>
          <a href="/vision/" class="block bg-white border border-dark-200 hover:border-teal-700 rounded-xl p-5 transition-all hover:shadow-md">
            <p class="text-xs text-teal-700 font-display font-bold tracking-widest uppercase">Vision</p>
            <h3 class="mt-2 font-display text-lg font-bold text-dark-900">なぜ高品質か</h3>
            <p class="mt-2 text-sm text-dark-700">業界実態と 3 つの約束</p>
          </a>
        </div>
      </section>

      <!-- 無料診断 CTA -->
      <section aria-label="無料診断" class="mt-12 bg-teal-50 border-y border-teal-100 rounded-xl p-8 text-center">
        <p class="text-teal-700 font-display font-bold text-xs lg:text-sm tracking-widest uppercase">Free Diagnosis</p>
        <h2 class="mt-3 font-display text-xl lg:text-2xl font-bold text-dark-900">貴社サイトの実測スコアを無料で診断します</h2>
        <p class="mt-3 text-dark-700 text-sm leading-relaxed">scanner v3.9.8 で同じ 100 点満点 4 軸採点。業界平均との位置・致命的 NG 有無を即日レポート。</p>
        <a href="/contact/" class="mt-6 inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-600 text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg">
          <span>1 分で無料診断を申し込む</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
        </a>
      </section>
    </article>

  </main>

  <footer class="border-t border-dark-100 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-sm text-dark-700">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p>© 2026 T.C.HARTON</p>
        <ul class="flex flex-wrap gap-x-5 gap-y-2">
          <li><a href="/legal/" class="hover:text-teal-700">特定商取引法</a></li>
          <li><a href="/privacy/" class="hover:text-teal-700">プライバシー</a></li>
          <li><a href="/about/" class="hover:text-teal-700">会社情報</a></li>
          <li><a href="/contact/" class="hover:text-teal-700">お問い合わせ</a></li>
        </ul>
      </div>
    </div>
  </footer>
  <script src="/dist/scripts/menu.js?v=202605141500" defer></script>
</body>
</html>
`;

const outDir = path.join(ROOT, 'areas/numazu/results');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf-8');
console.log(`沼津 全件結果ページ生成: areas/numazu/results/index.html`);
console.log(`内訳: n=${totAll} / S=${totS} / A=${totA} / B=${totB} / <70=${totUnder} / NG=${totNG}`);
