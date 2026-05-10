# tcharton.com SEO 厳格再評価 V6（100 点満点）

**評価日**: 2026-05-10
**評価対象**: 全 21 HTML（main 16 + 深層 3 + 404 + thanks）+ sitemap.xml
**評価者**: ① HARTON 総合責任者
**評価方針**: ② 子セッションが「P0 修正完了」と claim した内容を、ローカル正本（= production deploy 元）+ 本番 sitemap fetch にて全数再検証。手抜き禁止 / 言い訳禁止 / 計測ベース。
**スコア推移**: V1 88 → V2 94 → V3 97 → V4 99（② self-claim・虚偽） → V5 89（① 厳格 / P0 露見） → **V6 96/100**（P0 三件全治癒・P1 一部残存）

---

## 0. エグゼクティブサマリー — V5 P0 は全て真に治癒

V5 で告発した P0 三件（深層 3 ページ canonical / sitemap 欠落 / Breadcrumb position 3 item）について、本 V6 監査は **ローカル正本 21 ファイル全数 grep + 本番 sitemap.xml curl 取得** にて再検証した。結論：**② の「P0 修正完了」claim は事実**である。手抜きの再発は認めない。ただし V5 で指摘した P1 のうち 2 件が未着手で、ここに ② の優先順位判断ミスが残る。

### 検証結果 3 行サマリ
1. **P0-1（canonical 自己参照）**: 深層 3 ページとも自身の URL を指す canonical / og:url を保持 → **治癒**
2. **P0-2（sitemap 19 URL）**: 本番 https://tcharton.com/sitemap.xml を fetch、19 url 全件確認 → **治癒**
3. **P0-3（Breadcrumb position 3 item）**: 4 深層階層（ai-prediction 親含む）の position:3 item が全て自身 URL → **治癒**

加えて V5 で指摘した legal/privacy の JSON-LD 不在を WebPage + BreadcrumbList で補填（2 ブロック / ファイル × 2 = 4 ブロック追加）→ 治癒。

---

## 1. V5 → V6 スコア再評価表（V5 比較必須）

| カテゴリ | 配点 | V4 ② 虚偽 | **V5 厳格** | **V6 厳格** | V5→V6 差 | 主因（V6 時点） |
|---|---|---|---|---|---|---|
| Technical SEO | 25 | 25 | 20 | **24** | **+4** | P0 三件治癒。−1 は深層ページ TTFB / Core Web Vitals 実測未提示 |
| On-page SEO | 25 | 25 | 23 | **24** | **+1** | og:url 自己参照化で SNS シェア健全化。−1 は services/lp/ refurbish/ の og:image が共通 ogp.png（プラン固有 OGP 未生成） |
| Content SEO | 20 | 20 | 18 | **19** | **+1** | 深層 3 ページが index 可能化 + methodology TechArticle 化（V5 P1-2 治癒）。−1 は cases/ CaseStudy schema 不在（V5 P1-3 残存）+ 公開事例 1 件のみ |
| Local SEO | 15 | 15 | 14 | **15** | **+1** | 「沼津 + 業種」long-tail が深層 3 ページ復活で取り戻し。Person.address JP-22 維持 |
| Off-page 準備 | 10 | 9 | 9 | **9** | ±0 | 実被リンク 0 据え置き。/llms.txt + sameAs 5 本維持 |
| ユーザビリティ | 5 | 5 | 5 | **5** | ±0 | skip link / aria / focus / 44px タップ 維持 |
| **合計** | **100** | **99** | **89** | **96** | **+7** | — |

V4 の偽 99 と V6 96 の差 −3 は、② が見落としていた **P1（Service schema 欠落 / CaseStudy 不在 / OGP 個別化）3 件のうち 2 件未対応** に起因する素直な減点。99 への復帰には該 2 件の解消が必要。

---

## 2. 検証エビデンス（再現可能な実測値）

### 2.1 ローカル正本 grep（21 HTML 全数）

| 検査項目 | 期待 | 実測 | 判定 |
|---|---|---|---|
| `rel="canonical"` 出現ファイル数 | 21 | 21 | ✅ |
| 各 canonical href が自身 URL と一致 | 21/21 | 21/21（404.html は `/404.html` 含む） | ✅ |
| `og:url` 出現 + 自身 URL 一致 | 20/20（404 は OGP 不要） | 20/20 | ✅ |
| `<title>` 一意性（重複ゼロ） | 21 種 | 21 種 | ✅ |
| `meta description` 出現 | 21/21 | 21/21（120-160 字目安に概ね収束） | ✅ |
| BreadcrumbList JSON-LD | 20/20（404 除く） | 20/20 | ✅ |
| 深層ページ position:3 item が自身 URL | 4/4 | 4/4 | ✅ |
| legal/privacy WebPage JSON-LD | 1/1 each | 1/1 each | ✅ |

### 2.2 本番 curl（sitemap.xml）

`WebFetch https://tcharton.com/sitemap.xml` 結果：**19 url 全件取得**（main 16 + 深層 3）。loc 行は ローカル `sitemap.xml` と完全一致。lastmod=2026-05-10 で当日同期済。

### 2.3 本番 curl（HTML）の制約

本セッションで Bash / PowerShell の Invoke-WebRequest が権限拒否されたため、本番 HTML 内の `<head>` バイト一致確認は WebFetch（HTML→Markdown 変換）に依存した。WebFetch は head 内の link/meta/script を欠落させる仕様で、深層 3 ページの canonical / og:url / JSON-LD 有無を本番側で直接 grep 確認することは本セッションの範囲では不可能だった。**回避策**: ローカル正本（git 管理下 / Cloudflare Pages 配信元）を grep し、git 直近 push hash と本番 sitemap.xml の lastmod=2026-05-10 が一致することで「同一バイト配信」を間接保証する。完全一致確認には次回セッションで Bash 権限を解禁し `curl -s URL | grep canonical` 直接照合を必須とする。

---

## 3. 残存課題（V6 で追加減点 −4 点の内訳）

### 3.1 P1（V5 から持ち越し / 早期解消で +2 点）

**P1-1. services/lp/ services/refurbish/ Service schema 不在（V5 から未着手）**
- 現状: BreadcrumbList のみ。services/web/ services/ai-prediction/ には Service + HowTo + FAQPage 完備、整合性が著しく欠ける
- 修正: 各ファイルに `@type":"Service"` ブロック挿入（services/web/index.html L72 を雛形として 5-8 行）
- 効果: SERP リッチリザルトで Offer / 価格レンジ表示、CTR +5-8% 推定

**P1-3. cases/ CaseStudy / WorkExample schema 不在（V5 から未着手）**
- 現状: 「公開済み事例 1 件」を持ちながら ItemList も無し
- 修正: ItemList + CreativeWork（または schema.org Project）で構造化、1 件でも露出効果あり

### 3.2 P2（新規発見 / V6 で −2 点）

**P2-1. 深層 3 ページの og:image が共通 `/ogp.png`**
- 全 21 ページが同一 OGP 画像。X / Facebook シェア時にユーザがどのページか判別不能
- 修正コスト中（プラン固有 OGP 5 種生成 + meta 差替）→ 緊急性は低いが On-page SEO −1 の根拠

**P2-2. methodology TechArticle に `datePublished` / `dateModified` 不在の可能性**
- TechArticle 化は治癒したが、Article 系 schema の必須プロパティ充足度を本セッションで全数確認していない（要 spec-checker gate 追加）
- spec-checker.js に Article 必須 4 項目（headline / datePublished / author / image）の machine gate 追加で防衛

---

## 4. ② の手抜き再発の有無 — **再発なし / 健全**

V5 で告発した「② が production HTML を一行も再検証せず V4 を 99 点採点した」事案について、本 V6 では：

- ② 直近コミット（v1.29 Phase E + v1.28.x 系）で **canonical / sitemap / Breadcrumb item の修正実装が ローカル grep で全数確認可能**
- ② が pricing/services/web/ai-prediction/ 系で先に実装した Service / HowTo / FAQPage schema を、深層 LP 群へは展開していない（P1-1 のスケジュール先送り判断）。これは「手抜き」ではなく **優先順位選択ミス** と評価する。次回再発防止には、① が ② への発注時に「P1 全件着手」を明示する必要あり

ただし V5 →V6 の修正サイクルで spec-checker.js（1758 項目）への新 gate 追加が ① ログ（git log）から確認できない。**再発防止策として ①→④ scanner 連携で「canonical 自己参照 / sitemap 全 URL / Breadcrumb 末端 self」3 種の machine gate を必須追加** を発令する（SPEC §0.0.7 H-1 完了報告枠組みに整合）。

---

## 5. 結論と発令

- **V6 = 96/100**（V5 89 比 +7 / V4 偽 99 比 −3 / S-RANK 95 ライン超過 ✅）
- P0 三件は真に治癒。② の修正 claim に虚偽なし
- P1-1（Service schema 2 ファイル）+ P1-3（CaseStudy）+ P2-1（OGP 個別化）の 3 件解消で V7 = 99/100 復帰可能
- ① 発令: spec-checker.js に canonical 自己参照 gate / sitemap 全 URL gate / Breadcrumb 末端 self gate の 3 機械検証を追加。次回 push までに ② 実装、verify-all.js 0 FAIL を ① に証跡報告（SPEC §0.0.7）

---

**最終更新**: 2026-05-10 / 評価者 ① HARTON 総合責任者 / V5→V6 +7 改善 / S-RANK 達成
