# ② tcharton 現役指示書 (2026-05-12 / v1.36 単一最終)

> **重要**: 過去版 (v1.0-v1.34.1) は `INSTRUCTION-HISTORY-ARCHIVE.md` に全文保管。
> **本書のみが現役有効指示**。

---

## ⚠️ 強制法規 HSCEL v1 (最高位優先)

| Skill | 適用契機 |
|---|---|
| `/feature-dev:feature-dev` | 各記事 / LP 実装着手時 |
| `/requesting-code-review` | 公開前 / 並列 reviewer 2+ 必須 |
| `/receiving-code-review` | review feedback 受領時 |
| `/gstack` | 公開後 ブラウザ実機検証 |

§3.3 事実確認 mandatory: コンテンツ内の数値 / 引用 / 法令言及は出典明示。

全文: [`HARTON/ENFORCEMENT-LAW-V1.md`](../ENFORCEMENT-LAW-V1.md)

---

## 単一最優先命令

**Phase α (データ不要記事) を 13 ページ実装し、tcharton.com に配置せよ。**

期限: **2026-05-26 (2 週間)**

---

## Phase 分割

| Phase | 内容 | 開始 |
|---|---|---|
| **α (本指示)** | Tier 1 Problem LP 5 + Tier 2 教育記事 8 = **計 13 ページ** | **即時 5/12** |
| β (別途指示) | Tier 3 業界中央値 + Tier 4 都道府県別自動生成 | ④ 改修 + 全国再スキャン完了後 |

---

## Tier 1: Problem 起点 LP (5 ページ)

| URL | テーマ | 想定字数 |
|---|---|---|
| `/problems/site-speed/` | ホームページが遅い悩み解決 | 4,000-5,000 |
| `/problems/no-inquiry/` | 問合せが来ない悩み解決 | 4,000-5,000 |
| `/problems/ai-search-invisible/` | AI 検索 (ChatGPT/Perplexity) に出ない悩み解決 | 4,000-5,000 |
| `/problems/security-risk/` | セキュリティ不安解消 | 4,000-5,000 |
| `/problems/no-mobile/` | スマホで見にくい問題解決 | 3,500-4,500 |

各 LP 必須要素:
- Lead 200 字 (痛み描写)
- 問題の原因解説 (3-5 要因)
- 解決方法ステップ
- 業界平均との比較 (Phase β データ後で更新可能なプレースホルダー設置)
- /recruit/ への CTA
- FAQ (3-5 問)
- Schema.org: `Article` + `FAQPage` + `HowTo`

---

## Tier 2: 教育記事 (8 本)

| URL | テーマ | 想定字数 |
|---|---|---|
| `/insights/core-web-vitals/` | Core Web Vitals 完全解説 (LCP/INP/CLS) | 5,000 |
| `/insights/json-ld-implementation/` | JSON-LD 構造化データ実装ガイド | 6,000 |
| `/insights/llmo-explained/` | LLMO とは — AI 検索時代の SEO | 5,000 |
| `/insights/wikidata-for-ai/` | Wikidata Q コードを使った AI 検索対策 | 4,000 |
| `/insights/security-5-principles/` | 中小企業 WEB セキュリティ 5 原則 | 4,500 |
| `/insights/eat-improvement/` | E-E-A-T 強化完全ガイド | 5,000 |
| `/insights/longtail-seo/` | ロングテール SEO 戦略 | 4,000 |
| `/insights/search-intent/` | 検索意図への回答方法 (Problem-Solution 設計) | 4,500 |

各記事必須要素:
- 専門性 (具体例 + コード例 + 図解)
- 実装可能な手順 (How-To)
- 内部リンク (関連 Tier 1 LP / 他 Tier 2 記事)
- /recruit/ への CTA
- 公開日 / 更新日
- Schema.org: `Article` + `HowTo` (該当時 `FAQPage`)

---

## ② 実行フロー

### Step 1: 構造設計 (Day 1 / 5/12)

- `/blog/` 配下に `/problems/` `/insights/` ディレクトリ作成
- 共通レイアウトテンプレ作成 (header / footer / 内部リンク CSS)
- 各記事の URL スラッグ確定
- Schema.org 共通コンポーネント設計

### Step 2: 記事執筆 + 配置 (Day 2-13 / 5/13-5/24)

- 1 日 1-2 ページペース (代表時間配分次第)
- 各記事は ① ルート (私) が起草 → 代表検証 → ② が HTML 化
- 代表 voice 反映 (「沼津で会える 1 人の WEB 屋」スタンス維持)

### Step 3: 内部リンク網構築 (Day 14 / 5/25)

- 13 ページ + 既存ページ 間の内部リンク網
- パンくずリスト (BreadcrumbList Schema)
- 関連記事ブロック

### Step 4: 公開 + 検証 (Day 14 / 5/25-26)

- 全 13 ページ push 公開
- ④ scanner 実測 (各ページ単発)
- Lighthouse / PageSpeed Insights 全件 90+ 確認
- Search Console インデックス登録申請

---

## 制約 (HSCEL §0.0.7 越境禁止)

- ④ scanner.py 改変禁止 (実行のみ ① 権限)
- ⑥ wp-mastery / portfolio に触らない
- 3 法規 (SPEC / GOOGLE / GEO) を編集しない
- ⑤ certification archive に触らない

---

## 完遂報告

`tcharton/REPORT-TO-ROOT-FROM-TCHARTON.md` v1.36.X として追記。

各 Step 完遂時の必須報告:
- 実装完了 URL
- git commit hash
- 字数 / Schema 適用確認
- ① への scanner 実測依頼

---

## 並行作業 (継続中 / v1.34.1 完遂済)

- TTFB 569ms 維持 (Step 1 完遂)
- ヘッダー 100/100 維持 (Step 4 完遂)
- /recruit/ ページ + PDF 維持
- note 募集応募モニタリング

---

## 着手前提

代表 GO 受領済 (2026-05-12) → **即時 Step 1 着手 mandatory**

過去発令 v1.30 ~ v1.34.1 は本書 v1.36 で **全件再編** / 履歴は `INSTRUCTION-HISTORY-ARCHIVE.md` 参照。

## 現状リアルタイム数値 (5/12 時点)

| 項目 | 値 |
|---|---|
| 格付け | ★ HARTON Certified (★★★ 復帰は Phase β で再検証) |
| TTFB | 569ms ✅ |
| ヘッダースコア | 100 ✅ |
| 致命的NG | 0 ✅ |
| 必須条件達成 | 2/4 + 1 保留 (Phase β で全達成見込み) |

---

## v1.37 ⑤→② 統合 + DESIGN.md 厳格参照 + /stella/ サブセクション (2026-05-12 / 代表 Q1+Q2 GO)

### 経緯

代表追加指示 (5/12):
- Gemini 提言 → ⑤ を ② に統合 (「審判」ポジション宣言)
- Q1 GO: ⑤→② 統合
- Q2 GO: 優良サイトは公開 (適時判断 / 集計データ + オプトイン Sランク Badge)
- Q3: ⑥ Phase A 再起動不要 (代表 5/12 ⑤⑥ 休止判断維持)

### 新規追加事項

#### 1. tcharton/DESIGN.md 採用 (案 C / awesome-design-md 準拠)

正本: `tcharton/DESIGN.md` (新規策定 / 12 セクション)

実装時 **厳格参照 mandatory**:
- §1 Visual Theme & Atmosphere
- §2 Color Palette & Semantic Roles (#1B4965 / #D4AF37 維持)
- §3 Typography Hierarchy (Noto Sans JP / Noto Serif JP)
- §4 Component Styling
- §5 Layout & Spacing (8px base)
- §6 Depth / Elevation
- §7 Do's and Don'ts (ブランド禁止用語)
- §8 Responsive Breakpoints
- §9 Agent Prompt Guide
- §10 HARTON 独自 (LLMO + SEO 必須)
- §11 Validation Checklist (全 14 項目)
- §12 Update Policy

#### 2. tcharton/CLAUDE.md 採用 (② 固有ルール)

正本: `tcharton/CLAUDE.md` (新規策定 / 11 セクション)

主要ルール:
- DESIGN.md 厳格参照 mandatory
- AIO + SEO + UI/UX 統合厳格運用
- Stella サブセクション (/stella/) 統合運用
- HSCEL §3.1 4 Skill mandatory + §3.3 事実確認 mandatory
- ブランド禁止用語 grep 0 件 mandatory
- 越境禁止 (HSCEL §0.0.7)

#### 3. /stella/ サブセクション統合 (5 ページ追加)

| URL | 内容 |
|---|---|
| `/stella/` | 審判ポジション宣言 + Sランク基準明文化 |
| `/stella/methodology/` | スキャン方法論 + 4 軸評価ロジック |
| `/stella/ranking/` | 業界中央値・上位ランキング (集計のみ / 個別企業名なし) |
| `/stella/badge/` | Sランク Badge (オプトイン制) |
| `/stella/diagnose/` | 無料診断 (stella Scan) フォーム |

### 修正された Phase α (Tier 1+2 + Stella 5 ページ = 計 18 ページ)

| Tier | 内容 | ページ数 |
|---|---|---|
| Tier 1 | Problem 起点 LP (既存 v1.36) | 5 |
| Tier 2 | 教育記事 (既存 v1.36) | 8 |
| **Stella (新)** | **/stella/ サブセクション 5 ページ** | **5** |
| **計** | | **18 ページ** |

### Stella サブセクション法的リスク回避 (mandatory)

- ✅ 集計データのみ公開 (個別企業名禁止)
- ✅ Sランク Badge は希望企業オプトイン制 (事後同意)
- ❌ 競合制作会社の名指しスキャン禁止
- ❌ 個別企業の低スコア晒し禁止
- ❌ 競合顧客横取り訴求禁止
- ❌ 「業界 1 位」自称禁止 (景表法)

### Stella ブランド色追加

| ロール | HEX | 用途 |
|---|---|---|
| Stella Gold (richer) | `#D4AF37` | Sランク Badge メイン (既存) |
| Stella Gold Dark | `#B8941F` | Sランク Badge ボーダー |
| Stella Gold Light | `#F5E5A8` | Sランク Badge 背景 |
| Stella Navy | `#0F2840` | 審判ポジション ヒーロー背景 |

DESIGN.md §2 に追加済。

### 期限延長

旧 v1.36: 5/26 (2 週間 / Tier 1+2 = 13 ページ)
新 v1.37: **6/9 (4 週間 / Tier 1+2+Stella = 18 ページ)**

### ④ Phase F データ連動

④ Gemini 提言反映改修完遂 + Phase F 全国スキャン完了後:
- /stella/ranking/ で集計データ自動更新
- /stella/methodology/ で 4 軸評価ロジック解説 (改修内容反映)

② は ④ 出力 JSON を Read のみ。

### 完遂フロー

```
Step 1: tcharton/CLAUDE.md + tcharton/DESIGN.md Read (起動時自動)
Step 2: Tier 1 Problem LP 5 ページ実装 (Day 1-7)
Step 3: Tier 2 教育記事 8 本実装 (Day 8-21)
Step 4: /stella/ サブセクション 5 ページ実装 (Day 22-28)
Step 5: 全 18 ページ §11 Validation Checklist 検証
Step 6: ④ scanner 実測 (① 権限) → 結果反映
Step 7: 公開 + ① 検収
```

### 担当分担

- ① ルート (私): 各記事/LP 内容起草 + 代表検証 + ② への引渡
- ② tcharton: HTML 化 + 配置 + Schema + DESIGN.md §11 Validation 検証
- 代表: ブランドトーン調整 + 最終承認
- ④ scanner: 実測協力 (① 経由)

### HSCEL §3.1 4 Skill mandatory (継続)

各ページ公開前: feature-dev → 並列 reviewer 2+ → receiving → gstack

### 着手前提

代表 GO 受領済 (2026-05-12) → **即時 Step 1 着手 mandatory**

過去発令 v1.36 は v1.37 に統合 / 履歴は INSTRUCTION-HISTORY-ARCHIVE.md 参照
