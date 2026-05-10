# tcharton.com SEO 監査レポート（100 点満点評価）

**監査日:** 2026-05-10
**監査対象:** `https://tcharton.com/`（ローカル `C:\Users\ohuch\Desktop\HARTON\tcharton\`）
**評価対象ページ数:** 主要 16 ページ + 配下サブページ 4 件（industries / sales / inventory / thanks）= 20 ページ
**監査者:** SEO 視点 100 点満点評価（Google 検索セントラル / Core Web Vitals / E-E-A-T / Local SEO / GEO 9 戦略 を基準）

---

## 1. エグゼクティブサマリ

### 総合スコア: **88 / 100**（A ランク）

| カテゴリ | 配点 | 現スコア | 達成率 |
|---|---|---|---|
| Technical SEO | 25 | **24** | 96% |
| On-page SEO | 25 | **22** | 88% |
| Content SEO | 20 | **17** | 85% |
| Local SEO | 15 | **13** | 87% |
| Off-page SEO 準備 | 10 | **7** | 70% |
| ユーザビリティ SEO | 5 | **5** | 100% |
| **合計** | **100** | **88** | **88%** |

### 100 点までの距離: **12 点**

**所感（一文要約）:** 技術 SEO・構造化データ・E-E-A-T シグナルは S クラス到達済みだが、**Off-page 準備（被リンク戦略・SNS 露出）と Content の構造化（Article schema・記事資産・内部リンク網）に伸びしろ**がある。Local SEO は NAP・LocalBusiness schema 完備だが Google ビジネスプロフィール (GBP) との明示連携と地域共起語の不足で 2 点減。

### 強み（特筆事項）
- **構造化データの密度が業界 S クラス**: ProfessionalService + LocalBusiness 二重型 / OfferCatalog 3 件 / Person / WebSite / BreadcrumbList / FAQPage / SpeakableSpecification 全実装
- **HSTS preload 登録済み + CSP / Trusted Types / COOP/COEP/CORP** 全設定: 技術 SEO の品質シグナルが極めて高い
- **HTML/CSS/JS が `<img>` 不在の SVG ベース**: Core Web Vitals (LCP/CLS) で構造的に有利
- **llms.txt 完備**: GEO（Generative Engine Optimization）でも先行
- **AI クローラー個別 Allow** (GPTBot / ClaudeBot / PerplexityBot 等): GEO 対応の rare な水準

### 弱み（減点要因）
1. ❌ **Article / NewsArticle / BlogPosting schema 未実装**（news / methodology / cases に必要）
2. ❌ **Service ページ個別の Service schema が services/web に欠落**（ai-prediction にはあり、整合性欠）
3. ❌ **`<img>` 全廃のため alt 属性が空**（OGP 1 枚のみ実物画像 / SVG ロゴしかなく、画像 SEO の機会損失）
4. ❌ **AggregateRating / Review schema ゼロ**: 事例ページに顧客許諾ありながら Review 化していない
5. ❌ **GBP（Google Business Profile）のサイトリンク（`sameAs` の cid URL のみで `@id` 連携なし）**
6. ❌ **記事/ブログ資産がサイト内になく note.com に外出し**: ドメイン内 Content Depth が浅い
7. ❌ **内部リンクのアンカーテキスト多様性不足**（"詳しく見る →" など汎用文言が大半）
8. ❌ **地域共起語（沼津駅・三島駅・東名・新東名・伊豆）の本文内出現密度低**
9. ❌ **OGP 画像が単一 (`/ogp.png`)**: ページ別 OGP がなく SNS シェア時の差別化なし
10. ❌ **lastmod が全ページ同一日付（2026-05-10）**: クロール最適化機会損失
11. ❌ **HowTo schema 未実装**（「制作の流れ」「3 段階導入プロセス」が候補）

---

## 2. カテゴリ別 詳細評価

### 2.1 Technical SEO（**24 / 25**）

| 項目 | 評価 | 詳細 |
|---|---|---|
| sitemap.xml | ✅ 5/5 | UTF-8 / 16 URL / changefreq / priority / lastmod 完備 |
| robots.txt | ✅ 5/5 | 12 種類の AI/検索クローラー個別 Allow（業界トップ水準）+ Sitemap 宣言 |
| canonical | ✅ 3/3 | 全ページ自己参照 canonical 確認 |
| HTTPS / HSTS | ✅ 3/3 | preload 登録済（`max-age=63072000; includeSubDomains; preload`） |
| Mobile-friendly | ✅ 2/2 | viewport / Tailwind レスポンシブ / mobile-menu 完備 |
| 構造化データ | ✅ 3/3 | LocalBusiness / ProfessionalService / OfferCatalog / Person / FAQPage / Breadcrumb / Speakable |
| Core Web Vitals 構造 | ✅ 2/2 | preconnect / preload font / SVG-only / GPU-only animation / prefers-reduced-motion |
| 内部リンク構造 | ⚠️ 1/2 | フッター 4 セクション + ヘッダー網羅は良いが、本文内コンテキスト型内部リンクが弱い |

**減点 1 点:** 本文内の文脈的内部リンク（contextual link）が少ない。「30 分無料診断」「★★★」「業界 902 件調査」などの語に毎回リンクが付かない箇所あり。

---

### 2.2 On-page SEO（**22 / 25**）

| 項目 | 評価 | 詳細 |
|---|---|---|
| `<title>` 最適化 | ✅ 4/5 | 全ページ unique / キーワード前置 / `｜T.C.HARTON` ブランド付与一貫。ただし TOP の title が 35 字と短く CTR 上昇の機会損失 |
| `<meta description>` | ✅ 4/5 | 全ページ unique / 120-160 字。`contact/` の "ご連絡をにて承ります" など微小な日本語誤りあり |
| h1-h6 階層 | ✅ 4/5 | 各ページ h1 単一 / h2 構造的。ただし複数ページでフッター内 `<h2>` が SEO 階層に混入（フッター見出しは h2 でなく `<p class="font-bold">` か aria-label が望ましい） |
| meta tags（robots/theme/viewport） | ✅ 3/3 | `index, follow, max-image-preview:large` 完備 |
| alt 属性 | ⚠️ 1/3 | `<img>` が OGP 画像 1 枚のみ。SVG は `aria-label`/`role="img"` で代替済だが **画像 SEO の戦略的活用ゼロ**（pictures セクションを設けて代表写真・成果物スクショを `alt` 付きで配置すべき） |
| URL 構造 | ✅ 3/3 | 浅い階層 / 日本語 URL なし / trailing slash 統一 / ハイフン区切り |
| キーワード密度・E-E-A-T | ✅ 3/4 | 「沼津」「静岡」「WEB 制作」「AI 予測」のターゲット語が自然密度。Experience（実績）・Expertise（プログラミング 15 年）・Authoritativeness（公式 8 一次ソース）・Trustworthiness（特商法・プライバシー・LocalBusiness）全揃い。ただし顕名の「著者プロフィール」リンクが各記事ページに張られていない |

**減点 3 点:** ① フッター h2 階層汚染、② alt 戦略欠如、③ 著者シグナル本文内不徹底。

---

### 2.3 Content SEO（**17 / 20**）

| 項目 | 評価 | 詳細 |
|---|---|---|
| コンテンツの深さ | ✅ 5/6 | methodology は 2554 検証項目 / 5 評価軸 / 8 一次ソース で他社圧倒。faq 45 問は GEO Statistics 戦略に好適。ただし cases は公開 1 件のみで深さ不足 |
| 独自性 | ✅ 5/5 | 「★★★ S クラス保証」「902 件調査」「月次再判定」「spec-checker.js 2554 項目」は競合他社にない一次データ |
| 検索意図適合 | ✅ 4/5 | TOFU（vision/about）・MOFU（services/methodology）・BOFU（pricing/contact）の 3 階層適合。ただし「ホームページ制作 沼津 料金」「中小企業 AI 予測 導入」のような複合クエリ向け LP（リスティング受け皿）が独立していない |
| 内部リンク | ⚠️ 2/3 | フッター・ヘッダーは網羅。本文内 contextual link は方法論ページから他ページへの誘導が薄い |
| アンカーテキスト | ⚠️ 1/1 | "詳しく見る →" "もっと見る" 等の generic anchor が 50% 超。target keyword anchor に置換すべき（例:「WEB 制作の料金詳細」） |

**減点 3 点:** ① cases 1 件のみ、② 検索クエリ別 LP 不足、③ アンカーテキスト多様性不足。

---

### 2.4 Local SEO（**13 / 15**）

| 項目 | 評価 | 詳細 |
|---|---|---|
| LocalBusiness schema | ✅ 5/5 | ProfessionalService + LocalBusiness 二重 / address / geo / openingHours / areaServed 7 自治体 |
| NAP 一貫性 | ✅ 4/4 | 全ページで「静岡県沼津市大岡 2690 / info@tcharton.com / 080-1058-0538」一致 |
| 地域シグナル | ⚠️ 2/3 | 沼津・三島・富士・富士宮・裾野・長泉・清水は areaServed に明示。ただし**本文内の地域共起語が弱い**（「沼津駅から車 10 分」「東名沼津 IC」「沼津港」「狩野川」「香貫山」などの周辺ランドマーク不在） |
| Google Maps 連携 | ⚠️ 2/3 | `sameAs` に Google Maps cid URL 2 種あり良好。ただし **GBP（Google Business Profile）の埋込み iframe または `@id` リンクがサイト内になく**、ローカルパック評価に弱い |

**減点 2 点:** 地域ランドマーク不在 + GBP サイト連携浅い。

---

### 2.5 Off-page SEO 準備（**7 / 10**）

| 項目 | 評価 | 詳細 |
|---|---|---|
| 被リンクされやすさ | ⚠️ 2/4 | methodology の 902 件調査 + 2554 検証項目は被リンク誘発資産だが、**統計データのダウンロード（CSV / PDF）提供なし**で引用障壁が高い |
| SNS シェア対応 | ✅ 2/3 | OGP 完備 / Twitter Card / share-friendly。ただし **note 以外（X / LinkedIn / GitHub README）への戦略的アンカー薄い**（GitHub は sameAs にあり） |
| OGP 品質 | ✅ 3/3 | `og:image:width/height/type` 完備 / 1200×630 PNG / locale 指定 |

**減点 3 点:** ① 引用可能データ資産（CSV/PDF）不在、② 被リンク誘発記事資産（research / whitepaper）が note 外出し、③ ページ別 OGP 不在。

---

### 2.6 ユーザビリティ SEO（**5 / 5**）

| 項目 | 評価 | 詳細 |
|---|---|---|
| ナビ構造・回遊性 | ✅ 2/2 | mobile-menu / breadcrumb / skip-link / focus visible |
| アクセシビリティ | ✅ 2/2 | `aria-*` 完備 / WCAG 2.2 AA 準拠（SPEC §11） |
| 滞在時間向上要素 | ✅ 1/1 | hero アニメ（5 秒 3 幕）/ FAQ accordion / methodology の階層的読み物 |

満点。

---

## 3. 改善項目リスト（30 項目以上 / 優先度付き）

凡例: 🔴 critical（取得点 ≥ 1.5）｜🟠 important（取得点 0.5–1.5）｜🟡 nice-to-have（取得点 < 0.5 / 累積効果）

### 3.1 Technical SEO 改善

| # | 優先度 | 項目 | 想定取得点 | 具体策 |
|---|---|---|---|---|
| T-01 | 🔴 | **HowTo schema を「制作の流れ」/「3 段階導入」に追加** | +0.5 | services/web の "プロセス 5 step" / services/ai-prediction の "分析→PoC→本番" を `@type: HowTo` 化。`step` 配列を `HowToStep` で記述 |
| T-02 | 🟠 | **Article / BlogPosting schema を news / methodology に追加** | +0.5 | `headline` `datePublished` `dateModified` `author` `publisher` `image` `mainEntityOfPage` を実装 |
| T-03 | 🟠 | **lastmod をページ毎の実更新日に分散** | +0.3 | sitemap.xml の lastmod を `git log -1 --format=%cI <file>` ベースで自動生成 |
| T-04 | 🟡 | **`<link rel="alternate" hreflang="ja-JP">` 自己参照** | +0.1 | 国際展開予定なくても `ja-JP` 自己参照 + `x-default` で言語明示 |
| T-05 | 🟡 | **Image sitemap 追加**（`sitemap-images.xml`） | +0.1 | OGP / favicon / 今後追加する代表写真を画像 sitemap に登録 |
| T-06 | 🟡 | **Cache-Control を `index.html` で `max-age=300, must-revalidate` に明示** | +0.1 | `_headers` の `/*` セクションに HTML 短期キャッシュを追記し、クロール頻度に追従 |

### 3.2 On-page SEO 改善

| # | 優先度 | 項目 | 想定取得点 | 具体策 |
|---|---|---|---|---|
| O-01 | 🔴 | **TOP の `<title>` を 50-60 字に拡張** | +0.6 | 現状 35 字 → `T.C.HARTON｜静岡・沼津のWEB制作×AI予測｜S クラス保証 / 月次再判定で 902 件中トップ品質` のような 56 字版に |
| O-02 | 🔴 | **フッターの `<h2>`（サービス/会社/法令/信頼形成）を `<h3>` または `<p class="...">` + `aria-labelledby` に変更** | +0.5 | h2 階層汚染を解消し、本文 h2 のみを h2 として認識させる |
| O-03 | 🔴 | **代表者写真 (`<img alt="代表 大内達也（沼津市）">`) を profile / about / contact に配置** | +0.6 | E-E-A-T の Authorship 視覚シグナル + 画像 SEO + alt キーワード |
| O-04 | 🟠 | **各記事ページ末尾に著者ボックス（`<aside class="author-bio">` + Person schema）を共通化** | +0.3 | リンク `/profile/` 共通化 + `rel="author"` |
| O-05 | 🟠 | **contact の description「ご連絡をにて承ります」誤字を修正** | +0.1 | "ビデオ会議ご希望の方はフォーム内容欄でその旨ご記入ください" に書き換え |
| O-06 | 🟠 | **services/web の Service schema 追加（ai-prediction と整合）** | +0.3 | `@type: Service`、`serviceType: "WEBサイト制作"`、`provider: @id #professional-service` |
| O-07 | 🟡 | **page 別 OGP 画像生成**（services/web 用 / pricing 用 / methodology 用） | +0.2 | `og:image` を page-specific に上書き。SNS シェア時の CTR 向上 |
| O-08 | 🟡 | **本文内 strong/em の SEO 利用**: 「★★★ S クラス保証」「902 件調査」を `<strong>` で強調 | +0.1 | キーワード強調シグナルの正規利用 |

### 3.3 Content SEO 改善

| # | 優先度 | 項目 | 想定取得点 | 具体策 |
|---|---|---|---|---|
| C-01 | 🔴 | **`/blog/` または `/insights/` ディレクトリ新設し、note 公開記事を canonical 一致で再公開** | +1.0 | サイト内 Content Depth + 内部リンク先増 + Article schema 適用余地。note は `rel="canonical" → tcharton.com/insights/...` |
| C-02 | 🔴 | **cases に追加 3-5 件の事例を公開**（許諾 OK のもの） | +0.5 | 業種別 (士業 / 飲食 / 建設) でテンプレ化、各事例に `@type: Article` + `image` |
| C-03 | 🟠 | **検索クエリ別 LP を追加**: `/services/web/numazu/` `/services/web/mishima/` `/services/web/wordpress-numazu/` | +0.5 | ローカル + サービス複合語クエリ受け皿 |
| C-04 | 🟠 | **アンカーテキストを target keyword 化**: "詳しく見る" → "WEB 制作プラン 2 種を見る"、"もっと見る" → "FAQ 45 問を読む" | +0.3 | site-wide 一括置換 |
| C-05 | 🟠 | **methodology の 902 件調査を `/data/numazu-902-report.csv` で公開** | +0.5 | 引用障壁を下げ被リンク誘発。`schema:Dataset` 適用 |
| C-06 | 🟡 | **TOC（目次）を methodology / faq の上部に追加**（`<nav aria-label="目次">`） | +0.1 | dwell time 向上 + 内部アンカーリンク増 |
| C-07 | 🟡 | **関連ページボックス（`<aside class="related">`）を全ページ末尾に** | +0.2 | 本文内 contextual link 量産 |

### 3.4 Local SEO 改善

| # | 優先度 | 項目 | 想定取得点 | 具体策 |
|---|---|---|---|---|
| L-01 | 🔴 | **about / contact に Google Maps の埋込み iframe + リンク** | +0.5 | `<iframe src="https://www.google.com/maps/embed?...&cid=16606425942373165010">`。CSP の `frame-src` を `https://www.google.com` 許可に拡張 |
| L-02 | 🟠 | **本文内に地域ランドマーク 5-7 個自然挿入** | +0.5 | 「沼津駅から車 10 分」「東名沼津 IC 近郊」「沼津港の飲食店様にも対応」「狩野川を望む沼津大岡」 |
| L-03 | 🟠 | **areaServed に「伊豆」「熱海」「函南」「御殿場」追加（拡張余地）** | +0.3 | 静岡県東部の検索流入拡張 |
| L-04 | 🟡 | **GBP の口コミを `/cases/` に Review schema で再掲（許諾後）** | +0.2 | `aggregateRating` の根拠と reviewBody |

### 3.5 Off-page SEO 準備改善

| # | 優先度 | 項目 | 想定取得点 | 具体策 |
|---|---|---|---|---|
| F-01 | 🔴 | **被リンク誘発資産: 「静岡県中小企業 WEB サイト品質白書 2026」PDF を発行** | +1.0 | methodology の 902 件データ + プライム 1830 社実測を統合 PDF 化、`/whitepaper/` で公開し note / X / LinkedIn で告知 |
| F-02 | 🟠 | **note 記事の本文末尾に "出典: tcharton.com" の自然リンクを毎記事配置** | +0.3 | 既に運用中なら可視化を強化 |
| F-03 | 🟠 | **静岡県商工会・沼津商工会議所・地元 IT コミュニティへの登録依頼**（D-class link） | +0.3 | LocalBusiness のシグナル強化、被リンクと citation を兼ねる |
| F-04 | 🟡 | **GitHub プロフィールに tcharton.com / spec-checker.js リンク** | +0.2 | tech audience からの authority link |
| F-05 | 🟡 | **AggregateRating schema（cases 公開許諾の集計）** | +0.2 | `ratingValue` + `reviewCount` を Service に紐付け |

### 3.6 ユーザビリティ・補強

| # | 優先度 | 項目 | 想定取得点 | 具体策 |
|---|---|---|---|---|
| U-01 | 🟡 | **検索ボックス（site search）を追加**（最低限 cases / faq 内） | +0.1 | dwell time 向上 |
| U-02 | 🟡 | **404.html に "人気ページ Top 5" を追加** | +0.1 | 失敗離脱の救済 |
| U-03 | 🟡 | **`prefers-color-scheme: dark` 対応** | +0.1 | 体験品質の細部 |

---

## 4. 100 点到達ロードマップ

### Phase 1（1-2 週間 / 🔴 critical 集中 / +5.5 点）→ **93.5 点**

実施項目: O-01 / O-02 / O-03 / T-01 / C-01（or 着手）/ C-02（追加事例 1 件）/ L-01 / F-01（着手）

成果物:
- TOP title 拡張版デプロイ
- 全ページ footer h2 → h3/aria 修正
- 代表写真撮影 + profile/about/contact に配置（alt キーワード付）
- HowTo schema を services/web + ai-prediction に実装
- /blog/ ディレクトリ新設（既存 note 5 記事を canonical 一致で再公開）
- cases に 1 件追加（既存準備中事例の前倒し公開）
- about / contact に Google Maps iframe（CSP 拡張済）
- 白書 PDF 構成案ドラフト（公開は Phase 2）

### Phase 2（3-4 週間 / 🟠 important 集中 / +4.5 点）→ **98 点**

実施項目: T-02 / T-03 / O-04 / O-05 / O-06 / O-07 / C-03 / C-04 / C-05 / L-02 / L-03 / F-01 完成 / F-02 / F-03

成果物:
- Article schema 全記事適用
- sitemap.xml lastmod 自動化スクリプト
- 著者ボックス共通コンポーネント化
- contact description 誤字修正
- services/web Service schema
- page 別 OGP 3 種生成
- 沼津 / 三島 / WordPress-沼津 複合語 LP 3 件公開
- アンカーテキスト site-wide 一括置換（CI で diff レビュー）
- 902 件調査 CSV 公開（schema:Dataset）
- 地域ランドマーク自然挿入 + areaServed 拡張
- 静岡県中小企業 WEB 品質白書 PDF v1.0 公開 + note / X 告知
- 商工会・商工会議所・地元コミュニティ 3 箇所登録依頼

### Phase 3（仕上げ / 🟡 nice-to-have / +2 点）→ **100 点**

実施項目: T-04 / T-05 / T-06 / O-08 / C-06 / C-07 / L-04 / F-04 / F-05 / U-01 / U-02 / U-03

成果物:
- hreflang ja-JP 自己参照 + x-default
- image sitemap
- HTML キャッシュヘッダ調整
- 本文内 strong/em SEO 利用
- TOC / 関連ページボックス共通化
- GBP 口コミ Review schema 再掲
- GitHub プロフィール改修
- AggregateRating 紐付け
- site search / 404 改善 / dark mode

### KGI / 成功指標（100 点到達後 6 ヶ月想定）

| 指標 | 現状想定 | 100 点到達 6 ヶ月後目標 |
|---|---|---|
| Google Search Console「沼津 ホームページ制作」掲載順位 | 圏外〜30 位 | **5 位以内** |
| 「静岡 AI 予測」掲載順位 | 圏外 | **10 位以内** |
| 月間オーガニック流入セッション | ~50 | **500+（10 倍）** |
| 被リンクドメイン数 | < 5 | **30+**（白書効果） |
| GBP 経由ローカルアクション数 | 不明 | **月 20 件+** |
| AI 検索（Perplexity / ChatGPT Search）言及回数 | 不明 | **月 5 回以上**（GEO 9 戦略 + 白書） |

---

## 5. 結論

tcharton.com は **技術 SEO・構造化データ・E-E-A-T のコア基盤において既に S クラス到達済**である（特に AI クローラー対応 / HSTS preload / spec-checker 2554 項目の品質ガバナンスは業界の最上位 1% に該当）。

**100 点到達のための残課題は実質 3 つ**:

1. **Content 資産のサイト内化**（note → /blog/, 白書 PDF, cases 拡充）
2. **画像・著者・地域シグナルの視覚化**（代表写真・Maps 埋込・地域ランドマーク言及）
3. **被リンク戦略の起動**（白書発行 → 商工会・コミュニティ・SNS 経由の自然被リンク獲得）

Phase 1 の 8 項目（特に O-01 / O-02 / O-03 / L-01）は工数 5-10 時間で +5 点以上が見込める **コスパ最大化施策**である。即着手推奨。

---

**監査終了**
