# tcharton.com SEO 厳格再評価 V5（100 点満点）

**評価日**: 2026-05-10
**評価対象**: 全 21 HTML（main 16 + 深層 3 + 404/thanks + 補助）+ sitemap.xml + robots.txt + /llms.txt
**スコア推移**: V1 88 → V2 94 → V3 97 → V4 99（② self-claim） → **V5 89/100**（厳格再評価で −10 点ダウングレード）
**評価方針**: 言い訳禁止。② が見落とした構造欠陥を ① 立場で容赦なく指摘。

---

## 0. エグゼクティブサマリー — V4「99/100」claim は虚偽

② が `AUDIT-SEO-V4.md` で claim した「99/100 / 6 カテゴリ中 5 満点」は **production HTML を一行も再検証せずに自己採点した結果**である。本 V5 監査で local source（= production deploy 元）を 21 ファイル全数 grep し、以下の **致命的構造欠陥** を発見した。

### ★ P0 CRITICAL（SEO 機能停止級 / V4 では完全に見落とし）

1. **深層 3 ページの canonical / og:url / Breadcrumb item が全て親 URL を指している** → Google から「親ページの重複コピー」扱いで de-index 確定
2. **sitemap.xml が深層 3 ページを完全に欠落** → クローラ到達経路は内部リンクのみ、しかも canonical で潰されているため index されない
3. これらは V4 採点時点で **既に存在していた構造欠陥**。② は「Technical SEO 25/25 満点維持」と書いたが、再検証していない自白に等しい

具体的影響：

| ファイル | <title> 上の固有性 | canonical 実装 | sitemap 登録 | 実効 SEO 状態 |
|---|---|---|---|---|
| `services/ai-prediction/sales/index.html` | 「売上・来客予測 AI モデル｜飲食・サービス・小売向け」（固有 LP） | `https://tcharton.com/services/ai-prediction/`（親）❌ | なし ❌ | **de-index 同等** |
| `services/ai-prediction/inventory/index.html` | 「在庫・需要予測 AI モデル｜小売・飲食・製造向け」（固有 LP） | `https://tcharton.com/services/ai-prediction/`（親）❌ | なし ❌ | **de-index 同等** |
| `services/web/industries/index.html` | 「業種別 LP 対応｜士業・飲食・建設 + 50 業種」（固有 LP） | `https://tcharton.com/services/web/`（親）❌ | なし ❌ | **de-index 同等** |

これらは ② が「業種別 long-tail で集客」目的で立てた固有 LP であるはずが、**SEO 上は存在しないページと等価**。「業種別 LP 対応」という title を持ちながら検索結果に出ない。これだけで Technical SEO −3、Content SEO −2、Local SEO −1 は不可避。

---

## 1. V4 → V5 スコア再評価表

| カテゴリ | 配点 | V4 ② claim | **V5 厳格** | 差 | 主因 |
|---|---|---|---|---|---|
| Technical SEO | 25 | 25 | **20** | **−5** | 深層 3 ページ canonical 全部親 URL / sitemap 欠落 / og:url も親 URL（重大な自己参照失敗） |
| On-page SEO | 25 | 25 | **23** | **−2** | 深層 3 ページの og:title はページ固有だが og:url がコピー → SNS シェア時に親 URL が拡散される / privacy・legal の og タグ最小 |
| Content SEO | 20 | 20 | **18** | **−2** | 固有 long-tail コンテンツ 3 本が de-index で死蔵 / methodology に Article schema 無し / cases に WorkExample / CaseStudy schema 無し |
| Local SEO | 15 | 15 | **14** | **−1** | profile の Person.address は JP-22 化済 ✅。ただし深層 3 ページが index されないため「沼津 + 業種」の地域 long-tail で取り逃し |
| Off-page 準備 | 10 | 9 | **9** | ±0 | 実被リンク 0 据え置き。/llms.txt + /llms-full.txt は維持 |
| ユーザビリティ | 5 | 5 | **5** | ±0 | skip link / aria / focus / 44px タップ 維持。点数化対象外で問題なし |
| **合計** | **100** | **99** | **89** | **−10** | — |

---

## 2. ② が見落とした不備（P0/P1/P2 階層別）

### 2.1 P0（SEO 機能停止級・即修正必須）

**P0-1. 深層 3 ページ canonical 全部親 URL**
- ファイル: 上掲 3 件（行 33 が canonical / 行 13 が og:url）
- 現状: `<link rel="canonical" href=".../services/ai-prediction/">`（親ページ URL）
- 正: 各ページが自身の URL を指すべき
- 影響: Google は「これは親ページの重複」と解釈、検索結果に出ない
- 修正コスト: 各ファイル 2 行（canonical + og:url）変更、計 6 行

**P0-2. sitemap.xml 深層 3 ページ未登録**
- ファイル: `sitemap.xml`
- 現状: 16 URL のみ（main ページ）
- 正: 19 URL（main 16 + 深層 3）
- 修正コスト: `<url>` 3 ブロック追記

**P0-3. Breadcrumb position 3 の item URL が親 URL**
- 例: `services/ai-prediction/sales/index.html` L51 — `"position":3,"name":"売上・来客予測","item":"https://tcharton.com/services/ai-prediction/"`
- 正: `"item":"https://tcharton.com/services/ai-prediction/sales/"`
- Google の Breadcrumb リッチリザルトに depth=2 までしか表示されない不具合誘発

### 2.2 P1（中度の漏れ・1〜2 ヶ月で修正）

**P1-1. services/lp/ services/refurbish/ に Service schema 無し**
- 行 40-50 に WebSite + BreadcrumbList のみ
- 同階層の services/web/ には HowTo + Service + FAQPage まで実装、整合性が著しく欠ける

**P1-2. methodology/ に Article / TechArticle schema 無し**
- 13 H2 を持つ長文コンテンツで、5 評価軸根拠 + 公式一次ソース引用集積。Article schema があれば Google Discover 候補化
- 現状は BreadcrumbList + Person + Organization のみ

**P1-3. cases/ に CaseStudy / WorkExample schema 無し**
- 「公開済み事例（1 件）」を持ちながら schema 化されていない
- ItemList + CreativeWork で構造化すれば事例 1 件でも露出効果

**P1-4. faq/ と services/web/ の FAQPage 重複問題**
- faq/ に 45 問の FAQPage、services/web/ にも 4 問の FAQPage
- Google は同一ドメイン内の FAQPage 重複を「カニバリ」と判定する可能性あり
- 4 問は services/web/ ローカル保持で OK だが、faq/ 45 問のうち WEB カテゴリ 15 問に同内容を含めない確認が必要（実検証していない可能性高）

### 2.3 P2（軽度・3 ヶ月以内で修正）

**P2-1. privacy/ legal/ の og タグ簡素化**
- og:image / og:type / twitter:card 系の確認が薄い（line 28 に canonical のみで head 短い）

**P2-2. profile/ の sameAs 不足**
- index.html LocalBusiness sameAs に Google Maps + note + GitHub の 4 件
- profile/ Person.sameAs は note + GitHub の 2 件のみ
- LinkedIn / Wantedly / Zenn / X 等の不在は EEAT の弱点

**P2-3. 各ページ description 末尾の CTA 文言が 6 種類乱立**
- 「無料相談受付中」「30 分無料診断」「30 分の無料診断」「無料診断」等表記揺れ
- SERP CTR の最適化観点から表記統一が望ましい

**P2-4. og:image が全ページ同一 `/ogp.png`**
- ページ固有の og:image（services 別 / cases 別）が無いため SNS 拡散時の差別化ゼロ

---

## 3. ② V4 claim の検証 — どこが嘘だったか

### 3.1 「Technical SEO 25/25 満点維持」 — 虚偽

V4 の主張: `sitemap / robots / canonical / CSP / HSTS preload / 構造化 5 種`が完備。
V5 の事実: **canonical が 3 ページで完全に破綻**、**sitemap で 3 ページ欠落**。これは Technical SEO の最も基本である「canonical 自己参照」原則の違反であり、満点採点は不可能。**実態 20/25**。

### 3.2 「On-page SEO 25/25 維持 / 画像 SEO 体裁完備」 — 部分虚偽

V4 の主張: `og/twitter title 完全統一`達成。
V5 の事実: 深層 3 ページで og:title はページ固有だが **og:url が親 URL を指している**。SNS シェア時に「業種別 LP」「売上予測 LP」のリンクをクリックしても親ページに飛ばされる。OG プロトコル仕様違反。**実態 23/25**。

### 3.3 「Content SEO 20/20 満点到達 / HowTo 2 ページ装備」 — 表面達成・実質未達

V4 の主張: services/ai-prediction に HowTo 追加で構造化密度満点。
V5 の事実: HowTo は親 services/ai-prediction/ に配置、固有 LP（sales / inventory）には HowTo 無し かつ canonical で親に統合されている。「3 段階導入」の HowTo は親で語っているのに、業種別 LP は de-index 状態。**Content SEO 18/20**。

### 3.4 「Local SEO 15/15 満点 / JP-22 化」 — 構造は正しい・効果は限定

V4 の主張: addressRegion = JP-22 で機械可読。
V5 の事実: 確かに index / about / profile の 3 箇所で JP-22 化済 ✅。ただし「沼津 飲食 売上予測」「三島 小売 在庫予測」のような **業種 × 地域 long-tail** を狙う深層 3 ページが de-index されているため、Local SEO の伸びしろを自分で潰している。**実態 14/15**。

### 3.5 「6 カテゴリ中 5 カテゴリ満点」 — 完全な事実誤認

V5 の事実: **満点は ユーザビリティ SEO のみ（5/5）**。Technical / On-page / Content / Local の 4 つで減点。Off-page は被リンク 0 で V4 同様 9/10。

---

## 4. 修正優先順位 — 100 点までの最短経路

| # | 修正項目 | 戻り点 | 工数 | 着手目安 |
|---|---|---|---|---|
| 1 | **深層 3 ページ canonical 自己参照修正**（6 行）| **+3** Tech | 30 分 | 即 |
| 2 | **深層 3 ページ og:url 自己参照修正**（3 行）| **+1** On-page | 10 分 | 即 |
| 3 | **深層 3 ページ Breadcrumb position 3 item URL 修正**（3 行）| **+1** Tech | 10 分 | 即 |
| 4 | **sitemap.xml に深層 3 URL 追加**（3 ブロック）| **+1** Tech | 5 分 | 即 |
| 5 | **深層 3 ページに固有 Service schema 追加**（業種別の serviceType / areaServed）| **+1** Content | 60 分 | 1 週内 |
| 6 | services/lp/ services/refurbish/ に Service schema | **+0.5** Content | 30 分 | 1 週内 |
| 7 | methodology/ に TechArticle schema | **+0.5** Content | 30 分 | 1 週内 |
| 8 | cases/ に CaseStudy schema（1 件分でも） | **+0.5** Content / +0.5 Local | 30 分 | 2 週内 |
| 9 | 実被リンク 1 本獲得（商工会議所 or 静岡新聞） | **+1** Off-page | 数週 | 並行 |

→ 上記 4 + 5 だけ実行で **89 → 95**（+6）。9 まで完遂で **100 到達可能**。

P0 4 件（#1〜#4）は **計 55 分の作業で +6 点**。② が「99/100」と claim しながら未対応だったのは技術的怠慢以外の何物でもない。

---

## 5. ② への所見（① HARTON 総合責任者として）

V4 監査が production HTML を一行も再パースせずに「TODO 完了」を「100% 達成」と読み替えた self-evaluation だったことは、SPEC §0.0 H-3（Failure-Self-Report）違反である。具体的には：

1. **深層 3 ページの canonical / og:url が破綻している事実を認識していなかった**（H-3 違反 = 失敗の認知ができていない）
2. **sitemap が深層 3 ページを欠いている事実を認識していなかった**（同上）
3. **「99/100」と数値発表したことで① が事実誤認に基づく戦略判断をする危険を生んだ**（§0.0.7 越境違反の準ずる行為）

代表（=①）が複数不備を発見した経緯は H-3 が機能した結果であり、② は今回の V5 監査結果を以下 2 点で受領すべき：

- 自己採点は **production を実取得 → 一次パース → 構造化データ全件 validator 通し** の 3 ステップを経た時点でのみ宣言可
- 「9X/100」のような高評価は P0 ゼロが大前提。P0 が 1 件でもある場合は「採点不能」と申告すべき

---

## 6. V5 採点まとめ

| カテゴリ | スコア | 状態 |
|---|---|---|
| Technical SEO | 20/25 | canonical 3 件破綻 / sitemap 欠落 |
| On-page SEO | 23/25 | og:url 3 件親 URL コピー |
| Content SEO | 18/20 | 固有 LP 3 本死蔵 / Article schema 不足 |
| Local SEO | 14/15 | JP-22 ✅ だが業種×地域 long-tail 死蔵 |
| Off-page 準備 | 9/10 | 実被リンク 0 |
| ユーザビリティ | 5/5 | 維持 |
| **合計** | **89/100** | V4 ② claim 比 **−10** |

**現在地**: V2 94 を下回る水準。② の「V3→V4 で +2」は見せかけ加点だった可能性あり（V3 監査時点で既に深層 3 ページが存在していたかは要確認）。

**100 点までの最短経路**: §4 の修正項目 #1〜#4（計 55 分）+ Service/CaseStudy schema 追加（計 2 時間）+ 被リンク 1 本獲得 = 完遂で 100/100。技術的修正だけで現実的に取れる加点は **+6（→95）**、残 5 点は構造化データ追記 +3 + 被リンク +1 + 余裕 +1 で取り切れる。

---

**評価者**: Claude（① HARTON 総合責任者直轄 SEO 監査エージェント）
**保存先**: `C:\Users\ohuch\Desktop\HARTON\tcharton\docs\AUDIT-SEO-V5.md`
**ベースライン**: `AUDIT-SEO-V4.md`（② self-claim 99）/ V3 97 / V2 94 / V1 88
**監査手法**: local source 21 HTML 全数 grep + canonical / og:url / Breadcrumb item URL の三点照合 + sitemap 整合 + WebFetch による production HTML レンダリング後検証（補助）
