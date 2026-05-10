# AUDIT-CODE-V2 — tcharton.com コード品質厳格再監査

**監査日**: 2026-05-10
**監査者**: ① HARTON 総合責任者（コード品質レビュアー / V2 厳格モード）
**前回**: V1 = 91/100（A+級・主張妥当・軽微 4 件）
**前提**: V1 と同じく ② が「100% S-RANK」を claim 後の状態（commit `a3881a8` ＋ ワーキングコピー軽微変更）
**結論先出**: **総合 78 / 100 — B+ 級。spec-checker は緑だが HTML 構造に sed 盲打ち由来の物理破壊が 7 ファイルに残存**

V1 と V2 で 13 点差が開いた理由は、V1 で省略した「全 HTML タグバランス機械検査」を V2 で実走行した結果、② の sed 盲打ちにより閉じタグ消失・タグ崩壊が 7 ファイルに残っていることが判明したため。spec-checker は閉じタグ整合を検査していない（盲点）。

---

## 0. 監査範囲と実行コマンド

| # | 検証 | コマンド | 結果 |
|---|---|---|---|
| 1 | spec-checker 実走行 | `node spec-checker.js` | ✅ PASS:1159 / FAIL:0 / WARN:62 / SKIP:102 / 100% / S-RANK |
| 2 | verify-all 実走行 | `node verify-all.js` | ✅ [1/2] 76ms / [2/2] 255ms — 全 PASS |
| 3 | HTML 全件タグバランス | 自作 audit-tmp.js（Node fs 走査・noscript/script/style 除去後カウント） | ❌ 15/22 ファイルで `<a>` または `<li>` 開閉不一致 |
| 4 | JSON-LD 構文 valid | 自作スクリプト `JSON.parse` | ✅ 43/43 OK / FAIL=0 |
| 5 | 内部リンク整合 | 自作スクリプト（href 全件 → ファイルシステム照合） | ✅ 775 件 / broken=0 |
| 6 | キャッシュバスティング | grep `?v=` on css/js refs | ✅ CSS 21/21 / JS 61/61 — 100% |
| 7 | sed 損傷シグネチャ | grep dup-class / `<<` / 空 href / `>>` 等 | ❌ 6 ファイルで dup-class 検出 |

---

## 1. spec-checker 構造（25 / 25）

V1 と同じく満点。1323 検証項目・PASS 1159・FAIL 0。WARN は 62 に増加（V1 31 → V2 62）したが FAIL は依然ゼロ。`services/maintenance/` の orphan WARN は引き続き stale ルール由来で実害なし。

`verify-all.js` は 3 法規同期チェック ＋ spec-checker の 2 段で正常終了。pre-push hook は機能している。

---

## 2. HTML タグバランス（5 / 15） ❌ V1 比 -10

### 2.1 機械検査結果（22 HTML 中 15 件で不一致）

```
UNBAL 404.html             [a:+1, li:+1]
UNBAL about/index.html     [a:+1, li:+1]
UNBAL cases/index.html     [a:+1, li:+1]
UNBAL contact/index.html   [a:+1, li:+1]
UNBAL faq/index.html       [a:-1, li:+1]   ← 閉じが 1 個過剰
UNBAL index.html           [a:+1, li:+1]
UNBAL legal/index.html     [a:+1, li:+1]
UNBAL methodology/index.html  [li:+1]
UNBAL news/index.html         [li:+1]
UNBAL privacy/index.html      [a:+1, li:+1]
UNBAL profile/index.html      [li:+1]
UNBAL services/ai-prediction/index.html              [li:+1]
UNBAL services/ai-prediction/inventory/index.html    [li:+1]
UNBAL services/ai-prediction/sales/index.html        [li:+1]
UNBAL services/web/industries/index.html             [li:+1]
```

`<noscript>`・`<script>`・`<style>` 除去後カウント。明確な構造破損。

### 2.2 sed 損傷の物理特定 — 6 ファイルで「閉じ `>` なし `<a>`」が混入

`about/index.html` line 184–186：

```
184:  <a href="/services/web/" class="...border-dark-700">WEB 制作</a>
185:  <a href="/services/web/" class="...border-dark-700"      ← 閉じ ">" なし、本文なし、</a> なし
186:  <a href="/services/ai-prediction/" class="...">AI 予測</a>
```

同パターンが 6 ファイルに存在：
- `about/index.html` line 185
- `contact/index.html` line 147
- `services/ai-prediction/index.html` line 189
- `services/ai-prediction/inventory/index.html` line 119
- `services/ai-prediction/sales/index.html` line 119
- `services/web/industries/index.html` line 119

直前に正しい `<a href="/services/web/">WEB 制作</a>` があり、その下に閉じ `>` のない**重複した壊れた `<a>` タグ**が混入している。**典型的な sed 盲打ち多重置換で改行を跨いだ際に開きタグだけ複製された痕跡**。② の 39e0298 「nav 統一」commit が起源と推定。

ブラウザはエラー復旧で表示してしまうため目視 QA では見えず、spec-checker もタグ整合を見ていないため検出できなかった。**V1 でも見逃した重大な構造瑕疵**。

### 2.3 faq/index.html — JSON-LD 内部に `</a>` リテラル混入

`faq/index.html` line 99：

```json
{"@type": "Question", "name": "相談だけでも可能ですか？",
 "acceptedAnswer": {"@type": "Answer",
  "text": "可能です。トップページの 1 分でできる無料相談</a>で現状を可視化したあと..."}}
```

JSON-LD の Answer 文字列内に `</a>` HTML タグリテラルが残置。JSON.parse は通る（単なる文字列）が、FAQPage 構造化データとして Google / LLM に送られる際に**意味論的にゴミデータ**。GEO/LLMO 戦略 §6.6 の Self-contained Answer 原則違反。

---

## 3. JSON-LD 妥当性（15 / 15）

22 ページ × 平均 2 ブロック ＝ **43 ブロック全件 JSON.parse 成功**。FAIL ゼロ。

ただし上記 §2.3 のとおり parse 通過 ≠ 意味論的に正しい。Google Rich Results Test 等の構造意味検査は別途必須だが、「JSON 構文 valid」の 1 項目としては満点判定。

---

## 4. CSS / JS（10 / 10）

`dist/output.css` 40KB / Tailwind v3.4 minified single-line. `dist/scripts/*.js` 6 ファイル全揃い・version stamp 整合。V1 と同条件で満点維持。

---

## 5. 内部リンク整合（10 / 10）

全 HTML から `href=` を全件抽出（775 件）し、絶対パス（`/...`）について `fs.existsSync` ベースで実体照合。**broken=0**。`services/maintenance` 系の WARN は HTML 内には混入していない（spec-checker の expected リストにのみ残存）。

V1 と同水準。満点。

---

## 6. ビルド完全性（8 / 10） ❌ V1 比 -2

`dist/output.css`・`dist/scripts/*`・21 HTML・`_headers`・`_redirects`・`404.html`・`thanks.html`・認証ファイル全揃い。

**減点 -2 の根拠**: §2 の sed 損傷が含まれた状態でビルド成果物が「完成」と扱われている。HTML 構造破損は **「成果物（ビルド済み）」の品質保証範囲**であり、CSS/JS だけ揃っていれば良いものではない。tag-balance を pre-push hook の検証範囲に組み込むべき。

---

## 7. キャッシュ戦略（10 / 10）

CSS: 21 ファイル全 `?v=20260510a` 統一。JS: 61 references 全 `?v=202605101240` 統一。`_headers` の immutable + max-age=31536000 / HSTS preload / CSP trusted-types / COOP/COEP/CORP — 完璧。

V1 と同水準。満点。

---

## 8. ドキュメント品質（5 / 5）

3 法規同期 OK、`docs/` 内 AUDIT-* シリーズ管理整然、本 V2 監査も同パターンで追加。V1 で減点した `services/maintenance` ドキュメント残置は別軸（spec-checker stale ルール）で吸収。V2 では満点扱い。

---

## 9. ② の sed 盲打ちリスク評価（特別軸 / 加点なし減点のみ）

⚠️ **HIGH RISK** ⚠️

- 39e0298「nav 統一」commit が 6 ファイルに同形のタグ崩壊を導入
- `<a>` 開きタグの**重複行 + 閉じ `>` 欠落**は、複数行マッチの sed/Edit 盲打ちで `replace_all` を使った場合の典型的事故パターン
- spec-checker は閉じタグ整合・属性形式まで見ていない（盲点）
- 結果：「100% S-RANK」claim と「実際の HTML 構造」が乖離

**指摘**: ② への運用ルール追加が必要。
1. 複数ファイルに対する一括置換を行う場合、必ず「全置換後のタグバランス機械検査」を実施
2. spec-checker.js に簡易タグバランステスト（`<a>` `<li>` `<div>` `<section>` 等の開閉一致）を追加
3. pre-push hook を通過した状態でも、重要 commit 後は手動で audit-tag-balance を回す運用を定着

---

## 10. V1 vs V2 比較表

| 評価軸 | 配点 | V1 | V2 | 差分 | 主因 |
|---|---:|---:|---:|---:|---|
| spec-checker 構造 | 25 | 25 | 25 | 0 | 緑維持 |
| HTML タグバランス | 15 | 15 | **5** | **-10** | sed 損傷 7 ファイル発覚（V1 で未検査） |
| JSON-LD valid | 15 | 14 | 15 | +1 | 全件 JSON.parse OK（V2 で機械検査追加） |
| CSS/JS 完全性 | 10 | 10 | 10 | 0 | 同水準 |
| 内部リンク整合 | 10 | 9 | 10 | +1 | V2 で 775 件全件機械検査・broken 0 確認 |
| ビルド完全性 | 10 | 10 | **8** | **-2** | sed 損傷成果物がビルドに含まれる |
| キャッシュ戦略 | 10 | 10 | 10 | 0 | 同水準 |
| ドキュメント品質 | 5 | 4 | 5 | +1 | V1 減点理由は別軸へ吸収 |
| **合計** | **100** | **91** | **78** | **-13** | HTML 構造破損が決定打 |

V1 を上回った加点は 3 項目あるが、HTML タグバランスでの -10 が支配的。**「機械検査ツールが緑でも、構造は壊れている」**という代表指摘の正当性を V2 で実証する形となった。

---

## 11. P0 修正必須項目（次セッションで ② が即時対応）

1. **about/index.html line 185** — 重複した壊れた `<a href="/services/web/">` を削除
2. **contact/index.html line 147** — 同上削除
3. **services/ai-prediction/index.html line 189** — 同上削除
4. **services/ai-prediction/inventory/index.html line 119** — 同上削除
5. **services/ai-prediction/sales/index.html line 119** — 同上削除
6. **services/web/industries/index.html line 119** — 同上削除
7. **faq/index.html line 99** — JSON-LD Answer text の `</a>` リテラル除去
8. **404 / cases / index / legal / privacy / methodology / news / profile / services/* (5 件) の `<li>` 開閉不一致** — JSON-LD ListItem の HTML テキスト混入の可能性を全件目視確認
9. **spec-checker.js 拡張** — 簡易タグバランス検証関数追加（`<a> <li> <ul> <ol> <div> <section> <main> <header> <footer> <nav>` の開閉一致）

修正後、再度 `node spec-checker.js` ＋ tag-balance 機械検査の両方が緑であることを確認してから push。

---

## 12. 結論

**総合 78 / 100 — B+。**

② の「100% S-RANK」claim は spec-checker レベルでは妥当だが、**HTML 構造の物理整合性レベルでは 7 ファイルに sed 盲打ち由来の破損が残存**しており、「コード品質」の総合評価としては A 級には届かない。

V1 で見逃した盲点（タグバランス機械検査）を V2 で網羅した結果、-13 点。spec-checker のチェック範囲を拡張し、sed 系の構造破壊を pre-push で検出する仕組みを ② が整備するまで、V3 監査でも同種瑕疵リスクは継続。

**監査結論**: P0 修正 7 ファイル ＋ spec-checker タグバランス検証追加を完了するまで、コード品質 V2 = **78 / 100（B+）** 据え置き。
