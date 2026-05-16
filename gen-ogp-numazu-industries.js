#!/usr/bin/env node
/**
 * gen-ogp-numazu-industries.js — areas/numazu/{slug}/ogp.png × 12 を生成
 */
'use strict';
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = __dirname;
const DIR = path.join(ROOT, 'areas', 'numazu');

const SLUGS = ['tax','lawyer','realestate','restaurant','salon','lodging','dental','hospital','shihoshoshi','gyoseishoshi','cosmeticclinic','juku'];

function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function charW(ch) { return /[\x00-\xff‐-―‘-‟]/.test(ch) ? 0.55 : 1.0; }
function wrapTitle(title, max) {
  const lines = [];
  let cur = '', w = 0;
  for (const ch of title) {
    const cw = charW(ch);
    if (w + cw > max && cur) { lines.push(cur); cur = ''; w = 0; }
    cur += ch; w += cw;
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 3);
}

function extract(slug) {
  const html = fs.readFileSync(path.join(DIR, slug, 'index.html'), 'utf-8');
  const h1 = (html.match(/<h1[^>]*>([^<]+)<\/h1>/) || [])[1] || slug;
  const eb = (html.match(/tracking-widest uppercase">([^<]+)<\/p>/) || [])[1] || '';
  const category = eb.replace(/^沼津市 × /, '').replace(/ ／.*$/, '').trim() || '沼津 × 業種';
  return { h1: h1.trim(), category };
}

function svg(category, title) {
  const FONT = "'Noto Sans JP','Yu Gothic','Hiragino Sans',sans-serif";
  const lines = wrapTitle(title, 18);
  const startY = lines.length === 3 ? 258 : (lines.length === 2 ? 290 : 320);
  const titleSvg = lines.map((l, i) =>
    `<text x="80" y="${startY + i * 72}" font-family="${FONT}" font-size="48" font-weight="800" fill="#1a1a1a">${esc(l)}</text>`
  ).join('\n  ');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#FFFFFF"/>
  <circle cx="1210" cy="640" r="280" fill="#eff6fb"/>
  <circle cx="1150" cy="120" r="70" fill="#fff8e6"/>
  <rect width="1200" height="10" fill="#1B4965"/>
  <rect x="80" y="74" width="46" height="46" rx="11" fill="#1B4965"/>
  <text x="103" y="106" text-anchor="middle" font-family="Inter,sans-serif" font-size="25" font-weight="800" fill="#ffffff">T</text>
  <text x="142" y="107" font-family="Inter,sans-serif" font-size="29" font-weight="800" fill="#1a1a1a">T.C.HARTON</text>
  <text x="1120" y="107" text-anchor="end" font-family="Inter,sans-serif" font-size="22" font-weight="700" letter-spacing="4" fill="#1B4965">沼津 × 業種</text>
  <text x="80" y="222" font-family="${FONT}" font-size="27" font-weight="700" fill="#1B4965">${esc(category)}</text>
  ${titleSvg}
  <rect x="80" y="536" width="66" height="6" rx="3" fill="#D4AF37"/>
  <text x="80" y="580" font-family="${FONT}" font-size="22" fill="#666666">tcharton.com ／ 沼津 業界実測データに基づく WEB 制作</text>
</svg>`;
}

(async () => {
  const arg = process.argv[2];
  const slugs = arg ? [arg] : SLUGS;
  for (const slug of slugs) {
    const { h1, category } = extract(slug);
    const out = path.join(DIR, slug, 'ogp.png');
    await sharp(Buffer.from(svg(category, h1))).png().toFile(out);
    console.log(`✅ ${slug.padEnd(15)} ${h1}`);
  }
  console.log(`\n生成完了: ${slugs.length} 件`);
})();
