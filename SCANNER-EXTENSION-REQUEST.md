# 📤 scanner ④ への拡張依頼（② tcharton 起票）

> **起票**: 2026-04-27 / ② tcharton 改修担当者（HANDOVER-S-CLASS-FIX.md Phase 2-3 進行中）
> **宛先**: ④ scanner 運用セッション（S クラス基準の技術正本保持責任者 / CLAUDE.md §1.2.3）
> **CC**: ① HARTON 総合責任者（戦略整合判断・SPEC v3.3 余地確認）
> **準拠**: SPEC §0.0.7 マルチセッション境界 / CLAUDE.md §1 サブセッション報告義務

---

## 0. 経緯サマリ

HANDOVER-S-CLASS-FIX.md（旧②起票）に基づき、② tcharton は以下を実装済:

- **Phase 1（完了・実測検証済）**: HTTP セキュリティヘッダ全配信 + HSTS preload 申請受付
- **Phase 3 タスク 3.1（部分完了）**: JSON-LD `additionalType`（Wikidata Q189210/Q11661/Q11660）+ `sameAs`（note.com・GBP プレースホルダ）

未達領域は本書で ④ scanner 拡張の検討を依頼します。

---

## 1. 依頼事項 ① — SSG/Jamstack 検出ロジック拡張

### 現状の課題（HANDOVER §1.3 必須条件 5）

| 項目 | 現状 |
|---|---|
| tcharton.com の配信プラットフォーム | **Cloudflare Workers Static Assets**（`.assetsignore` 1 行目で確定）|
| 実 HTTP レスポンスヘッダ | `Server: cloudflare` + `CF-RAY: ...` のみ |
| `cf-pages` ヘッダ | **無し**（Workers Static Assets では付与されないのが正常）|
| scanner.py `check_ssg_hint` 現行ロジック | `cf-ray AND cf-pages` 両方 / `X-Vercel-Id` / `X-NF-Request-Id` / `Server: github.com` のいずれかで SSG 認定 |
| 結果 | **判定不能（SSG/Jamstack 未達）**→ Sクラス必須条件 5 ✗ |

### 技術背景

Cloudflare Workers Static Assets は Cloudflare Pages と**同等の静的エッジ配信**であり、本質的に Jamstack の定義（pre-built static + edge serving）を満たします。`cf-pages` ヘッダ非存在は配信実装の差異であって、静的配信の有無を区別するものではありません。

### 依頼内容

scanner.py `check_ssg_hint` に以下のいずれかの認定パターンを追加してください:

#### Option A（最小変更・推奨）

```python
# 既存パターンに以下を追加:
# Cloudflare Workers Static Assets: Server="cloudflare" AND cf-ray AND (cf-pages 不在でも可) AND (origin server シグナルが無い)
# シグナル: X-Origin-* / X-Backend / X-Powered-By 等の origin 由来ヘッダが無いこと
```

#### Option B（明示シグナルに依拠）

② tcharton 側の `_headers` に honest なマーカーを追加可（要 ① 承認）:

```
X-Hosting: cloudflare-workers-static-assets
```

scanner.py 側は `X-Hosting` の値が静的配信プラットフォーム（許可リスト）に含まれれば SSG 認定。

#### Option C（既存運用維持・推奨度低）

② tcharton を Cloudflare Pages に物理移行（dashboard 作業 + DNS 切替 + 短時間 404 リスク）。④ 拡張不要。本選択は ① 承認案件のため避けたい。

### 推奨

**Option A** を推奨。Cloudflare Workers Static Assets は Cloudflare Pages と同レベルの静的配信であり、scanner の本来意図（静的配信判定）と整合。Option B は明示シグナルが必要な場合のフォールバック。

---

## 2. 依頼事項 ② — INDUSTRY_KEYWORD_MAP 拡張

### 現状の課題（HANDOVER §1.2 軸 C / 必須条件 2）

scanner.py `INDUSTRY_KEYWORD_MAP` には `コンサル` / `IT` / `Web 制作` の業種が未収録のため、tcharton の業種判定が ✗ となり JSON-LD スコア 30/100 据え置き。

### ② tcharton 側で実施済（2026-04-27）

5 ファイル（index / about / services x3）の JSON-LD に `additionalType` を追加:

```json
"additionalType": [
  "https://www.wikidata.org/wiki/Q189210",   // Web design
  "https://www.wikidata.org/wiki/Q11661",    // Information technology
  "https://www.wikidata.org/wiki/Q11660"     // Artificial intelligence
]
```

### 依頼内容

scanner.py `INDUSTRY_KEYWORD_MAP` に以下の業種マッピングを追加してください:

| 業種カテゴリ | キーワード（JSON-LD `description` / `knowsAbout` / `additionalType` のいずれかで検出）| Wikidata Q番号 |
|---|---|---|
| Web 制作 / Web デザイン | `WEBサイト構築`, `Web design`, `ウェブデザイン`, `Q189210` | Q189210 |
| IT サービス / 保守運用 | `IT`, `保守運用`, `Information technology`, `Q11661` | Q11661 |
| AI / 機械学習 | `AI予測`, `機械学習`, `Artificial intelligence`, `Q11660` | Q11660 |
| コンサルティング | `コンサル`, `Consulting`, `Q193563` | Q193563 |

これにより、自社サイト（tcharton）+ 個人事業主 IT/Web/AI/コンサル系顧客の業種判定が可能になります。

---

## 3. 依頼事項 ③ — `@type` 配列対応（spec-checker.js / scanner.py 共通）

### 現状の課題

HANDOVER §3.1 タスク 1 は `@type` を `["ProfessionalService", "LocalBusiness"]` の配列形式に変更する指示でしたが、② で実装したところ **spec-checker.js の `jsonldTypes()` が配列を 1 要素として登録**するバグが顕在化（spec-checker.js line 183-189）。検証 4 件 FAIL を引き起こしたため、実装はロールバック（@type は string `"ProfessionalService"` 維持）。

scanner.py 側でも同種の `@type === 'ProfessionalService'` 厳格比較がある場合、配列化により業種判定が壊れるリスクがあります。

### 依頼内容

- scanner.py が JSON-LD の `@type` を解釈する全箇所で、**string と array 両形式を許容**する実装に変更してください。
- 実装パターン例:
  ```python
  type_value = schema.get('@type')
  type_set = {type_value} if isinstance(type_value, str) else set(type_value)
  if 'ProfessionalService' in type_set: ...
  ```
- 同等の修正が tcharton/spec-checker.js にも必要です（CLAUDE.md §1.2.3 の整合保持原則のもと、scanner.py を技術正本とする方針なら ④ 主導で）。

---

## 4. 依頼事項 ④（参考・低優先）— SPEC §4.2 必須プロパティの再検討

### 現状

SPEC.md §4.2 で `ProfessionalService / LocalBusiness（必須プロパティ）` に **`telephone`** が含まれます。

② tcharton では本日、ユーザの「電話非公開ポジティブ化」要望を受けて JSON-LD `telephone` 削除を試行しましたが、SPEC §4.2 規定により spec-checker FAIL（`PS必須プロパティ 不足: telephone`）→ ロールバック実施。

### ① ルートへの戦略提言（参考）

将来 SPEC v3.3 を発行する際、必須連絡先プロパティを `telephone` 単独ではなく **「`telephone` または `email` + `contactPoint`」** に緩和することで、個人事業主のプライバシー要件と Sクラス取得を両立できる余地があります。

ただし scanner Sクラス必須条件 2「NAP 完全一致」（Name+Address+Phone）の `Phone` 部分との整合確認が必要。本件は ① で判断ください（②/④ の権限外）。

---

## 5. 期待される成果（依頼事項 ①+② 完了後）

| 項目 | Phase 1 完了時点 | 依頼事項 ①+② 完了後 |
|---|---|---|
| 必須条件 1（HSTS Preload + WAF）| ✅ 達成 | ✅ |
| 必須条件 2（高度 JSON-LD + NAP）| 🟡 部分（業種✗）| ✅ 業種✓（依頼②）+ GBP 連携時 NAP ✓ |
| 必須条件 3（CWV + TTFB）| ✅ 達成 | ✅ |
| 必須条件 4（ボット防御）| 🟡 保留 | 🟡 保留（フォーム不在ページ対象外） |
| 必須条件 5（SSG/Jamstack）| 🔴 未達 | ✅ 認識（依頼①）|
| **総合判定見込み** | B〜A | **S** |

---

## 6. ② tcharton 側の今後（独立タスク）

依頼事項とは独立に、② で以下を継続:

- ✅ Phase 1 完了済（commit `97323a6`）
- ✅ Phase 3 タスク 3.1 部分（additionalType + sameAs 追加・本書と同一 commit）
- ⏳ **GBP（Google ビジネスプロフィール）作成** — ユーザ手動作業。完了後 sameAs 配列に GBP URL 追記
- ⏳ HSTS preload リスト反映観測（数週間）

---

## 7. 参照ドキュメント

| ドキュメント | パス |
|---|---|
| 本依頼書 | `tcharton/SCANNER-EXTENSION-REQUEST.md`（本ファイル） |
| 元計画 | `tcharton/HANDOVER-S-CLASS-FIX.md` |
| Phase 1 完了申告書 | tcharton commit `97323a6` |
| 自社監査原本 | `TCHARTON-AUDIT-REPORT.md` |
| 3 法規 | `SPEC.md` `GOOGLE-STANDARDS.md` `GEO-STANDARDS.md`（root） |
| ルート CLAUDE.md | `CLAUDE.md` |

---

## 8. SPEC §0.0 準拠 Self-Audit

| § | 規範 | 遵守 |
|---|---|---|
| 0.0.1 | 虚偽完了報告禁止 | ✅ Phase 3 部分実装と未達領域を明示 |
| 0.0.3 H-1 | Evidence-before-Claim | ✅ 実測 / コード参照 / Wikidata Q 番号併記 |
| 0.0.3 H-2 | Scope-Explicit | ✅ ② 範囲（依頼書起票）と ④ 範囲（実装）を分離明記 |
| 0.0.3 H-3 | Failure-Self-Report | ✅ 配列化試行の失敗・ロールバックを率直に記載 |
| 0.0.3 H-4 | No-Sycophancy | ✅ 「scanner が悪い」等の言い訳排除 |
| 0.0.7 | マルチセッション境界 | ✅ ② → ④ への正規エスカレーション |

---

**版**: 1.0
**最終更新**: 2026-04-27 / ② tcharton 起票
**次レビュー**: ④ scanner で受信時 / ④ 実装完了時 / ② tcharton で再判定実測時
