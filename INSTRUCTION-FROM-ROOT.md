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
