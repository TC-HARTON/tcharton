# T.C.HARTON 教育記事 構成設計書 V1

> 策定: 2026-05-14 / ② tcharton セッション
> 根拠: アメリカ 2025-2026 Web 構築最新情報 4 領域並列リサーチ（SEO/LLMO/GEO/AIO・技術・デザイン/UX・マーケティング / 出典計 52 本）
> 対象: `insights/` 配下 8 記事スタブの本実装
> 上位文書: MARKETING-OPERATING-POLICY-V2.md / DESIGN.md

---

## 0. 設計方針

### 目的
T.C.HARTON の **信頼獲得・実績獲得** に直結する教育記事を設計する。実績数で勝てない以上、「英語圏一次情報に基づく専門記事」で技術的信頼を獲得し、同時に各記事自体を GEO/LLMO 最適化の実演（dogfooding）とする。

### 全記事共通の実装規律（リサーチで確定した GEO/LLMO 必須要件）
リサーチ結果より、全記事に以下を機械的に適用する:

1. **冒頭 40-60 語で問いに直答**（GEO: 可視性最大 40% 向上 / KDD 2024）
2. **150-200 語ごとに統計・数値を配置**（fact density / 全主張に出典）
3. **1 段落 1 アイデア・3 文以内**（LLM 引用の 4 条件）
4. **「Top N」リスト形式を各記事に含む**（AI 引用の 74.2% がリスト型）
5. **JSON-LD 3 段スタッキング**: Article + FAQPage +（該当時）HowTo / ItemList
6. **`dateModified` を 90 日以内に維持**（時事クエリで優先）
7. **見出し階層を厳密に**（H1→H2→H3 スキップなし / チャンク化）
8. **検証可能な数値 + 一次出典リンク**（曖昧な代名詞回避）

### KPI（リサーチで確定した計測規律）
- GA4 にカスタムチャネルグループ `chatgpt\.com|perplexity\.ai|claude\.ai|gemini\.google\.com|copilot\.microsoft\.com` を作成（AI 流入の 70.6% が direct 誤分類されるため）
- 「クリック数」でなく「AI 引用率 / share of voice」を主 KPI に
- AI 流入はオーガニックの 4.4 倍 CVR — 流入量より質で評価

---

## 1. 記事マップ（8 本 / insights 配下）

| slug | タイトル（案） | 主ペルソナ | 検索意図 | リサーチ領域 |
|---|---|---|---|---|
| core-web-vitals | Core Web Vitals 完全解説 — INP 時代の表示速度改善 | 再制作検討型 | Know / Do | 技術 |
| json-ld-implementation | JSON-LD 構造化データ実装ガイド — AI に事実を渡す | 採用難・AI危機感型 | Know / Do | SEO/AIO |
| llmo-explained | LLMO とは — AI 検索に引用される文章の書き方 | 採用難・AI危機感型 | Know | SEO/LLMO/GEO |
| wikidata-for-ai | Wikidata Q コードで AI に正しく認識される | 採用難・AI危機感型 | Know / Do | SEO/AIO |
| security-5-principles | 中小企業 WEB セキュリティ 5 原則（2025 OWASP 準拠） | 放置サイト屈辱型 | Know | 技術/セキュリティ |
| eat-improvement | E-E-A-T 強化ガイド — AI 時代の信頼シグナル | 事業承継・刷新型 | Know | SEO/マーケ |
| longtail-seo | ロングテール SEO 戦略 — 地域 × 課題で勝つ | 再制作検討型 | Know / Do | マーケ/ローカル |
| search-intent | 検索意図への回答設計（Problem-Solution / AEO） | 事業承継・刷新型 | Know | SEO/UX |

---

## 2. 記事別 構成設計

### 2.1 core-web-vitals — Core Web Vitals 完全解説

**冒頭直答（40-60語）**: Core Web Vitals は Google が定める 3 つの実ユーザー体験指標（LCP・INP・CLS）。2024 年 3 月に FID が INP に置き換わり、現在の合格基準は INP 200ms 未満・LCP 2.5s 未満・CLS 0.1 未満。表示速度は検索順位と離脱率に直結する。

**構成（H2）:**
1. Core Web Vitals とは — 3 指標の定義（LCP / INP / CLS）
2. なぜ INP が FID を置き換えたのか（2024 年 3 月の変更）
3. フィールドデータ優先 — CrUX と Lighthouse の違い（ラボ値 90+ でも CrUX で落ちる理由）
4. **【Top 7】INP を 200ms 未満にする実装手法**（JS タスク分割 / Web Worker / debounce + passive / DOM 1,500 ノード未満 等）
5. LCP 改善 — `fetchpriority="high"` / lazy を付けない要素
6. 計測の正しい手順（PageSpeed Insights の Field Data を先に見る / Lighthouse は 3-5 回中央値）
7. FAQ（5 問）

**必須数値**: INP 200ms / LCP 2.5s / CLS 0.1 / モバイル CWV 合格率 48% / DOM 1,500 ノード・深さ 32
**参照リンク**:
- https://web.dev/articles/inp
- https://web.dev/articles/vitals
- https://web.dev/explore/learn-core-web-vitals
- https://developers.google.com/speed/docs/insights/v5/about

---

### 2.2 json-ld-implementation — JSON-LD 構造化データ実装ガイド

**冒頭直答**: JSON-LD は Schema.org 語彙で「このページが何についてか」を機械可読にする記法。2025 年以降、リッチスニペット目的より「AI 検索エンジンが高信頼の事実を抽出する経路」として価値が再定義された。

**構成（H2）:**
1. 構造化データとは — なぜ AI 時代に重要性が増したか
2. JSON-LD 一択の理由（HTML から分離 / 全 AI 対応）
3. **【Top 4】最優先で実装すべき Schema タイプ** — FAQPage / HowTo / Article / Organization
4. 3 段スタッキング — ランキングページに Article + ItemList + FAQPage
5. LocalBusiness — 地域受託に効く（Bing Copilot のエンティティ認識）
6. よくある実装ミスと検証方法（Rich Results Test / Schema Markup Validator）
7. FAQ（5 問）+ HowTo（実装手順）

**必須数値**: AI Overview 引用の 92.36% が自然検索 10 位以内ドメイン
**参照リンク**:
- https://searchengineland.com/schema-markup-ai-search-no-hype-472339
- https://www.brightedge.com/blog/structured-data-ai-search-era
- https://schema.org/
- https://developers.google.com/search/docs/appearance/structured-data

---

### 2.3 llmo-explained — LLMO とは

**冒頭直答**: LLMO（Large Language Model Optimization）は ChatGPT・Perplexity・Google AI Overviews 等の生成 AI に引用されるための最適化。従来 SEO が「検索順位」を狙うのに対し、LLMO は「AI の回答に引用される」ことを狙う。AI 流入はオーガニックの 4.4 倍の CVR を持つ。

**構成（H2）:**
1. LLMO / GEO / AIO の違いと関係
2. GEO の原典 — KDD 2024 論文（統計・引用追加で可視性最大 40% 向上）
3. **【Top 4】AI に引用される文章の 4 条件** — ①冒頭直答 ②全主張に数値・固有名のソース ③1 段落 3 文以内 ④断定的な voice
4. ドメイン別の有効手法（法律/政府系は統計、歴史/社会系は引用）
5. LLM seeding — Reddit / Quora / LinkedIn への情報分散（LinkedIn は被引用 2 位ドメイン）
6. 従来 SEO は不要になったか — AI 引用の 92.36% が自然検索 10 位以内（土台として必須）
7. 計測 — GA4 カスタムチャネルグループの作り方
8. FAQ（6 問）

**必須数値**: 可視性最大 40% 向上 / LinkedIn 被引用率 11% / AI 流入 CVR 4.4 倍 / direct 誤分類 70.6% / ChatGPT が AI 流入の 87.4%
**参照リンク**:
- https://arxiv.org/abs/2311.09735
- https://dl.acm.org/doi/10.1145/3637528.3671900
- https://searchengineland.com/mastering-generative-engine-optimization-in-2026-full-guide-469142
- https://www.semrush.com/blog/llm-optimization/
- https://searchengineland.com/guides/large-language-model-optimization-llmo
- https://www.semrush.com/blog/most-cited-domains-ai/

---

### 2.4 wikidata-for-ai — Wikidata Q コードで AI に正しく認識される

**冒頭直答**: Wikidata は構造化データの巨大なオープン知識ベースで、各概念に固有 ID（Q コード）が振られる。Schema.org の `additionalType` / `sameAs` に Q コードを設定すると、AI 検索エンジンが事業内容を曖昧さなく認識できる。

**構成（H2）:**
1. Wikidata とは — AI のエンティティ認識基盤
2. Q コードとは — 概念の固有 ID
3. **【Top 5】事業者サイトに設定すべき Q コード**（業種・サービス・地域 等）
4. `additionalType` / `sameAs` への実装方法（HowTo）
5. 自社の Q コードの探し方・検証方法
6. FAQ（4 問）+ HowTo

**参照リンク**:
- https://www.wikidata.org/
- https://schema.org/sameAs
- https://searchengineland.com/schema-markup-ai-search-no-hype-472339

---

### 2.5 security-5-principles — 中小企業 WEB セキュリティ 5 原則

**冒頭直答**: 中小企業の WEB サイトは「狙われない」と思われがちだが、OWASP Top 10 2025 で「Security Misconfiguration（設定不備）」が 2 位に上昇。その主因は CSP・HSTS 等のセキュリティヘッダーの欠落で、これは中小企業サイトでも securityheaders.com A+ まで到達可能。

**構成（H2）:**
1. なぜ中小企業サイトが狙われるのか — OWASP Top 10 2025 の変化
2. **【Top 5】中小企業 WEB セキュリティ 5 原則**
   - ① HTTPS / HSTS（preload 登録）
   - ② Content Security Policy（strict CSP / nonce ベース）
   - ③ Trusted Types で DOM XSS 遮断
   - ④ セキュリティヘッダー（securityheaders.com A+）
   - ⑤ CMS の管理画面・バージョン情報の露出防止
3. WordPress サイトで特に注意すべき点
4. 自己診断の方法（securityheaders.com / Mozilla Observatory）
5. FAQ（5 問）

**必須数値**: OWASP Top 10 2025 で Misconfiguration が #2
**参照リンク**:
- https://owasp.org/Top10/2025/
- https://web.dev/articles/strict-csp
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP
- https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
- https://www.ipa.go.jp/security/vuln/websecurity/about.html

---

### 2.6 eat-improvement — E-E-A-T 強化ガイド

**冒頭直答**: E-E-A-T は Google が定める品質評価軸（Experience・Expertise・Authoritativeness・Trustworthiness）。AI 検索時代でも品質シグナルとして有効で、特に「誰がやっているかの可視化」と「透明性」が中小・個人事業の信頼獲得に直結する。

**構成（H2）:**
1. E-E-A-T とは — 4 つの軸
2. AI 時代に E-E-A-T はどう変わったか
3. **【Top 4】信頼を伝えるデザイン要素**（NN/g の 4 信頼要素: デザイン品質 / 事前情報開示 / 網羅性と最新性 / 外部接続）
4. 実績ゼロでも信頼を作る方法 — 本人・作業場所の可視化 / 料金透明化 / 第三者評価
5. ケーススタディ型証言の作り方（課題 → 実施 → 測定可能な成果）
6. 「信頼の階層」モデルでコミットメント段階を設計
7. FAQ（5 問）

**必須数値**: 意思決定者の 78% が具体的数値付きケーススタディを信頼 / 新規サイトは数秒で印象が固まる
**参照リンク**:
- https://www.nngroup.com/articles/trustworthy-design/
- https://www.nngroup.com/articles/communicating-trustworthiness/
- https://www.nngroup.com/articles/commitment-levels/
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content

---

### 2.7 longtail-seo — ロングテール SEO 戦略

**冒頭直答**: ロングテール SEO は「沼津 ホームページ 表示速度 改善」のような具体的で競合の少ない検索語を狙う戦略。ビッグキーワード（「沼津 ホームページ制作」）は比較サイトが上位を占有するため、個人事業が現実的に 1 位を取れるのはロングテール領域である。

**構成（H2）:**
1. ロングテール SEO とは — なぜ中小・個人事業に有効か
2. ビッグキーワードの壁 — 比較サイトが占有する構造
3. **【Top 5】地域 × 課題のロングテール例**（「沼津 ホームページ 表示速度 改善」「ホームページ 作り直し 三島」等）
4. ニッチ特化の利益（B2B 意思決定者の過半数がニッチ専門業者を探す / 特化で利益 10% 増）
5. Google ビジネスプロフィール（GBP）の活用 — 記入完了で訪問 70% 増・表示 18 倍
6. AEO（Answer Engine Optimization）— 質問に会話的に直答する
7. FAQ（5 問）

**必須数値**: GBP 記入完了で訪問 70% 増・表示 18 倍 / ニッチ特化で利益 10% 増
**参照リンク**:
- https://www.smartinsights.com/lead-generation/lead-generation-strategy/lead-generation/
- https://www.headcore.com/blog/b2b-marketing-for-niche-products
- https://thebrandhopper.com/learning-resources/local-seo-google-business-profile-best-practices-for-2026/
- https://developers.google.com/search/docs/fundamentals/seo-starter-guide

---

### 2.8 search-intent — 検索意図への回答設計

**冒頭直答**: 検索意図は 4 種（Know / Do / Buy / Go）に分類でき、各意図に構造化された回答を用意することが AI 検索時代のコンテンツ設計の核。AI に要約されることを前提に、冒頭直答・明確な見出し階層・箇条書きでチャンク化する。

**構成（H2）:**
1. 検索意図の 4 分類（Know / Do / Buy / Go）
2. Problem-Solution 設計 — 悩みに対し構造化された解を返す
3. **【Top 6】AI に引用されるコンテンツ設計のチェックリスト**（冒頭 TL;DR / 見出し階層 / チャンク化 / 検証可能な数値+出典 / JSON-LD / AI ボット許可）
4. AI スロップ（量産コンテンツ）への反動 — 「人の手の証明」が差別化軸
5. ファーストビュー設計（主訴求 1・サブ 1 行・CTA 1 / 50ms で第一印象が決まる）
6. FAQ（5 問）

**必須数値**: 第一印象は 50ms 未満で決定 / 単一 CTA 13.5% vs 5 個以上 10.5% CVR / 消費者の 78% が AI 画像を「本物でない」と認識
**参照リンク**:
- https://www.nngroup.com/articles/state-of-ux-2026/
- https://kontent.ai/blog/how-to-optimize-content-for-ai-and-llms-a-practical-guide-to-geo/
- https://www.mintlify.com/blog/how-to-improve-llm-readability
- https://unbounce.com/conversion-rate-optimization/call-to-action-examples/

---

## 3. 記事テンプレート構造（全 8 記事共通）

```
1. <h1> タイトル（30-60字 / ブランド名末尾）
2. 冒頭直答ブロック（40-60語 / Lead Evidence Block）
3. 公開日 / dateModified（90日以内維持）
4. <h2> 本文セクション（各 H2 = 1 トピック / H3 でサブ）
   - 各段落 3 文以内
   - 150-200 語ごとに数値 + 出典リンク
5. 【Top N】リストセクション（AI 引用率 74.2%）
6. FAQ セクション（4-6 問 / FAQPage JSON-LD）
7. 関連記事への内部リンク（最低 3）
8. CTA（無料診断 / 関連サービスページ）
9. 出典一覧（記事末 / 全リンク列挙）
```

**JSON-LD**: 全記事に Article + FAQPage、該当記事に HowTo / ItemList を追加。

---

## 4. 制作優先順位

| 優先 | 記事 | 理由 |
|---|---|---|
| P0 | llmo-explained / search-intent | V2 主訴求「AI に選ばれる」と直結。これ自体が GEO 実演 |
| P0 | longtail-seo | 90 日マイルストーン「沼津 × 課題」記事戦略の理論的支柱 |
| P1 | core-web-vitals / security-5-principles | 競合 7 社が訴求しない技術領域。差別化の核 |
| P1 | json-ld-implementation / wikidata-for-ai | AIO 実装の実演 |
| P2 | eat-improvement | 信頼構築の総論 |

---

## 5. 校正・品質基準（公開前チェック）

各記事公開前に以下を検証:

1. 冒頭 40-60 語で問いに直答しているか
2. 全数値に一次出典リンクがあるか（HSCEL §3.3 事実確認 mandatory）
3. 1 段落 3 文以内か
4. 【Top N】リストを含むか
5. JSON-LD（Article + FAQPage 最低）が valid か
6. 見出し階層スキップなし（H1→H2→H3）
7. 内部リンク最低 3 / CTA 配置
8. ブランド禁止用語 grep 0 件（景表法）
9. DESIGN.md §11 Validation Checklist 全 14 項目
10. spec-checker S-RANK PASS

---

**Version**: 1.0 / **策定**: 2026-05-14 / **次アクション**: 制作優先順位 P0 の 3 記事から本文執筆に着手（要 ① GO）
