# AUDIT-COMPLETION-V2 — tcharton.com 完成度再検証（grep 中心）

**実施日:** 2026-05-09
**対象:** `C:\Users\ohuch\Desktop\HARTON\tcharton\` 配下全 HTML / CSS / JS
**前提:** V1 監査で 76 件不備指摘 → ② 修正実施。本 V2 は修正後の厳格再確認。
**手法:** grep 中心の事実確認 + spec-checker 実走行。

---

## 1. grep 結果（事実列挙）

### 1-1. 「保守」独立サービス表記の残存

```
./llms-full.txt:243:- WEB 制作・保守運用・AI 予測モデル開発の 3 本柱を提供
```

- **HTML 本体: 0 件**（services/web/ index.html about cases methodology profile faq legal privacy contact thanks すべてヒットなし）
- **残存 1 件:** `llms-full.txt` L243 のみ。AI クローラー向け要約テキストに旧「3 本柱」表記が残置。HTML 表示には影響しないが LLM 学習面では旧情報が露出する。

### 1-2. 旧ジャーゴン残存

| パターン | ヒット件数 | 場所 |
|---------|----------|-----|
| `HARTON Stella` | 0 | — |
| `機械検証で第三者性` | 0 | — |
| `Sクラス保証` / `S クラス保証` | **3** | about/index.html L327, L490 ／ faq/index.html L83, L264 |
| `Deep Work` | 0 | — |
| `GEO 9 戦略` | 0 | — |
| `LLMO` | **1** | methodology/index.html L239（「LLMO（AI 検索最適化）」見出し）|

詳細：
- `about/index.html` L327: `<a ...>★★★ S クラス保証の詳細</a>` — リンクテキスト
- `about/index.html` L490: `S クラス保証の詳細` — テキスト
- `faq/index.html` L83 / L264: Q24 回答内 JSON-LD + DOM 双方に「Sクラス保証の品質」記述

### 1-3. 削除済みパス（リンク残存チェック）

```
/services/audit/        : 0 件
/services/maintenance/  : 0 件
/services/web/sclass/   : 0 件
```

- 全 HTML / TXT で **0 ヒット**。デッドリンクなし。クリーン。

### 1-4. PC インラインナビ

```
index.html:299: <div class="hidden lg:flex items-center gap-7 text-sm">
```

- ✅ 1 件存在。`hidden lg:flex` で lg 以上に PC ナビ表示。修正反映済。

### 1-5. ハンバーガー lg:hidden 化

```
index.html:309: <div class="flex lg:hidden items-center gap-4">
index.html:311: <button id="menuToggle" ... aria-label="メニューを開く" ...>
```

- ✅ ハンバーガー親要素に `lg:hidden`。lg 以上で非表示。修正反映済。

### 1-6. CTA whitespace-nowrap

```
index.html:506: ... text-sm sm:text-base lg:text-lg ... whitespace-nowrap"
```

- ✅ 主 CTA に `whitespace-nowrap`。改行崩壊防止が反映。

### 1-7. CSS アニメ出力（dist/output.css）

- `anim-old | anim-new | anim-particles | new-card` ヒット件数: **1**
- 期待値（src/input.css 側に複数 keyframes 定義あり）と比較すると **大幅不足**。
- src 側には `anim-old-out` / `anim-particles-fade` / `anim-new-in` の 3 keyframes + 3 animation 宣言（計 6 ヒット相当）が存在。
- `dist/output.css` 側に該当ヒット 1 のみ = **Tailwind ビルドが最新 src/input.css を反映していない疑い**。要再ビルド検証。

### 1-8. アニメタイミング（src/input.css）

```
200: animation: anim-old-out 0.5s ease-in 0.8s forwards;
212: @keyframes anim-old-out {
219: animation: anim-particles-fade 0.9s ease-in-out 0.8s forwards;
221: @keyframes anim-particles-fade {
260: animation: anim-new-in 0.5s ease-out 1.5s forwards;
262: @keyframes anim-new-in {
```

- ✅ src 側は 3 段階タイムライン（0.8s 旧消失 → 0.8s 粒子 → 1.5s 新登場）が定義済。
- ⚠️ ただし dist 側へ反映されていない可能性（1-7 と整合）。

### 1-9. ★★★ 残存

- 総ヒット数: **26 件**（前回確認時の cases / about / methodology に集中）
- 場所: `about/index.html` / `cases/index.html` / `methodology/index.html` のみ
- index.html / services/web/ / faq / profile への流出なし。意図的な評価軸表記として許容範囲内。

### 1-10. spec-checker 実行結果

```
検証項目: 1323
✅ PASS: 1190  ❌ FAIL: 0  ⚠️ WARN: 31  ⏭️ SKIP: 102
合格率: 100.0%
🏆 S-RANK 合格！全FAIL項目ゼロ
```

- FAIL=0 / 合格率 100%。機械検証の S-RANK は維持。
- WARN 31 件は既知許容範囲（spec-checker の判定基準内）。

---

## 2. V1 → V2 差分

| 項目 | V1 状態 | V2 状態 |
|---|---|---|
| index.html JSON-LD「WEBサイト保守運用」 | 残存 | **解消** |
| index.html JSON-LD「Sクラス保証」 | 残存 | **解消（HTML 本体ゼロ）** |
| aria-label「3 サービス（Web 制作・保守運用・AI 予測）」 | 残存 | **解消** |
| profile / cases / about の保守運用分割 | 残存 | **解消（HTML 0 件）** |
| PC インラインナビ追加 | 未実装 | **実装済（L299）** |
| ハンバーガー lg:hidden 化 | 未対応 | **対応済（L309）** |
| CTA whitespace-nowrap | 未対応 | **対応済（L506）** |
| 削除済みパスへのリンク残骸 | 一部残存 | **解消（0 件）** |

**V1 76 件 → V2 残存推定 5 件**（後述）。約 93% 解消。

---

## 3. 残存不備リスト（優先度付き）

### 【HIGH】FAIL に近い構造的残置（要修正）

1. **`faq/index.html` L83 + L264 — Q24「Sクラス保証」記述**
   - JSON-LD（構造化データ）と DOM 双方に「Sクラス保証の品質」を含む。LLM / Google 双方に旧用語が露出。
   - V1 で指摘済の「Sクラス保証 → ★★★ パッケージ等への用語統一」が **faq のみ未反映**。
   - 推奨: 「Sクラス保証の品質」→「★★★ パッケージの品質基準」等へ統一。

2. **`dist/output.css` のアニメ反映欠落**
   - src/input.css に 3 keyframes 定義あるが dist 側ヒット 1 件のみ。
   - Tailwind 再ビルド未実施の疑い。本番デプロイ時に Hero アニメが期待動作しない可能性。
   - 推奨: `npx tailwindcss -i src/input.css -o dist/output.css --minify` 再走行。

### 【MEDIUM】用語ドリフト（要統一）

3. **`about/index.html` L327, L490 — 「S クラス保証」記述**
   - リンクテキスト・本文で残存。faq と同様、★★★ パッケージ表記へ統一推奨。

4. **`llms-full.txt` L243 — 「3 本柱」表記**
   - HTML 表示影響なしだが AI クローラー向け正本テキストとして旧モデル「3 本柱」が露出。
   - 「主軸 + 4 副軸」へ更新推奨（直近コミット b0b8c95 / a3881a8 と整合させる）。

### 【LOW】許容範囲だが確認推奨

5. **`methodology/index.html` L239 — 「LLMO（AI 検索最適化）」見出し**
   - 旧ジャーゴンだがカッコ書きで「AI 検索最適化」と併記し業界用語として説明している文脈。
   - SPEC 上「LLMO 単独使用禁止」かどうかにより判定。代表判断要。

---

## 4. 最終判定

### **「真に 100% 完成」と称せる状態か：否（NO）**

#### 判定根拠

- **spec-checker（機械検証）:** S-RANK / FAIL=0 / 100%。✅
- **構造的修正（V1 76 件）:** PC ナビ・ハンバーガー・CTA・削除済みパス・JSON-LD 主要部・aria-label の修正は反映済。✅
- **しかし以下が残存:**
  1. faq Q24 の「Sクラス保証」JSON-LD + DOM（**HIGH**）
  2. about の「S クラス保証」テキスト × 2（**MEDIUM**）
  3. dist/output.css のアニメ反映欠落（**HIGH**：本番動作リスク）
  4. llms-full.txt の「3 本柱」（**MEDIUM**：AI 露出）

機械検証は通過しているが、**用語統一の漏れ + ビルド成果物の同期漏れ**という人間目視・実機検証で発覚するレベルの瑕疵が残っている。

② が「100% 完成」と push した V1 と同じ轍を踏みつつあり、**「spec-checker PASS = 完成」という機械依存の罠**から完全には脱していない。

#### 必須対応（push 前）

- [ ] faq/index.html L83 + L264 の「Sクラス保証」用語統一
- [ ] about/index.html L327 + L490 の「S クラス保証」用語統一
- [ ] `npx tailwindcss` 再ビルドで dist/output.css にアニメ反映
- [ ] llms-full.txt L243 「3 本柱」→「主軸 + 4 副軸」更新
- [ ] 上記後に `node spec-checker.js` + `node verify-all.js` 再走行

#### 任意対応（代表判断）

- [ ] methodology/index.html L239「LLMO」表記の許否

---

## 5. 監査者所見

V1 76 件 → V2 残存約 5 件（93% 解消）。② の修正作業は構造的部分について確実に進捗。ただし **「用語統一」「ビルド成果物同期」という地味な詰めで複数件取りこぼしがある**点は、V1 と同じ「機械検証 PASS で安心して目視確認を省く」傾向の継続を示唆。

100% 完成を称するには、上記 HIGH 2 件 + MEDIUM 2 件の解消が必須。

**現時点判定: 95% 完成（残 5%）。push 不可。**
