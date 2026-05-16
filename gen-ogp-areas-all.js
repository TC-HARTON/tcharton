#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = __dirname;
const AREAS = path.join(ROOT, 'areas');
const NEW_CITIES = ['shizuoka','hamamatsu','shibuya','sapporo'];

function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function charW(ch) { return /[\x00-\xff‐-―‘-‟]/.test(ch) ? 0.55 : 1.0; }
function wrap(t, m) {
  const lines = []; let cur = '', w = 0;
  for (const ch of t) {
    const cw = charW(ch);
    if (w + cw > m && cur) { lines.push(cur); cur = ''; w = 0; }
    cur += ch; w += cw;
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 3);
}

function extract(filePath) {
  const html = fs.readFileSync(filePath, 'utf-8');
  const h1 = (html.match(/<h1[^>]*>([^<]+)<\/h1>/) || [])[1] || '';
  const eb = (html.match(/tracking-widest uppercase">([^<]+)<\/p>/) || [])[1] || '';
  return { h1: h1.trim(), eb: eb.trim() };
}

function svg(category, title, badge) {
  const FONT = "'Noto Sans JP','Yu Gothic','Hiragino Sans',sans-serif";
  const lines = wrap(title, 18);
  const startY = lines.length === 3 ? 258 : (lines.length === 2 ? 290 : 320);
  const t = lines.map((l, i) => `<text x="80" y="${startY + i * 72}" font-family="${FONT}" font-size="48" font-weight="800" fill="#1a1a1a">${esc(l)}</text>`).join('\n  ');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#FFFFFF"/>
  <circle cx="1210" cy="640" r="280" fill="#eff6fb"/>
  <circle cx="1150" cy="120" r="70" fill="#fff8e6"/>
  <rect width="1200" height="10" fill="#1B4965"/>
  <rect x="80" y="74" width="46" height="46" rx="11" fill="#1B4965"/>
  <text x="103" y="106" text-anchor="middle" font-family="Inter,sans-serif" font-size="25" font-weight="800" fill="#ffffff">T</text>
  <text x="142" y="107" font-family="Inter,sans-serif" font-size="29" font-weight="800" fill="#1a1a1a">T.C.HARTON</text>
  <text x="1120" y="107" text-anchor="end" font-family="Inter,sans-serif" font-size="22" font-weight="700" letter-spacing="4" fill="#1B4965">${esc(badge)}</text>
  <text x="80" y="222" font-family="${FONT}" font-size="27" font-weight="700" fill="#1B4965">${esc(category)}</text>
  ${t}
  <rect x="80" y="536" width="66" height="6" rx="3" fill="#D4AF37"/>
  <text x="80" y="580" font-family="${FONT}" font-size="22" fill="#666666">tcharton.com ／ 業界実測データに基づく WEB 制作</text>
</svg>`;
}

(async () => {
  let count = 0;
  // City hubs (4 new)
  for (const c of NEW_CITIES) {
    const fp = path.join(AREAS, c, 'index.html');
    if (!fs.existsSync(fp)) continue;
    const { h1, eb } = extract(fp);
    const cat = eb.replace(/^Areas\s*[／/]\s*/, '');
    const png = path.join(AREAS, c, 'ogp.png');
    await sharp(Buffer.from(svg(cat, h1, 'AREAS'))).png().toFile(png);
    console.log(`✅ HUB    ${c.padEnd(15)} ${h1}`);
    count++;
  }
  // Industry pages (all 7 cities)
  const cities = fs.readdirSync(AREAS).filter(d => fs.statSync(path.join(AREAS, d)).isDirectory());
  for (const c of cities) {
    const indDir = path.join(AREAS, c);
    const indEntries = fs.readdirSync(indDir).filter(d => fs.statSync(path.join(indDir, d)).isDirectory());
    for (const ind of indEntries) {
      const fp = path.join(indDir, ind, 'index.html');
      if (!fs.existsSync(fp)) continue;
      const { h1, eb } = extract(fp);
      const cat = eb;
      const png = path.join(indDir, ind, 'ogp.png');
      await sharp(Buffer.from(svg(cat, h1, '都市 × 業種'))).png().toFile(png);
      count++;
    }
  }
  console.log(`\n生成完了: ${count} 件`);
})();
