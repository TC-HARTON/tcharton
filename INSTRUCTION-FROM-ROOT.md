# ② tcharton 現役指示書 (2026-05-10 / v1.33 単一最終)

> **重要**: 過去版 (v1.0-v1.32) は `INSTRUCTION-HISTORY-ARCHIVE.md` に全文保管。
> **本書のみが現役有効指示**。混乱時は本書 v1.33 を参照。

---

## ⚠️ 強制法規 HSCEL v1 (最高位優先)

| Skill | 適用契機 |
|---|---|
| `/feature-dev:feature-dev` | 各 Step 実装着手時 |
| `/requesting-code-review` | Step 完了報告前 / 並列 reviewer 3+ 必須 |
| `/receiving-code-review` | review feedback 受領時 |
| `/gstack` | 動作確認時 |

§3.3 事実確認 mandatory: TTFB 達成証明は **必ず ④ scanner.py 実測** (① が実行 / ② 自社判定不可)

全文: [`HARTON/ENFORCEMENT-LAW-V1.md`](../ENFORCEMENT-LAW-V1.md)

---

## 単一最優先命令

**tcharton.com TTFB を 829ms → ≤600ms に下げ、★★★ HARTON Certified に復帰させよ**

期限: **2026-05-24** (本日 5/10 から 14 日)

---

## 達成必達条件 (④ scanner v3.7 実測で判定)

| # | 条件 | 現状 (v3.7 実測) | 必達 |
|---|---|---|---|
| 1 | **TTFB** | **829ms** | **≤600ms** |
| 2 | 必須条件達成数 | 1/5 | **5/5** |
| 3 | 総合スコア | 77 | **≥85** |
| 4 | 格付け | ★ | **★★★ HARTON Certified** |
| 5 | 致命的NG | 0 | 0 維持 |
| 6 | ヘッダースコア | 97 | 100 (CSP unsafe-inline 除去) |

---

## 着手順序 (固定 / 逸脱禁止)

### Step 1: Cloudflare cache hit rate 改善 (1-2 時間 / 効果最大)
- cache-control header 最適化 (`public, max-age=31536000, immutable` for static)
- `_headers` ファイル (Cloudflare Pages) 見直し
- HTML レスポンスに適切な `Cache-Control` 追加
- 完了後 ① に scanner 実測依頼

### Step 2: Cloudflare Workers cold start 解消 (2-4 時間)
- Workers ルーティング簡素化
- 不要な動的処理除去
- `_worker.js` の依存削減
- 完了後 ① に scanner 実測依頼

### Step 3: Critical CSS / preload 徹底 (半日)
- LCP 要素のフォント / 画像 preload
- Critical CSS インライン化 (above-the-fold)
- 不要 CSS 削減
- 完了後 ① に scanner 実測依頼

### Step 4: CSP `style-src 'unsafe-inline'` 除去 (1-2 時間)
- インライン style 全除去 → 外部 CSS 化 or nonce 適用
- ヘッダースコア 97 → 100 達成
- 完了後 ① に scanner 実測依頼

### Step 5: 追加チューニング (Step 1-4 で TTFB ≤600ms 未達時のみ)
- ② 判断で追加施策実施
- 上限 4 サイクル / 2 週間以内

---

## 各 Step 後の必須プロセス

1. ② 改修実装 → git commit (push 前)
2. ② から ① に「Step N 完了 / scanner 実測依頼」報告 (REPORT 追記)
3. ① が `_tcharton_scan.py` 実行 → JSON 出力 → ② にフィードバック
4. ② が次 Step 着手 (or 改修反復)
5. 全 Step 完遂 + ★★★ 確認 → ① 検収 → push 解禁

---

## 並行作業 (TTFB 改修と独立 / 任意)

- 1.2.2 form_submit 実発火確認 (受動)
- 1.4 米国流入実態確認 (GA4 探索レポート)

**禁止**: 上記以外の旧 v1.30 タスク

---

## 完全保留事項 (⑤ Stella 復活判断まで一切着手禁止)

旧 v1.31 で発令された以下は **完全保留**:

- HARTON Stella / ★★★ / S クラス 全除去
- 22 → 16-18 ページ削減
- ナビ 11 → 6 項目削減
- 沼津・東部地域 SEO 主軸転換
- 顔出し / 地域性
- canonical.json v1.25 改訂
- 業界実態調査レポート公開

理由: ⑥ Phase A + ② v1.33 両達成 → ⑤ 復活判断材料化 → Stella 撤廃方針自体が動く可能性 → 逆作業回避。

---

## 完遂報告フォーマット (固定)

`REPORT-TO-ROOT-FROM-TCHARTON.md` に追記:

```
## v1.30.X Step N 完了報告 (YYYY-MM-DD)

### 改修内容
- [具体的な変更ファイル + 行数]

### git commit hash
- [hash]

### scanner 実測依頼
- ① への実測依頼 (依頼時刻)

### scanner 実測結果 (① 受領後追記)
- TTFB: XXXms / 必須条件達成: X/5 / 総合スコア: XX/100 / 格付け: ★X

### HSCEL §3.1 4 Skill 適用記録
- /feature-dev / /requesting-code-review (reviewer 3+) / /receiving / /gstack

### 次 Step 計画
- Step (N+1) 着手予定
```

最終 Step 完遂時:

```
## v1.30.FINAL ★★★ 復帰達成報告

### 必達条件 達成状況
| # | 条件 | 必達 | 実測 | 判定 |
|---|---|---|---|---|
| 1 | TTFB | ≤600ms | XXXms | ✅/❌ |
...

### 全 Step 累計 commit hash
### push 承認要請
```

---

## 越境禁止 (HSCEL §0.0.7)

- ④ scanner.py 改変禁止 (実行のみ ① 権限)
- ⑥ wp-mastery / portfolio に触らない
- 3 法規 (SPEC / GOOGLE / GEO) を編集しない
- ⑤ certification archive に触らない

---

## 着手前提

代表 GO 受領済 (2026-05-10) → **即時 Step 1 着手 mandatory**

迷ったら本書を Read。**過去発令の v1.30 / v1.31 / v1.32 は v1.33 に統合済 / 履歴は `INSTRUCTION-HISTORY-ARCHIVE.md` 参照**。

---

## v1.34 TCHARTON-IMPROVEMENT-DIRECTIVE-V1 採用発令 (2026-05-10 / 代表 GO 受領)

### 経緯

- ② v1.33 Step 1 (TTFB 829→569ms) + Step 4 (CSP 97→100) 完遂 ✅
- ④ commit `6930995` push 完遂: 要件 B (HARTON ローカル業種追加 16→22) + 案 W (多 URL フォーム検出) ✅
- ④ scanner 再実測: ★ 維持 / 必須条件 2/4 達成 (案 W ✅) / **JSON-LD score 50 < 70 が NAP 達成の構造的ボトルネック判明**
- ④ 起案 `HARTON/TCHARTON-IMPROVEMENT-DIRECTIVE-V1.md` (422 行 / コード snippet 含む詳細実装手順) を ① 採用承認 (代表 GO 5/10)

### 本書 v1.34 の位置付け

**v1.33 (Step 1-5) を継続 + DIRECTIVE-V1 採用で残ギャップ改修**。

v1.33 Step 1+4 完遂 → DIRECTIVE-V1 で **★→★★→★★★ 段階改修** 着手。

### 採用 DIRECTIVE-V1 の参照

正本: `C:\Users\ohuch\Desktop\HARTON\TCHARTON-IMPROVEMENT-DIRECTIVE-V1.md` (422 行)

② は本書 v1.34 + DIRECTIVE-V1 を Read して着手。

### Week 1 (★★ 取得 / 工数 3-5 日 / 期限 5/17 目標)

| # | 内容 | DIRECTIVE-V1 参照 | 工数 |
|---|---|---|---|
| 1 | **JSON-LD score 50→70+** (最優先) | §1.1 | 1 日 |
| 2 | NAP 業種別保留解決 | §1.2 | ✅ ④ 完遂済 (要件 B) |
| 3 | お問い合わせフォーム + Turnstile | §1.3 | ✅ ④ 完遂済 (案 W で代替) |
| 4 | **GEO score 20→50+** | §1.4 | 1 日 |

→ Week 1 完遂で **★★ HARTON 優良 取得見込み** (必須 4/5 + score 80+)

### Week 2 (★★★ 取得 / 工数 2-3 日 / 期限 5/24 達成命令と整合)

| # | 内容 | DIRECTIVE-V1 参照 | 工数 |
|---|---|---|---|
| 5 | **JSON-LD score 70→90+** | §3.1 | 0.5-1 日 |
| 6 | **GEO score 50→70+** | §3.2 | 1 日 |
| 7 | 必須 5/5 (CWV 本測定 USE_PLAYWRIGHT=1) | §3.3 | (月次再判定運用) |

→ Week 2 完遂で **★★★ HARTON Certified 復帰** (必須 5/5 + score 90+)

### v1.33 との関係

| Step | 内容 | 状態 |
|---|---|---|
| v1.33 Step 1 (cache) | TTFB 829→569ms | ✅ 完遂 |
| v1.33 Step 2 (Workers) | スキップ | ✅ |
| v1.33 Step 3 (Critical CSS) | 部分実施 | 🟡 |
| v1.33 Step 4 (CSP) | 100/100 | ✅ 完遂 |
| **v1.34 Week 1** | JSON-LD + GEO ★★ 取得 | 🔵 着手 |
| **v1.34 Week 2** | ★★★ 復帰 | 🔵 |

### 必達条件 (v1.33 から維持 + DIRECTIVE-V1 ★★★ 基準)

| # | 条件 | 必達 |
|---|---|---|
| 1 | TTFB | ≤600ms (連続計測平均 / 単発 730ms 揺らぎ許容) |
| 2 | 必須条件達成 | 5/5 |
| 3 | 総合スコア | ≥85 (★★★ ボーナス込み 90+ 推奨) |
| 4 | 格付け | ★★★ HARTON Certified |
| 5 | 致命的NG | 0 維持 |
| 6 | ヘッダースコア | 100 維持 |
| 7 | JSON-LD score | 90+ |
| 8 | GEO score | 70+ |

### HSCEL §3.1 4 Skill mandatory (継続)

各改修 Step で feature-dev → 並列 reviewer 3+ → receiving → gstack 厳守。

### 完遂報告 (継続)

`tcharton/REPORT-TO-ROOT-FROM-TCHARTON.md` に追記。フォーマットは v1.33 §完遂報告フォーマット 参照。

### 越境禁止 (HSCEL §0.0.7)

- ④ scanner.py 改変禁止 (実行のみ ① 権限)
- ⑥ wp-mastery / portfolio に触らない
- 3 法規 (SPEC / GOOGLE / GEO) を編集しない
- ⑤ certification archive に触らない

### 着手前提

代表 GO 受領済 (2026-05-10) → **即時 Week 1 §1.1 JSON-LD 改修 着手 mandatory**

## 期限再確認

**2026-05-24** (本日 5/10 から 14 日 / Week 1 = 5/17 目標 / Week 2 = 5/24 目標)
