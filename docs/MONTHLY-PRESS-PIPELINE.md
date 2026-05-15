# 月次プレスリリース自動化パイプライン

> Stella scanner の月次再スキャン → 自動 press release 生成のフロー定義
> Last updated: 2026-05-15 / 計画ブレ防止用

---

## 0. 目的

東証プライム / スタンダード / グロース市場の WEB 品質を**月次で再スキャン**し、Phase 進行ごとに **press release を半自動生成**する。Phase F 完了時から運用開始。

**目標**: スキャン完了 → press 公開まで **24 時間以内**。

---

## 1. パイプライン全体像

```
[scanner 実行]
    ↓ summary.json + CSV 出力
[gen-press-from-scanner.js]
    ↓ HTML テンプレ + データ差込
[press/{YYYY-MM-{phase}-{N}}/index.html] 自動生成
    ↓
[gen-ogp-press.js] OGP 自動生成
    ↓
[spec-checker.js + sitemap.xml] 自動更新
    ↓
[git commit + push]
    ↓
[① 代表 確認 → GO]
    ↓
[note.com 投稿 + GitHub Issue でアナウンス]
```

---

## 2. ファイル/ディレクトリ規約

### URL slug
`/press/{YYYY-MM}-{scope}-{N}/`

| 例 | 内容 |
|---|---|
| `/press/2026-05-jpx-prime-1553/` | Phase E プライム（公開済 / 2026-05-15）|
| `/press/2026-06-jpx-standard-1600/` | Phase F スタンダード（予定）|
| `/press/2026-07-jpx-growth-XXX/` | Phase G グロース（予定）|
| `/press/2026-08-jpx-prime-1553-month2/` | Phase E 月次更新（差分版）|

### 命名ルール
- `{YYYY-MM}` = スキャン基準月（公開月ではない）
- `{scope}` = `jpx-prime` / `jpx-standard` / `jpx-growth` / `regional-{都市}` 等
- `{N}` = 母集団社数（実数のみ。推測値や丸めは禁止）

---

## 3. データソース

| 種類 | 場所 | 用途 |
|---|---|---|
| 母集団リスト | scanner/phase-{E,F,G}-{scope}-urls.csv | 社数・業種分類 |
| 集計サマリ | scanner/phase-{E,F,G}-{scope}-summary.json | 中央値・平均・NG・★ |
| 個別スコア | scanner/phase-{E,F,G}-{scope}-results.csv | 業種別集計用（個社名は非公開） |
| 公式出典 | https://www.jpx.co.jp/markets/statistics-equities/misc/01.html | リリース文中で必ず引用 |

**禁止**:
- 「主要企業」「優良企業」「プライム＝ベスト」等の独自言い換え
- scope に「静岡県」等の地理修飾を勝手に付ける
- summary.json に存在しない数値の創作

---

## 4. テンプレ（press release 雛形）

`press/2026-05-jpx-prime-1553/index.html` を gold standard として、以下を差し込む：

| プレースホルダ | データソース |
|---|---|
| `{TITLE}` | "{scope ja}上場企業 {n} 社の WEB 品質を機械検証 — Stella データを CC BY 4.0 で公開" |
| `{N_TOTAL}` | summary.json `n_total` |
| `{MEDIAN}` | summary.json `score_stats.median` |
| `{MEAN}` | summary.json `score_stats.mean` |
| `{MAX}` | summary.json `score_stats.max` |
| `{NG_PCT}` | summary.json `ng_pct` |
| `{NG_TOTAL}` | summary.json `ng_total_companies` |
| `{NG_BREAKDOWN}` | summary.json `ng_breakdown` (4 種) |
| `{TOP3_INDUSTRIES_NG}` | by_industry を ng_pct 降順で上位 3 |
| `{INDUSTRY_CLASS}` | summary.json `industry_classification` |
| `{DATA_SOURCE_URL}` | summary.json `data_source` |
| `{GENERATED_AT}` | summary.json `generated_at` の日付部分 |
| `{NEUTRALITY_CLAUSE}` | summary.json `neutrality_clause` |

---

## 5. 自動化スクリプト（雛形）

`gen-press-from-scanner.js` を `../tcharton/` 直下に配置（Phase F 完了後に実装）。

```javascript
// gen-press-from-scanner.js — scanner summary.json から press release を生成
'use strict';
const fs = require('fs');
const path = require('path');

const SCANNER_DIR = '../scanner';
const PRESS_DIR = './press';
const TEMPLATE_PATH = './press/2026-05-jpx-prime-1553/index.html';

// CLI 引数: phase (E/F/G), scope (jpx-prime/jpx-standard/...)
const [, , phase, scope] = process.argv;
if (!phase || !scope) {
  console.error('Usage: node gen-press-from-scanner.js <phase> <scope>');
  console.error('Example: node gen-press-from-scanner.js F jpx-standard');
  process.exit(1);
}

// scanner データ読み込み
const summaryPath = path.join(SCANNER_DIR, `phase-${phase.toLowerCase()}-${scope}-summary.json`);
const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'));

// テンプレート読み込み
const template = fs.readFileSync(TEMPLATE_PATH, 'utf-8');

// データ差し込み（実装は手動レビュー必須）
// 1. n_total / median / ng_pct 等の数値置換
// 2. by_industry[] からテーブル再生成
// 3. 公開日付・スキャン基準日の更新
// 4. URL slug の差し替え（YYYY-MM 部分）
//
// 注: summary.json に存在しない数値の創作は禁止 (再発防止 memory 参照)

const yyyymm = summary.generated_at.slice(0, 7);  // "2026-05"
const slug = `${yyyymm}-${scope}-${summary.n_total}`;
const outDir = path.join(PRESS_DIR, slug);

// ... (実装詳細は Phase F 着手時に補完)
```

---

## 6. 公開前チェックリスト（毎回必須）

- [ ] **scanner CSV / summary.json を直接 Read 済み**（数値の捏造ゼロ）
- [ ] `{N_TOTAL}` が summary.json `n_total` と一致
- [ ] `{MEDIAN}` `{MEAN}` `{MAX}` が summary.json と一致
- [ ] `{NG_BREAKDOWN}` 4 種の合計が `ng_total_companies` と一致
- [ ] 業種分類が `industry_classification` と一致（東証 33 業種等）
- [ ] データ源 URL が `data_source` と一致（JPX 公式 URL 等）
- [ ] スキャン基準日が `generated_at` の日付部と一致
- [ ] 個別企業名がゼロ（`neutrality_clause` 遵守）
- [ ] ブランド禁止用語 grep ゼロ（圧倒的・最高・No.1 等）
- [ ] Insights 内部リンクが実在 slug を指す（404 禁止）
- [ ] OGP 個別生成（`gen-ogp-press.js {slug}`）
- [ ] sitemap.xml + spec-checker.js (STATIC_TARGETS + PAGE_TYPE) 同期更新
- [ ] spec-checker FAIL:0 / S-RANK 維持
- [ ] preview server で実機表示確認
- [ ] git commit + push（main + worktree branch）

---

## 7. 月次運用カレンダー（目安）

| 週 | アクション |
|---|---|
| 月初週 | scanner 実行（東証プライム + スタンダード）|
| 月初+1 | summary.json 確認 → 数値変動の特異点を検知 |
| 月中 | gen-press-from-scanner.js でドラフト生成 → ① 代表レビュー |
| 月中+1 | press release 公開 + note 投稿 + GitHub Issue でアナウンス |
| 月末 | 月次振り返り（公開記事の AI 引用率・流入数を集計） |

---

## 8. 失敗からの教訓（再発防止）

### 2026-05-15 事故
- **概要**: scanner CSV を確認せず「1,553 社 = 静岡県プライム企業」と捏造
- **真相**: 1,553 = 東証プライム市場上場（JPX 公式 / 内国・外国株 / 33 業種）
- **再発防止**: 本ドキュメント §6 のチェックリスト全項目を毎回実施
- **memory 保存**: `~/.claude/projects/.../memory/feedback_scanner_csv_truth.md`

### 教訓
- 「プライム」を独自定義（"主要"・"優良"）で説明しない
- summary.json `n_total` を見ずに社数を書かない
- 業種数（33 vs 11 vs 17 等）も summary.json に従う

---

## 9. 参考資料

- 既存 press release: `/press/2026-05-jpx-prime-1553/`
- press release ハブ: `/press/`
- Stella サブセクション: `/stella/`
- spec-checker: `./spec-checker.js`
- pre-push hook: `.git/hooks/pre-push`
- 関連 Insights:
  - `/insights/jpx-prime-1553-deep-dive/`
  - `/insights/standard-market-prediction/`
  - `/insights/from-17-to-90-points/`

---

**Adopted**: 2026-05-15
**Owner**: ① HARTON 総合責任者（最終承認）
**Operator**: ② tcharton 構築チーム（実装）
**Source of truth**: `C:\Users\ohuch\Desktop\HARTON\scanner/phase-*-summary.json`
