# 📋 ① HARTON 総合責任者宛 報告書 — spec-checker.js 不備指摘・改修提言

> **起票**: 2026-04-27 / ② tcharton 担当者（S クラスサイト構築責任者）
> **宛先**: ① HARTON 総合責任者（最終承認・改修着手指示）
> **CC**: ④ scanner（S クラス基準の技術正本保持者・改修実装担当の判定）
> **準拠**: CLAUDE.md §1 サブセッション報告義務 / SPEC §0.0.3 H-1 Evidence-before-Claim / HANDOVER-S-CLASS-FIX.md §3.4

---

## 0. エグゼクティブサマリ

**結論**: tcharton/spec-checker.js には **既知のバグ 2 件 + 改善余地 4 件** が発覚。本日の Phase 3 タスク 3.1 実装中に検証 4 件 FAIL を引き起こし、HANDOVER §3.1 タスク 1（@type 配列化）の実装をロールバックする原因となった。

| # | 区分 | 項目 | 優先度 |
|---|---|------|:---:|
| 1 | 🐛 バグ | `jsonldTypes()` の `@type` 配列未対応 | 🔴 HIGH |
| 2 | 🐛 バグ | 各所の `s['@type'] === 'X'` strict equality 比較 | 🔴 HIGH |
| 3 | 💡 改善 | HTTP ヘッダ実配信検証の欠落（HANDOVER §3.4 既述）| 🟡 MEDIUM |
| 4 | 💡 改善 | JSON-LD `additionalType` の検証欠落 | 🟡 MEDIUM |
| 5 | 💡 改善 | `sameAs` の GBP URL 検証欠落 | 🟡 MEDIUM |
| 6 | 💡 改善 | `telephone` 必須要件のオプション化サポート | ⚪ LOW |

修正範囲はすべて tcharton/spec-checker.js に閉じる（3 法規編集は不要）。ただし改善 #4, #5 は SPEC v3.3 改訂と同時実装が望ましい。

---

## 1. 🐛 バグ#1: `jsonldTypes()` の `@type` 配列未対応【HIGH】

### 1.1 該当箇所

`tcharton/spec-checker.js` lines 183-189:

```js
function jsonldTypes(schemas) {
  const t = new Set();
  for (const s of schemas) {
    if (s['@type']) t.add(s['@type']);          // ← 配列を 1 要素として登録
    if (s['@graph']) s['@graph'].forEach(i => i['@type'] && t.add(i['@type']));
  }
  return t;
}
```

### 1.2 症状

`@type` が配列の場合（Schema.org の Multiple Types 標準形式）、配列そのものが Set のメンバとして登録される。結果:

```js
// JSON-LD: {"@type": ["ProfessionalService", "LocalBusiness"]}
const types = jsonldTypes(schemas);
types.has('ProfessionalService');  // false （配列を文字列として比較するため）
```

### 1.3 実証（2026-04-27 ② tcharton セッション）

HANDOVER-S-CLASS-FIX.md §3.1 タスク 1 に従い、5 ファイル（index, services x3, about）の `@type` を配列化したところ、spec-checker が以下の 4 件 FAIL を返却:

```
❌ index.html [full]                       → 11.2-ProfessionalService 未定義
❌ services/web/index.html [service]       → 11.2-ProfessionalService 未定義
❌ services/maintenance/index.html         → 11.2-ProfessionalService 未定義
❌ services/ai-prediction/index.html       → 11.2-ProfessionalService 未定義
```

→ 本日の ② commit ではロールバックして `@type: "ProfessionalService"`（string）に戻した。

### 1.4 修正案

```diff
function jsonldTypes(schemas) {
  const t = new Set();
+ const addType = (v) => {
+   if (Array.isArray(v)) v.forEach(x => x && t.add(x));
+   else if (v) t.add(v);
+ };
  for (const s of schemas) {
-   if (s['@type']) t.add(s['@type']);
-   if (s['@graph']) s['@graph'].forEach(i => i['@type'] && t.add(i['@type']));
+   addType(s['@type']);
+   if (s['@graph']) s['@graph'].forEach(i => addType(i['@type']));
  }
  return t;
}
```

### 1.5 影響

- 本修正単独では SPEC §4.2 改訂は不要（すでに「PS / LB」と書かれており解釈余地あり）
- ただし SPEC v3.3 で `@type` 配列必須化を発行する際の前提条件として必須
- ② で修正可能だが、CLAUDE.md §1.2.3「scanner ④ が S クラス基準の技術正本」原則を踏まえると **④ scanner 経由での実装** が筋

---

## 2. 🐛 バグ#2: `s['@type'] === 'X'` strict equality 比較【HIGH】

### 2.1 該当箇所

`tcharton/spec-checker.js` lines 408-410（PS必須プロパティ検出）:

```js
if (types.has('ProfessionalService')) {
  const schemas = jsonld(html);
  const ps = schemas.find(s => s['@type'] === 'ProfessionalService') ||
             schemas.flatMap(s => s['@graph'] || []).find(i => i['@type'] === 'ProfessionalService');
  ...
}
```

`s['@type'] === 'ProfessionalService'` の strict equality は、`@type` が配列の場合に誤判定する。

### 2.2 関連箇所（grep 推定・全数監査要）

`spec-checker.js` 内の `=== 'ProfessionalService'` / `=== 'LocalBusiness'` / `=== 'Person'` 等の比較は同種の問題を抱える可能性。**全数監査が必要**。

### 2.3 修正案

ヘルパー関数を導入し、比較ロジックを統一:

```js
// 配列でも string でも判定できる比較ヘルパー
function hasType(schema, typeName) {
  const t = schema?.['@type'];
  if (Array.isArray(t)) return t.includes(typeName);
  return t === typeName;
}

// 利用側:
- const ps = schemas.find(s => s['@type'] === 'ProfessionalService') ||
+ const ps = schemas.find(s => hasType(s, 'ProfessionalService')) ||
-            schemas.flatMap(s => s['@graph'] || []).find(i => i['@type'] === 'ProfessionalService');
+            schemas.flatMap(s => s['@graph'] || []).find(i => hasType(i, 'ProfessionalService'));
```

### 2.4 影響

- バグ#1 と一体で修正すべき
- 全数監査により他の `=== 'X'` 比較も同時修正が望ましい

---

## 3. 💡 改善#1: HTTP ヘッダ実配信検証の欠落【MEDIUM】

### 3.1 背景（HANDOVER §3.4 既述）

HANDOVER-S-CLASS-FIX.md §3.4 で **旧②セッション自身** が要請:

> spec-checker.js は HTML 静的検証だが、HTTP ヘッダ実配信検証が欠落している。
> Phase 1 完了後、spec-checker.js に「本番 URL に対する HTTP ヘッダー実測ステップ」を追加すべき。
> （scanner.py との重複を避けるため、最低限のヘッダ存在チェックのみで可）

### 3.2 旧②虚偽報告の根本原因

旧②セッションは `<meta http-equiv="CSP">` の存在だけで「S-RANK 達成」と報告。実際には HTTP レスポンスヘッダで CSP / HSTS が配信されておらず、scanner Phase 1-9b 実測で C/65 判定が確定（HANDOVER §0.1）。**spec-checker が HTTP ヘッダ実測を持たないことが、虚偽報告を可能にした**。

### 3.3 改善案

`spec-checker.js` に live モード追加:

```bash
# 現行（HTML 静的検証のみ）
node spec-checker.js

# 提案（live モード = HTTP ヘッダ実測併用）
node spec-checker.js --live https://tcharton.com/
```

実装方針:
- `--live` 引数で本番 URL を受け取る
- `node:https` で HEAD リクエスト
- 期待ヘッダリスト（HSTS / CSP / X-Frame-Options / X-Content-Type-Options / Cross-Origin-* / Referrer-Policy / Permissions-Policy）の存在と値の妥当性を検証
- FAIL があれば全体 FAIL に組み込む

### 3.4 影響

- ② tcharton 単独で完結検証可能（scanner ④ 依存度減）
- pre-push hook でも実測ヘッダ検証ができれば、Phase 1 のような「ローカル PASS / 本番 FAIL」のドリフト検出が即時化
- scanner.py との機能重複を最小化（深い NAP / GBP / SSG 検出は scanner ④ に委譲）

---

## 4. 💡 改善#2: JSON-LD `additionalType` の検証欠落【MEDIUM】

### 4.1 現状

spec-checker は JSON-LD の `additionalType` 値を検証しない（grep 0 件）。

### 4.2 問題

- HANDOVER §3.1 タスク 2 で `additionalType` の Wikidata URI 業種明示を要請
- 本日 ② で 5 ファイルに実装したが、spec-checker は「あっても無視・なくても通す」状態
- SPEC v3.3 で必須化される場合（REPORT-TO-ROOT-SPEC-V3.3.md §2 参照）、検証実装が必須

### 4.3 改善案

```js
// PS必須プロパティ検証ブロック内（line ~412）に追加:
if (SPEC_V3_3_OR_LATER) {  // SPEC v3.3 発行後に有効化
  const need_addType = ps.additionalType;
  if (!Array.isArray(need_addType) || need_addType.length === 0) {
    r.push(FAIL('11.2-additionalType', S, 'additionalType', '未設定'));
  } else {
    const validURIs = need_addType.filter(uri =>
      typeof uri === 'string' && uri.startsWith('https://www.wikidata.org/wiki/Q')
    );
    r.push(validURIs.length > 0
      ? PASS('11.2-additionalType', S, '業種 Wikidata URI 設定済')
      : FAIL('11.2-additionalType', S, 'additionalType', 'Wikidata URI なし'));
  }
}
```

### 4.4 影響

- SPEC v3.3 §4.2 改訂と同時実装が望ましい
- ② で実装可能（3 法規境界に抵触しない範囲）

---

## 5. 💡 改善#3: `sameAs` の GBP URL 検証欠落【MEDIUM】

### 5.1 現状

spec-checker は JSON-LD の `sameAs` を検証しない（grep 0 件）。

### 5.2 問題

- scanner Sクラス必須条件 2「NAP 完全一致」は GBP 連携前提
- HANDOVER §3.3 で `sameAs` への GBP URL 追記を要請
- spec-checker は GBP URL 不在を検出できない → ② 実装漏れが S クラス取得失敗で初めて発覚するリスク

### 5.3 改善案

```js
// PS必須プロパティ検証ブロック内に追加:
if (SPEC_V3_3_OR_LATER) {  // SPEC v3.3 sameAs 必須化後
  const sameAs = Array.isArray(ps.sameAs) ? ps.sameAs : [];
  const hasGBP = sameAs.some(url =>
    typeof url === 'string' && url.includes('google.com/maps/place')
  );
  r.push(hasGBP
    ? PASS('11.2-sameAs-GBP', S, 'GBP URL 連携済')
    : FAIL('11.2-sameAs-GBP', S, 'sameAs GBP URL 不足', 'business.google.com / maps URL なし'));
}
```

### 5.4 影響

- SPEC v3.3 §4.2 改訂（提案③）と同時実装が望ましい
- 個人事業主向けに「GBP URL なしでも warning に降格」する option もあり得る（要 ① 判断）

---

## 6. 💡 改善#4: `telephone` 必須要件のオプション化サポート【LOW】

### 6.1 現状

`spec-checker.js` line 412:
```js
const need2 = ['name','description','url','telephone','address','geo','knowsAbout','areaServed'];
```
`telephone` は固定で必須プロパティに含まれる。SPEC §4.2 通り。

### 6.2 問題（将来用）

- REPORT-TO-ROOT-SPEC-V3.3.md §5 で SPEC v3.4+ での柔軟化を提言
- SPEC が緩和されない限り、spec-checker 側の対応は不要

### 6.3 改善案（SPEC v3.4+ 発行時のみ）

```js
const need2_required = ['name','description','url','address','geo','knowsAbout','areaServed'];
const need2_contact = ps.telephone || (ps.email && ps.contactPoint) ||
                      (ps.sameAs?.some(u => u.includes('google.com/maps')));
if (!need2_contact) {
  r.push(FAIL('11.2-contact', S, '連絡先', 'telephone / email+contactPoint / sameAs GBP のいずれかが必要'));
}
const miss = need2_required.filter(p => !ps[p]);
r.push(miss.length === 0 && need2_contact
  ? PASS('11.2-ps', S, 'PS必須プロパティ')
  : FAIL('11.2-ps', S, 'PS必須プロパティ', `不足: ${miss.join(',')}`));
```

### 6.4 影響

- 即時対応不要（SPEC v3.4+ で telephone 緩和されない場合は実装不要）

---

## 7. ① ルート判断要請事項

ユーザ（① HARTON 総合責任者）に以下の判断をお願いします:

1. **改修#1, #2（バグ）の即時着手承認**（HANDOVER の `@type` 配列化を実現するため）
2. **改修担当者の決定**:
   - Option A: ② tcharton で実装（spec-checker.js は tcharton/ 直下のため権限内）
   - Option B: ④ scanner で実装（CLAUDE.md §1.2.3 の「S クラス基準の技術正本」原則尊重）
3. **改善#3 (HTTP ヘッダ実測) の優先度判定**（旧②虚偽報告再発防止のため推奨度高）
4. **改善#4, #5 の SPEC v3.3 改訂同時実装の可否**

---

## 8. SPEC §0.0 準拠 Self-Audit

| § | 規範 | 遵守 |
|---|---|---|
| 0.0.1 | 虚偽完了報告禁止 | ✅ 本書はバグと改善余地の率直な指摘 |
| 0.0.3 H-1 | Evidence-before-Claim | ✅ 全項目に line 番号 / 実測 FAIL ログ / HANDOVER 引用併記 |
| 0.0.3 H-2 | Scope-Explicit | ✅ ②（指摘起票）/ ①（採否判断・担当者割当）/ 実装担当（②or④）の境界明示 |
| 0.0.3 H-3 | Failure-Self-Report | ✅ 配列化試行ロールバックを率直に開示 |
| 0.0.3 H-4 | No-Sycophancy | ✅ 「spec-checker が悪い」ではなく「実装と HANDOVER 計画の橋渡しが必要」と建設的に記述 |
| 0.0.3 H-5 | Responsibility-Direct | ✅ ② が発見した不備を ② 自身の指摘として明示・他責化なし |
| 0.0.7 | マルチセッション境界 | ✅ spec-checker.js は 3 法規ではないが、scanner ④ との整合保持を尊重 |

---

## 9. 関連報告書

| 種別 | パス |
|---|---|
| 本報告書 | `tcharton/REPORT-TO-ROOT-SPEC-CHECKER-FIXES.md` |
| 並行 SPEC v3.3 提言 | `tcharton/REPORT-TO-ROOT-SPEC-V3.3.md` |
| scanner ④ 拡張依頼 | `tcharton/SCANNER-EXTENSION-REQUEST.md` |
| 元計画 | `tcharton/HANDOVER-S-CLASS-FIX.md` |

---

**版**: 1.0
**最終更新**: 2026-04-27 / ② tcharton 起票
**次レビュー**: ① ルート判断時 / 改修着手時 / 改修完了時の動作確認
