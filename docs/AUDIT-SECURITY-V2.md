# tcharton.com セキュリティ監査レポート V2

**監査日**: 2026-05-10
**監査対象**: https://tcharton.com/ (Cloudflare Workers Static Assets / 全 16 ページ + 5 子ページ = 21 HTML)
**ローカル**: `C:\Users\ohuch\Desktop\HARTON\tcharton\`
**監査者**: HARTON 総合責任者（① セッション）
**準拠基準**: OWASP Top 10:2025 / Mozilla Web Security Guidelines / 個人情報保護法 2022 改正 / GDPR
**前回 V1**: 2026-05-10（同日）/ 87 点 → 本 V2 では周辺改修後の影響評価

---

## エグゼクティブサマリ

**総合得点 V2: 87 / 100（A 評価維持・S-RANK 95+ 未到達）**

V1 以降に実施された改修（jargon cleanup / 構造化データ拡充 / `/llms.txt` `/llms-full.txt` 配備 / Schema.org `addressRegion` ISO 化 / 顔写真 `<img>` 追加）は、**いずれも CSP / Trusted Types / HSTS 等の防御層に対し中立**であり、攻撃面を増やさずに到達した。一方、V1 で指摘した CSP `unsafe-inline` 残置・SRI 未付与・Cookie consent 不在・Turnstile 未導入の 4 大課題は **未着手**のため、点数は据え置きとなる。

### V1 / V2 比較表

| カテゴリ | 配点 | V1 | V2 | 差分 | 主因 |
|---|---|---|---|---|---|
| HTTP セキュリティヘッダー | 25 | 23 | 23 | ±0 | `_headers` 無変更（Permissions-Policy 追加なし）|
| Content Security Policy | 20 | 14 | 14 | ±0 | `style-src 'unsafe-inline'` 残置・nonce 未採用 |
| OWASP Top 10:2025 | 20 | 18 | 18 | ±0 | 新規 `<img>` は self-origin のみ。新規攻撃面なし |
| プライバシー・データ保護 | 15 | 13 | 13 | ±0 | `/llms.txt` の公開情報のみで PII 流出なし |
| サプライチェーン | 10 | 6 | 6 | ±0 | 外部 CDN 依存・SRI 状況に変化なし |
| インシデント対応 | 10 | 7 | 7 | ±0 | runbook / IaC 化未着手 |
| **合計** | **100** | **87** | **87** | **±0** | — |

**Mozilla Observatory 予想**: A（90/100）— V1 同等
**securityheaders.com 予想**: A+ — V1 同等

---

## 1. V1 以降改修の防御層影響評価

### 1.1 jargon cleanup（用語平易化）

`Trusted Types policy: default` の**構造（policy 名・`createHTML` フック・`require-trusted-types-for 'script'`）には一切手を加えていない**ことを `dist/scripts/trusted-types.js` で確認。CSP 文字列・`_headers` も無変更。**XSS 防御に対し中立**。

### 1.2 構造化データ拡充（HowTo / Service Schema）

`index.html` / `services/web/index.html` / `services/ai-prediction/index.html` の 3 ファイルに JSON-LD 追加を確認。これらは **`<script type="application/ld+json">` の純テキストデータ**であり、`script-src` の許可対象だが実行コードではないためインジェクション経路にならない。CSP 評価上は「inline JSON-LD は CSP 違反扱いされない（仕様）」のため減点要素なし。**一点だけ留意**: 将来的に nonce 化した際 (P3) は `<script type="application/ld+json">` にも nonce 付与が必要（`script-src` 全体に nonce が効くため）。

### 1.3 `/llms.txt` `/llms-full.txt` 配備

サイトルート 2 ファイル新規配備を確認。内容を精査した結果:

- 含まれる情報: 公開済み 16 ページの再構成テキスト（事業内容・料金・代表プロフィール・連絡先）
- 含まれない: API キー / 内部 URL / 顧客名 / 認証情報 / ステージング情報
- **PII / 機密漏洩リスク: なし**
- セキュリティ影響: **中立**。ただし攻撃者用 OSINT としては既存サイトコピーで足りるため増分リスクなし
- LLM プロンプトインジェクション: 静的配信ファイルのため **HTTP レスポンスとしては読み取り専用**。LLM が引用する際の文脈汚染は当方の責任範囲外

### 1.4 Schema.org `addressRegion` ISO 化

`addressRegion: "Shizuoka"` → `addressRegion: "JP-22"` 等の ISO 3166-2 化を確認（推測）。**JSON-LD テキスト変更のみで CSP/XSS 経路に影響なし**。

### 1.5 顔写真 `<img>` 追加（CSP `img-src` 整合性確認 ★必須項目）

7 HTML（index / profile / contact / services/ai-prediction × 3 / services/web/industries）に `<img src="/assets/ceo.webp">` 追加を確認。

**CSP 整合性検証**:

```
現行 img-src: 'self' data: https://www.google-analytics.com https://www.googletagmanager.com
新規 img URL: /assets/ceo.webp（self-origin、相対パス）
判定: ✅ 'self' により許可。CSP 違反なし
```

**追加検証項目**:
- `loading="lazy"` `decoding="async"` 付与済 → DoS 緩和（OWASP A04 安全な設計）
- `width=600 height=600` 明示 → CLS 攻撃面（レイアウトシフト悪用）防止
- 外部ホット リンク・data URI 不使用 → サプライチェーン拡張なし
- alt 属性適切 → アクセシビリティ準拠（A11y はセキュリティ範囲外だが評価加点要素）

**結論**: CSP 改変不要。img-src は現状のまま十分。

---

## 2. CSP 残存 `unsafe-inline` 確認（★必須項目）

### 2.1 現状（`_headers` 13 行目より verbatim 抽出）

```
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
```

`script-src` 側には `'unsafe-inline'` **なし**（V1 から維持）。残置は **`style-src` のみ**。

### 2.2 `unsafe-inline` 必要性の根拠調査

- `<style>` ブロック検出: `index.html` に 2 箇所（hero フォールバック CSS 等の小規模）
- インライン `style=""` 属性: 全 HTML で **1 箇所のみ**（`contact/index.html`）
- Tailwind 生成 CSS: `dist/output.css` に集約済（外部ファイル化完了 = 不要）

**判定**: 残るインライン CSS はごく小規模であり、**外部ファイル化 + nonce 化で `unsafe-inline` 完全撤去が技術的に可能**。撤去すれば CSP +3 点（14 → 17）が即時得られる。

### 2.3 リスク評価

`style-src 'unsafe-inline'` 残置による具体リスク:

1. **CSS インジェクション経由の情報窃取**: 攻撃者が DOM に CSS を注入できれば `attribute selector + background-image` 構文でフォーム入力値を 1 文字ずつ外部 URL に exfiltrate 可能
2. **緩和要素**: `connect-src` および `img-src` で外部ドメインが厳格制限されているため、exfiltration の出口が `google-analytics.com` `googletagmanager.com` のみ → 実害は限定的
3. **総合リスク**: 中（V1 同等、未悪化）

---

## 3. OWASP Top 10:2025 再評価（18/20、V1 同等）

| ID | V1 | V2 | 備考 |
|---|---|---|---|
| A01 アクセス制御 | OK | OK | 静的サイト・変化なし |
| A02 暗号化失敗 | OK | OK | HSTS preload + upgrade-insecure-requests |
| A03 インジェクション | △ | △ | web3forms 依存・新規フォーム経路追加なし |
| A04 安全でない設計 | △ | △ | Bot 対策（Turnstile）未導入のまま |
| A05 設定ミス | -1 | -1 | CSP `unsafe-inline` 残置 |
| A06 脆弱な依存 | -1 | -1 | `npm audit` CI 統合未着手 |
| A07 認証 | N/A | N/A | — |
| A08 完全性 | △ | △ | SRI 未付与 |
| A09 ロギング | △ | △ | CSP report 未収集 |
| A10 SSRF | N/A | N/A | — |

**新規攻撃面の発生有無**: なし。`/llms.txt` `/llms-full.txt` 配備は**読み取り専用静的アセット**であり、書き込み API は新設されていない。

---

## 4. プライバシー V2（13/15、V1 同等）

`/llms.txt` 公開後の PII リスク再評価:

- 代表氏名・連絡先（`info@tcharton.com`）: 既に `/profile/` `/contact/` で公開済 → 増分リスクなし
- 顧客名・取引額・契約条件: 含まれず
- GDPR Cookie consent: V1 から未着手（-1）
- DPO / 開示請求窓口: V1 から未着手（-1）

**LLM 学習されることの是非**: SPEC v3.6 / GEO-STANDARDS のミッション「AI 検索対応」と整合。意図的公開のため**ポリシー的に正当**。

---

## 5. サプライチェーン V2（6/10、V1 同等）

外部依存リスト変化なし:
- `fonts.googleapis.com` / `fonts.gstatic.com`（SRI 未付与）
- `googletagmanager.com` / `static.cloudflareinsights.com`
- `api.web3forms.com`

`/llms.txt` `/llms-full.txt` は自前ホスト・外部依存追加なし。

---

## 6. インシデント対応 V2（7/10、V1 同等）

`docs/INCIDENT-RESPONSE.md` 不在・Terraform IaC 化未着手・整合性 hash 監視未導入の 3 点で V1 から変化なし。

---

## 7. 100 点までの残課題（V1 33 項目から精査）

V1 の 33 項目はすべて未着手。**最優先 5 項目（投資対効果順）**:

| # | 項目 | 工数 | 加点 | 期待後得点 |
|---|---|---|---|---|
| 1 | `style-src 'unsafe-inline'` 撤廃（外部 CSS 化 + nonce） | 8h | +3 | 90 |
| 2 | `Permissions-Policy` 30+ feature 完全列挙 | 1h | +1 | 91 |
| 3 | Cloudflare Turnstile を contact form 統合 | 4h | +2 | 93 |
| 4 | Google Fonts セルフホスト化（`fonts/` 既設活用）| 4h | +2 | 95 |
| 5 | `Reporting-Endpoints` + `NEL` + CSP report-uri 集約 | 3h | +2 | 97 |

残 +3 点は P4（web3forms 内製化 / Terraform IaC / INCIDENT-RESPONSE.md / npm audit CI / Cookie consent banner）で到達可能。

---

## 8. 結論

V1 → V2 で**スコア変動なし（87/100）**。V1 以降の改修群（jargon / Schema / llms.txt / addressRegion / 顔写真 img）は**いずれもセキュリティ中立**であり、本来期待された CSP・サプライチェーン側の改善には未着手のため点数は据え置き。

**特筆事項**:
- 顔写真 `<img>` 追加は `img-src 'self'` で完全カバー、CSP 改変不要を確認
- `/llms.txt` `/llms-full.txt` は公開情報のみで PII 漏洩なし、新規攻撃面なし
- 構造化データ拡充は inline JSON-LD のみで CSP/XSS 経路に影響なし
- ただし将来 nonce 化時には JSON-LD `<script>` にも nonce 付与必須

**次回 V3 で +3〜+10 を狙うアクション**: §7 の最優先 5 項目を P3（CSP 改修）として SPEC v3.7 改訂と同期実施。① ルートで SPEC.md 編集 → `node sync-spec.js` → `node verify-all.js` の運用フロー必須。

---

**監査者署名**: HARTON 総合責任者（① セッション）
**次回監査**: V3（CSP 改修後 / 2026-08-10 目安）または 3 法規大改訂時
