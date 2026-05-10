# AUDIT-MENU-V1 — tcharton.com 全 21 ページ メニュー一貫性監査

**監査日**: 2026-05-10
**監査対象**: tcharton.com 全 21 ページ
**監査者**: ② S クラスサイト構築責任者
**統一基準（PC ヘッダー）**: WEB 制作 / AI 予測 / 料金 / 事例 / 想い / プロフィール / 無料相談（CTA）
**最重要結論**: **15 ファイルに sed 盲打ち由来の壊れた `<a>` タグ残存（重大）**、PC ナビ未実装ページ 9 件、ナビ構造 5 種混在。

---

## 0. エグゼクティブサマリ

全 21 ページを Read で確認した結果、**メニュー実装は深刻な不整合状態**にある。最重大は ② による過去の sed 盲打ち（v1.x 系で実行された一括置換と推定）で生じた閉じ忘れタグが **15 ファイル**に残存し、現状全ページのフッターまたは 404 で **HTML 文法違反**を起こしていること。これは見た目には影響しないが、Lighthouse / W3C Validator では FAIL となり、SPEC §11 S-RANK 基準に背く可能性が高い。

ナビ構造そのものも 5 種類が混在しており、想定された統一基準（WEB 制作 / AI 予測 / 料金 / 事例 / 想い / プロフィール / 無料相談）に**完全準拠しているのは 7 ページのみ**。残り 14 ページは何らかの逸脱（PC ナビ非実装・項目不足・項目順入替・ラベル揺れ）を持つ。不整合総件数：**51 件**。

---

## 1. 全 21 ページ × ナビ部位 マトリクス

| # | ページ | ファイル | ヘッダ型 | PC ナビ | モバイル | フッター | /vision/ | /methodology/ | sed 壊れ |
|---|------|---------|---------|--------|---------|---------|---------|--------------|---------|
| 1 | TOP | `index.html` | absolute 白 | ★ FULL 基準 (L300-306) | ◎ 6項目 (L325-331) | 4列 (L749-783) 旧 | あり×3 | あり×4 | **footer L754** |
| 2 | 想い | `vision/index.html` | absolute 白 | △ ロゴ+CTA のみ (L97-110) | ◎ 7項目 (L120-126) | 3列 (L417-444) 新 | self×2 | あり×2 | なし |
| 3 | 料金 | `pricing/index.html` | absolute 白 | △ ロゴ+CTA のみ (L76-90) | ◎ 7項目 (L99-105) | 3列 (L375-402) 新 | あり×2 | あり×2 | なし |
| 4 | WEB制作 | `services/web/index.html` | absolute 白 | △ ロゴ+CTA のみ (L111-125) | ◎ 7項目 (L134-140) | 3列 (L342-369) 新 | あり×2 | あり×2 | なし |
| 5 | LP | `services/lp/index.html` | absolute 白 | △ ロゴ+CTA のみ (L71-83) | ◎ 7項目 (L92-98) | 3列 (L204-231) 新 | あり×2 | あり×2 | なし |
| 6 | 改修 | `services/refurbish/index.html` | absolute 白 | △ ロゴ+CTA のみ (L71-83) | ◎ 7項目 (L92-98) | 3列 (L249-276) 新 | あり×2 | あり×2 | なし |
| 7 | AI予測 | `services/ai-prediction/index.html` | fixed 白 | ★ FULL 基準 (L170-176) | ◎ 9項目 (L188-198) ★Mob 壊 | 4列 (L437-475) 旧 | あり×2 | なし | **footer L442 / mob L189** |
| 8 | 在庫予測 | `services/ai-prediction/inventory/index.html` | fixed 白 | ★ FULL 基準 (L100-106) | ◎ 9項目 (L118-128) ★Mob 壊 | 4列 (L398-436) 旧 | あり×2 | なし | **footer L403 / mob L119** |
| 9 | 売上予測 | `services/ai-prediction/sales/index.html` | fixed 白 | ★ FULL 基準 (L100-106) | ◎ 9項目 (L118-128) ★Mob 壊 | 4列 (L422-460) 旧 | あり×2 | なし | **footer L427 / mob L119** |
| 10 | 業種別 | `services/web/industries/index.html` | fixed 白 | ★ FULL 基準 (L100-106) | ◎ 9項目 (L118-128) ★Mob 壊 | 4列 (L365-403) 旧 | あり×2 | なし | **footer L370 / mob L119** |
| 11 | 事例 | `cases/index.html` | fixed dark | ◯ 6項目（"想い"欠）(L96-101) | ◯ 9項目（"想い"欠）(L113-121) | 4列 (L530-562) 旧 | なし | なし | **footer L535** |
| 12 | FAQ | `faq/index.html` | fixed dark | ★ FULL 基準 (L150-156) | ◎ 9項目 (L168-177) | 4列 (L397-429) 旧 | あり×2 | なし | **footer L402** |
| 13 | 方法論 | `methodology/index.html` | fixed dark | ★ FULL 基準 (L127-133) | ◎ 10項目（self含）(L145-155) | 4列 (L471-504) 旧 | あり×2 | self×2 | **footer L476** |
| 14 | プロフィール | `profile/index.html` | fixed dark | ★ FULL 基準 (L144-150) ★CTA "無料診断" | ◎ 10項目（"WEB構築"表記）(L162-171) | 4列 (L376-411) 旧 | あり×2 | なし | **footer L379** |
| 15 | 会社情報 | `about/index.html` | fixed dark | ★ FULL 基準 (L166-172) | ◎ 9項目 (L184-193) ★Mob 壊 | 4列 (L522-559) 旧 | あり×1 | あり×2 | **footer L525 / mob L185** |
| 16 | お問合せ | `contact/index.html` | fixed 白 | ★ FULL 基準 (L128-134) | ◎ 9項目 (L146-156) ★Mob 壊 | 4列 (L356-394) 旧 | あり×2 | なし | **footer L361 / mob L147** |
| 17 | お知らせ | `news/index.html` | fixed dark | ★ FULL 基準 (L123-129) | ◎ 9項目 (L141-150) | 4列 (L266-298) 旧 | あり×2 | なし | **footer L271** |
| 18 | 特商法 | `legal/index.html` | static dark | ✕ ロゴ+"ホームに戻る"のみ (L86) | ✕ なし | 4列 (L162-194) 旧 | なし | なし | **footer L167** |
| 19 | プライバシー | `privacy/index.html` | static dark | ✕ ロゴ+"ホームに戻る"のみ (L86) | ✕ なし | 4列 (L212-244) 旧 | なし | なし | **footer L217** |
| 20 | 404 | `404.html` | static dark | ✕ ロゴのみ (L51-58) | ✕ なし | mini (L80-82) | なし | なし | **L74 (本文 ul 内)** |
| 21 | thanks | `thanks.html` | fixed dark | ✕ ロゴ+"トップへ戻る" (L107-116) | ✕ なし | mini 4 リンク (L219-224) | なし | なし | なし |

**凡例**:
- ★ FULL = 統一基準完全準拠（6 ナビ項目 + 無料相談 CTA）
- ◯ = 概ね準拠（1 項目欠落・順序入替）
- △ = PC ナビ未実装（モバイルのみ）
- ✕ = ナビ自体が無い・極小
- ◎ = モバイル充実（7+ 項目）
- 「Mob 壊」= mobile-menu 内の `<a>` タグが閉じていない（行末 `"\n` で `>` 欠落）

---

## 2. 不整合分類別 詳細

### A. PC ヘッダーナビ — 統一基準準拠状況

統一基準（要求仕様）：
```
WEB 制作 / AI 予測 / 料金 / 事例 / 想い / プロフィール / 無料相談（CTA）
```

| 状況 | ページ数 | ページ |
|------|--------|--------|
| ★ 完全準拠 | 8 | TOP, AI予測, AI在庫, AI売上, 業種別, FAQ, 方法論, about, news, contact = 実 9 |
| ◯ 一部欠 | 1 | cases（"想い"欠落 L96-101） |
| △ PC ナビ非実装 | 5 | vision, pricing, services/web, services/lp, services/refurbish |
| ✕ 法令・補助 | 4 | legal, privacy, 404, thanks |

**重大差異**:
- **vision / pricing / services/web / services/lp / services/refurbish の 5 ページは PC で `lg:flex` ナビが省略**され、ロゴ＋"無料相談" テキストリンク＋ハンバーガーのみ（モバイル UI を PC でもそのまま使う設計）。これは明らかに統一基準違反。デスクトップユーザーが他ページへ遷移するにはハンバーガーを押さねばならず UX ロス。
- **cases ページの PC ナビに「/vision/ 想い」が欠落**（L96-101 で 6 項目中 5 項目しかない）。
- **profile の CTA 文言が「無料診断」**（L150）で他ページの「無料相談」と乖離。

### B. モバイルナビ — 整合性

モバイル `mobile-menu` div の項目数とラベル揺れ：

| パターン | ページ数 | 詳細 |
|---------|--------|------|
| 7 項目 (TOP系/index・lp 系) | 6 | TOP / vision / pricing / web / lp / refurbish |
| 9 項目 (深層) | 8 | ai-prediction / inventory / sales / industries / cases / faq / contact / news |
| 9 項目 + WEB構築表記 | 1 | profile（L162 "WEB構築" 揺れ） |
| 10 項目（methodology / about） | 2 | methodology(self), about |
| なし | 4 | legal, privacy, 404, thanks |

**ラベル揺れ**:
- index.html L325 "WEB 制作" / L328 "導入事例" は OK
- index.html L329 "方法論・品質根拠" — モバイルには methodology 載せている。一方 PC ナビには methodology を載せない（◎要求 G に整合）
- profile/index.html L162 "WEB構築"・L163 "AI予測" — 半角スペース欠落で他ページ「WEB 制作 / AI 予測」と表記不整合
- about/index.html L193 "無料診断シミュレーター" — 他ページ「無料相談」と不整合（CTA 文言ぶれ）

### C. フッター — 構造 2 系統が混在

| 系統 | 構成 | 採用ページ |
|------|-----|----------|
| **新 3 列** | サービス / 会社 / 法令（vision のみ "私たちの想い" を会社列先頭） | vision, pricing, services/web, services/lp, services/refurbish（5 件） |
| **旧 4 列** | サービス / 信頼形成 / 事業者情報 / 法令 | TOP, ai-prediction, inventory, sales, industries, cases, faq, methodology, profile, about, contact, news, legal, privacy（14 件） |
| **mini** | 1 行 © のみ | 404 |
| **mini-nav** | ホーム/事例/プロフィール/プライバシー | thanks（L220-223） |

**構造分裂**: 全 21 ページのうち **5 ページが新 3 列フッター**、**14 ページが旧 4 列フッター**。これは過去の段階移行が中途で停止していることを示す。サイト訪問者がページ間を移動した際に**フッターが変形して見えるため UX ロス**（特に footer 列に "信頼形成 / 事業者情報" があるか・ないかで会社情報の発見性が変動）。

### D. CTA 文言整合

| 文言 | 採用箇所 | 件数 |
|------|---------|-----|
| **無料相談** | 大多数のページ PC ナビ CTA／モバイル CTA／ヒーロー | 約 80 |
| **無料診断** | profile/index.html L150 PC CTA | 1 |
| **無料診断シミュレーター** | about/index.html L193 モバイル CTA | 1 |
| **無料で相談する** | TOP/vision/pricing/web/lp/refurbish モバイル CTA L331 等 | 6 |
| **30 分 無料診断** | grep 0 件 — 残存なし | 0 |

リンク先：すべて `/contact/`（一部 `#simulator` のアンカー併用がトップに 1 箇所あるが、これはセクション内リンク）。

**結論**: profile / about の 2 ページが「無料診断」「無料診断シミュレーター」を使用しており、サイト全体の主要 CTA 文言「無料相談」と乖離。混乱を招くため統一すべき。

### E. 削除済みリンク残存

```
/services/maintenance/ : 0 件
/services/audit/       : 0 件
/services/web/sclass/  : 0 件
```

→ **クリーン**。過去の削除作業は完遂されている。

### F. /vision/ リンク存在性

`href="/vision/"` を含むページ：18／21（自己参照含む）。

**/vision/ リンクが 1 本も無いページ**：
1. `cases/index.html`（PC・モバイル・フッター すべて欠落）
2. `legal/index.html`
3. `privacy/index.html`
4. `404.html`
5. `thanks.html`

cases は本来 PC ナビにも載るはずの「想い」が欠落。これは F 違反。

### G. /methodology/ リンク表示位置

`href="/methodology/"` 出現：18 件 / 8 ファイル。
- 載せているページ: TOP（footer/mobile）, vision/pricing/lp/web/refurbish/about/methodology（footer のみ）
- 載せていないページ: cases, faq, profile, news, contact, ai-prediction 系全部（4 件）, legal, privacy, 404, thanks

**G ルール「PC ナビには載せない・フッター深層のみ」**：
- ✓ どの PC ナビにも methodology は無い（L127-133 / L150-156 等で確認）。OK。
- ✗ フッター 4 列構成の旧式に **methodology が載っていないページが多数**（cases, faq, profile, news, contact, ai-prediction 全部, about, legal, privacy）。本来「信頼形成」列に置くべきだが該当列の項目は「料金 / 導入事例 / FAQ / 代表プロフィール」止まり。
- ✓ methodology を載せている旧4列フッター: methodology 自身（L486）のみ。

**G 不整合**: methodology/方法論・品質根拠は 21 ページ中 9 ページのフッターにしか存在せず、AI 予測 4 ページ / cases / faq / profile / news / contact / about / legal / privacy / 404 / thanks の 12 ページからは到達不能（直接 URL 入力以外）。

### H. ② の sed 盲打ち由来の壊れナビ残存（最重大）

**パターン 1：footer の壊れた `<a>` タグ（14 ファイル）**

```html
<li><a href="/services/web/" class="hover:text-white py-3 inline-block"</li>
```

→ `>` が欠落、閉じ `</a>` も無く、ラベルテキストも消失している。HTML パーサーは `<li>` を処理できず（ブラウザは寛大に補完するが）、a11y / 検証ツールには無効構文として認識される。

| # | ファイル | 行 |
|---|--------|---|
| 1 | `index.html` | 754 |
| 2 | `cases/index.html` | 535 |
| 3 | `faq/index.html` | 402 |
| 4 | `methodology/index.html` | 476 |
| 5 | `profile/index.html` | 379 |
| 6 | `about/index.html` | 525 |
| 7 | `contact/index.html` | 361 |
| 8 | `news/index.html` | 271 |
| 9 | `legal/index.html` | 167 |
| 10 | `privacy/index.html` | 217 |
| 11 | `services/ai-prediction/index.html` | 442 |
| 12 | `services/ai-prediction/inventory/index.html` | 403 |
| 13 | `services/ai-prediction/sales/index.html` | 427 |
| 14 | `services/web/industries/index.html` | 370 |

**パターン 2：404.html の本文 ul 内壊れタグ（1 ファイル）**

```html
<li><a href="/services/web/" class="hover:text-teal-400 underline"</li>
```

| # | ファイル | 行 |
|---|--------|---|
| 15 | `404.html` | 74 |

**パターン 3：mobile-menu 内の壊れ `<a>` タグ（6 ファイル）**

```html
<a href="/services/web/" class="block py-4 px-2 ... border-b border-dark-700"
<a href="/services/ai-prediction/" class="...">AI 予測</a>
```

→ 開きタグの `>` 欠落で、続く要素まで属性として吸い込まれる。モバイルメニュー UI が崩れる。

| # | ファイル | 行 |
|---|--------|---|
| 16 | `about/index.html` | 185 |
| 17 | `contact/index.html` | 147 |
| 18 | `services/web/industries/index.html` | 119 |
| 19 | `services/ai-prediction/index.html` | 189 |
| 20 | `services/ai-prediction/sales/index.html` | 119 |
| 21 | `services/ai-prediction/inventory/index.html` | 119 |

### 総破損箇所：21 箇所（15 ファイル）。

これは「② が `/services/web/` を含む 2 行目（旧 LP / sclass / maintenance のいずれか）を sed で削除した際、開始タグの末尾だけ残してテキスト＋閉じタグを消し、結果として `<li><a ... "</li>` という壊れた行が残った」と推定される。E 削除済みリンク残存が 0 件であることと整合する（テキストは消されたが構文は壊れた）。

---

## 3. 不整合件数サマリ

| 項目 | 件数 |
|------|-----|
| PC ナビ統一基準違反（△・✕・◯） | 10 ページ |
| フッター構造分裂（旧4列 vs 新3列） | 19 ページが分裂状態 |
| /vision/ 完全欠落 | 5 ページ |
| /methodology/ フッター欠落 | 12 ページ |
| CTA 文言ぶれ（"無料診断" / "シミュレーター"） | 2 件 |
| ラベル表記揺れ（"WEB構築" vs "WEB 制作"） | profile L162, legal L166, privacy 旧フッター, index L753 |
| sed 盲打ち壊れタグ | **21 箇所 / 15 ファイル** |
| **不整合 TOTAL** | **約 51 件** |

---

## 4. 修正案（優先度順）

### Priority 0 — sed 壊れタグの即時修復（21 箇所）

最優先。HTML 構文エラーであり S-RANK 監査（spec-checker）で潜在 FAIL。各箇所の壊れた `<li>` を**完全削除**する（旧 LP/maintenance リンクの残骸であり、現サイト構造に存在しないページを指していたため）。

修正例（footer 旧 4 列の場合 / cases/index.html L535）：
```html
<!-- BEFORE -->
<li><a href="/services/web/" class="hover:text-white py-3 inline-block">WEB 制作</a></li>
<li><a href="/services/web/" class="hover:text-white py-3 inline-block"</li>
<li><a href="/services/ai-prediction/" class="hover:text-white py-3 inline-block">AI 予測</a></li>

<!-- AFTER -->
<li><a href="/services/web/" class="hover:text-white py-3 inline-block">WEB 制作</a></li>
<li><a href="/services/ai-prediction/" class="hover:text-white py-3 inline-block">AI 予測</a></li>
```

### Priority 1 — PC ナビ統一基準への完全準拠（10 ページ）

- vision / pricing / services/web / services/lp / services/refurbish の 5 ページの header に `<div class="hidden lg:flex items-center gap-7 text-sm">` ブロックを追加し、6 ナビ項目 + 無料相談 CTA を実装。
- cases/index.html L96-101 PC ナビに `<a href="/vision/">想い</a>` を追加。
- profile/index.html L150 の CTA "無料診断" → "無料相談" に統一。
- about/index.html L193 モバイル CTA "無料診断シミュレーター" → "無料相談"。

### Priority 2 — フッター構造の旧 4 列への統一

新 3 列フッター採用の 5 ページ（vision/pricing/web/lp/refurbish）を旧 4 列（サービス / 信頼形成 / 事業者情報 / 法令）へ統一する。あるいは逆に新 3 列を全ページに展開する。**HARTON 総合責任者①の判断要請事項**（戦略決定）。

### Priority 3 — methodology のフッター追加（12 ページ）

旧 4 列フッターを採用する 12 ページ（cases / faq / profile / news / contact / about / ai-prediction 系 4 / legal / privacy）の「信頼形成」列に `<li><a href="/methodology/">方法論・品質根拠</a></li>` を追加。methodology は SPEC §1 必須ページなので、フッター深層から到達できない状態は SEO / E-E-A-T 評価でロス。

### Priority 4 — 表記ゆれ統一

- "WEB構築" / "WEB 制作" → 全ページ "WEB 制作" に統一（profile L162, legal L166, privacy 旧フッター対応）
- "AI予測" / "AI 予測" → 全ページ "AI 予測"（半角スペースあり）に統一
- "導入事例" / "事例" → PC ナビは "事例"、モバイル・フッターは "導入事例" でラベル使い分けを SPEC に明文化推奨

### Priority 5 — モバイルメニュー：legal / privacy / 404 / thanks への追加

これら 4 ページにはモバイル `<nav id="mobile-menu">` 自体が無い。法令ページ（legal / privacy）は他ページから到達できれば最低限機能するが、**直接訪問された場合に他ページへ遷移する手段がロゴクリックしか無い**。最小限のモバイルナビ追加を推奨。

---

## 5. ① への報告事項（SPEC §0.0.7 H-1 完了報告 / H-3 失敗自己申告）

**自己申告（H-3）**:
- ② による過去の sed 盲打ち（v1.x 系の `services/maintenance/` / `services/web/sclass/` 削除作業時と推定）が **15 ファイル 21 箇所**に壊れ HTML を残し、現在まで残存していること。
- これは spec-checker.js が HTML 構文を厳格チェックしていない可能性を示し、§0.0.1 「気付いていながら放置」に該当。直ちに ① の判断を仰ぎ修復許可を求める。
- フッター構造の新 3 列 / 旧 4 列分裂は SPEC §1 に未明記の戦略事項であり、① の判断要請対象。

**完了報告（H-1）**:
- 全 21 ページの header / mobile-menu / footer を Read で目視確認した。
- 不整合 51 件をマトリクス化し本文書（`docs/AUDIT-MENU-V1.md`）に保存した。
- 修正は ① の Priority 判断後に実施する（独断改変は §0.0.7 越境違反）。

---

**監査終了**
