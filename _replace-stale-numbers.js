#!/usr/bin/env node
/**
 * _replace-stale-numbers.js — v3.9.8 実測値への一括整合
 *
 * 代表 2026-05-17 指示: 古い数値主張 (902/5.3 倍/17 点 等) を最新 scanner v3.9.8
 * (沼津 12 業種 166 社) 実測値に置換。
 *
 * 置換テーブル:
 *   倍率: 5.3 倍 / 5.0 倍 / 3.8 倍 → 1.3 倍
 *   母集団: 902 (件/社) → 166 (件/社)、171 (社) → 166 (社)
 *   中央値: 17 / 18 点 (一般文脈) → 業界平均 72 点
 *   NG 件数: 277 (社) → 52 (社)、56 (社) → 52 (社)
 *   NG 率: 30.7% / 32.7% → 31.3%
 *   業種数: 11 業種 → 12 業種
 *   都市範囲: 静岡県内 5 都市 → 沼津市内
 *   max 点: 52 点 (業界 max) → 94 点
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

function walk(dir, out=[]) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (['node_modules', '.git', '.claude'].includes(e.name)) continue;
      walk(p, out);
    } else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const files = walk(ROOT);
let touched = 0;

for (const f of files) {
  let c = fs.readFileSync(f, 'utf-8');
  const orig = c;

  // 順序重要: 長い特殊パターンから先

  // ────────── 詳細パターン (具体的フレーズ) ──────────
  // 「静岡県内 5 都市（沼津・三島・富士・静岡・浜松）の中小企業 902 社を 11 業種にわたり」
  c = c.replace(/静岡県内\s*5\s*都市（沼津・三島・富士・静岡・浜松）の中小企業\s*902\s*社を\s*11\s*業種にわたり/g,
                '沼津市内の中小企業 166 社を 12 業種にわたり');
  c = c.replace(/静岡県内\s*5\s*都市（沼津・三島・富士・静岡・浜松）11\s*業種\s*902\s*社/g,
                '沼津市内 12 業種 166 社');
  c = c.replace(/静岡県内\s*5\s*都市（沼津・三島・富士・静岡・浜松）/g, '沼津市内');
  c = c.replace(/静岡県内\s*5\s*都市/g, '沼津市内');
  c = c.replace(/静岡県\s*5\s*都市/g, '沼津市内');
  c = c.replace(/静岡県東部の中小企業\s*WEB\s*サイト/g, '沼津市内 12 業種 中小企業 WEB サイト');

  // 業界中央値 X 点 vs 上位水準 90 点超 = Y 倍ギャップ
  c = c.replace(/業界中央値\s*17\s*点\s*vs\s*上位水準\s*90\s*点超\s*=\s*5\.3\s*倍ギャップ/g,
                '業界平均 72 点 vs HARTON 95 点超 = 1.3 倍ギャップ');
  c = c.replace(/業界中央値\s*17\s*点を\s*40-60\s*点に持ち上げる/g,
                '業界平均 72 点を 90 点以上 (HARTON Certified) に持ち上げる');
  c = c.replace(/中央値\s*17\s*点はどう解釈/g, '業界平均 72 点はどう解釈');
  c = c.replace(/業界\s*max\s*52\s*点・中央値\s*17\s*点/g, '業界 max 94 点・平均 72 点');

  // 902 社中 / 件中 詳細パターン
  c = c.replace(/902\s*社中\s*212\s*社（23\.5%）/g, '166 社中 (再集計予定)');
  c = c.replace(/902\s*社中\s*49\s*社（5\.4%）/g, '166 社中 15 社（9.0%）');
  c = c.replace(/902\s*社中\s*43\s*社（4\.8%）/g, '166 社中 13 社（7.8%）');
  c = c.replace(/902\s*社中\s*27\s*社（3\.0%）/g, '166 社中 (再集計予定)');

  c = c.replace(/277\s*社\s*\/\s*902\s*社\s*=\s*30\.7%/g, '52 社 / 166 社 = 31.3%');
  c = c.replace(/277\s*件\s*\/\s*902\s*件/g, '52 件 / 166 件');
  c = c.replace(/32\.7%（56\s*社\s*\/\s*171\s*社）/g, '31.3%（52 社 / 166 社）');

  // 沼津市内 171 社 (12 業種：...) の中央値は 18 点（県 5 都市中央値 17 点とほぼ同等）...
  c = c.replace(/沼津市内\s*171\s*社（12\s*業種：[^）]*）の中央値は\s*<strong[^>]*>18\s*点<\/strong>（県\s*5\s*都市中央値\s*17\s*点とほぼ同等）。最高得点は\s*51\s*点、致命的\s*NG\s*は\s*32\.7%（56\s*社\s*\/\s*171\s*社）。当社の自社サイト\s*tcharton\.com\s*は\s*HARTON\s*機械検証で\s*<strong[^>]*>90\s*点（★★★\s*S-Class）<\/strong>を達成しており、地元中央値との差は\s*<strong[^>]*>5\.0\s*倍<\/strong>（90\s*÷\s*18）です。/g,
                '沼津市内 166 社（12 業種）の業界平均は <strong class="text-dark-900">72 点</strong>。最高得点は 94 点、致命的 NG は 31.3%（52 社 / 166 社）。当社の自社サイト tcharton.com は ④ scanner v3.9.1 (PSI verbatim 3 回平均) で <strong class="text-dark-900">95.3 点（★ HARTON Certified）</strong>を達成しており、業界平均との差は <strong class="text-dark-900">1.3 倍</strong>（95.3 ÷ 72）です。');

  // ────────── 一般パターン (フォールバック) ──────────
  // 倍率
  c = c.replace(/業界中央値の\s*5\.3\s*倍品質/g, '業界平均の 1.3 倍品質');
  c = c.replace(/業界平均\s*3\.8\s*倍品質/g, '業界平均 1.3 倍品質');
  c = c.replace(/業界平均\s*5\.0\s*倍品質/g, '業界平均 1.3 倍品質');
  c = c.replace(/5\.3\s*倍/g, '1.3 倍');
  c = c.replace(/3\.8\s*倍/g, '1.3 倍');
  c = c.replace(/5\.0\s*倍/g, '1.3 倍');

  // 母集団
  c = c.replace(/静岡県\s*902\s*社の/g, '沼津市 166 社の');
  c = c.replace(/静岡県\s*<strong[^>]*>902\s*件<\/strong>調査/g, '沼津市 <strong class="text-dark-900">166 件</strong>調査');
  c = c.replace(/静岡県\s*902\s*件調査/g, '沼津市 166 件調査');
  c = c.replace(/902\s*社/g, '166 社');
  c = c.replace(/902\s*件/g, '166 件');
  c = c.replace(/171\s*社/g, '166 社');
  c = c.replace(/56\s*社/g, '52 社');
  c = c.replace(/277\s*社/g, '52 社');
  c = c.replace(/277\s*件/g, '52 件');

  // 中央値 (一般)
  c = c.replace(/中央値\s*17\s*点/g, '業界平均 72 点');
  c = c.replace(/中央値\s*18\s*点/g, '業界平均 72 点');

  // NG 率
  c = c.replace(/30\.7%/g, '31.3%');
  c = c.replace(/32\.7%/g, '31.3%');

  // 業種数
  c = c.replace(/11\s*業種\s*902/g, '12 業種 166');
  c = c.replace(/11\s*業種\s*166/g, '12 業種 166');

  // 連続改行整理
  c = c.replace(/\n{3,}/g, '\n\n');

  if (c !== orig) {
    fs.writeFileSync(f, c, 'utf-8');
    touched++;
  }
}

console.log(`stale numbers 一括整合完了: ${touched} files updated`);
