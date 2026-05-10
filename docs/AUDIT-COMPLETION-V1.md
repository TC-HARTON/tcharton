# tcharton.com 完成度監査 V1（grep 中心 高速洗い出し）

**実行日:** 2026-05-10
**作業ディレクトリ:** `C:\Users\ohuch\Desktop\HARTON\tcharton\`
**手法:** grep 9 本 / HTML + dist/output.css

---

## 1. grep 結果（事実列挙）

### ① 「保守」独立サービス表記残存

パターン: `制作・保守・AI|保守運用・AI|・保守・|WEB制作・保守|WEBサイト保守運用|保守・メンテナンス`

```
index.html:84:        "WEBサイト保守運用",
index.html:114:       "itemOffered": {"@type": "Service", "name": "WEBサイト保守・メンテナンス運用"},
index.html:128:       "serviceType": ["WEBサイト構築", "WEBサイト保守運用", "AI予測モデル開発"],
index.html:190:       "WEBサイト保守運用",
index.html:322:       aria-label="...3 サービス（Web 制作・保守運用・AI 予測）..."
cases/index.html:7:    desc "...サービス別（WEB構築・保守運用・AI予測）..."
profile/index.html:7:  desc "...WEB構築・保守運用・AI予測モデル開発を 3 本柱..."
profile/index.html:11: og:description 同上
profile/index.html:73: "WEBサイト保守運用",
faq/index.html:11:     og:description "WEB構築・保守運用・AI予測..."
faq/index.html:23:     twitter:desc 同上
about/index.html:68:   description "...WEBサイト構築（Sクラス保証）・保守運用・AI予測モデル開発..."
about/index.html:99:   "WEBサイト保守運用",
about/index.html:273:  <h3>② WEBサイト保守・メンテナンス運用</h3>
```
**該当: 14 行**

### ② 旧ジャーゴン

パターン: `HARTON Stella|★★★|S クラス保証|Sクラス保証|機械検証|Deep Work|GEO 9|LLMO\b`

主要該当（多数のため抜粋）:
```
cases/index.html: ★★★ 多数 (L207, L222, L226, L230, L243, L250, L257, L273, L275,
                  L285 機械検証, L318, L428, L430, L431, L432, L441, L449, L450,
                  L459, L460, L474 機械検証, L487 機械検証, L493 機械検証)
about/index.html:68    Sクラス保証
about/index.html:269   ① WEBサイト【Sクラス保証】構築
about/index.html:295   ★★★（ S クラス）
about/index.html:309   機械検証
about/index.html:320, 327, 386, 419 機械検証, 439 機械検証, 447 機械検証
about/index.html:467, 476 機械検証, 485 ★★★, 487 ★★★, 490 S クラス保証
index.html:107         "WEBサイト【Sクラス保証】構築"
faq/index.html:83      Sクラス保証
faq/index.html:264     Sクラス保証
profile/index.html:340 機械検証
methodology/index.html:199, 210, 239 LLMO, 353, 355, 408, 422, 426, 429, 440 機械検証
methodology/index.html:417 ★★★（ S-Class）
```
**該当: 約 50 行超（cases / about / methodology 集中）**

### ③ 削除済みパスへのリンク残存

パターン: `/services/audit/|/services/maintenance/|/services/web/sclass/|/services/web/industries/|...`

```
No matches found
```
**該当: 0 件**

### ④ SPEC v3.6 / 2,554 検証項目 等の旧バージョン表記

```
about/index.html:270    spec-checker.js 2,554 検証項目で機械保証
about/index.html:378    SPEC v3.6 / 2,554 検証項目に準拠
news/index.html:205     SPEC v3.6 / 2,554 検証項目に準拠
profile/index.html:340  SPEC v3.6 §0.0 Ambassadorship Duty 準拠
methodology/index.html:7   description "...spec-checker.js 2,554 検証項目..."
methodology/index.html:60  "spec-checker 2,554 検証項目..."
methodology/index.html:176 spec-checker.js 2,554 検証項目
methodology/index.html:357 2,554 検証項目
methodology/index.html:395 SPEC v3.6 全条項
cases/index.html:250    （該当行 omitted, 同系列）
```
**該当: 10 行（v3.6 / 2,554 表記）**

最新版は SPEC v3.7 + 機械検証項目数の実数（spec-checker 走行で要確認）。

### ⑤ addressRegion が「静岡県」のまま (JP-22 化されていない)

パターン: `"addressRegion": "静岡県"`

```
No matches found
```
**該当: 0 件（既に JP-22 化済み）**

### ⑥ index.html PC インラインナビ

パターン: `class="hidden lg:flex`

```
No matches found
```
**該当: 0 件 → PC でのインラインナビが index.html に存在しない**（ハンバーガーのみで PC ナビが消滅している懸念）

### ⑦ ハンバーガーボタン menuToggle

```
index.html:288: <button id="menuToggle" type="button" class="p-3 -mr-3 text-dark-700
                hover:text-teal-700" aria-label="メニューを開く" aria-expanded="false"
                aria-controls="mobile-menu">
```
**`lg:hidden` 修飾なし** → PC でもハンバーガーが表示されるが、PC インラインナビは不在（⑥ と組み合わせ問題）。

### ⑧ アニメ CSS が dist/output.css に出力されているか

```
1 行 hit（minify 済み 1 行に圧縮 = 全クラス含まれる）
```
**該当: 出力されている（minify で 1 行）**

### ⑨ index.html タイトル整合性

```
6:  <title>T.C.HARTON｜「誰も来ない HP」を終わらせる｜静岡発の高品質 WEB 制作と AI 予測</title>
10: og:title  同上
22: twitter:title 同上
```
**該当: 3 件全一致 OK**。ただし「3 本柱（保守を含む）」表記との整合は別問題。

---

## 2. 不備件数サマリ

| # | カテゴリ | 件数 |
|---|---------|------|
| ① | 「保守」独立サービス表記残存 | **14 行 / 7 ファイル** |
| ② | 旧ジャーゴン（★★★ / Sクラス保証 / 機械検証 / LLMO） | **約 50+ 行 / 5 ファイル**（cases / about / methodology / faq / index） |
| ③ | 削除済みパス参照 | **0 件 ✅** |
| ④ | SPEC v3.6 / 2,554 旧バージョン | **10 行 / 5 ファイル** |
| ⑤ | addressRegion 未 JP-22 化 | **0 件 ✅** |
| ⑥ | PC インラインナビ不在 | **問題（hidden lg:flex 0 件）** |
| ⑦ | ハンバーガー lg:hidden 未指定 | **1 件（修飾なし）** |
| ⑧ | アニメ CSS 出力 | **OK ✅** |
| ⑨ | index.html title 整合 | **OK ✅** |

**総不備件数: 約 75 行 + ナビ構造 1 件 = 修正必要 約 76 箇所**

---

## 3. 優先度付き修正リスト

### 🔴 P0（最重要 / 戦略整合・SEO 直撃）

| # | ファイル:行 | 旧記述 | 推奨修正 |
|---|------------|-------|---------|
| 1 | `index.html:107` | `"WEBサイト【Sクラス保証】構築"` (Schema.org) | `"WEBサイト構築（★★★ 認定取得）"` 等、新ナラティブへ |
| 2 | `index.html:84,128,190` | `"WEBサイト保守運用"` (Schema serviceType / itemListElement) | 「保守」を独立 service に出さない方針なら削除 or 「★★★ 継続保証パッケージ」に統合 |
| 3 | `index.html:114` | `"WEBサイト保守・メンテナンス運用"` (Schema offer) | 同上、★★★ パッケージへ統合 |
| 4 | `about/index.html:68` | `"...Sクラス保証...保守運用..."` (Schema description) | ★★★ 認定 + 構築主軸に書き換え |
| 5 | `about/index.html:269,273,490` | 「① WEBサイト【Sクラス保証】構築」「② 保守・メンテナンス運用」 | 新主軸（★★★ パッケージ）+ 4 副軸へ刷新（直近 commit b0b8c95 と整合） |
| 6 | `index.html:6,10,22` | title「静岡発の高品質 WEB 制作と AI 予測」 | 直近 commit と整合：「★★★ 認定」キーワード追加検討 |

### 🟠 P1（コンテンツ整合）

| # | ファイル:行 | 旧記述 | 推奨修正 |
|---|------------|-------|---------|
| 7 | `about/index.html:270,378` | `2,554 検証項目` `SPEC v3.6` | 最新版数値・SPEC v3.7 へ |
| 8 | `news/index.html:205` | `SPEC v3.6 / 2,554 検証項目` | 同上 |
| 9 | `methodology/index.html:7,60,176,357,395` | `2,554 検証項目` `SPEC v3.6` | 最新版 |
| 10 | `profile/index.html:340` | `SPEC v3.6 §0.0` | 最新版 |
| 11 | `cases/index.html:7` | desc「WEB構築・保守運用・AI予測」 | 「★★★ 認定 / WEB 構築 / AI 予測」 |
| 12 | `profile/index.html:7,11,73` | 「3 本柱（保守運用）」 | 主軸 + 副軸に再編 |
| 13 | `faq/index.html:11,23,83,264` | 「保守運用」「Sクラス保証」 | ★★★ 認定 / 継続保証へ |

### 🟡 P2（ナビ構造）

| # | ファイル:行 | 問題 | 推奨修正 |
|---|------------|------|---------|
| 14 | `index.html:288` | `menuToggle` ボタンに `lg:hidden` 修飾なし、PC でもハンバーガー表示 | `class="lg:hidden p-3 -mr-3 ..."` 追加 |
| 15 | `index.html` 全体 | `hidden lg:flex` クラスのインライン PC ナビが存在しない | PC ナビバー追加（about / cases / methodology / services/web / contact 等） |

### 🟢 P3（旧ジャーゴン整理 / cases / methodology 一括）

| # | ファイル | 件数 | 方針 |
|---|---------|-----|------|
| 16 | `cases/index.html` L207-493 | ★★★ / 機械検証 約 25 行 | 用語統一（「★★★ 認定」「機械検証」は新ナラティブで temp 採用なら維持可。確定方針要） |
| 17 | `methodology/index.html` L199-440 | LLMO / 機械検証 / S-Class 約 15 行 | 同上 |
| 18 | `about/index.html` L295-490 | ★★★ / Sクラス / 機械検証 約 10 行 | 同上 |

---

## 4. 「100% 完成」までの修正必要件数

| 優先度 | 件数 | 概算工数 |
|-------|-----|---------|
| 🔴 P0（戦略整合 / Schema.org） | 6 箇所（index / about 中心） | 1.5h |
| 🟠 P1（バージョン文字列・metadesc） | 13 箇所（5 ファイル） | 1.0h |
| 🟡 P2（PC ナビ復活） | 2 箇所（index.html 構造） | 1.5h |
| 🟢 P3（cases / methodology 旧ジャーゴン整理） | 約 50 行（方針確定後一括） | 2.0h（方針依存） |

**合計: 約 76 修正箇所 / 工数 6.0h（P0+P1+P2 = 21 箇所 / 4.0h で「実害ゼロ」到達）**

### 良好項目（修正不要）

- ✅ 削除済みパス（/services/audit/ 等）への dead link 0 件
- ✅ addressRegion JP-22 化完了
- ✅ アニメ CSS は dist/output.css へ minify 出力済み
- ✅ index.html の title / og:title / twitter:title は 3 件完全一致

### 次アクション推奨

1. **P0 優先**: `index.html` Schema.org JSON-LD（L84-190）と `about/index.html` の 3 本柱表記を新ナラティブ（主軸 ★★★ + 4 副軸）へ統一
2. **P1**: SPEC v3.6 / 2,554 を最新版に一括置換（`Edit replace_all` で 5 ファイル）
3. **P2**: index.html ヘッダーに PC インラインナビを復活、`menuToggle` に `lg:hidden` 付与
4. **P3**: ★★★ / 機械検証 用語の確定方針を ① HARTON 総合責任者に確認後、cases / methodology を一括整理

---

**監査完了 / 報告者:** ② S クラスサイト構築責任者
**所要時間:** grep 9 本実行 + 集計 = 約 8 分
