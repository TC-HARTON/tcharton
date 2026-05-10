# tcharton.com セキュリティ監査レポート

**監査日**: 2026-05-10
**監査対象**: https://tcharton.com/ (Cloudflare Workers Static Assets)
**ローカル**: `C:\Users\ohuch\Desktop\HARTON\tcharton\`
**監査者**: HARTON 総合責任者 (① セッション)
**準拠基準**: OWASP Top 10:2025 / Mozilla Web Security Guidelines / 個人情報保護法 2022 改正 / GDPR

---

## エグゼクティブサマリ

**総合得点: 87 / 100 (A 評価 / S-RANK 基準は 95+)**

| カテゴリ | 配点 | 取得点 | 主要評価 |
|---|---|---|---|
| HTTP セキュリティヘッダー | 25 | 23 | 主要ヘッダ完備、COEP `credentialless` 採用妥当 |
| Content Security Policy | 20 | 14 | `style-src 'unsafe-inline'` 残置 / nonce 未採用 |
| OWASP Top 10:2025 | 20 | 18 | 静的サイトのため A03/A07/A08 該当少。A05/A06 で減点 |
| プライバシー・データ保護 | 15 | 13 | DNT 対応・privacy.html 完備。Cookie consent UI 不在 |
| サプライチェーン | 10 | 6 | 外部 CDN への SRI 未付与 / web3forms 第三者依存 |
| インシデント対応 | 10 | 7 | Cloudflare ログ依存・改ざん検知の能動仕組み無し |

**Mozilla Observatory 予想**: A (90/100) — `unsafe-inline` 残置で A+ (115) 未達
**securityheaders.com 予想**: A+ (主要 7 ヘッダ揃) — Report-Only/Reporting API 追加で満点

---

## 1. HTTP セキュリティヘッダー (23/25)

### 1.1 現状 (`_headers` 抜粋)

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=(), browsing-topics=()
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: credentialless
Cross-Origin-Resource-Policy: same-origin
```

**評価**: HSTS preload は登録済 (MEMORY 確認)。COEP `credentialless` は GA4/CF Insights を許容しつつ強度確保で妥当。

### 1.2 減点要因

- **-1 点**: `Reporting-Endpoints` / `Report-To` ヘッダ未設定 → CSP/COEP/Deprecation 違反の自動収集ができず、運用上の盲点
- **-1 点**: `Permissions-Policy` に `payment=()`, `usb=()`, `serial=()`, `bluetooth=()`, `accelerometer=()`, `gyroscope=()`, `magnetometer=()`, `clipboard-read=()`, `xr-spatial-tracking=()`, `unload=()` が抜け
- **-0**: `Cache-Control: no-store` が認証関連ページに不要 (該当なしのため減点なし)

### 1.3 改善版ヘッダー (推奨)

```
/*
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  Content-Security-Policy: <下記 §2.4 参照>
  Content-Security-Policy-Report-Only: <strict-dynamic + nonce 試験>
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: accelerometer=(), ambient-light-sensor=(), autoplay=(), battery=(), camera=(), clipboard-read=(), clipboard-write=(self), display-capture=(), document-domain=(), encrypted-media=(), fullscreen=(self), gamepad=(), geolocation=(), gyroscope=(), hid=(), idle-detection=(), interest-cohort=(), browsing-topics=(), local-fonts=(), magnetometer=(), microphone=(), midi=(), otp-credentials=(), payment=(), picture-in-picture=(), publickey-credentials-create=(), publickey-credentials-get=(), screen-wake-lock=(), serial=(), speaker-selection=(), storage-access=(), unload=(), usb=(), web-share=(), window-management=(), xr-spatial-tracking=()
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Embedder-Policy: credentialless
  Cross-Origin-Resource-Policy: same-origin
  Reporting-Endpoints: csp="https://tcharton.com/_csp-report", default="https://tcharton.com/_report"
  Report-To: {"group":"csp","max_age":10886400,"endpoints":[{"url":"https://tcharton.com/_csp-report"}]}
  NEL: {"report_to":"default","max_age":31536000,"include_subdomains":true}
  Clear-Site-Data: (※ ログアウト時のみ — 該当なし)
  X-Permitted-Cross-Domain-Policies: none
  X-DNS-Prefetch-Control: off
```

---

## 2. Content Security Policy (14/20)

### 2.1 現状 CSP

```
default-src 'self';
script-src 'self' https://www.googletagmanager.com https://static.cloudflareinsights.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: https://www.google-analytics.com https://www.googletagmanager.com;
connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://cloudflareinsights.com;
frame-src 'none'; object-src 'none'; base-uri 'self';
form-action 'self' https://api.web3forms.com;
frame-ancestors 'none';
require-trusted-types-for 'script'; trusted-types default;
upgrade-insecure-requests
```

### 2.2 良好点

- `object-src 'none'` / `frame-ancestors 'none'` / `base-uri 'self'` 完備
- `require-trusted-types-for 'script'` + `trusted-types default` ポリシー実装済 (`/dist/scripts/trusted-types.js`)
- inline `<script>` を 21 HTML から外部化済 (v1.15)

### 2.3 減点要因

- **-3 点**: `style-src 'unsafe-inline'` 残置 — Tailwind/`<style>` ブロック由来の inline CSS 注入を許容。XSS 経由 CSS exfiltration (CSS injection attack) 余地
- **-2 点**: `script-src` に `'strict-dynamic'` および nonce/hash 不採用 — ホワイトリスト方式は CDN 経由 XSS バイパスに脆弱 (Google Web.dev の評価で "host allowlist is not strict")
- **-1 点**: `connect-src` に `https://api.web3forms.com` が抜け (form-action では POST 可だが fetch fallback で違反)

### 2.4 推奨 CSP (満点版)

ビルド時に nonce 注入する前提で:

```
Content-Security-Policy:
  default-src 'none';
  script-src 'self' 'nonce-{RANDOM}' 'strict-dynamic';
  style-src 'self' 'nonce-{RANDOM}';
  style-src-elem 'self' 'nonce-{RANDOM}' https://fonts.googleapis.com;
  style-src-attr 'none';
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https://www.google-analytics.com https://www.googletagmanager.com;
  connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://cloudflareinsights.com https://api.web3forms.com;
  frame-src 'none'; object-src 'none'; media-src 'none'; worker-src 'self';
  manifest-src 'self';
  base-uri 'none';
  form-action 'self' https://api.web3forms.com;
  frame-ancestors 'none';
  require-trusted-types-for 'script'; trusted-types default 'allow-duplicates';
  upgrade-insecure-requests;
  block-all-mixed-content;
  report-uri https://tcharton.com/_csp-report;
  report-to csp;
```

### 2.5 nonce 注入実装 (Cloudflare Workers サンプル)

`_headers` だけでは nonce 動的化不可。Workers `fetch` イベントで HTMLRewriter:

```js
export default {
  async fetch(request, env) {
    const nonce = btoa(crypto.getRandomValues(new Uint8Array(16)));
    const response = await env.ASSETS.fetch(request);
    if (!response.headers.get('content-type')?.includes('text/html')) return response;
    const rewritten = new HTMLRewriter()
      .on('script', { element: e => e.setAttribute('nonce', nonce) })
      .on('style',  { element: e => e.setAttribute('nonce', nonce) })
      .on('link[rel="stylesheet"]', { element: e => e.setAttribute('nonce', nonce) })
      .transform(response);
    const headers = new Headers(rewritten.headers);
    headers.set('Content-Security-Policy',
      headers.get('Content-Security-Policy').replaceAll('{RANDOM}', nonce));
    return new Response(rewritten.body, { status: rewritten.status, headers });
  }
};
```

---

## 3. OWASP Top 10:2025 対応 (18/20)

| ID | リスク | 対応状況 | 評価 |
|---|---|---|---|
| A01 アクセス制御 | 静的サイトに認証ロジックなし。`base-uri 'self'` + `frame-ancestors 'none'` で UI redress 防御 | OK |
| A02 暗号化失敗 | HTTPS 強制 (HSTS preload) + `upgrade-insecure-requests` | OK |
| A03 インジェクション | フォーム → web3forms API へ POST。サーバ側エスケープは web3forms 側依存。XSS は Trusted Types で防御 | △ web3forms 依存 |
| A04 安全でない設計 | フォーム CAPTCHA は `botcheck` honeypot のみ。reCAPTCHA / Turnstile 未導入 | △ Bot 対策弱 |
| A05 セキュリティ設定ミス | CSP `unsafe-inline` 残置、nonce 未採用 | **-1** |
| A06 脆弱な依存 | `tailwindcss` `sharp` のみ devDeps。ランタイム依存なし。`npm audit` 未自動化 | **-1** |
| A07 認証失敗 | 認証機能なし | N/A |
| A08 完全性失敗 | 外部 fonts.googleapis.com / web3forms に **SRI 未付与** (CSS は SRI 不可だが script は要対応) | △ |
| A09 ロギング不足 | Cloudflare 標準ログのみ。CSP report 未収集 | △ |
| A10 SSRF | 静的サイト。該当なし | N/A |

### 3.1 必須改善

1. `<form>` 送信前に **Cloudflare Turnstile** 検証を挟む (web3forms は Turnstile 連携公式サポート)
2. `npm audit --production` を pre-push hook に追加
3. CSP report を Cloudflare Workers `_csp-report` エンドポイントで集約

---

## 4. プライバシー・データ保護 (13/15)

### 4.1 現状

- `/privacy/` に個人情報保護法 2022 改正準拠ポリシー完備
- GA4 は DNT 対応 (`/dist/scripts/ga4.js`、privacy.html §6 公約)
- contact form: SSL/TLS 通知 + プライバシーポリシー同意文言あり (line 287)
- `Permissions-Policy: interest-cohort=()` `browsing-topics=()` で FLoC/Topics API 拒否

### 4.2 減点

- **-1 点**: GDPR 厳密適用域 (EU からのアクセス) で **Cookie consent banner 未実装**。GA4 を DNT 以外でも初期 OFF にするか、IAB TCF v2.2 framework / Cloudflare Zaraz Consent Manager 推奨
- **-1 点**: 開示請求フォーム / DPO 連絡先が `/privacy/` に明記されていれば+。保有期間 (retention period) 表記の確認推奨
- フォームの **hidden access_key (web3forms)** はクライアント露出が前提の設計だが、悪用 (なりすまし送信) リスクあり → Turnstile 必須

### 4.3 改善

```html
<!-- privacy.html に追加推奨 -->
<section id="data-retention">
  <h2>保有期間</h2>
  <p>お問い合わせ情報: 受領から 3 年間保管後、自動削除。</p>
  <p>GA4 ログ: Google 側 14ヶ月設定。</p>
  <p>Cloudflare アクセスログ: 30 日。</p>
</section>
<section id="dsr">
  <h2>開示・訂正・削除請求</h2>
  <p>info@tcharton.com 宛に「開示請求」と明記してご連絡ください。30 日以内に対応します。</p>
</section>
```

---

## 5. サプライチェーン (6/10)

### 5.1 現状

- `package.json`: `tailwindcss ^3.4.0` / `sharp ^0.34.5` (devDeps のみ、ランタイム影響なし)
- 外部 CDN: `fonts.googleapis.com`, `fonts.gstatic.com`, `googletagmanager.com`, `static.cloudflareinsights.com`, `api.web3forms.com`

### 5.2 減点

- **-2 点**: 外部 `<link rel="stylesheet" href="https://fonts.googleapis.com/...">` に **SRI なし**。Google Fonts の CSS は動的でハッシュ困難だが、ローカル fonts/ 自前ホストへ移行可能 (`fonts/` ディレクトリ既設)
- **-1 点**: `package-lock.json` の lockfile 整合性検証 (`npm ci`) が CI で未強制
- **-1 点**: web3forms (第三者 SaaS) への完全依存。ベンダーロック・データ漏洩責任分界が不明

### 5.3 改善

1. **Google Fonts セルフホスト化**: `fonts/` 既設なので CSS+WOFF2 全部ローカル化 → CSP から `fonts.googleapis.com` `fonts.gstatic.com` 完全削除可能
2. **依存固定**: `package.json` で `^` を `~` または完全 pin に変更 (devDeps でも reproducible build)
3. **`npm audit` + `osv-scanner`** を `verify-all.js` に組込
4. **web3forms → Cloudflare Workers + R2 + Email Routing** で内製化、第三者依存解消

---

## 6. インシデント対応 (7/10)

### 6.1 現状

- Cloudflare Workers `observability.enabled: true` でログ収集
- Git によるバージョン管理 + pre-push hook による S-RANK ゲート
- `_redirects` 不整合検出は spec-checker.js で 2554 項目検証

### 6.2 減点

- **-1 点**: 改ざん検知が能動的でない。Cloudflare の deployment hash と production 配信 hash の差分を `scripts/post-push-deploy-check.js` 以上に頻度高く検査する仕組みなし
- **-1 点**: バックアップ戦略文書なし (Git は SCM であってバックアップではない)。Cloudflare 設定の Terraform 化推奨
- **-1 点**: インシデント対応 runbook 未整備 (`docs/INCIDENT-RESPONSE.md` 不在)

### 6.3 改善

1. **Cloudflare Notifications** で deploy 失敗 / WAF イベント / 急なトラフィック異常 → Email/Slack 通知
2. **外形監視**: UptimeRobot or Cloudflare Health Checks で `/`, `/contact/`, `/privacy/` 5 分間隔
3. **整合性監視**: 週次 cron で `index.html` SHA256 を Notion DB に記録、差分時 alert

---

## 7. 100 点到達のための改善項目 (33 項目)

### CSP / Headers (1-10)
1. `style-src 'unsafe-inline'` 撤廃 → nonce 化
2. `script-src` に `'strict-dynamic'` + nonce 導入
3. Cloudflare Workers HTMLRewriter で nonce 動的注入実装
4. `Reporting-Endpoints` + `Report-To` ヘッダ追加
5. `NEL` (Network Error Logging) ヘッダ追加
6. `Permissions-Policy` を 30+ feature まで完全列挙
7. `X-Permitted-Cross-Domain-Policies: none` 追加
8. `X-DNS-Prefetch-Control: off` 追加
9. `connect-src` に `api.web3forms.com` 追加
10. CSP `default-src 'none'` へ最小化、各 directive 個別指定

### XSS / Injection (11-15)
11. Trusted Types policy を `default` から **page-specific** に分離 (`createHTML` rejection)
12. `style-src-attr 'none'` で inline `style=""` 全面禁止
13. `manifest-src 'self'` 追加
14. `worker-src 'self'` 追加
15. CSP report-uri へ違反集約 (Cloudflare Workers `/_csp-report`)

### サプライチェーン (16-21)
16. Google Fonts セルフホスト化 (fonts.googleapis.com 削除)
17. `script` タグ全件 SRI 付与 (内部 `/dist/` 含めビルド時生成)
18. `npm audit` を pre-push hook 統合
19. `osv-scanner` を CI 追加
20. Dependabot / Renovate 有効化
21. web3forms → Workers 内製フォーム化 (R2 + Email Routing)

### プライバシー (22-26)
22. Cookie consent banner (Cloudflare Zaraz Consent Manager) 導入
23. GDPR Art.13 通知文言の `/privacy/` 追加
24. データ保有期間表記 (`/privacy/` §保有期間)
25. 開示請求フォーム or 専用窓口の明記
26. GA4 IP 匿名化 + Google signals OFF 確認

### Bot / Abuse (27-29)
27. Cloudflare Turnstile を contact form に統合
28. Cloudflare Rate Limiting Rules: `/contact/` POST → 1分5回
29. Cloudflare Bot Fight Mode: ON 確認

### 監視 / 対応 (30-33)
30. `docs/INCIDENT-RESPONSE.md` 作成 (RTO/RPO/Severity matrix)
31. `terraform/` で Cloudflare 設定 IaC 化 (Workers / DNS / WAF / Pages)
32. 週次外形監視 + 整合性 hash 検査 cron
33. Cloudflare WAF Custom Rules: SQLi/XSS/Path traversal 強制 ON

---

## 8. Cloudflare Workers 推奨設定 (推測ベース)

```jsonc
// wrangler.jsonc 拡張案
{
  "name": "tcharton",
  "compatibility_date": "2026-05-03",
  "observability": { "enabled": true, "head_sampling_rate": 1.0 },
  "assets": { "directory": ".", "html_handling": "auto-trailing-slash", "not_found_handling": "404-page" },
  "compatibility_flags": ["nodejs_compat"],
  "limits": { "cpu_ms": 50 },
  "placement": { "mode": "smart" }
}
```

WAF Custom Rules (Dashboard 設定):
- `(http.request.uri.path contains "/wp-admin")` → Block
- `(http.request.uri.path contains "..")` → Block (path traversal)
- `(cf.threat_score gt 14)` → Managed Challenge

---

## 9. ヘッダー設定サンプル (満点版 `_headers`)

```
/*
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: accelerometer=(),ambient-light-sensor=(),autoplay=(),battery=(),camera=(),clipboard-read=(),clipboard-write=(self),display-capture=(),encrypted-media=(),fullscreen=(self),gamepad=(),geolocation=(),gyroscope=(),hid=(),idle-detection=(),interest-cohort=(),browsing-topics=(),local-fonts=(),magnetometer=(),microphone=(),midi=(),otp-credentials=(),payment=(),picture-in-picture=(),publickey-credentials-create=(),publickey-credentials-get=(),screen-wake-lock=(),serial=(),speaker-selection=(),storage-access=(),unload=(),usb=(),web-share=(),window-management=(),xr-spatial-tracking=()
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Embedder-Policy: credentialless
  Cross-Origin-Resource-Policy: same-origin
  X-Permitted-Cross-Domain-Policies: none
  X-DNS-Prefetch-Control: off
  Reporting-Endpoints: csp="https://tcharton.com/_csp-report"
  NEL: {"report_to":"csp","max_age":31536000,"include_subdomains":true}
  X-Robots-Tag: index, follow
```

CSP 本体は Workers で nonce 注入のため `_headers` ではなく `fetch` ハンドラで動的設定。

---

## 10. 結論と次アクション

**現状 87/100 (A) → 100/100 (S+) への到達ロードマップ**:

| Phase | 項目 | 工数 | 加点 |
|---|---|---|---|
| **P1** (即日) | `_headers` 拡張 (項目 4-9, 22-25) | 2h | +3 |
| **P2** (1 週) | Google Fonts セルフホスト化 + SRI 付与 | 4h | +3 |
| **P3** (2 週) | Cloudflare Workers nonce + strict-dynamic CSP | 8h | +4 |
| **P4** (1 月) | Turnstile 導入 + web3forms 内製化 + Consent Manager | 16h | +3 |

**SPEC §11 / §12.11 整合**: 上記改善はすべて 3 法規 (SPEC v3.6 §8 / GOOGLE-STANDARDS §11.1-11.3 / GEO-STANDARDS) 改訂を伴う。① ルートで SPEC.md 編集 → `node sync-spec.js` → `node verify-all.js` の運用フロー必須。

**最優先 3 件**:
1. CSP `unsafe-inline` 撤廃 (P3) — Mozilla Observatory A → A+
2. Cloudflare Turnstile (P4) — フォーム悪用防止
3. Google Fonts セルフホスト (P2) — サプライチェーン縮小 + プライバシー向上 (EU IP の Google 露出排除)

---

**監査者署名**: HARTON 総合責任者 (① セッション)
**次回監査**: 2026-08-10 (3ヶ月後) または 3 法規大改訂時
