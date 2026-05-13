# ② tcharton セッション ローカル運用ガイド (CLAUDE.md)

> 親ガイド: `HARTON/CLAUDE.md` (① ルート / 6 セッション運用)
> 本書: ② tcharton セッション固有ルール
> Last updated: 2026-05-12

---

## 0. セッション位置づけ

- **役割名称**: WEB 制作責任者 (旧 S クラスサイト構築責任者)
- **作業ディレクトリ**: `HARTON/tcharton/`
- **担当**: HARTON 自社サイト (tcharton.com / 本番稼働) + Stella サブセクション (/stella/)
- **報告義務**: ① ルートへ `REPORT-TO-ROOT-FROM-TCHARTON.md` 追記

---

## 1. 必読書 (起動時 自動 Read 順序)

ファイル Read 順序 (上から優先):

1. **`HARTON/ENFORCEMENT-LAW-V1.md`** — HSCEL v1 強制法規
2. **`tcharton/CLAUDE.md`** — 本書 (② 固有ルール)
3. **`tcharton/DESIGN.md`** — **デザインシステム正本 (厳格参照 mandatory)**
4. **`tcharton/INSTRUCTION-FROM-ROOT.md`** — ① 最新指示書
5. `tcharton/SPEC.md` / `GOOGLE-STANDARDS.md` / `GEO-STANDARDS.md` — 3 法規 (生成物 / 編集禁止)

---

## 2. DESIGN.md 厳格参照 mandatory

### 絶対遵守ルール

**全ての HTML / CSS / コンポーネント実装時、`tcharton/DESIGN.md` を必ず参照する**:

| 場面 | 必須参照箇所 |
|---|---|
| 新規ページ作成時 | §1-§10 全項目 |
| 既存ページ改修時 | 該当箇所 + §7 Do/Don't |
| 色変更時 | §2 Color Palette |
| フォント変更時 | §3 Typography |
| ボタン / カード / フォーム実装 | §4 Component Styling |
| レイアウト設計 | §5 Layout & Spacing / §8 Responsive |
| 影 / 立体感 | §6 Depth / Elevation |
| Stella サブセクション (/stella/) | §10 Stella Sub-brand 識別 + 全項目 |

### DESIGN.md からの逸脱

- DESIGN.md 規定外のスタイル使用 = **HSCEL §3.1 違反 / 即不承認**
- 例外承認: ① ルートからの明示指示のみ (代表 GO 受領後)

### 公開前検証

各ページ公開前に **§11 Validation Checklist** 全 14 項目チェック必須:

- DESIGN.md §1-§10 全項目準拠
- WCAG 2.1 AA (axe-core / Pa11y)
- CWV 全 GOOD
- Lighthouse 全カテゴリ 90+
- JSON-LD バリデーション
- llms.txt 反映
- securityheaders.com A+
- 等

---

## 3. AIO + SEO + UI/UX 統合厳格運用

### AIO (AI 検索最適化)

**全ページ必須実装**:

- JSON-LD: `Article` / `ProfessionalService` / `LocalBusiness` (該当時)
- Wikidata Q コード掲載 (`additionalType` URL 配列)
- `knowsAbout` / `areaServed` / `founder` / `sameAs`
- `SpeakableSpecification` (音声 LLM)
- llms.txt + llms-full.txt 反映
- robots.txt に AI ボット (GPTBot / ClaudeBot / PerplexityBot 等) 明示許可

### SEO (検索エンジン最適化)

**全ページ必須実装**:

- Title (30-60 字 / ブランド名末尾)
- Meta Description (120-160 字 / 主訴求 + CTA)
- Canonical URL (絶対 URL)
- Open Graph (og:title / og:description / og:image / og:type)
- Twitter Card (`summary_large_image`)
- Sitemap XML 自動更新
- 内部リンク (関連ページへ最低 3 リンク)
- パンくずリスト (BreadcrumbList Schema)
- 構造化データ (Schema.org 完備)

### UI/UX (導線設計)

**全ページ必須実装**:

- ファーストビュー: 主訴求 1 つ + Sub 1 行 + CTA 1 つ
- 3 クリック以内で主要ページに到達 (情報設計階層)
- CTA 配置: 上部 / 中間 / 下部 (3 箇所 / 一貫性)
- フォーム: 必須項目最小化 / リアルタイムバリデーション
- モバイル: タップ領域 44x44px 以上 / Sticky CTA (該当時)
- ローディング: スケルトンスクリーン or プログレスバー
- エラー: 親切な日本語メッセージ
- アクセシビリティ: WCAG 2.1 AA

---

## 4. Stella サブセクション (/stella/) 統合運用

### 立場宣言

`/stella/` 配下は HARTON の **「WEB 品質審判ポジション」** を表現:

- 「制作会社」ではなく「評価機関」スタンス
- 「過去の実績数」ではなく「最新の技術スコア」基準
- HARTON scanner の独自判定アルゴリズム公開

### 設置必須ページ

| URL | 内容 |
|---|---|
| `/stella/` | 審判ポジション宣言 + Sランク基準明文化 |
| `/stella/methodology/` | スキャン方法論 + 4 軸評価ロジック |
| `/stella/ranking/` | 業界中央値・上位ランキング (集計のみ) |
| `/stella/badge/` | Sランク Badge (オプトイン制) |
| `/stella/diagnose/` | 無料診断 (stella Scan) |

### 厳格遵守事項

- ✅ **集計データのみ公開** (個別企業名禁止)
- ✅ Sランク Badge は **希望企業オプトイン制**
- ❌ 競合制作会社の名指しスキャン禁止
- ❌ 個別企業の低スコア晒し禁止
- ❌ 「保守費用払って放置」競合顧客横取り訴求禁止

### 法的リスク回避

| 法律 | 対策 |
|---|---|
| 名誉毀損 (刑法 §230) | 個別企業名公開禁止 |
| 不正競争防止法 §2(1)14 (営業誹謗) | 集計データのみ + 公正性担保 |
| 景表法 | 「Sランク」基準明示 |
| 著作権法 | スクショ引用要件遵守 |

---

## 5. HSCEL §3.1 4 Skill mandatory (継続)

各ページ実装時、以下 4 Skill 適用必須:

1. **`/feature-dev:feature-dev`** — 設計フェーズ
2. **`/requesting-code-review`** — 公開前 / 並列 reviewer 2+
3. **`/receiving-code-review`** — feedback 厳格処理
4. **`/gstack`** — 公開後 ブラウザ実機検証

報告書 `REPORT-TO-ROOT-FROM-TCHARTON.md` に各 Skill 適用証跡 mandatory。

---

## 6. HSCEL §3.3 事実確認 mandatory

コンテンツ内の以下は **出典明記必須**:

- 数値 (例: 「中央値 17 点」 → scanner Phase E プライム 1,553 社実測 / 2026-04-05 月)
- 引用 (例: 「KDD 2024」 → 論文 URL)
- 法令 (例: 「景表法」 → 第 5 条 不当表示)
- 業界統計 (例: 「個人事業主 320 万人」 → 総務省家計調査)

出典なしの数値・断定 = **HSCEL §3.3 違反 / 即不承認**。

---

## 7. ブランド禁止用語 (grep 0 件 mandatory)

公開前 grep 検証:

```bash
grep -rE "(圧倒的|完全|業界一|全国一|世界一|No\.1|最高|最強|最速|唯一|完璧)" tcharton/ --include="*.html"
```

ヒット 0 件 mandatory (景表法リスク回避)。

例外: 「最新」「最低限」等の文脈上適切な「最 X」は許容 (要文脈確認)。

---

## 8. 越境禁止 (HSCEL §0.0.7)

- ❌ ④ scanner.py 改変 (実行のみ ① 権限)
- ❌ ⑥ wp-mastery / portfolio に触らない
- ❌ ③ note-content / drafts に触らない
- ❌ 3 法規 (SPEC / GOOGLE / GEO) を編集しない
- ❌ ⑤ certification archive に触らない (但し /stella/ サブセクションは ② 内で実装)

---

## 9. 完遂報告フォーマット

`REPORT-TO-ROOT-FROM-TCHARTON.md` に追記:

```
## v1.XX.Y [タスク名] 完了報告 (YYYY-MM-DD)

### 実装内容
- [変更ファイルパス + 概要]

### git commit hash
- [hash]

### DESIGN.md 準拠確認
- §X-§Y 全項目チェック PASS

### §11 Validation Checklist
- [ ] DESIGN.md §1-§10 全項目準拠
- [ ] WCAG 2.1 AA
- [ ] CWV 全 GOOD
- [ ] Lighthouse 90+
- [ ] JSON-LD バリデーション
- [ ] llms.txt 反映
- [ ] ブランド禁止用語 grep 0 件
- [ ] ④ scanner 実測依頼

### scanner 実測依頼
- ① への scan_single 実行依頼

### HSCEL §3.1 4 Skill 適用記録
- /feature-dev / /requesting-code-review (reviewer 2+) / /receiving / /gstack
```

---

## 10. ⑤ 統合方針 (2026-05-12 確定)

- ⑤ 独立認定機関事業 = **終結** (Q1=A 維持)
- Stella **ブランド名** = ② tcharton.com 内 `/stella/` で活用
- 認定機関事業ではなく **マーケティング訴求軸** (審判ポジション)
- ⑤ certification/ archive は触らない (将来参照のみ)

---

## 11. 参照ファイル一覧

| ファイル | 用途 |
|---|---|
| `tcharton/DESIGN.md` | デザインシステム正本 / 厳格参照 mandatory |
| `tcharton/CLAUDE.md` | 本書 / ② 固有ルール |
| `tcharton/INSTRUCTION-FROM-ROOT.md` | ① 最新指示書 |
| `tcharton/INSTRUCTION-HISTORY-ARCHIVE.md` | 過去指示書履歴 |
| `tcharton/REPORT-TO-ROOT-FROM-TCHARTON.md` | ② → ① 報告書 |
| `tcharton/SPEC.md` | HARTON SPEC 生成物 (編集禁止) |
| `tcharton/GOOGLE-STANDARDS.md` | Google 基準 生成物 (編集禁止) |
| `tcharton/GEO-STANDARDS.md` | GEO 基準 生成物 (編集禁止) |
| `HARTON/ENFORCEMENT-LAW-V1.md` | HSCEL v1 強制法規 |
| `HARTON/CLAUDE.md` | ① ルート全体運用ガイド |

---

**Version**: 1.0
**Adopted**: 2026-05-12
**Next review**: ② v1.37 完遂時
