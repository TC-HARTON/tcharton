# 教育記事 出典基盤リサーチ — 米国 WEB 業界最新動向（2026-05 全面再調査版）

> 策定: 2026-05-14 / ② tcharton セッション
> 手法: 6 ドメイン並列リサーチ（general-purpose エージェント ×6 / WebSearch・WebFetch）
> 目的: `INSIGHTS-ARTICLE-DESIGN-V2.md` 全 31 記事の出典基盤。HSCEL §3.3「数値・引用は一次出典明記 mandatory」の根拠台帳。
> 位置づけ: V2 設計書 §6「参照リンク 52 本」を**全面更新・精査**したもの。記事執筆時は本書の「確度: 高」のファクトのみを断定に使い、「中」は出所限定付き、「低」は不使用。

---

## 0. 本書の使い方と確度ランク

| ランク | 定義 | 記事での扱い |
|---|---|---|
| **高** | 一次出典（Google 公式 / W3C / OWASP / 査読論文 / Pew 等学術機関 / 政府機関）で確認、複数ソース整合 | 断定で使用可。出典 URL を記事末「出典」に明記 |
| **中** | 業界専門メディア・大手調査会社（BrightLocal / Baymard / HubSpot / Ahrefs 等）の一次調査だが、利益相反や母集団非公開の要素あり | 「ある調査では」「○○社の調査によれば」と出所限定付きで使用 |
| **低** | 二次ブログの孫引き・出所不明・誇張系（「○倍」「○%増」で原典不明） | **記事に使用しない**。§8 に隔離 |

**鉄則**: 数値を 1 つ書くたびに、本書のどのファクト番号に基づくかを確認する。本書にないファクトは記事に書かない（憶測禁止 / HSCEL §3.3）。

---

## 1. ピラー 1: AI 検索・GEO・LLMO

### 1-1【高】GEO の原典 KDD 2024 論文
- GEO（Generative Engine Optimization）の原典は Aggarwal ら「GEO: Generative Engine Optimization」（KDD 2024 採択）。GEO-bench は 10,000 クエリ。
- 「統計の追加」「引用の追加」「出典明記」が生成エンジン応答内の source visibility を**最大 40% 向上**。
- **論文自身が「効果はドメイン依存」と明記**。法律・行政は統計値、歴史・社会は引用がより有効。
- 出典: https://arxiv.org/abs/2311.09735 / https://dl.acm.org/doi/10.1145/3637528.3671900
- 注意: これは 2023-24 時点（GPT-3.5/4 世代）の実測。現行 AI Overviews（Gemini 3）には未検証。「GEO すれば必ず 40% 上がる」は誇張。

### 1-2【高】Pew Research — AI 要約が検索行動を変えた（本ピラー最重要・学術データ）
- Pew Research Center、米国成人 900 人の実ブラウジングデータ（2025-03）、68,000 件超の実検索クエリを分析（2025-07 公表）。
- AI 要約が表示されたとき検索結果をクリックしたのは **8%**（非表示時は 15%）= 相対約 47% 減。
- **AI Overviews 自身が引用したソースへのクリックはわずか 1%**。
- AI 要約を見た後ブラウジングを完全終了したユーザーは **26%**（要約なし時は 16%）。
- 2025-03 時点で全 Google 検索の約 **18%** が AI Overview を誘発。
- 出典: https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/

### 1-3【高】llms.txt は AI 検索向けには実効性が実証されていない
- John Mueller（Google、2025-06）: 「現状どの AI システムも llms.txt を使っていない。サーバーログを見れば一目瞭然」。
- Gary Illyes（Google、2025-07）: 「Google は llms.txt をサポートしておらず、その予定もない」。
- 複数の独立サーバーログ監査（2025-08〜10）で GPTBot / ClaudeBot / PerplexityBot / Google-Extended の llms.txt アクセスはゼロ。
- ただし Cursor / Claude Code 等の**コーディングエージェント**では利用されている = AI「検索」ではなく AI「開発ツール」の入口。
- 出典: https://searchengineland.com/google-says-normal-seo-works-for-ranking-in-ai-overviews-and-llms-txt-wont-be-used-459422
- **重要**: 既存記事 `llmo-explained` は「優先度は低め」と既に正しく扱っている。§7 の社内訂正事項も参照。

### 1-4【中】AI プラットフォームごとに引用ロジックが全く違う
- ChatGPT と Perplexity が共通引用するドメインは 11% のみ（Profound、6.8 億引用分析）。
- 引用源の個性: ChatGPT = Wikipedia 偏重（最多 7.8%）/ Perplexity = Reddit 偏重（6.6%）+ リアルタイム Web / Google AIO = Reddit + YouTube 分散型。
- Perplexity は Google 上位 10 位を 91% 引用（順位連動型）、ChatGPT は上位 10 位との重複わずか 14%（独自知識型）。
- 出典: https://www.tryprofound.com/blog/ai-platform-citation-patterns（ベンダー大規模調査）
- 扱い: 「プラットフォームごとに引用ロジックが違う」という構造は断定可。個別 % は「ある調査では」と限定。

### 1-5【中】Google AIO と Google 検索順位の相関は急低下中
- AIO 引用元と Google 上位 10 位の一致率は 2025 年中頃の約 76% → 2026 年初頭に約 38%（Ahrefs、863,000 SERP・400 万 AIO URL 分析）。Gemini 3 が AIO デフォルト化（2026-01-27）と時期一致。
- 出典: https://ahrefs.com/blog/ai-overview-citations-top-10/

### 1-6【中】earned media（第三者メディア）が AI 可視性に効く
- AI 引用の約 82% が earned media 由来、自社ブログはほぼ不可視（複数調査で方向性一致）。
- ブランド Web 言及と AIO 可視性の相関 0.664 に対し、被リンクは 0.218（Ahrefs 75,000 ブランド）。
- 中小企業への示唆: 自社サイトを盛るより「地域メディア・業界紙・第三者レビューサイト掲載」が現実的。
- 扱い: 方向性は使用可。「239% lift」「10 倍」等の倍率は §8 へ隔離。

### 1-7【高】AI 流入は「質は高めだが量は桁違いに小さい」— 両面セットで語る
- ChatGPT の検索ボリュームは Google の約 12% だが、Google は ChatGPT の 190 倍の Web トラフィックを送客（Ahrefs）。
- AI 流入のコンバージョン率が高いとの調査は複数あるが母数が極小・セルフセレクションバイアスあり。「量と質を必ずセットで」書く。
- 出典: https://ahrefs.com/blog/chatgpt-has-12-percent-of-googles-search-volume/

---

## 2. ピラー 2: 表示速度・技術品質

### 2-1【高】Core Web Vitals の合格基準（不変）
- LCP 2.5 秒以内 / INP 200ms 以内 / CLS 0.1 以内。判定は実ユーザー（CrUX）の 75 パーセンタイル。
- 2024-03、FID → INP に置き換え。FID は最初の 1 操作のみ、INP はほぼ全操作を見るため格段に厳しい。
- **2026-05 時点で「4 つ目の Core Web Vital」追加予定はない**。動きがあるのは SPA 向け Soft Navigations API（Chrome 147 / 2026-03 トライアル開始）のみ。
- 出典: https://web.dev/articles/vitals / https://developers.google.com/search/docs/appearance/core-web-vitals / https://developer.chrome.com/docs/web-platform/soft-navigations-experiment

### 2-2【高】全 Web の CWV 合格率（Web Almanac 2025 / CrUX 2025-07）
- 全 Web サイトの全 CWV 合格率: モバイル 48% / デスクトップ 56%。
- LCP が最難関（モバイル GOOD 62% / デスクトップ 74%）。
- INP は改善しているが TBT（Total Blocking Time）は前年比 58% 増 = JS の総量・実行コストが増え続けている。
- 出典: https://almanac.httparchive.org/en/2025/performance / https://almanac.httparchive.org/en/2025/cms

### 2-3【高】INP 改善の中核手法
- ロングタスク（50ms 超）の分割とメインスレッドへの yield（明け渡し）。
- `scheduler.yield()` が新標準だが **Safari 未対応**で `setTimeout` フォールバック併用が定石。`scheduler.postTask()` も関連。
- 重い計算は Web Worker へ。イベントコールバック内の作業を分割し UI 更新前に yield。
- 出典: https://web.dev/articles/optimize-inp / https://web.dev/articles/optimize-long-tasks

### 2-4【高】INP 改善の web.dev 公式ケーススタディ
- Trendyol: `scheduler.yield()` 導入で商品一覧の INP 50% 削減。
- QuintoAndar: INP 80% 削減 → コンバージョン前年比 36% 増。
- Economic Times: INP を約 1/4 に → 直帰率 50% 減・ページビュー 43% 増。
- 出典: https://web.dev/case-studies/trendyol-inp / quintoandar-inp / economic-times-inp
- 扱い: 数値は使用可だが「INP 改善 → 売上 X%」は厳密には相関。「〜という結果が報告されている」と書く。

### 2-5【高】WordPress vs 静的 HTML（CWV 観点）
- WordPress のモバイル全 CWV 合格率は 43.44% で主要 CMS 最低（Web Almanac 2025）。
- CMS 別: Duda 83.63% / Shopify 75.22% / Wix 70.76% / Squarespace 67.66% / Drupal 59.07% / WordPress 43.44%。
- WordPress は全 Web の 42.2%、CMS 中 59.6%（W3Techs 2026-05）。
- **正確な書き方**: 「WordPress だから遅い」ではない。低品質テーマ・プラグイン過多・未最適化ホスティングの母集団効果。「適切に作られた WordPress / 静的 HTML はどちらも S 級たり得るが、平均的な WordPress サイトは合格率 43% に留まる」。
- 出典: https://almanac.httparchive.org/en/2025/cms / https://w3techs.com/technologies/details/cm-wordpress

### 2-6【高】画像・フォント最適化
- AVIF は JPEG 比約 50%、WebP 比 20–30% ファイルサイズが小さい。ブラウザ対応は AVIF 約 94% / WebP 約 95%（2025-09）。`<picture>` で AVIF 主・WebP フォールバック・JPEG 最終保険。
- `font-display: optional` + フォント preload がレイアウトシフトゼロの最有力。preload 時は self-host でも `crossorigin` 必須。`@font-face` の `size-adjust` でフォント入れ替え時のシフトを抑制。
- 出典: https://web.dev/articles/font-best-practices / https://web.dev/articles/css-size-adjust / https://caniuse.com/avif

### 2-7【高】表示速度とビジネス指標（年を明記して使う）
- Deloitte / Google「Milliseconds Make Millions」: モバイル速度を 0.1 秒改善で EC コンバージョン +8.4%・平均注文額 +9.2%、旅行コンバージョン +10.1%、リードジェネ情報ページ直帰率 8.3% 改善。
- **2020 年公表**。記事で使うなら必ず「2020 年の Deloitte/Google 共同研究、現在も業界標準的に引用」と年を明示。
- 出典: https://www.deloitte.com/ie/en/services/consulting/research/milliseconds-make-millions.html

### 2-8【中】モダンビルド（Astro / Islands Architecture）
- Islands Architecture = 静的 HTML（クライアント JS ゼロ）をベースに、インタラクティブな部分だけを「島」としてハイドレート。
- Astro は「HTML-first, JavaScript when necessary」。`client:load` / `client:idle` / `client:visible` 等でハイドレーションのタイミングを制御。
- 出典: https://www.patterns.dev/vanilla/islands-architecture/ / https://astro.build/
- 扱い: アーキテクチャの概念・仕様は使用可。「40% 速い」等の定量主張は §8 へ隔離（二次・条件不明）。「JS をゼロから始めるため構造的に有利」と定性的に書く。

---

## 3. ピラー 3: セキュリティ

### 3-1【高】OWASP Top 10:2025（4 年ぶり改訂・最新版）
- OWASP Top 10:2025 が最新（第 8 版）。owasp.org/Top10/2025/。
- A01 Broken Access Control が引き続き 1 位。**SSRF は A01 に統合**。
- A02 Security Misconfiguration が 2021 年版 5 位 → 2 位に上昇。
- A03 が「Software Supply Chain Failures」に再定義・拡張（旧 Vulnerable and Outdated Components）。
- **A10 Mishandling of Exceptional Conditions が新規カテゴリ**（例外条件の不適切な処理 / フェイルオープン等）。
- 出典: https://owasp.org/Top10/2025/ / https://owasp.org/Top10/2021/（旧版対照）

### 3-2【高】Strict CSP が現在の XSS 対策の推奨
- ドメインホワイトリスト方式は回避策が多く非推奨。nonce ベースまたは hash ベースの `script-src` を使う。
- `'strict-dynamic'` で信頼済みスクリプトが読み込む子スクリプトを許可。
- Trusted Types（`require-trusted-types-for` / `trusted-types`）で DOM ベース XSS を防御。ただし 2025-2026 時点で Chrome のみフル対応、Firefox / Safari 未対応（ポリフィル併用可）。
- 出典: https://web.dev/articles/strict-csp / https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html / https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP

### 3-3【高】中小企業が狙われる現実（Verizon 2025 DBIR）
- 中小企業の侵害の **88%** にランサムウェアが関与（大企業は 39%）= 中小企業は約 4 倍狙われる。
- ランサム身代金の中央値は 11.5 万ドル、被害者の 64% が支払い拒否。
- Verizon 2025 DBIR（2025-04-23 公開）、22,000 件超のインシデント・うち 12,195 件が確認された侵害を分析。
- 出典: https://www.verizon.com/business/resources/reports/dbir/

### 3-4【高】WordPress 固有のセキュリティリスク（Patchstack 2025）
- 2025 年に WordPress エコシステムで 11,334 件の新規脆弱性、前年比 42% 増。
- **91% がプラグイン、9% がテーマ、コア本体はわずか 6 件（全て低優先度）** = リスクはほぼサードパーティ起因。
- 脆弱性タイプ最多は XSS（約 41.5%）、次いで CSRF・Broken Access Control（各約 13%）。
- 出典: https://patchstack.com/whitepaper/state-of-wordpress-security-in-2025/
- 示唆: 「プラグインを入れすぎない・更新を怠らない・有料テーマも安全とは限らない」が実データに裏打ちされたメッセージ。

### 3-5【高】セキュリティヘッダー
- 2025 年の必須ヘッダー: HSTS / CSP / X-Content-Type-Options / X-Frame-Options / Referrer-Policy / Permissions-Policy / Cross-Origin 系。
- **X-Frame-Options は CSP の `frame-ancestors` ディレクティブにより obsolete 扱い**。新規実装は `frame-ancestors` を優先（互換のため X-Frame-Options 併記は可）。
- 評価ツール: Mozilla HTTP Observatory（A+〜F）/ securityheaders.com。
- 出典: https://owasp.org/www-project-secure-headers/ / https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Frame-Options

### 3-6【高】日本の公的機関（IPA）
- IPA「安全なウェブサイトの作り方」は**現行が第 7 版（2015 年）**。第 1 章で SQL インジェクション・XSS・アクセス制御欠落など 11 種の脆弱性を「根本的解決」「保険的対策」両面で解説。「最新」と書くと不正確 — 「2026 年現在も第 7 版が現行」と書く。
- IPA「情報セキュリティ10大脅威」は毎年更新。組織編 1 位はランサム攻撃（2021 年以降不動）、2 位はサプライチェーン攻撃。**2026 年版が 2026-03 に公開済み** — 執筆時点で最新の年版を使う。
- 出典: https://www.ipa.go.jp/security/vuln/websecurity/about.html / https://www.ipa.go.jp/security/10threats/

---

## 4. ピラー 4: 集客・SEO・E-E-A-T

### 4-1【高】E-E-A-T — Trust が最重要
- E-E-A-T = Experience / Expertise / Authoritativeness / Trust。Google は「Trust が中心であり最重要」と公式に明言。
- Google はコンテンツの「誰が（who）・どのように（how）・なぜ（why）」作ったかを重視。AI 利用の有無も "how" に含めて開示を推奨。
- 出典: https://developers.google.com/search/blog/2022/12/google-raters-guidelines-e-e-a-t / https://developers.google.com/search/docs/fundamentals/creating-helpful-content

### 4-2【高】Google 品質評価ガイドライン 2025-01 更新
- 2025-01、Search Quality Rater Guidelines を更新。生成 AI の定義を初めて明記、「水増しした肩書き」など軽度の誇張も Low 評価対象に追加、Scaled Content Abuse（§4.6.5）を新設。
- **品質評価ガイドラインは評価者用であり、直接ランキングに影響しない**（Google 公式の立場）。
- 出典: https://services.google.com/fh/files/misc/hsw-sqrg.pdf / https://searchengineland.com/google-updates-search-quality-raters-guidelines-adding-ai-overview-examples-ymyl-definitions-461908

### 4-3【高】Google コア更新タイムライン（記事の時系列背景）
- March 2025 / June 2025（06-30〜07-17）/ December 2025（12-12〜12-29）/ March 2026（03-27〜04-08）。
- 2025-06 コア更新で Helpful Content システムがコアアルゴリズムに深く統合 = 低品質ページがサイト全体評価を引き下げる「サイトワイド影響」。
- 出典: https://searchengineland.com/ （Google status.search.google.com 追跡）

### 4-4【高】ローカル SEO の 3 本柱
- Relevance（関連性）/ Proximity（距離）/ Prominence（知名度・評判）。Prominence が最重要。
- Whitespark の最新ローカル検索ランキング要因調査は 2025-11 公開（47 専門家・187 要因）。
- 出典: https://whitespark.ca/local-search-ranking-factors/

### 4-5【中】Google ビジネスプロフィール（GBP）
- BrightLocal 調査: SMB の 35% しか GBP を保有していない = 整備するだけで競合優位。
- GBP はローカルパック（地図 3 枠）可視性の最大ドライバー（各調査で一致）。
- 出典: https://www.brightlocal.com/research/local-consumer-review-survey/
- 扱い: 「完全プロフィールでクリック 7 倍」「写真でルート検索 +45%」は §8 へ隔離（出所不明）。

### 4-6【中】被リンクゼロからの SEO
- Backlinko 分析: 全 Web ページの 95% が被リンクゼロ = 新規サイトは多数派。
- Google は 2024 年アップデートでスケール型アウトリーチ・低品質リンクを減価、デジタル PR・自然な高品質リンクを優遇。
- **低競合・超具体的なキーワード（地域 × 課題のロングテール）なら被リンクなしでも上位化可能** — 新規地域サイトの現実的戦略。
- 出典: https://ahrefs.com/blog/ （Backlinko 系データ）

### 4-7【高】AEO と検索意図
- 検索意図の 4 分類: Informational / Navigational / Commercial / Transactional（SEO 業界の標準枠組み。Google 公式用語ではない）。
- AEO = Answer Engine Optimization。従来 SEO が「キーワード」起点なのに対し AEO は「質問」起点。answerability（直接回答できるか）を重視。
- 扱い: 4 分類・AEO の概念は使用可。方法論的な断定はベンダー発信が多いため避ける。

---

## 5. ピラー 5: 構造化データ・計測・アクセシビリティ・運用

### 5-1【高】構造化データは AI 引用を「ブーストしない」— 誇張の打ち消し
- Ahrefs の DiD（差分の差分法）実験: JSON-LD schema を新規追加した 1,885 ページ vs 対照群 4,000 件、2025-08〜2026-03。**どのプラットフォームでも有意な引用増加なし**。Google AI Mode +2.4%・ChatGPT +2.2%（ノイズ域）、Google AI Overviews は -4.6%（小さいが有意な減少）。
- OtterlyAI 実験: schema 全面実装で SERP features +377%・AI Overviews 出現 +1,500% の一方、AI 検索引用は ChatGPT/Gemini/Copilot で減少。
- Search/Atlas（2024-12）: schema カバレッジと引用率に相関なし。
- **schema の AI 検索影響に関する査読論文・制御実験は現時点で存在しない**。
- 出典: https://ahrefs.com/blog/schema-ai-citations/ / https://otterly.ai/blog/schema-markup-real-impact-ai-search/ / https://searchengineland.com/schema-markup-ai-search-no-hype-472339

### 5-2【高】構造化データの「正当な価値」と Google/Bing 公式見解
- 2025-04、Google が「構造化データは検索結果で advantage を与える」と表明。ただし**従来のリッチリザルト（検索結果の見た目）の文脈**であり AI 引用ブーストの意味ではない。
- 2025-03、Microsoft Bing の Fabrice Canel が「schema は Microsoft の LLM（Copilot）のコンテンツ理解を助ける」と発言。両社ともクロール時の schema 保持・抽出利用は未公表。
- **正当な価値**: 「リッチリザルト適格性」「機械可読性の保険」であって「AI 引用ブースト」ではない。
- Google 公式（記法面）: 3 記法（JSON-LD / Microdata / RDFa）中、JSON-LD を推奨（「大規模に実装・保守する上で最も簡単」）。配置は `<head>` / `<body>` どちらでも可。必須プロパティを全て含めないとリッチリザルト対象外。ユーザーに見えない情報のマークアップは禁止。
- 出典: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data

### 5-3【中】Wikidata Q コードと AI エンティティ認識
- Wikidata の各項目に一意の永続識別子 QID（Q + 整数）。Schema.org に該当タイプがない業種は `LocalBusiness` + `additionalType: https://www.wikidata.org/entity/Q...` で具体化。
- **Wikidata は直接のランキング要因ではない** — エンティティの明確化に寄与する間接効果。Knowledge Panel の情報の多くは Wikidata 由来。
- Wikidata Embedding Project が 2025-10 公開、MCP 標準対応で AI からの参照性が公式に強化。
- 出典: https://support.schemaapp.com/support/solutions/articles/33000277321 / https://en.wikipedia.org/wiki/Wikidata
- 扱い: 「直接のランキング要因ではない／間接的にエンティティ明確化に寄与」は使用可。「Stanford 研究 96%」「CTR 大幅増」は §8 へ隔離。

### 5-4【高〜中】GA4 で AI 流入を計測する
- GA4 はデフォルトでは AI 流入を正確に捕捉できず、推計で **6〜7 割が Direct 等に誤分類**される。原因はモバイル webview の referrer 除去と、ユーザーが URL をコピペする行動。
- 対策: GA4 のカスタムチャネルグループを作成し、正規表現で ChatGPT / Perplexity / Gemini / Copilot / Claude を「AI assistants」チャネルに分類。デフォルトチャネルグループは編集不可だが、カスタムを primary に指定可能。モバイル referrer 除去ぶんは原理的に取りこぼす。
- 出典: https://support.google.com/analytics/answer/13051316 / https://martech.org/how-ga4-records-traffic-from-perplexity-comet-and-chatgpt-atlas/
- 扱い: 「誤分類が起きる・カスタムチャネルグループで対処」は断定可。「70.6%」等の具体値は「ある調査では約 7 割」とレンジ＋出所付きで。

### 5-5【高】アクセシビリティ WCAG 2.2 と EAA
- WCAG 2.2 は 2023-10-05 に W3C 勧告化。WCAG 2.1 から達成基準を 9 個追加。**4.1.1 Parsing は廃止・削除**。
- 主な新基準: Focus Not Obscured (Minimum)[AA] / Dragging Movements[AA] / **Target Size (Minimum)[AA] = タップターゲット最小 24×24 CSS px** / Consistent Help[A] / Redundant Entry[A] / Accessible Authentication (Minimum)[AA]。
- EAA（European Accessibility Act）は **2025-06-28 適用開始**。新規の対象 WEB サイト・アプリは準拠必須、既存は 2030-06-28 まで猶予。従業員 10 人未満かつ年商 200 万ユーロ未満は免除。
- **重要**: EAA のウェブ技術基準は EN 301 549 経由で **WCAG 2.1 Level AA**（2.2 ではない）。「EAA だから 2.2 必須」は誤り。
- 出典: https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/ / https://www.w3.org/TR/WCAG22/ / https://commission.europa.eu/strategy-and-policy/policies/justice-and-fundamental-rights/disability/european-accessibility-act-eaa_en

### 5-6【高】「公開して終わり」にしない運用
- Google は「last updated 日付だけ変える見せかけ更新」を検出して信頼性シグナルを減点する。
- John Mueller: 「XML サイトマップの日付を自動更新しても SEO に効かず、むしろ Google が本当の更新を見つけにくくなる」。
- Mueller（2025-11）: 「我々のシステムは AI 製か人間製かを問わない。helpful・正確・ユーザーのために作られたかを見る」。
- 出典: https://www.searchenginejournal.com/googles-john-mueller-updating-xml-sitemap-dates-doesnt-help-seo/545547/
- 扱い: 「日付詐称は効かない・実質的更新のみ評価」は断定可。「CTR 47% 高い」「業種別減衰月数」は §8 へ隔離。

---

## 6. ピラー 6: 信頼設計・コンバージョン・発注者層

### 6-1【高】NN/g 信頼性の 4 要素
- Jakob Nielsen の定義: ①デザイン品質 ②前もっての情報開示 ③包括的で最新のコンテンツ ④WEB の他の部分とのつながり。原典 1999 年だが NN/g は「数十年にわたり安定して有効」と再確認。
- 出典: https://www.nngroup.com/articles/trustworthy-design/

### 6-2【高】NN/g 信頼の階層（5 段階のコミットメント）
- サイトが要求する情報・労力が増えるほど、ユーザー側に必要な信頼も増える。初訪問者へのフォーム強制は「初対面で身上書を要求」しているのと同じで離脱を招く。
- 出典: https://www.nngroup.com/articles/commitment-levels/

### 6-3【高】第一印象は約 50 ミリ秒で決まる
- 人は WEB ページの視覚的魅力を約 50 ミリ秒（0.05 秒）で判断（Lindgaard ら、査読論文）。Google 研究は一部 17 ミリ秒と追認。ユーザーは「視覚的に単純・見慣れた型」のデザインを強く好む。
- 出典: https://www.tandfonline.com/doi/abs/10.1080/01449290500330448 / https://research.google/blog/users-love-simple-and-familiar-designs-why-websites-need-to-make-a-great-first-impression/

### 6-4【高】Stanford Web Credibility — 視覚デザインで信頼が判断される
- Stanford Persuasive Technology Lab の 3 年・4,500 人超の研究。消費者の **46.1%** がサイトの信頼性を「全体的な視覚デザイン」に部分的に基づいて判断。
- 出典: https://credibility.stanford.edu/guidelines/index.html
- 注意: 原研究は 2002-2003 年。基礎研究として標準引用されるが「古い」点を添える。

### 6-5【中〜高】2025-2026 の新信頼シグナル「手作り感」
- AI 生成の「つるっとした完璧な」ビジュアルへの飽きから、手描き・イラスト・人の顔・自分で撮った写真が「人間が手をかけた証拠＝信頼シグナル」として機能し始めた。
- 出典: https://www.nngroup.com/articles/handmade-designs/（NN/g の観察ベース記事 / 定量データは限定的）
- 扱い: 「トレンド観察」として。HARTON の「沼津で会える 1 人の WEB 屋」スタンスと強く整合。

### 6-6【高】Baymard — チェックアウト/フォーム設計
- チェックアウト設計の改善だけでコンバージョン率を平均 **35.26%** 向上できる。
- 平均チェックアウトは 19.9 フォーム要素、最適化で 12 まで削減可能。多くは 20〜60% 削減できる。「ステップ数」より「フォーム項目数」が使いやすさを左右。
- 必須・任意を明示する。モバイルではラベルを入力欄の上に置く。
- 米国成人の 19% が「アカウント作成を避けたい」でカゴ落ち。主要 EC の 65% がチェックアウト UX で「平凡以下」= きちんとやれば差別化余地。
- 出典: https://baymard.com/research/checkout-usability / https://baymard.com/blog/current-state-of-checkout-ux / https://baymard.com/learn/form-design

### 6-7【高】CTA・1 ページ 1 CTA の原則
- CTA テキストは「動詞＋得られる価値」で具体的に（「送信」ではなく「無料見積もりを受け取る」）。WCAG コントラスト比 4.5:1 以上、モバイルのタップ領域 44×44px 以上。
- 1 ページの主要 CTA を 1 つに絞ると成果が上がる（NN/g・CRO 共通原則）。
- 扱い: 原則は使用可。「ボタン文言変更で +90%」「+161%」等の個別数値は §8 へ隔離。

### 6-8【中】BrightLocal — レビューと中小企業の信頼
- BrightLocal「Local Consumer Review Survey 2025」（米国成人 1,026 人）: 消費者の **97%** がオンラインレビューを読む。
- ローカル推薦の情報源として生成 AI（ChatGPT 等）利用が 6% → 45% に急増し 3 位に。
- 出典: https://www.brightlocal.com/research/local-consumer-review-survey/
- 注意: 米国データ。沼津商圏にそのまま当てはまらない点を記事内で明示。

### 6-9【高】HubSpot 2026 State of Marketing
- 「WEB サイト/ブログ/SEO」はマーケターが選ぶ ROI 創出チャネルの 1 位。
- 小規模事業者はブログから ROI を得る確率が平均より 23% 高い。
- マーケターの約 94% が 2026 年にコンテンツ制作で AI を使う予定 = AI 量産記事が溢れる → 「自分の現場の写真・実体験・地域の固有名詞」が入った記事だけが埋もれずに残る。
- 出典: https://www.hubspot.com/state-of-marketing
- 注意: HubSpot 自身が CMS 事業者である利益相反に留意。

### 6-10【中】日本の中小企業向けサイト制作費の相場
- 中小企業のホームページ制作費は 30 万〜100 万円が一般的。フリーランス 10〜30 万円、制作会社 50 万円以上。費用の大部分は人件費（＝かけた工数）。
- 出典: 制作会社・比較メディアの相場記事（Web幹事 / PRONIアイミツ / freee 等。公的統計ではない）
- 扱い: 「相場感」として「複数の制作会社・比較サイトの公表値では」と限定。

### 6-11【高】小規模事業者持続化補助金（日本）
- ウェブサイト関連費は**単体申請不可**で、**補助金額の 1/4 が上限**（補助上限 50 万円なら WEB は最大 12.5 万円）。チラシ・看板など他の販路開拓とセットが条件。
- 対象は小規模事業者（商業・サービス業は常時使用従業員 5 人以下、製造業その他は 20 人以下）。
- 出典: https://www.chusho.meti.go.jp/keiei/shokibo/jizoku/
- **注意**: 金額・枠は年度ごとに改定。「2026-05 時点」と日付を明記し、申請前の最新公募要領確認を促す一文を必ず入れる。

### 6-12【中〜高】「作ったのに成果が出ない」は変換の問題
- 「アクセスはあるのに問い合わせが来ない」の本質は可視性ではなく変換（来た人を行動に変えられていない）。主因: 不明確なメッセージ / 信頼コンテンツ欠如 / 料金非開示 / 弱い CTA / 遅さ / モバイル不備。
- ユーザーは「読まずスキャンする」（NN/g の確立した知見）。信頼要素は CTA の近くに置く。
- 一般的なサイトの変換率は 2〜5%（全業種混在のブレンド値 / 二次集約）。
- 構造的帰結: 制作プロセスが「公開」をゴールにし「公開後に測って直す」工程が抜けている。NN/g「真の信頼は長期の積み上げ」・Baymard「設計改善で +35%」はいずれも公開後の継続改善が前提。

---

## 7. 【最重要】既存の社内前提に対する訂正事項

リサーチの結果、tcharton の既存ドキュメント・実装に対して以下の訂正・注意が必要。① ルートへのエスカレーション対象。

| # | 訂正事項 | 根拠 | 影響範囲 |
|---|---|---|---|
| 訂正 1 | **llms.txt は AI 検索向けの実効性が実証されていない**。Google が公式に非サポート（Mueller / Illyes）。主要 AI クローラーは読んでいない。 | §1-3 | `CLAUDE.md` §3 が「llms.txt 必須実装」を mandatory にしている。害はないが「AI 検索に効く」根拠はない。「コーディングエージェント向けには意味がある」程度の温度感が正確。① で CLAUDE.md / DESIGN.md の表現を再検討すべき。既存記事 `llmo-explained` は既に「優先度は低め」と正しく扱っている。 |
| 訂正 2 | **構造化データ（JSON-LD/Schema）は AI 引用をブーストしない**。Ahrefs DiD 実験で有意増なし、AI Overviews はむしろ -4.6%。 | §5-1 | 本セッションで完成させた `json-ld-implementation` は既に「魔法ではない・土台（インフラ）」と誠実に framing 済み = リサーチと整合。今後の構造化データ系記事も「リッチリザルト適格性・機械可読性の保険」を価値の主軸にする。「構造化データで AI 引用 ○倍」系は絶対に書かない。 |
| 訂正 3 | **EAA のウェブ基準は WCAG 2.1 AA であって 2.2 ではない**。 | §5-5 | `accessibility-wcag22` 記事執筆時の必須注意。「EAA だから 2.2 必須」は誤り。 |
| 訂正 4 | **IPA「安全なウェブサイトの作り方」は 2015 年第 7 版が現行**。「最新」と書くと不正確。 | §3-6 | セキュリティ系記事（`security-5-principles` 等）執筆時の注意。 |
| 訂正 5 | **Deloitte 速度研究は 2020 年公表**。「2025-2026 最新」記事で使うなら必ず年を明示。 | §2-7 | `core-web-vitals`（完成済）・`why-slow-site-loses-sales` 等。`core-web-vitals` は要再確認。 |
| 訂正 6 | **「4 つ目の Core Web Vital」追加予定はない**（2026-05 時点）。動きは SPA 向け Soft Navigations API のみ。 | §2-1 | `core-web-vitals`（完成済）に「新指標」言及があれば要確認。 |
| 訂正 7 | V2 設計書の記事総数は **31 本**（既存スタブ 8 + 新規 23）。引き継ぎ書 `SESSION-HANDOVER-INSIGHTS.md` の「36 本」は V2 確定前の旧数字。 | V2 §229 / ファイルシステム実測 | 引き継ぎ書の本数記述を訂正すべき。① の判断事項。 |

---

## 8. 【隔離】記事に使用しない「確度の低い主張」

以下は二次ブログの孫引き・出所不明・誇張系。**HSCEL §3.3 違反リスクのため記事に書かない**。記載は「使わないことを明示するため」。

- 「構造化データで AI 引用 3 倍」「schema でファクト誤り 34% 減」— 出所不明・preprint。
- 「GBP 完全プロフィールでクリック 7 倍」「写真でルート検索 +45%・サイトクリック +31%」「定期投稿で 2.7 倍信頼される」— 二次ブログの循環引用、一次調査未確認。
- 「ロングテールは全検索の 70%」「ロングテール平均コンバージョン率 36%」「ヘッドの 2.5 倍」— 古い数値の孫引き、現行裏付け弱い。
- 「AI 流入は organic の 23 倍コンバージョン」「4.4 倍」— セルフセレクションバイアス・極小母数。
- 「Astro は React 比 40% 速い」— 二次・測定条件不明。
- セキュリティ「全攻撃の 43% が中小企業標的」「中小企業の平均被害 254,445 ドル」「SMB が全侵害の 46%」— ベンダーブログ間の循環引用、原典不明。Verizon DBIR の確実な数値（§3-3）に置き換える。
- CTA「ボタン文言変更で +90% / +161% / +202% / +266%」— 二次・古い単発事例。
- レビュー統計「92% がレビューなしで購入をためらう」「星 1 段階上昇で売上 5〜9% 増」— 二次まとめ、BrightLocal 等一次で裏取りが必要。
- 「Wikidata リンクで CTR 大幅増・Perplexity 流入増」「Stanford 研究で有用回答 96%」— 個別事例・伝聞。
- 運用「定期更新で CTR 47% 高い・セッション 31% 長い」「AI 引用 6 件 vs 3.6 件」「業種別減衰月数」— 単一ベンダーのデータスタディ、母集団非公開。
- 米国の中小企業向け WEB 補助金 — 一次未確認。記事化非推奨。
- サイト変換率「2〜5%」— レンジ自体は各社一致するが公的統計ではない。「ある業界ベンチマークでは」と限定するか使わない。

---

## 9. 調査メタ情報

- 調査日: 2026-05-14
- 手法: general-purpose エージェント 6 体並列（6 ドメイン）。各エージェントは WebSearch を主に使用（WebFetch は本環境で権限制限のため、検索スニペット経由の一次出典引用が中心）。
- **執筆前の必須アクション**: 本書の「確度: 高」のうち、PDF 本文の細かい数値（OWASP の CVE 件数、Patchstack の通年確定値、Verizon DBIR の細部、Google 公式ドキュメントの逐語引用）は、記事化の直前に各一次 URL を直接開いて再確認すること。本書は「どの出典のどの数値を使うか」の地図であり、逐語の正本ではない。
- 旧 V2 設計書 §6「参照リンク 52 本」は本書で更新。記事執筆時は本書を参照する。

---

**Version**: 1.0 / **策定**: 2026-05-14 / ② tcharton セッション
**次アクション**: ① ルートへ §7 訂正事項をエスカレーション。本書を出典基盤として教育記事執筆を継続。
