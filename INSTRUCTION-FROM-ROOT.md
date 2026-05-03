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

---

## 【追記 2026-05-01 / v1.13】② v1.8 報告 ① 承認 + 経過措置適用

**判定**: ② v1.8 報告書 全件承認

| commit | HSCEL 適用 | 判定 |
|---|---|---|
| `dc196c4`（2026-04-30 08:42:10 / IA #1-4）| **§10.2 経過措置**（HSCEL 発効より 5h13m 前）| **追認 / Tier 適用なし** |
| `779df0e`（2026-05-01 / GEO 戦略強化 9 件 + review 全件解消）| §3.1 4 Skill 完備 + §4.1 REPORT 証跡 + §5 順序遵守 | **承認** |

### ① エスカレーション議題受領

| 議題 | 取扱 |
|---|---|
| Aggarwal et al. 所属表記「Princeton/IIT Delhi」共著者 6 名中 2 名 Independent 欠落 | **GEO-STANDARDS v2.2 議題化**（次回 v3.5 SPEC 改訂時に処理）|

### 次タスク

- IA #5 ★★★ バッジ + verbatim hash 公開: ④ scanner 正規実行 SHA-256 受領後（待機）
- 「現状診断を依頼する」CTA 追加（v1.12.2 (B) 連動）: ⑤ certification 診断ページ完成後に実装可
- HSCEL v1.1 §3.3 事実確認 mandatory 遵守: 次回以降の REPORT に「事実確認証跡」行追加必須

---

## 【追記 2026-05-03 / v1.14】🔴🔴 トップページ大改修指示書 v1（最優先）

> **発信**: ① HARTON 総合責任者（代表 2026-05-03 直接 GO）
> **背景**: 代表診断「現状トップは細かなウンチクが羅列され、ユーザーが付加価値を一目で理解できず離脱懸念」/ ① 同意確定
> **位置付け**: ② 最優先タスク（GEO 強化 / IA #5 等の保留タスクより上位）

### 1. 改修目的（ユーザー視点 First）

「**自社が誇りたい指標（★★★ / dogfooding / 沼津起点）**」と「**ユーザーが知りたい価値（自分は何を得るのか）**」の乖離を解消。Above the fold で「何屋・誰向け・何が違う・どう動く」を完結させる。

### 2. 真の付加価値 4 軸（コピー設計の原典 / 改変禁止）

| # | ユーザー深層ニーズ | 提供価値 |
|---|---|---|
| 1 | AI 検索時代に取り残されたくない | **AI 検索（GEO）対応の次世代 SEO** |
| 2 | ChatGPT/Perplexity に推薦されたい | **機械検証で「AI が引用する」構造を保証** |
| 3 | 第三者から信頼を保証されたい | **HARTON Certified ★★★ 基準で構築（業界唯一）** |
| 4 | WordPress 漏洩リスクを避けたい | **業界 32.5% の致命的脆弱性を構造的にゼロ化** |

### 3. ヒーロー再構成（verbatim 採用 / 改変は ① エスカレーション必須）

```
[H1（最大）]
「探される Web」から「AI に選ばれる Web」へ。

[サブコピー（H1 直下 / 2 行）]
ChatGPT・Perplexity が真っ先に引用するサイトには、明確な技術基準があります。
HARTON は第三者認定機関 HARTON Certified の ★★★ 基準で WEB を構築する、
静岡県東部唯一の制作集団です。

[CTA 2 つ]
[ ▸ 無料診断する ]（プライマリ / teal-700 背景）
[   事例を見る  ]（セカンダリ / outline）

[信頼補強行（小さく / 1 行 / dark-300）]
★★★ 自社取得済 | 静岡県 902 件業界平均の 3.8 倍品質 | spec-checker PASS 1,461/0
```

**注**:
- 「Sクラス保証で未来基準に」「buy-out 型 WEB 構築・保守運用・AI 予測モデル開発」等の現コピーは **全削除**
- 「Numazu / Mishima / Fuji — Shizuoka East」等の英字 Eyebrow も **削除**（ユーザー価値訴求と無関係）
- 富士山ヒーロー画像は **維持可**（地域信頼 + 視覚的インパクト）

### 4. セクション順序 厳守（13 → 8 圧縮）

| 新順 | セクション | 役割 | 旧位置 |
|---|---|---|---|
| 1 | **Hero**（上記 §3 verbatim）| 価値 1 行で離脱防止 | 1 |
| 2 | **「あなたが得る 3 つの成果」** 新設 | What you get | — |
| 3 | **3 本柱の事業** | What we do（WEB / 保守 / AI 予測）| 5 |
| 4 | **業界実測との比較** 新設 | Why us（902 件中央値 24 vs 当社 90 = 3.8 倍を 1 グラフ）| — |
| 5 | **無料診断 CTA** | Conversion 1 | 6 |
| 6 | **導入事例 3 件** | Proof | 10 |
| 7 | **代表メッセージ + FAQ 抜粋** | 人格信頼 + 不安解消 | 7 + 11 |
| 8 | **お問い合わせ CTA** | Conversion 2 | 13 |

### 5. 「あなたが得る 3 つの成果」セクション 設計（§4 #2）

3 カード構成（H2「あなたが得る 3 つの成果」/ aria-label="3 つの成果"）:

| カード | アイコン | 見出し | 本文（80 字以内）|
|---|---|---|---|
| 1 | AI / 検索 | **AI 検索で見つかる** | ChatGPT・Perplexity が引用するための GEO 9 戦略を全件実装。Google だけでなく次世代 AI 検索からの流入を獲得。 |
| 2 | ★ / 認定 | **第三者機関が品質を保証** | HARTON Certified ★★★ 基準は全 11 業種共通の機械検証エンジン。「自分でいいと言う」のではなく「客観的に証明される」品質。 |
| 3 | 盾 / セキュリティ | **致命的脆弱性ゼロ** | 静岡県 902 件中 32.5% で WordPress 管理面露出等の致命的 NG が発生。HARTON は構造的にゼロ化。 |

### 6. 「業界実測との比較」セクション 設計（§4 #4）

| 要素 | 内容 |
|---|---|
| H2 | 「業界平均の 3.8 倍の品質を、お客様のサイトに」 |
| 数値ビジュアル | 棒グラフ or 大数字対比（業界中央値 **24** vs 当社実測 **90**）|
| 出典 | 「scanner Phase 0.5 / 静岡県 5 都市 902 件 / 2026-05-01 実測」明記 |
| サブテキスト | 「沼津 134 件（4.1 倍）と静岡県 902 件（3.8 倍）で **県全体規模の安定実証**」 |
| CTA | 「あなたのサイトの現在地を知る → 無料診断」|

### 7. ウンチク別ページ移管（必須）

| 削除セクション（現 index.html）| 移管先 |
|---|---|
| Hero 下「★★★ Verified Evidence」4 KPI（line 420-445）| `/services/web/sclass/` 詳細セクションへ移植 |
| 公式基準準拠 figure（line 447-460）| `/methodology/` 新設ページ or `/tech/` へ統合 |
| Why Numazu?（民主化 / dogfooding / 構造実証 3 カード / line 462-505）| `/about/` 「私たちの使命」節へ移管 |
| 評価機関と自己実証体の循環（line 861-902）| `/about/` 「HARTON Certified との関係」節へ移管 |
| 日々の発信 note（line 696-714）| footer 内リンクのみに縮約（セクション削除）|
| 技術品質の根拠（line 716-768 / 公式基準準拠と重複）| `/methodology/` へ統合（重複解消）|

### 8. 完了条件 AND（HSCEL §3.1 4 Skill 完備 mandatory）

1. spec-checker FAIL=0 維持
2. **`/feature-dev:feature-dev`** Phase 1-7 完遂（大規模改修のため mandatory）
3. **`/requesting-code-review` 並列 3 reviewer**（独立検証 / 1 名以上欠如は §6.1 Tier 1 適用）:
   - **Reviewer A: UX / コピー精度**（ヒーロー B 案 verbatim 反映 + 訪問者視点での価値理解度評価）
   - **Reviewer B: ブランド戦略整合**（v1.1.7 自己実証体 / dogfooding は別ページ移管されており、トップで「ユーザー価値」が前面化されているか）
   - **Reviewer C: a11y / WCAG 2.2**（H1-H3 階層 / 色コントラスト / aria-label / タッチターゲット）
4. **`/receiving-code-review`** 厳格処理（performative 同意禁止 / CRITICAL/HIGH 全件解消）
5. **`/gstack` 本番実機検証** mandatory:
   - tcharton.com 本番デプロイ後の curl 実測（コピー verbatim 配信確認）
   - スマホ + PC 両方のスクリーンショット（Above the fold で価値 1 行が完結しているか）
6. REPORT-TO-ROOT-FROM-TCHARTON.md に **§HSCEL-V1 §3 セクション完全記載**
7. **HSCEL §5 順序遵守**: 実装 → Skill 完遂 → REPORT 証跡 → ① 承認待ち（disk + REPORT 提示）→ ① 承認 → commit + push → 本番実機検証 → ① 最終承認

### 9. 着手前提

- 即時着手（最優先 / 他保留タスクより上位）
- HSCEL §5 Step 4 で disk artifact + REPORT 提示時、② は **commit 前に ① 承認を必ず受領**（独断 push 禁止）
- 改修中も既存 ★★★ / S-RANK 維持必須（spec-checker FAIL=0）

### 10. ロールバック条件

以下のいずれか発生時、② は即座に ① にエスカレーション + 改修一時停止:

| 発生条件 | 対応 |
|---|---|
| spec-checker FAIL > 0 | 即停止 / 原因解消後再着手 |
| 並列 3 reviewer のうち 1 名以上が CRITICAL 提起 | 当該指摘解消まで commit 不可 |
| 本番 curl 実測でコピー B 案 verbatim 不一致 | rollback + 再 deploy |
| 訪問者離脱率 / 直帰率の劇的悪化（GA4 で観測 / 改修後 7 日経過時点）| ① 判断で部分 rollback 検討 |

### 11. 期待効果（改修後 KPI 想定）

| KPI | 現状想定 | 改修後目標 |
|---|---|---|
| Above the fold で「何屋」が分かる訪問者率 | 推定 < 30% | > 80% |
| 「無料診断」CTA クリック率 | — | +50% |
| 平均セッション時間 | — | +30% |
| 「3 つの成果」セクション完読率 | — | > 60% |

GA4 で改修前後 30 日比較を ② で取得し、③ note 自社改善前後比較シリーズの素材に活用。

### 12. ② への評価コメント

② v1.8（GEO 強化 9 件 + review 全件解消 / 2026-05-01 commit `779df0e`）は技術品質として優秀。**但し技術完成度の追求が、ユーザー価値訴求の希薄化を招いていた**ことを ① も同時認知（IA #1-4 改訂時に「自社目線」を見抜けなかった ① 設計責任）。本改修は技術後退ではなく、**情報設計の優先順位再構築**として位置付ける。

---

## 【追記 2026-05-03 / v1.15】② v1.10 エスカレーション C-1/C-2/C-3 一括判定

### C-1: /methodology/ 新設 → ✅ 案 X 承認（SPEC v3.5 改訂済）

| 確定 | 内容 |
|---|---|
| SPEC | v3.4.3 → **v3.5** 改訂済（§1.1 ディレクトリ構造 + §1.2 ページ表 19 ページ化 + §1.6「19 ページ未満許容しない」+ ヘッダ改訂概要追記）|
| sync 配布 | 完了（tcharton/SPEC.md / scanner/SPEC.md / certification/SPEC.md 全件 v3.5 配布済）|
| verify-all | PASS=1461 / FAIL=0 / S-RANK 維持 |

② Phase 5 実装範囲:
1. `methodology/index.html` 新設（reading variant）— 公式基準準拠 + 技術品質根拠を統合
2. `sitemap.xml` に `/methodology/` 追加
3. `spec-checker.js` `STATIC_TARGETS` 配列に `/methodology/index.html` 追加
4. `llms.txt` Core pages に `/methodology/` 追加

→ Phase 5 atomic commit で全 4 件同期実装（中間状態 LLM クロール回避）

### C-2: ヒーロー直下 Lead Evidence figure 新設 → ✅ 承認 + 1 条件

② 解釈「ヒーロー本体 verbatim 維持 + 直下追加 = §3 改変に該当しない」は **正しい**。

**① 追加条件**:
- figure は **小サイズ厳守**（ヒーロー高さの 1/3 以下）
- メイン主張は **「業界 3.8 倍品質」を大きく前面**（訪問者にとって意味のある数値）
- arXiv 引用は **注記サイズ**（ウンチク化回避）
- 配色は dark 系背景 + teal アクセント維持（ヒーローとの視覚連続性）

### C-3: SVG inline icon → ✅ 承認 + 1 条件

指示書 §5 verbatim 遵守 + Multimodal GEO 整合 + a11y 双方達成。

**① 追加条件**:
- 既存 line 340（T ロゴ）/ line 357（hamburger）SVG パターン踏襲
- **外部依存追加禁止**（lucide / heroicons / fontawesome 等のライブラリ追加不可）
- SVG `<title>` + `<desc>` mandatory（WCAG 2.2 + LLM 引用率向上）

### Phase 4 着手承認

② は即時 Phase 4 着手可:

| Phase | 内容 |
|---|---|
| 4 | 並列 2-3 code-architect agent でアーキテクチャ実装案 3 案提示 → ① 推奨案選択 |
| 5 | 実装（disk のみ / commit 未） — index.html / sclass / about / methodology 新設 / sitemap / spec-checker / llms.txt **atomic** |
| 6 | HSCEL §3.1 並列 3 reviewer（A:UX / B:ブランド / C:a11y）+ /receiving-code-review 厳格処理 |
| 7 | REPORT 起票 → ① 承認待ち → ① 承認後 atomic commit + push → /gstack 本番実機（curl + スマホ/PC スクショ）→ ① 最終承認 |

### Phase 4 着手前提

- spec-checker は現状 18 件配列で S-RANK 維持中。Phase 5 atomic commit で 19 件化と同時に /methodology/ 新設（中間状態回避）
- SPEC v3.5 は配布済（次回 ②④⑤ セッション起動時に sync-spec.js --check で整合確認義務）
- HSCEL §5 順序遵守（Step 4 で disk + REPORT 提示時、commit 前に ① 承認受領 mandatory）

### ② 評価コメント

v1.10 は **HSCEL §5 Step 4 厳守 + Phase 3 厳密検証 + 3 件根拠明示**で模範的エスカレーション。GEO §3.1「最強コンビ」の KDD 2024 verbatim 引用 + spec-checker G-6 line 855-871 verbatim 確認 + 既存 SVG パターン line 340/357 物理確認 = HSCEL §3.3 事実確認 mandatory 完全遵守。① はこの規範遵守を高評価。

---

## 【追記 2026-05-03 / v1.16】② v1.11 エスカレーション ARCH-1/2/3/4 一括判定 + Phase 5 着手承認

### ARCH-1: 案 C+ ハイブリッド → ✅ 承認

② 並列 3 code-architect 受領後の 2 軸純粋評価（AI 検索 9.5/10 + ユーザー価値 9/10 + 総合 8.5/10）に基づく案 C+ 採用 ① 承認。

### ARCH-2: heroicons MIT verbatim path → ✅ 解釈承認 + 1 条件

② 解釈「npm/CDN 不使用 + inline 埋め込み = ① 追加条件『外部依存追加禁止』非該当」は **正しい**。

**🔴 ① 追加条件**:
- **MIT ライセンス表記** mandatory（HTML コメント or footer 明記 / Copyright (c) Tailwind Labs Inc.）
- **取得日 + 一次ソース URL** を `<svg>` 隣の HTML コメントに記載

```html
<!-- heroicons MIT (https://github.com/tailwindlabs/heroicons) / 取得 2026-05-01 / commit-hash 等 -->
<svg ...>
  <title>AI 検索</title>
  <desc>AI 検索エンジンが引用するための GEO 9 戦略実装済</desc>
  <path d="..." />
</svg>
```

- HSCEL §3.3 事実確認証跡として REPORT に併記

### ARCH-3: コメント残置撤回（atomic commit 純度保持）→ ✅ 承認

健全な判断。中間状態コメント残置は LLM クロール一貫性リスク。rollback は git revert で対応。

### ARCH-4: 案 B 部分取り込み → ✅ 両方承認

| 要素 | 承認理由 |
|---|---|
| class 命名規約（`lead-evidence` / `outcome-card` / `industry-meter`）| 全 21 ページ波及の足場 / 既存 Tailwind 併用 / 影響範囲ゼロ |
| `validatePageTypeConsistency()` machine gate | **HSCEL §6.3 Tier 3 hook 配備の精神と整合** / 19→20 ページ拡張時の人間チェック漏れを構造的に排除 |

**副次効果**（① 議題化記録）: machine gate は ⑤ certification 等他担当のミス検出にも転用可 → **全担当統一活用を v3.6 議題化候補**として ① で記録。② Phase 5 実装後、他担当への展開可否を ① で評価。

### Phase 5 着手承認

② 即時 Phase 5 atomic commit 実装着手可:

| Phase 5 内訳 | 時間 | 内容 |
|---|---|---|
| 5a | 2:30 | 移管先ページ更新（sclass / about / methodology 新設）|
| 5b | 2:00 | index.html 改修（Hero / Lead Evidence / 3 つの成果 / 業界比較 / セクション統合）|
| 5c | 0:30 | ルート 3 ファイル（sitemap / spec-checker / llms.txt）|
| 5d | 0:30 | 案 B 取り込み（class 命名 / `validatePageTypeConsistency()`）|
| 最終 | 1:00 | spec-checker 実行・修正バッファ |
| **合計** | **6:30** | |

### Phase 6-7 進行条件

| Phase | 条件 |
|---|---|
| 6 | HSCEL §3.1 並列 3 reviewer（A:UX/コピー / B:ブランド整合 / C:a11y/WCAG） + /receiving-code-review 厳格処理 / CRITICAL/HIGH 全件解消 |
| 7 | REPORT v1.12 起票（§HSCEL-V1 §3 + 事実確認証跡 + ARCH-2 ライセンス記録）→ ① 承認待ち（Step 4）→ ① 承認後 atomic commit + push（Step 5）→ /gstack 本番実機（curl + スマホ/PC スクショ）（Step 6）→ ① 最終承認（Step 7）|

### ② v1.11 評価

**模範的アーキテクチャ評価**:
- 並列 3 agent 受領後の 2 軸純粋評価（AI 検索 + ユーザー価値）
- 統合スコア表で各案を客観定量化
- B 案を「品質保証圧迫リスク」と直言（sycophancy なし）
- 案 A 不採用 / 案 B 部分取り込み / 案 C+ 統合判断 各 verbatim 根拠

② v1.10 模範エスカレーションに続き、v1.11 で **規範遵守 + 戦略思考** の質的飛躍を継続実証。

---

## 【追記 2026-05-03 / v1.17】② v1.12 Phase 5-6 完了承認 + Step 5 atomic commit + push 許可

### Step 5 ✅ 承認

② は **HSCEL §5 Step 4 厳守 + 4 Skill 完遂 + 事実確認 13 項目 + S-RANK PASS=1,535（+74 / WARN=0 解消）** で模範遵守達成。Step 5 atomic commit + push 即時実施可。

### Phase 7 進行条件

| Step | 内容 |
|---|---|
| **5** | ✅ **atomic commit + push 即時可**（pre-push hook で verify-all 自動 S-RANK ゲート通過必須）|
| 6 | push 後 30 秒 deploy → /gstack 本番実機検証（curl + スマホ/PC スクショ）|
| 7 | /gstack 結果を REPORT v1.13 追記 → ① 最終承認 |

### Step 6 /gstack 本番実機検証 必須項目

| # | 検証対象 | 確認方法 |
|---|---|---|
| 1 | ヒーロー B 案 H1「『探される Web』から『AI に選ばれる Web』へ。」配信 | `curl -s https://tcharton.com/ \| grep verbatim` |
| 2 | ヒーロー サブコピー 2 行配信 | curl 実測 verbatim |
| 3 | Lead Evidence figure「3.8 倍」前面化 | スクショ（PC + スマホ）|
| 4 | 「3 つの成果」3 SVG icon 描画（heroicons MIT）| スクショ |
| 5 | 業界比較 industry-meter 横棒グラフ動作 | スクショ |
| 6 | /methodology/ 新設ページ配信 | `curl -I https://tcharton.com/methodology/` 200 OK |
| 7 | sitemap.xml に /methodology/ 含有 | curl 実測 |
| 8 | llms.txt Core pages に /methodology/ 含有 | curl 実測 |
| 9 | スマホ Above the fold で価値 1 行完結 | スマホスクショ |
| 10 | spec-checker `--live` モード（旧 ② 虚偽再発防止 machine gate）| `node spec-checker.js --live https://tcharton.com/` |

### 撤回 5 件 議題化（① 記録）

| # | 議題 | スコープ |
|---|---|---|
| **β** | **role="dialog" + `<nav>` ロールコンフリクト統一改修** | **v3.6 全担当（②④⑤）統一改修候補** |
| α | ブランド B 案キャッチコピー トップ配置 | 次回 IA 改修議題 |
| γ | H1 主要キーワード追加 | 次回 IA 改修議題 |
| δ | シミュレーター aria-live + aria-pressed | 月次保守 |
| ε | about 絵文字 aria-hidden | 月次保守 |

### ② v1.12 評価

**規範遵守の最高水準実証**:
- HSCEL §5 Step 4 厳守（commit 前 ① 承認待ち / 独断 push なし）
- HSCEL §3.1 4 Skill 完備（feature-dev / requesting 並列 3 reviewer / receiving 厳格処理）
- HSCEL §3.3 事実確認 13 項目（全件一次ソース verbatim）
- /receiving-code-review 撤回 5 件全件 verbatim 根拠提示（performative 同意禁止）
- ① 追加条件 7 件（C-2 figure 4 件 + C-3 SVG 3 件）全件遵守

② v1.6 越権 → v1.10 模範エスカレーション → v1.11 模範アーキ評価 → **v1.12 模範実装 + 規範遵守の到達点**。
