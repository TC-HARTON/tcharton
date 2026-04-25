#!/usr/bin/env node
/**
 * OGP 画像ビルダー
 * hero-fuji.jpg → 1200×630 にクロップ → 暗グラデーション + ブランドテキスト合成 → ogp.png
 *
 * 使い方:
 *   node scripts/build-ogp.js
 */

const sharp = require('sharp');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const HERO = path.join(ROOT, 'assets', 'hero-fuji.jpg');
const OUT = path.join(ROOT, 'ogp.png');

const W = 1200;
const H = 630;

const overlaySVG = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="dark" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="#0F172A" stop-opacity="0.92"/>
      <stop offset="55%"  stop-color="#1B4965" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#1B4965" stop-opacity="0.10"/>
    </linearGradient>
    <linearGradient id="bot" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"  stop-color="#0F172A" stop-opacity="0"/>
      <stop offset="100%" stop-color="#0F172A" stop-opacity="0.6"/>
    </linearGradient>
  </defs>

  <!-- グラデーションオーバーレイ -->
  <rect width="${W}" height="${H}" fill="url(#dark)"/>
  <rect width="${W}" height="${H}" fill="url(#bot)"/>

  <!-- ブランドアクセントライン -->
  <rect x="80" y="180" width="6" height="120" fill="#5FA8D3"/>

  <!-- ブランド名 -->
  <text x="110" y="230" font-family="'Helvetica Neue','Arial',sans-serif" font-size="64" font-weight="900" fill="#FFFFFF" letter-spacing="-1">
    T.C.HARTON
  </text>

  <!-- サブタイトル英文 -->
  <text x="110" y="270" font-family="'Helvetica Neue','Arial',sans-serif" font-size="20" font-weight="700" fill="#5FA8D3" letter-spacing="3">
    PROFESSIONAL WEB &amp; AI
  </text>

  <!-- メイン訴求 -->
  <text x="80" y="380" font-family="'Hiragino Sans','Yu Gothic','Meiryo',sans-serif" font-size="44" font-weight="800" fill="#FFFFFF">
    Sクラス保証付き
  </text>
  <text x="80" y="440" font-family="'Hiragino Sans','Yu Gothic','Meiryo',sans-serif" font-size="44" font-weight="800" fill="#FFFFFF">
    買い切り型 WEB 構築
  </text>

  <!-- サブ訴求 -->
  <text x="80" y="490" font-family="'Hiragino Sans','Yu Gothic','Meiryo',sans-serif" font-size="22" font-weight="500" fill="#CBD5E1">
    保守運用 / AI 予測モデル開発も対応
  </text>

  <!-- フッター: 対応エリア + URL -->
  <text x="80" y="570" font-family="'Hiragino Sans','Yu Gothic','Meiryo',sans-serif" font-size="18" font-weight="500" fill="#94A3B8">
    静岡県東部・全国オンライン対応
  </text>
  <text x="${W - 80}" y="570" text-anchor="end" font-family="'Helvetica Neue','Arial',sans-serif" font-size="22" font-weight="700" fill="#5FA8D3" letter-spacing="1">
    tcharton.com
  </text>
</svg>
`;

(async () => {
  console.log('▶ OGP 画像生成開始');
  console.log(`  入力: ${HERO}`);
  console.log(`  出力: ${OUT}`);
  console.log(`  寸法: ${W}×${H}`);

  // hero-fuji.jpg を 1200×630 cover フィット
  const baseBuf = await sharp(HERO)
    .resize(W, H, { fit: 'cover', position: 'center' })
    .toBuffer();

  // SVG オーバーレイを合成
  await sharp(baseBuf)
    .composite([{ input: Buffer.from(overlaySVG), top: 0, left: 0 }])
    .png({ compressionLevel: 9, quality: 90 })
    .toFile(OUT);

  const stat = await sharp(OUT).metadata();
  const fs = require('fs');
  const size = fs.statSync(OUT).size;
  console.log(`✅ 生成完了`);
  console.log(`  寸法: ${stat.width}×${stat.height}`);
  console.log(`  形式: ${stat.format}`);
  console.log(`  サイズ: ${(size / 1024).toFixed(1)} KB`);
})().catch((e) => {
  console.error('❌ エラー:', e.message);
  process.exit(1);
});
