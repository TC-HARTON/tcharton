#!/usr/bin/env node
/**
 * gen-ogp.js — Insights 記事の個別 OGP 画像生成
 *
 * 各記事の <h1> と eyebrow（カテゴリ）を抽出し、1200x630 のブランド OGP を
 * SVG で組み立てて sharp で PNG 化 → insights/<slug>/ogp.png に出力。
 * og:image / twitter:image / Article schema image も自記事の画像へ差し替える。
 *
 * 使い方: node gen-ogp.js          全 Insights 記事を生成
 *         node gen-ogp.js <slug>  指定 slug のみ（テスト用）
 */
'use strict';
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = __dirname;
const INSIGHTS = path.join(ROOT, 'insights');

// 対象 slug（insights/ 配下のディレクトリを自動列挙。ハブ index.html は除外）
function listSlugs() {
  return fs.readdirSync(INSIGHTS, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .filter(s => fs.existsSync(path.join(INSIGHTS, s, 'index.html')))
    .sort();
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// 全角=1.0 / 半角=0.55 で重みづけして折り返し
function charW(ch) {
  return /[\x00-\xff‐-―‘-‟]/.test(ch) ? 0.55 : 1.0;
}
function wrapTitle(title, maxUnits) {
  const lines = [];
  let cur = '', w = 0;
  for (const ch of title) {
    const cw = charW(ch);
    if (w + cw > maxUnits && cur) { lines.push(cur); cur = ''; w = 0; }
    cur += ch; w += cw;
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 3);
}

// 記事 HTML から h1 と eyebrow カテゴリを抽出
function extract(slug) {
  const html = fs.readFileSync(path.join(INSIGHTS, slug, 'index.html'), 'utf-8');
  const h1 = (html.match(/<h1[^>]*>([^<]+)<\/h1>/) || [])[1] || slug;
  // eyebrow: <p ...>Insight ／ カテゴリ</p>
  const eb = (html.match(/tracking-widest uppercase">([^<]+)<\/p>/) || [])[1] || 'Insight';
  const category = eb.replace(/^Insight\s*[／/]\s*/, '').trim() || 'Insights';
  return { h1: h1.trim(), category };
}

function ogpSvg(category, title) {
  const FONT = "'Noto Sans JP','Yu Gothic','Hiragino Sans',sans-serif";
  const lines = wrapTitle(title, 20);
  const titleStartY = lines.length === 3 ? 268 : (lines.length === 2 ? 300 : 330);
  const titleSvg = lines.map((l, i) =>
    `<text x="80" y="${titleStartY + i * 76}" font-family="${FONT}" font-size="54" font-weight="800" fill="#1a1a1a">${esc(l)}</text>`
  ).join('\n  ');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#FFFFFF"/>
  <circle cx="1210" cy="640" r="280" fill="#eff6fb"/>
  <circle cx="1150" cy="120" r="70" fill="#fff8e6"/>
  <rect width="1200" height="10" fill="#1B4965"/>
  <rect x="80" y="74" width="46" height="46" rx="11" fill="#1B4965"/>
  <text x="103" y="106" text-anchor="middle" font-family="Inter,sans-serif" font-size="25" font-weight="800" fill="#ffffff">T</text>
  <text x="142" y="107" font-family="Inter,sans-serif" font-size="29" font-weight="800" fill="#1a1a1a">T.C.HARTON</text>
  <text x="1120" y="107" text-anchor="end" font-family="Inter,sans-serif" font-size="22" font-weight="700" letter-spacing="4" fill="#1B4965">INSIGHTS</text>
  <text x="80" y="222" font-family="${FONT}" font-size="27" font-weight="700" fill="#1B4965">${esc(category)}</text>
  ${titleSvg}
  <rect x="80" y="536" width="66" height="6" rx="3" fill="#D4AF37"/>
  <text x="80" y="580" font-family="${FONT}" font-size="24" fill="#666666">tcharton.com ／ 一次出典付きの WEB 解説</text>
</svg>`;
}

async function genOne(slug) {
  const { h1, category } = extract(slug);
  const svg = ogpSvg(category, h1);
  const out = path.join(INSIGHTS, slug, 'ogp.png');
  await sharp(Buffer.from(svg)).png().toFile(out);
  // og:image / twitter:image / Article schema image を差し替え
  const file = path.join(INSIGHTS, slug, 'index.html');
  let html = fs.readFileSync(file, 'utf-8');
  const url = `https://tcharton.com/insights/${slug}/ogp.png`;
  html = html.replace(/https:\/\/tcharton\.com\/ogp\.png/g, url);
  fs.writeFileSync(file, html);
  console.log(`✅ ${slug}  [${category}] ${h1}`);
}

(async () => {
  const arg = process.argv[2];
  const slugs = arg ? [arg] : listSlugs();
  for (const s of slugs) await genOne(s);
  console.log(`\n生成完了: ${slugs.length} 件`);
})();
