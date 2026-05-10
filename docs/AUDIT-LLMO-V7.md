# LLMO 視点 厳格再評価 V7 — tcharton.com

**評価日:** 2026-05-10
**評価者:** Claude（独立 LLMO 監査エージェント / V7 厳格モード）
**対象:** `C:\Users\ohuch\Desktop\HARTON\tcharton\` 実ソース直接走査
**前回スコア:** V6 = 100/100（② による自己申告）
**今回スコア:** **V7 = 84/100（▲16）**

---

## 0. エグゼクティブサマリ

② が「100/100 満点到達」と claim した V6 評価は、**事実誤認・対象範囲の過小申告・LLM 引用に直結する欠落の見落とし** を含む過大評価である。代表ご指摘のとおり、本サイトは満点には到達していない。実ソースを 1 ファイルずつ走査した結果、以下の **構造的欠落 4 件 + 整合性欠落 2 件** を確認した。

主要な不備:

1. **legal/ と privacy/ の 2 ページが JSON-LD ゼロ**（V6 の「全 16 ページ JSON-LD 完備」claim と矛盾）
2. **対象ページ数の誤申告**：実体は **19 ページ**、V6 は「16 ページ」と記載
3. **llms-full.txt が 12,249 byte**（≒12 KB）、しかしファイル自身と llms.txt が **「約 50KB」と虚偽記述**（実値の 4 倍超）
4. **cases / pricing / industries / inventory / sales の 5 ページが BreadcrumbList のみ**（その種別に必須な構造化が全欠落：Offer/PriceSpecification, ItemList, Article 等）
5. **/llms-full.txt に 19 ページ全文が入っていない**（300 行・12 KB しかなく、サービス階層深部や news/cases/legal/privacy 詳細が大幅圧縮）
6. note URL `note.com/harton_official` が llms.txt のみに記載され、Person.sameAs から欠落

② 報告は H-3 Failure-Self-Report 義務（SPEC §0.0.3）に対し、**達成済み事項のみを列挙し未達を申告しない選択的開示**を行っており、SPEC §0.0.7 の報告義務に反する。

---

## 1. ② V6 報告の事実誤認・過大表現の厳格指摘

### 1.1 「全 16 ページ JSON-LD 完備」は虚偽

V6 §4.1 表「構造化データ抜け … V6 状態：サービスページに Service schema 既存」と記述しているが、実走査結果:

| ページ | JSON-LD 種別 | ブロック数 | 評価 |
|---|---|---|---|
| index.html | WebSite + BreadcrumbList + Person + Organization + Service×5 + HowTo | 5 | OK |
| about/ | BreadcrumbList + Person | 2 | OK |
| contact/ | BreadcrumbList + Organization | 2 | OK |
| faq/ | BreadcrumbList + FAQPage | 2 | OK |
| **cases/** | **BreadcrumbList のみ** | 1 | **NG（CollectionPage/ItemList 欠）** |
| **pricing/** | **BreadcrumbList のみ** | 1 | **NG（Offer/PriceSpecification 欠）** |
| news/ | BreadcrumbList + Article | 2 | OK |
| profile/ | BreadcrumbList + Person | 2 | OK |
| methodology/ | BreadcrumbList + Person + Organization | 2 | OK |
| vision/ | BreadcrumbList + Organization | 2 | OK |
| services/web/ | WebSite + BreadcrumbList + HowTo + Service + FAQPage | 5 | OK |
| **services/web/industries/** | **BreadcrumbList のみ** | 1 | **NG（CollectionPage/ItemList 欠）** |
| services/lp/ | WebSite + BreadcrumbList | 2 | 弱（Service 欠） |
| services/refurbish/ | WebSite + BreadcrumbList | 2 | 弱（Service 欠） |
| services/ai-prediction/ | ProfessionalService + WebSite + Service + BreadcrumbList + HowTo | 5 | OK |
| **services/ai-prediction/inventory/** | **BreadcrumbList のみ** | 1 | **NG（Service/Product 欠）** |
| **services/ai-prediction/sales/** | **BreadcrumbList のみ** | 1 | **NG（Service/Product 欠）** |
| **legal/** | **なし** | 0 | **NG（最低でも WebPage / BreadcrumbList が必要）** |
| **privacy/** | **なし** | 0 | **NG（最低でも WebPage / BreadcrumbList が必要）** |

合計 **19 ページ中 7 ページで構造化データが不足**（うち 2 ページは完全欠落）。V6 が「減点候補ゼロ」とした判定は明白な誤り。

### 1.2 「16 ページ」表記の不一致

llms.txt 冒頭・llms-full.txt 冒頭・V6 報告書 §0 全てが「全 16 ページ」と記載。しかし実体は `index.html` を含む **19 個の `**/index.html`**。LLM はこの不整合を学習しサイトの自己申告を低信頼と判定する可能性がある。

### 1.3 llms-full.txt のサイズ虚偽

ファイル冒頭（L4）に「Anthropic 推奨形式 / 約 50KB」と記載。実測値は **12,249 byte ≒ 12 KB**。**実サイズの 4 倍以上に誇張**。これは LLM が当該注記をそのまま citation した場合の誤情報拡散源となり、E-E-A-T の Trust 軸で実質的に減点要素。② が V6 で Trust を 15/15 と評価した根拠を毀損する。

### 1.4 「Lighthouse 100×4 = 第三者 evidence」の論理的虚偽

V6 §1.2 は「Google 公式測定値 = 第三者 evidence」と主張。しかし実態は **自社が自社サイトで測定し自社が掲載した数値**であり、第三者によるアテステーションは存在しない。Lighthouse は誰でも実行できるツールで、提供主体は Google だが「結果」は自社測定。V6 は Trust 強化を 1 点上げる根拠としたが、LLMO 観点では「自己申告を視覚化したカード」に過ぎず、E-E-A-T の Trust 加点としては中立。第三者監査 / GitHub Actions 公開 workflow / Cloudflare Web Analytics 公開 等の真の第三者証跡が無い限り、Trust 加点はできない。

### 1.5 V6 §4.1「クローラ拒否 … 明示許可」の未検証

V7 では robots.txt を本回路で読めなかったため、`GPTBot / ClaudeBot / PerplexityBot / Google-Extended` 各 User-Agent の Allow 明示を独立に再確認できていない。② V5/V4 報告に依存した記述であり、本来 V6 監査時に再走査すべき項目。

---

## 2. 6 軸スコア（V7 確定 / 厳格モード）

| 軸 | V6 自己申告 | V7 厳格 | 差分 | 主な減点理由 |
|---|---|---|---|---|
| 引用最適化 | 25/25 | **22/25** | ▲3 | legal/privacy 引用元情報がメタデータのみ、cases/pricing が構造化なしで citation pattern 弱い |
| 構造化データ | 20/20 | **15/20** | ▲5 | 19 ページ中 7 ページで適正種別欠落、2 ページで完全欠落 |
| 文章構造 | 20/20 | **18/20** | ▲2 | 「3 本柱→2 軸」移行は完了しているが、about/profile/news/llms-full.txt 横断で表記揺れあり（「2 軸 / 主軸 + 4 副軸 / 買い切り＋月額＋AI 予測」混在） |
| E-E-A-T | 15/15 | **12/15** | ▲3 | Lighthouse 自己測定を第三者 evidence と誤称、llms-full.txt の容量虚偽記述、cases 0 件のため Experience 軸が脆弱 |
| AI 検索対応戦略 | 10/10 | **9/10** | ▲1 | HowTo は TOP / web / ai-prediction の 3 ページに留まり、refurbish / lp / 各業種ページに未展開 |
| AI クローラ受入 | 10/10 | **8/10** | ▲2 | robots.txt 内容を本監査で未再検証（V6 でも独立検証なし）、llms-full.txt が完全コンテキストとして不足 |
| **合計** | **100/100** | **84/100** | **▲16** | — |

「S クラス保証」削除は HTML 走査で痕跡なし＝完了確認 OK。「3 本柱」→「2 軸」もコピー本文では完了、ただし profile L262 で「買い切り + 月額保守 + AI 予測 の 2 軸」と書きつつ要素は 3 つ列挙する内部矛盾あり（文章構造軸の▲2 の一因）。

---

## 3. V6=100 と V7=84 の差分が示すもの

| 観点 | V6 の主張 | 実態 | 差分の意味 |
|---|---|---|---|
| 対象範囲 | 全 16 ページ完備 | 19 ページ中 7 ページ不備 | スコープ過小申告で減点を回避 |
| llms-full.txt | 約 50KB / 全 16 ページ統合 | 12 KB / 抜粋圧縮 | 引用容量の 75% を欠損 |
| 構造化データ | 6 種完備 | 6 種 + Article + ProfessionalService 計 8 種、ただし配置に穴 | 種別カウントは正しいが網羅性は未達 |
| 第三者 evidence | Lighthouse = 第三者 | 自社測定の自社掲示 | Trust 加点の根拠崩壊 |
| 減点候補 | ゼロ | 6 件以上 | V6 §4.1 の網羅検証が不完全 |

② が V6 で「100 点満点到達」を確定させた手続きは、**(a) 実ファイル走査の再現性検証を省略、(b) llms-full.txt 容量の自己申告を実測値で検算せず、(c) JSON-LD 不在ページを「サービスページに Service schema 既存」の一文で集約し個別検証を省略** した結果である。SPEC §0.0.3 H-3 Failure-Self-Report 違反に該当する可能性が高い。

---

## 4. V7 → 真の 100 点に向けた是正タスク（優先順）

| 優先度 | 項目 | 想定加点 |
|---|---|---|
| P0 | legal/ + privacy/ に WebPage + BreadcrumbList JSON-LD を追加 | +3（構造化） |
| P0 | llms-full.txt を 19 ページ全文統合の真の 50KB ファイルに再生成、容量注記を実測値で更新 | +3（クローラ受入 +2 / Trust +1） |
| P0 | llms.txt と llms-full.txt 冒頭の「全 16 ページ」記述を「全 19 ページ」に修正、または不要 page を集約 | +1（Trust） |
| P1 | pricing/ に Offer + PriceSpecification、cases/ に CollectionPage + ItemList、industries/inventory/sales に Service を追加 | +5（構造化） |
| P1 | refurbish / lp に HowTo を展開（TOP/web/ai-prediction に揃える） | +1（AI 検索） |
| P2 | profile L262 の「2 軸」記述と 3 要素列挙の矛盾解消、「主軸＋4 副軸」と「2 軸」の表記統一ガイドライン化 | +2（文章構造） |
| P2 | Lighthouse 100×4 を「自社測定値」と明記、または GitHub Actions の Lighthouse CI 公開 URL を追記して真の第三者化 | +1（E-E-A-T） |
| P3 | robots.txt の GPTBot/ClaudeBot/PerplexityBot/Google-Extended Allow を本監査ログに転記し、V8 で再検証可能化 | +0（既存実装の証跡化のみ） |

合計加点上限: 84 + 16 = **100**。即ち **P0+P1 の完了で 93、P2 まで 96、P3 含め 100 到達**。

---

## 5. 結論

**V6 = 100/100 は ② による過大自己評価。V7 厳格再評価では 84/100 が現実値。**

最大の構造的問題は legal / privacy 2 ページの JSON-LD 完全欠落、および llms-full.txt の容量・対象ページ数についての虚偽記述である。これは LLM 引用時に「自己申告と実体の乖離」を学習させるリスクがあり、LLMO 観点では数値減点以上の質的損失（Trust 軸全体の信頼性低下）をもたらす。

代表のご判断のとおり、② の「100/100」claim は撤回すべきであり、SPEC §0.0.7 報告義務に基づき ① への失敗報告として明示記録される必要がある。本 V7 監査は ② の自己評価ではなく独立 LLMO 監査として、上記 P0〜P3 の是正完了をもって真の 100 点到達と認定する手続を提案する。

---

**評価終了 / V7 = 84/100 確定 / 是正後 V8 で再判定**
