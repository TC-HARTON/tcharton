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
