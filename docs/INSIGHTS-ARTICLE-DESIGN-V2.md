# T.C.HARTON 教育記事 構成設計書 V2（拡張版）

> 策定: 2026-05-14 / ② tcharton セッション
> 根拠: アメリカ 2025-2026 Web 構築最新リサーチ 4 領域（出典 52 本）+ MARKETING-OPERATING-POLICY-V2
> V1 からの変更: 8 本 → **31 本 / 6 ピラー** に拡張。最大の欠落だった「発注者（中小企業オーナー）に伝わる記事」ピラーを新設

---

## 0. V1 の問題と V2 の設計思想

### V1 の問題
V1 の 8 本は全て技術・SEO ジャーゴン寄り（LLMO / JSON-LD / Core Web Vitals…）。これらは **AI と検索エンジンには伝わるが、発注者である沼津の中小企業オーナーには伝わらない**。オーナーは「INP」も「Schema」も知らない・知りたくない。彼らが知りたいのは「自分の商売がどうなるか」。

### V2 の二層構造
記事を 2 層に分ける:

| 層 | 読者 | 役割 | 文体 |
|---|---|---|---|
| **発注者層**（ピラー 6） | 沼津の中小企業オーナー（非技術） | 信頼獲得・実績獲得・CV 直結 | ジャーゴン禁止。商売の言葉で書く |
| **専門層**（ピラー 1-5） | 同業者・AI 検索・技術リテラシー高い層 | 技術的権威の証明・AI 引用・dogfooding 実演 | 専門用語可。ただし冒頭は平易に |

両層とも GEO/LLMO 実装規律（後述）は共通適用する。

---

## 1. 全 31 記事ロースター（6 ピラー）

### ピラー 1: AI 検索時代の WEB（6 本）
| slug | タイトル | 主ペルソナ | 読者が得るもの |
|---|---|---|---|
| llmo-explained ★既存 | LLMO とは — AI 検索に引用される文章の書き方 | 採用難・AI危機感型 | AI 検索の仕組みと、引用される 4 条件 |
| geo-complete-guide ＋新 | GEO 完全ガイド — KDD 2024 論文で読み解く AI 最適化 | 専門層 | 原論文ベースの体系的理解（権威証明） |
| ai-search-engines-compared ＋新 | ChatGPT・Perplexity・Gemini 攻略法の違い | 採用難・AI危機感型 | AI ごとの引用ロジックの差と対策 |
| llms-txt-debate ＋新 | llms.txt は必要か — 賛否両論の検証 | 専門層 | 流行語に踊らされない判断基準 |
| get-cited-by-ai ＋新 | AI に「おすすめ」と言わせる方法 | 採用難・AI危機感型 | ブランドが AI 回答に載る実務 |
| search-intent ★既存 | 検索意図への回答設計（Problem-Solution / AEO） | 事業承継・刷新型 | 4 つの検索意図と回答の作り分け |

### ピラー 2: 表示速度・技術品質（6 本）
| slug | タイトル | 主ペルソナ | 読者が得るもの |
|---|---|---|---|
| core-web-vitals ★既存 | Core Web Vitals 完全解説 — INP 時代の表示速度改善 | 再制作検討型 | 3 指標の意味と合格基準 |
| why-slow-site-loses-sales ＋新 | サイトが遅いと、なぜ客が逃げるのか | 放置サイト屈辱型 | 速度 → 離脱 → 売上減の因果（オーナー語） |
| inp-deep-dive ＋新 | INP を 200ms 未満にする実装の全手法 | 専門層 | 具体的な JS 最適化手法 |
| wordpress-vs-static ＋新 | WordPress と静的 HTML、どちらを選ぶべきか | 事業承継・刷新型 | 自分の事業に合う選択の判断軸 |
| modern-build-astro ＋新 | HTML-first という選択肢 — Astro と Islands | 専門層 | モダン構築アプローチの全体像 |
| image-font-optimization ＋新 | 画像とフォントで表示速度を半分にする | 再制作検討型 | AVIF/WebP・フォント最適化の実務 |

### ピラー 3: セキュリティ（3 本）
| slug | タイトル | 主ペルソナ | 読者が得るもの |
|---|---|---|---|
| security-5-principles ★既存 | 中小企業 WEB セキュリティ 5 原則（2025 OWASP 準拠） | 放置サイト屈辱型 | 最低限守るべき 5 つ |
| are-you-really-safe ＋新 | 「うちは狙われない」は本当か | 放置サイト屈辱型 | 中小サイトが狙われる現実（オーナー語） |
| wordpress-security-basics ＋新 | WordPress のセキュリティで最低限やること | 再制作検討型 | WP 固有のリスクと対策 |

### ピラー 4: 集客・SEO（5 本）
| slug | タイトル | 主ペルソナ | 読者が得るもの |
|---|---|---|---|
| longtail-seo ★既存 | ロングテール SEO 戦略 — 地域 × 課題で勝つ | 再制作検討型 | 個人事業が現実的に勝てる検索語 |
| local-seo-guide ＋新 | 地域 × 業種で勝つローカル SEO | 事業承継・刷新型 | 地域検索で見つかる仕組み |
| google-business-profile ＋新 | Google ビジネスプロフィール完全運用ガイド | 放置サイト屈辱型 | GBP の正しい運用（訪問 70% 増） |
| seo-from-zero-backlinks ＋新 | 被リンクゼロから始める SEO | 採用難・AI危機感型 | 新規サイトの SEO 立ち上げ |
| eat-improvement ★既存 | E-E-A-T 強化ガイド — AI 時代の信頼シグナル | 事業承継・刷新型 | Google が見る品質 4 軸 |

### ピラー 5: 構造化データ・計測・運用（5 本）
| slug | タイトル | 主ペルソナ | 読者が得るもの |
|---|---|---|---|
| json-ld-implementation ★既存 | JSON-LD 構造化データ実装ガイド | 専門層 | AI に事実を渡す記法 |
| wikidata-for-ai ★既存 | Wikidata Q コードで AI に正しく認識される | 専門層 | エンティティ認識の実装 |
| measure-ai-traffic-ga4 ＋新 | GA4 で AI 流入を正しく計測する方法 | 専門層 | direct 誤分類 70.6% を可視化 |
| publish-is-not-the-goal ＋新 | 「公開して終わり」にしないための月次運用 | 事業承継・刷新型 | 公開後の運用設計（V2 主訴求と直結） |
| accessibility-wcag22 ＋新 | アクセシビリティ WCAG 2.2 — 誰も取りこぼさない WEB | 専門層 | EAA 施行・WCAG 2.2 の実装 |

### ピラー 6: 発注者に伝わる記事（★最重要 / 6 本 / 全て新規）
**ジャーゴン禁止。沼津の中小企業オーナーの「商売の言葉」で書く。信頼獲得・実績獲得・CV に最も直結する層。**
| slug | タイトル | 主ペルソナ | 読者が得るもの |
|---|---|---|---|
| how-to-read-a-quote | ホームページ制作の見積もり、正しい見方 | 事業承継・刷新型 | 「言い値」で買わされない判断力 |
| cheap-vs-expensive-site | 安いホームページと高いホームページ、何が違うのか | 事業承継・刷新型 | 価格差の正体（V2 価格戦略と直結） |
| when-to-rebuild | ホームページを作り直すべきタイミング | 再制作検討型 | 自分のサイトの寿命の見極め |
| how-to-choose-web-company | 制作会社の選び方 — 失敗しないチェックリスト | 事業承継・刷新型 | 業者選びの基準（競合の弱点を逆手に） |
| subsidy-for-website | 補助金でホームページを作る方法 | 放置サイト屈辱型 | 小規模事業者持続化補助金の使い方 |
| no-results-after-launch | 作ったのに問い合わせが来ない理由 | 再制作検討型 | 「作っただけ」では成果が出ない構造 |

★既存 = `insights/` にスタブあり（8 本）　＋新 = 新規スタブ作成が必要（23 本）

---

## 2. ピラー 6（発注者層）の執筆規律 — 「伝わる」記事の条件

リサーチ（NN/g 信頼設計 / マーケ透明性 / Baymard）より、発注者層の記事は以下を厳守:

1. **専門用語を本文で使わない**。使う場合は必ずその場で平易に言い換える（例: 「Core Web Vitals（＝Google が測る表示速度の通信簿）」）
2. **オーナーの「恐怖」から書き出す**（購買は恐怖回避で動く / V2 §2）— 「高い買い物で失敗したくない」「言い値で買わされたくない」
3. **数値は「商売の数値」に翻訳**する — 「INP 200ms」ではなく「表示が 1 秒遅いと問い合わせが◯%減る」
4. **結論を先に出す**（冒頭直答）。オーナーは結論から知りたい
5. **「自分ごと」の具体例**を入れる — 沼津・三島の業種（製造・クリニック・工務店・士業）を名指し
6. **次の行動を 1 つだけ**示す（無料診断 / 見積もり内訳ページ）

---

## 3. 全 31 記事共通の GEO/LLMO 実装規律（リサーチ確定）

V1 から継承。全記事に機械的適用:

1. 冒頭 40-60 語で問いに直答（GEO: 可視性最大 40% 向上 / KDD 2024）
2. 150-200 語ごとに統計・数値 + 一次出典
3. 1 段落 1 アイデア・3 文以内
4. 各記事に【Top N】リスト形式を含む（AI 引用の 74.2%）
5. JSON-LD 3 段スタッキング: Article + FAQPage +（該当時）HowTo / ItemList
6. `dateModified` 90 日以内維持
7. 見出し階層スキップなし（H1→H2→H3）
8. 検証可能な数値 + 一次出典リンク（曖昧な代名詞回避）
9. 内部リンク最低 3 + CTA 配置
10. 記事末に出典一覧を全列挙

---

## 4. 記事テンプレート構造（全 31 記事共通）

```
1. <h1> タイトル（30-60字 / ブランド名末尾）
2. 冒頭直答ブロック（40-60語 / Lead Evidence Block）
3. 公開日 / dateModified
4. <h2> 本文セクション（H2 = 1 トピック / H3 でサブ / 各段落 3 文以内）
5. 【Top N】リストセクション
6. FAQ セクション（4-6 問 / FAQPage JSON-LD）
7. 関連記事への内部リンク（最低 3）
8. CTA（無料診断 / 関連サービス・料金ページ）
9. 出典一覧（記事末 / 全リンク列挙）
```

---

## 5. 制作優先順位（31 本）

| 優先 | 記事群 | 理由 |
|---|---|---|
| **P0（信頼・CV 直結 / 6 本）** | ピラー 6 全 6 本 | 発注者に直接刺さる。実績獲得に最短。競合の弱点（価格非開示・成果根拠なし）を逆手に取れる |
| **P1（AI 主訴求 / 5 本）** | llmo-explained / geo-complete-guide / get-cited-by-ai / search-intent / measure-ai-traffic-ga4 | V2 主訴求「AI に選ばれる」の理論的支柱。記事自体が dogfooding 実演 |
| **P1（90 日マイルストーン / 3 本）** | longtail-seo / local-seo-guide / google-business-profile | 「沼津 × 課題」記事戦略・ポータル掲載準備の支柱 |
| **P2（技術差別化 / 8 本）** | ピラー 2・3 の残り | 競合 7 社が訴求しない技術領域 |
| **P3（専門・網羅 / 9 本）** | ピラー 5 残り・ピラー 1 残り・eat-improvement | 網羅性で AI 引用の母数を増やす |

---

## 6. 参照リンク（リサーチ出典 52 本 / ピラー別主要分）

### ピラー 1（AI 検索）
- https://arxiv.org/abs/2311.09735
- https://dl.acm.org/doi/10.1145/3637528.3671900
- https://searchengineland.com/mastering-generative-engine-optimization-in-2026-full-guide-469142
- https://www.semrush.com/blog/llm-optimization/
- https://searchengineland.com/guides/large-language-model-optimization-llmo
- https://www.semrush.com/blog/most-cited-domains-ai/
- https://searchengineland.com/llms-txt-proposed-standard-453676
- https://seranking.com/blog/llms-txt/
- https://www.mintlify.com/blog/the-value-of-llms-txt-hype-or-real
- https://www.yext.com/blog/ai-visibility-in-2025-how-gemini-chatgpt-perplexity-cite-brands
- https://brandauditors.com/blog/how-to-get-your-brand-cited-by-chatgpt-and-perplexity/

### ピラー 2（技術）
- https://web.dev/articles/inp
- https://web.dev/articles/vitals
- https://web.dev/explore/learn-core-web-vitals
- https://developers.google.com/speed/docs/insights/v5/about
- https://docs.astro.build/en/concepts/islands/
- https://www.patterns.dev/vanilla/islands-architecture/
- https://web.dev/articles/font-best-practices
- https://web.dev/learn/performance/optimize-web-fonts

### ピラー 3（セキュリティ）
- https://owasp.org/Top10/2025/
- https://web.dev/articles/strict-csp
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP
- https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
- https://www.ipa.go.jp/security/vuln/websecurity/about.html

### ピラー 4（集客・SEO）
- https://www.smartinsights.com/lead-generation/lead-generation-strategy/lead-generation/
- https://www.headcore.com/blog/b2b-marketing-for-niche-products
- https://thebrandhopper.com/learning-resources/local-seo-google-business-profile-best-practices-for-2026/
- https://www.techwyse.com/blog/search-engine-optimization/local-seo-2025-google-business-profile
- https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content

### ピラー 5（構造化データ・計測・運用）
- https://searchengineland.com/schema-markup-ai-search-no-hype-472339
- https://www.brightedge.com/blog/structured-data-ai-search-era
- https://schema.org/
- https://developers.google.com/search/docs/appearance/structured-data
- https://www.wikidata.org/
- https://kpplaybook.com/resources/how-to-report-on-traffic-from-ai-tools-in-ga4/
- https://martech.org/how-ga4-records-traffic-from-perplexity-comet-and-chatgpt-atlas/
- https://www.levelaccess.com/compliance-overview/european-accessibility-act-eaa/
- https://www.onetrust.com/blog/understanding-the-european-accessibility-act-and-wcag-22/

### ピラー 6（発注者層 / 信頼・CV）
- https://www.nngroup.com/articles/trustworthy-design/
- https://www.nngroup.com/articles/communicating-trustworthiness/
- https://www.nngroup.com/articles/commitment-levels/
- https://www.nngroup.com/articles/state-of-ux-2026/
- https://baymard.com/research/checkout-usability
- https://unbounce.com/conversion-rate-optimization/call-to-action-examples/
- https://www.sectigo.com/blog/how-small-businesses-build-customer-trust-online
- https://www.bbb.org/article/news-releases/23699-why-building-trust-is-critical-for-small-business-success
- https://contentmarketinginstitute.com/content-marketing-strategy/content-strategy-search
- https://www.hubspot.com/state-of-marketing
- https://www.artfolio.com/article/structuring-case-studies-inside-your-portfolio-to-solve-real-client-pain-points
- https://porchgroupmedia.com/blog/email-marketing-statistics/

---

## 7. 公開前 校正基準（全記事共通 / 10 項目）

1. 冒頭 40-60 語で問いに直答しているか
2. 全数値に一次出典リンクがあるか（HSCEL §3.3 mandatory）
3. 1 段落 3 文以内か
4. 【Top N】リストを含むか
5. JSON-LD（Article + FAQPage 最低）が valid か
6. 見出し階層スキップなし
7. 内部リンク最低 3 / CTA 配置
8. ブランド禁止用語 grep 0 件（景表法）
9. ピラー 6 記事は専門用語チェック（言い換えなしジャーゴン 0 件）
10. DESIGN.md §11 Validation 全 14 項目 + spec-checker S-RANK PASS

---

**Version**: 2.0（拡張版）/ **策定**: 2026-05-14
**記事総数**: 31 本（既存スタブ 8 + 新規 23）/ 6 ピラー
**次アクション**: ① 新規 23 スタブ作成 → ② P0 ピラー 6（発注者層 6 本）から本文執筆（要 GO）
