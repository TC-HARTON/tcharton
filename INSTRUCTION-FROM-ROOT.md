# ⚠️ 強制法規 HSCEL v1（HARTON Skill Compliance Enforcement Law）— 最高位優先

> **本書冒頭に配置 / 全条項より上位適用 / 違反は機械的不承認**
> **全文**: [`HARTON/ENFORCEMENT-LAW-V1.md`](../ENFORCEMENT-LAW-V1.md)（必読 / 起動時 自動 Read 1 番目に追加）
> **SPEC 正本化**: SPEC §0.0.11（v3.4.2 / 2026-04-30 制定）

## §3.1 mandatory Skill（違反 = 自動不承認 / 全件 redo）

| # | Skill | 適用契機 |
|---|---|---|
| 1 | `/feature-dev:feature-dev` | 新規ページ / 大規模実装 / 戦略仕様改訂 |
| 2 | `/requesting-code-review` | **完了報告前 全件**（草案・本番問わず）/ **並列 2+ reviewer 必須** |
| 3 | `/receiving-code-review` | review feedback 受領時 |
| 4 | `/gstack` | 本番デプロイ後 / 視覚変更時 |

## §3.2 例外（緊急 hotfix のみ）

致命的 NG / セキュリティ脆弱性 への即時対応 + ① 事前明示承認 の AND 達成時のみ免除。24 時間以内に §3.1 遡及完遂義務。

## §4 REPORT 様式 強制（必須セクション / 空欄 = 完了未達）

REPORT-TO-ROOT-FROM-{担当}.md に以下を必ず記載:

```markdown
## §HSCEL-V1 §3 Skill 適用証跡（必須）

| Skill | 起動証跡 | 結果サマリ | 該当 commit / file |
|---|---|---|---|
| /feature-dev:feature-dev | {Phase 1-7 進捗 / 起動時刻} | {成果物パス} | {hash} |
| /requesting-code-review | {並列 reviewer 数 / 起動時刻} | {CRITICAL / HIGH / 解消件数} | {hash} |
| /receiving-code-review | {feedback 受領時刻} | {対応件数 / 撤回件数} | {hash} |
| /gstack | {本番 URL / 起動時刻} | {スクリーンショット / curl 実測パス} | {hash} |
```

## §5 commit 前順序 厳格固定

```
[Step 1] 実装 / 編集
[Step 2] §3.1 全 Skill 完遂
[Step 3] REPORT に §HSCEL-V1 §3 セクション記載
[Step 4] ① 承認待ち（disk artifact + REPORT のみ提示、commit はまだしない）
[Step 5] ① 承認後、commit + push
[Step 6] push 後、本番実機検証（/gstack 等）+ REPORT 更新
[Step 7] ① 最終承認
```

「草案」「ドラフト」「α 版」「軽微」「ちょっとした」「急ぎ」を理由に Step 2-3 を省略することは **§8.1 禁止用語**として全件不適用。

## §6 違反時処分

| Tier | 内容 |
|---|---|
| Tier 1 | ① 機械的不承認 / 内容に言及せず差戻し / 全件 redo（デフォルト）|
| Tier 2 | CRITICAL-ISSUES-REPORT に違反記録 → 次セッション trust scope 縮小 |
| Tier 3 | `.claude/settings.json` hook で commit / push 物理拒否（次フェーズ）|
| Tier 4 | 同 § を 3 回違反 → 担当変更（① 権限）|

---

# ② tcharton 指示書（S クラスサイト構築責任者）

**最終更新**: 2026-04-27 / ① HARTON 総合責任者
**現状**: 🏆 **scanner で S クラス取得確定**（格付け S / 総合 90 / 必須 4/4 + 1 保留 / 致命的 NG 0）
**目標達成**: SPEC v3.4 §8.5 必須 5 条件 + spec-checker S-RANK + scanner S クラスの**両層達成**

---

## 起動時 自動 Read（上から順に Read ツールで全件読み込め。担当判断不要、無条件実行）

1. 本書（既読）
2. **Read** `C:\Users\ohuch\Desktop\HARTON\REPORT-TO-ROOT-FROM-TCHARTON.md` — ② 自身の完了報告（v1.5）
3. **Read** `C:\Users\ohuch\Desktop\HARTON\tcharton\SPEC.md` — §4.2 #1 / §8.1 / §8.5 / §8.9
4. **Read** `C:\Users\ohuch\Desktop\HARTON\CRITICAL-ISSUES-REPORT.md` — §13（S 取得）+ §15-§18（最新統制 + 4 Skill 必須化）
5. **Read** `C:\Users\ohuch\Desktop\HARTON\CLAUDE.md` — §1

---

## 🔴 実装 必須プロセス（2026-04-28 ① 確定 / ②④⑤ 共通 / 単独実装厳禁）

代表確定（2026-04-28）— ② / ④ / ⑤ 全担当は **単独実装を禁止**。以下 4 Skill を構造的に組込:

| Skill | 用途 | 適用タイミング |
|---|---|---|
| `/feature-dev:feature-dev` | Phase 1-7 構造化実装（codebase understanding + architecture focus）| 新規機能 / 大規模修正の着手時 |
| `/gstack` | 実機ブラウザテスト + dogfooding（ローカル PASS / 本番 FAIL ドリフト防止）| 機能実装後 + 本番デプロイ後 |
| `/requesting-code-review` | 完了前の自己レビュー要請（タスク完了 / 主要機能 / マージ前必須）| 完了報告前 mandatory |
| `/receiving-code-review` | 受信した review feedback の技術的厳格処理（performative 禁止）| review 受領時 mandatory |

**禁止**: 上記 Skill を経ずに「完了」「合格」「PASS」「達成」を称すること（§0.0.1 narrow-scope claim 一般化 / 背任）。

**完了条件 AND 化**:
1. spec-checker FAIL=0
2. `/requesting-code-review` 並列複数 reviewer の CRITICAL/HIGH 全件解消
3. `/gstack` で本番実機検証 PASS
4. ① 報告

⑤ v1.4 第二次厳格検証完遂（並列 5 エージェント自己レビュー）が standard。

---

## 完了タスク（履歴）

| # | タスク | commit | 状態 |
|---|---|---|---|
| 1 | spec-checker.js バグ修正（`@type` 配列対応 + `hasType()` ヘルパ）| `a12f686` | ✅ |
| 2 | JSON-LD `@type` 配列化 5 ファイル | `a12f686` | ✅ |
| 3 | `_headers` X-Hosting honest signaling | `a12f686` | ✅ |
| 改善#1 | spec-checker.js `--live` モード（HTTP ヘッダ実測 machine gate）| `a4d34de` | ✅ |
| 4 | GBP 作成 + sameAs に GBP URL 配置 | `a3113d1` | ✅ CID `16606425942373165010` |
| 5 | scanner で S クラス取得確認 | `36d4328` | ✅ **S/90** |
| 6 | Deep Work ナラティブ + 連絡導線再設計（Form 主 CTA / Phone 補助）| `06c3d1c` → `68b0f8b`（ビデオ会議 CTA 撤回 → フォーム経由）| ✅ |

**達成基準**: spec-checker FAIL=0 維持 / verify-all exit 0 / scanner で S/90 + 致命的 NG 0 / NAP 100

---

## 継続タスク（運用）

### 月次

- 月初: scanner で再判定 → S 維持確認 → ① 報告（変動あれば即報）
- 月中: SPEC / GOOGLE / GEO 更新時、`node sync-spec.js --check` で同期確認

### 随時（追加要請が来たら）

- ① / 代表からの追加実装要請を本書に追記して着手

---

## 報告

`HARTON/REPORT-TO-ROOT-FROM-TCHARTON.md` に末尾追記:

```markdown
## YYYY-MM-DD タスク#N 完了
- commit: {hash}
- 検証: {コマンド} → {出力 1 行}
- 残: {残課題 / 「なし」}
```

---

## 禁止

- 3 法規（`SPEC.md` / `GOOGLE-STANDARDS.md` / `GEO-STANDARDS.md`）編集
- `scanner/` 配下編集
- `--no-verify` push
- ローカル PASS のみで「S クラス取得」を称する報告（実 scanner 再判定が必須）

---

## 【追記 2026-04-30 / v1.12】ブランド戦略 v1.1.7（① HARTON 総合責任者 確定）

> **出典**: `HARTON/CRITICAL-ISSUES-REPORT.md` §23.3（v1.1.16）/ Gemini 提言書 `_archive/2026-04-28-skill-mandatory-cleanup/Project_Michelin_Strategy_v1.md` ① 批判的継承

### ブランド戦略 3 行サマリ（暗記必須）

```
[実体]    沼津 = HARTON Certified 評価基準の「自己実証体 第 1 号」誕生地
[物語]    地方都市から AI 時代の WEB 品質を再定義する
[証明]    自分が ★★★ を取れない基準で、他者を測ることはしない（dogfooding 倫理）
```

### ② tcharton への実装指示（メインサイト IA 改訂）

| # | 改訂項目 | 着手内容 |
|---|---|---|
| 1 | **ヒーロー副題**「沼津の WEB 制作」→「沼津で証明し、全国へ。AI 時代の WEB 品質を再定義する。」 | `index.html` ヒーロー差替 + scanner ★★★ 結果へのディープリンク |
| 2 | **「Why Numazu?」セクション新設** | 地方都市での ★★★ 取得 = 「機械評価は資本に依存しない」証明として明記。隣接市（三島・富士）ではなく類似地方都市（倉敷・四日市）展開根拠も明示 |
| 3 | **制作実績 二軸分離** | 「Local（地域貢献）」/「National（全国・高難度）」カテゴリ化 |
| 4 | **certification.tcharton.com への自然導線** | 評価機関（サブ）→ 自己実証体（メイン）の循環構造を 1 セクション化 |
| 5 | **★★★ 自己取得バッジ表示** | scanner 再判定結果の verbatim hash 公開（dogfooding 証跡）|

### 実装着手前の必須事項

1. ⑤ certification の MASTER-PLAN v1.1.7 草案受領を**待たず先行可**（戦略は ① で確定済）
2. 改修着手前に `node verify-all.js` で S-RANK 維持を再確認
3. 完了後 4 Skill 必須化（v1.1.11）適用 — `/feature-dev:feature-dev` + `/requesting-code-review` 並列複数 reviewer + `/gstack` 本番実機 + `/receiving-code-review`
4. ★ 表記は ★ / ★★ / ★★★（v3.4.1 整合化済 / 旧 ★3〜★5 / S・A・B・C・D は使用禁止 / retro-compat 内部 ID のみ）

### ★★ 厳格化（v1.1.15 §22）周知

② tcharton には影響なし（★★★ 取得済）。ただし MASTER-PLAN §3.4 / SPEC §8.5.2 表現が「★★ = 80 点以上 + 致命的 NG ゼロ + 必須条件 **4 件以上**」に厳格化された旨、報告書 / 顧客説明資料で言及する場合は最新表記を使用すること。

---

## 【追記 2026-04-30 / v1.12.2】「現状診断を依頼する」CTA 追加（分離レーン）+ 認定機関中立性維持

> **発信**: ① HARTON 総合責任者（2026-04-30 / ④ Phase 0 完了 + ① 戦略 (b)+(a) ハイブリッド確定）
> **連動**: CRITICAL-ISSUES-REPORT v1.1.18 §25 / ⑤ INSTRUCTION v1.12.2 (B)

### ② への 2 件指示

#### 1. 「現状診断を依頼する」CTA 追加（既存 apply / contact とは別レーン）

| 配置 | 内容 |
|---|---|
| ヒーロー直下 secondary CTA | 「あなたのサイトを HARTON Certified 機関で現状診断する（無料）」→ `https://certification.tcharton.com/diagnosis/` |
| Why Numazu? セクション末 | 「沼津 83 件業界実測（→ certification 業界レポート）+ あなたのサイトも診断可能」リンク |
| 既存 apply / contact | **触らない**（制作受任の別レーンとして維持）|

理由: 「認定機関の現状診断」と「制作受任」は**異なる動機の問合せ**のため、入口を分離。tcharton.com は両方の窓口になるが、CTA とフォームを分離することで認定機関の中立性を視覚的に担保。

#### 2. 認定機関中立性維持の表現原則

② tcharton 本文中で certification.tcharton.com を言及する際の規範:

| ✅ 推奨 | ❌ 禁止 |
|---|---|
| 「HARTON Certified 認定機関の業界レポート」 | 「弊社の認定機関」「弊社運営の HARTON Certified」（資本系列の自慢化）|
| 「機械検証で 業界実測を可視化」 | 「業界 worst をあぶり出す」（煽り）|
| 「自己実証体として ★★★ 取得」 | 「業界唯一の ★★★」（過剰主張）|
| 「沼津 5 業界 83 件中、★ 0 件という業界実測」 | 「沼津の制作会社は弊社が圧倒的」（敵視構造）|

**根拠**: 認定機関の信頼性は中立性に依存。② tcharton（制作実務）が認定機関を「自社の権威付け」として誇示すると、認定の客観性に疑念が生じる（CRITICAL-ISSUES-REPORT v1.1.18 §25 (c) 不採用理由）。

### 完了条件 AND

1. spec-checker FAIL=0 維持
2. `/requesting-code-review` 並列 reviewer 1 名（中立性表現の整合性）
3. `/gstack` 本番実機 CTA 動作確認
4. ① 報告
