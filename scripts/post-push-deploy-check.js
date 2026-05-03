#!/usr/bin/env node
/**
 * scripts/post-push-deploy-check.js
 * v1.16 / 2026-05-03 / DEPLOY-3 拡張 (① v1.22 採用)
 *
 * 用途: git push 後の Cloudflare Workers Static Assets 本番配信を機械検証。
 *       pre-push hook (verify-all.js) は local 検査のみ → post-push (本番) を補完し
 *       二段階 machine gate を構成 (HSCEL §6.3 Tier 3 精神 / §0.0.10 厳格化原則)。
 *
 * 検査対象:
 *   1. sitemap.xml 列挙 全 URL → HTTP 200 確認
 *   2. dist/scripts/*.js 6 件 → HTTP 200 確認 (sitemap 列挙外 / .assetsignore 死角再発防止)
 *   3. dist/output.css → HTTP 200 確認
 *
 * 失敗時: 指数バックオフで retry → max-wait 超過で stderr アラート + exit 1
 *
 * 既定値:
 *   --initial-wait=60   初回 Cloudflare deploy 待機 (秒)
 *   --max-wait=300      総タイムアウト (秒) / 5 分
 *   --interval=15       retry 基本間隔 (秒) / 1.5 倍ずつ伸長
 *   --domain=tcharton.com
 *
 * 起源: ② v1.16 commit f825ff7 push 後 dist/scripts/*.js 6 件 404 検出
 *       真因: .assetsignore line 20 'scripts/' glob anchor 不在 (validateAssetsignoreAnchor で別途検出)
 *       本スクリプト: 上記真因に拘らず「push 後に何かが配信されない」全てを検出する汎用 gate
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.join(__dirname, '..');

// ─── 引数パース ───
const argv = process.argv.slice(2).reduce((acc, a) => {
  const m = a.match(/^--([^=]+)=(.+)$/);
  if (m) acc[m[1]] = m[2];
  return acc;
}, {});
const INITIAL_WAIT = parseInt(argv['initial-wait'] || '60', 10);
const MAX_WAIT     = parseInt(argv['max-wait']     || '300', 10);
const INTERVAL     = parseInt(argv['interval']     || '15', 10);
const DOMAIN       = (argv['domain'] || 'tcharton.com').replace(/^https?:\/\//, '').replace(/\/$/, '');

// Reviewer A-3 HIGH: 引数 validation (NaN / 負数)
if (![INITIAL_WAIT, MAX_WAIT, INTERVAL].every(v => Number.isFinite(v) && v >= 0)) {
  console.error('✗ 引数 不正: --initial-wait / --max-wait / --interval は非負の整数を指定');
  process.exit(1);
}

// ─── 検査 URL 構築 ───
function buildUrlList() {
  const urls = new Set();

  // 1. sitemap.xml 列挙
  const smPath = path.join(ROOT, 'sitemap.xml');
  if (fs.existsSync(smPath)) {
    const sm = fs.readFileSync(smPath, 'utf-8');
    const matches = sm.match(/<loc>([^<]+)<\/loc>/g) || [];
    matches.forEach(m => {
      const u = m.replace(/<\/?loc>/g, '').trim();
      if (u) urls.add(u);
    });
  }

  // 2. dist/scripts/*.js 6 件 (sitemap 列挙外)
  const scriptsDir = path.join(ROOT, 'dist', 'scripts');
  if (fs.existsSync(scriptsDir)) {
    fs.readdirSync(scriptsDir).filter(f => f.endsWith('.js')).forEach(f => {
      urls.add(`https://${DOMAIN}/dist/scripts/${f}`);
    });
  }

  // 3. dist/output.css
  if (fs.existsSync(path.join(ROOT, 'dist', 'output.css'))) {
    urls.add(`https://${DOMAIN}/dist/output.css`);
  }

  return [...urls];
}

// ─── HTTP HEAD 検査 ───
function check(url) {
  return new Promise(resolve => {
    const req = https.request(url, { method: 'HEAD', timeout: 10000 }, res => {
      resolve({ url, status: res.statusCode });
    });
    req.on('error',   err => resolve({ url, status: 0, err: err.message }));
    req.on('timeout', () => { req.destroy(); resolve({ url, status: 0, err: 'timeout' }); });
    req.end();
  });
}

// Reviewer A-2 HIGH: 3xx (301/302/308) は HEAD 段階では成功扱い (Cloudflare の正規化リダイレクト等)
const OK_STATUS = new Set([200, 301, 302, 308]);

async function checkBatch(urls) {
  const results = await Promise.all(urls.map(check));
  const failed = results.filter(r => !OK_STATUS.has(r.status));
  return { results, failed };
}

// ─── sleep ───
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ─── main ───
(async () => {
  const urls = buildUrlList();
  console.log(`▶ post-push-deploy-check / 対象 ${urls.length} URL / domain ${DOMAIN}`);
  console.log(`  initial-wait=${INITIAL_WAIT}s / max-wait=${MAX_WAIT}s / interval=${INTERVAL}s`);

  if (urls.length === 0) {
    console.error('✗ 検査対象 URL が 0 件 — sitemap.xml / dist/ の存在確認');
    process.exit(1);
  }

  console.log(`⏳ Cloudflare deploy 初回待機 ${INITIAL_WAIT}s ...`);
  await sleep(INITIAL_WAIT * 1000);

  // Reviewer A-1 CRITICAL: 経過時間は wall-clock (Date.now() - start) で判定
  // checkBatch 自体が遅延した場合 (timeout 多発等) も実時間で max-wait を厳守
  const start = Date.now();
  const elapsedSec = () => (Date.now() - start) / 1000 + INITIAL_WAIT;
  let attempt = 0;
  let lastFailed = [];

  while (elapsedSec() < MAX_WAIT) {
    attempt++;
    const { failed } = await checkBatch(urls);
    lastFailed = failed;

    if (failed.length === 0) {
      const elapsed = Math.round(elapsedSec());
      console.log(`✅ 全 ${urls.length} URL HTTP ${[...OK_STATUS].join('/')} 確認 (attempt ${attempt} / 経過 ${elapsed}s)`);
      process.exit(0);
    }

    const intvl = Math.min(INTERVAL * Math.pow(1.5, attempt - 1), 60);
    const remaining = MAX_WAIT - elapsedSec();
    if (remaining < intvl) break;

    console.log(`⚠ attempt ${attempt}: ${failed.length}/${urls.length} 失敗 — ${Math.round(intvl)}s 後 retry`);
    failed.slice(0, 3).forEach(f => console.log(`  ✗ ${f.status || 'ERR'} ${f.url}${f.err ? ' (' + f.err + ')' : ''}`));
    if (failed.length > 3) console.log(`  ... 他 ${failed.length - 3} 件`);

    await sleep(intvl * 1000);
  }

  // タイムアウト時
  console.error('');
  console.error('═══════════════════════════════════════════════════════════════════');
  console.error(`🚨 post-push-deploy-check 失敗 / max-wait ${MAX_WAIT}s 超過`);
  console.error(`  失敗 ${lastFailed.length}/${urls.length} URL / attempt ${attempt}:`);
  lastFailed.forEach(f => console.error(`    ${f.status || 'ERR'} ${f.url}${f.err ? ' (' + f.err + ')' : ''}`));
  console.error('═══════════════════════════════════════════════════════════════════');
  console.error('① への通知 + 真因調査要請:');
  console.error('  - .assetsignore glob anchor (validateAssetsignoreAnchor で並行検出可)');
  console.error('  - Cloudflare ダッシュボード Workers/Pages → Deployments → Latest 確認');
  console.error('  - wrangler CLI: wrangler pages deploy . で強制再 deploy');
  process.exit(1);
})();
