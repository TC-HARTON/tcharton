#!/usr/bin/env node
/**
 * gen-ogp-industries.js — Industry LP (7 ページ) の個別 OGP 画像生成
 *
 * 各 LP の <h1> と eyebrow を抽出し、1200x630 のブランド OGP を生成。
 *
 * 使い方: node gen-ogp-industries.js          全 7 業種を生成
 *         node gen-ogp-industries.js <slug>   指定 slug のみ
 */
'use strict';
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = __dirname;
const INDUSTRIES = path.join(ROOT, 'services', 'web', 'industries');

function listSlugs() {
  return fs.readdirSync(INDUSTRIES, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .filter(s => fs.existsSync(path.join(INDUSTRIES, s, 'index.html')))
    .sort();
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

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

function extract(slug) {
  const html = fs.readFileSync(path.join(INDUSTRIES, slug, 'index.html'), 'utf-8');
  const h1 = (html.match(/<h1[^>]*>([^<]+)<\/h1>/) || [])[1] || slug;
  const eb = (html.match(/tracking-widest uppercase">([^<]+)<\/p>/) || [])[1] || 'Industry';
  const category = eb.replace(/^Industry\s*[／/]\s*/, '').trim() || 'Industry';
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
  <text x="1120" y="107" text-anchor="end" font-family="Inter,sans-serif" font-size="22" font-weight="700" letter-spacing="4" fill="#1B4965">INDUSTRY</text>
  <text x="80" y="222" font-family="${FONT}" font-size="27" font-weight="700" fill="#1B4965">${esc(category)}</text>
  ${titleSvg}
  <rect x="80" y="536" width="66" height="6" rx="3" fill="#D4AF37"/>
  <text x="80" y="580" font-family="${FONT}" font-size="24" fill="#666666">tcharton.com ／ 業種別 WEB 制作 実装ガイド</text>
</svg>`;
}

async function genOne(slug) {
  const { h1, category } = extract(slug);
  const svg = ogpSvg(category, h1);
  const out = path.join(INDUSTRIES, slug, 'ogp.png');
  await sharp(Buffer.from(svg)).png().toFile(out);
  console.log(`✅ ${slug}  [${category}] ${h1}`);
}

(async () => {
  const arg = process.argv[2];
  const slugs = arg ? [arg] : listSlugs();
  for (const s of slugs) await genOne(s);
  console.log(`\n生成完了: ${slugs.length} 件`);
})();
