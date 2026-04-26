#!/usr/bin/env node
/**
 * アイコンビルダー
 * SVG ソースから 5 サイズの PNG を生成 → PWA / iOS ホーム画面 / Android 対応
 *
 * 使い方:
 *   node scripts/build-icons.js
 *
 * 生成物:
 *   favicon-16.png  (16×16)
 *   favicon-32.png  (32×32)
 *   apple-touch-icon.png (180×180) — iOS Safari ホーム画面
 *   icon-192.png    (192×192) — Android Chrome
 *   icon-512.png    (512×512) — PWA splash / 高解像度
 */

const sharp = require('sharp');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// 小サイズ用：シンプルな "T" のみ（視認性最優先）
const smallSVG = `
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <rect width="64" height="64" rx="14" ry="14" fill="#1B4965"/>
  <text x="32" y="48" text-anchor="middle"
        font-family="Inter, system-ui, sans-serif"
        font-weight="900" font-size="44" fill="#ffffff" letter-spacing="-1">T</text>
</svg>
`;

// 大サイズ用："T" + "T.C.HARTON" ブランドテキスト
const largeSVG = `
<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1B4965"/>
      <stop offset="100%" stop-color="#0F2E45"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" ry="112" fill="url(#bg)"/>

  <!-- 中央の大きな T -->
  <text x="256" y="310" text-anchor="middle"
        font-family="Inter, system-ui, sans-serif"
        font-weight="900" font-size="280" fill="#ffffff" letter-spacing="-8">T</text>

  <!-- アクセントライン -->
  <rect x="166" y="360" width="180" height="3" fill="#5FA8D3"/>

  <!-- ブランドテキスト -->
  <text x="256" y="420" text-anchor="middle"
        font-family="Inter, system-ui, sans-serif"
        font-weight="700" font-size="44" fill="#5FA8D3" letter-spacing="2">
    T.C.HARTON
  </text>
</svg>
`;

const targets = [
  { name: 'favicon-16.png',       size: 16,  source: smallSVG },
  { name: 'favicon-32.png',       size: 32,  source: smallSVG },
  { name: 'apple-touch-icon.png', size: 180, source: largeSVG },
  { name: 'icon-192.png',         size: 192, source: largeSVG },
  { name: 'icon-512.png',         size: 512, source: largeSVG },
];

(async () => {
  console.log('▶ アイコン PNG 生成開始');
  for (const t of targets) {
    const out = path.join(ROOT, t.name);
    await sharp(Buffer.from(t.source))
      .resize(t.size, t.size)
      .png({ compressionLevel: 9 })
      .toFile(out);
    const fs = require('fs');
    const stat = fs.statSync(out);
    console.log(`  ✅ ${t.name.padEnd(24)} ${t.size}×${t.size}  ${(stat.size/1024).toFixed(1)} KB`);
  }
  console.log('✅ 全 5 サイズ生成完了');
})().catch((e) => {
  console.error('❌ エラー:', e.message);
  process.exit(1);
});
