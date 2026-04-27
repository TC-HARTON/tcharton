# ② tcharton 指示書（S クラスサイト構築責任者）

**発行**: 2026-04-27 / ① HARTON 総合責任者
**目標**: scanner で **S クラス（必須 5/5 + 90 点 + 致命的 NG ゼロ）取得**

---

## 起動時 自動 Read（上から順に Read ツールで全件読み込め。担当判断不要、無条件実行）

1. 本書（既読）
2. **Read** `C:\Users\ohuch\Desktop\HARTON\tcharton\SPEC.md` — §4.2 #1 / §8.1 / §8.5 / §8.9 を確認
3. **Read** `C:\Users\ohuch\Desktop\HARTON\CLAUDE.md` — §1 役割名称 + 報告義務
4. **Read** `C:\Users\ohuch\Desktop\HARTON\tcharton\HARTON-CERTIFIED-INTEGRATION.md` — §0.0 緊急実装要請
5. **Read** `C:\Users\ohuch\Desktop\HARTON\tcharton\HANDOVER-S-CLASS-FIX.md` — ② 自身の元計画
6. **Read** `C:\Users\ohuch\Desktop\HARTON\CRITICAL-ISSUES-REPORT.md` — §11 §12

全件 Read 完了後、本書「ロードマップ」へ進む。途中で代表へ確認・許可要請禁止。

---

## ロードマップ

| 順 | タスク | 依存 | 達成する必須条件 |
|---|---|---|---|
| 1 | spec-checker.js バグ修正 | なし | （#2 の前提）|
| 2 | JSON-LD `@type` 配列化（5 ファイル）| #1 | 必須 2（部分）|
| 3 | `_headers` に X-Hosting 追加 + push | #2 | 必須 5（④#1 完了後）|
| 4 | GBP 作成 + sameAs に GBP URL | 代表手動 | 必須 2（完全）|
| 5 | scanner 再判定で S クラス確認 | #2 #3 #4 + ④#1 | **目標達成** |

---

## #1 spec-checker.js バグ修正

**修正 A**: `tcharton/spec-checker.js` lines 183-189 を置換:

```js
function jsonldTypes(schemas) {
  const t = new Set();
  const addType = (v) => {
    if (Array.isArray(v)) v.forEach(x => x && t.add(x));
    else if (v) t.add(v);
  };
  for (const s of schemas) {
    addType(s['@type']);
    if (s['@graph']) s['@graph'].forEach(i => addType(i['@type']));
  }
  return t;
}
```

**修正 B**: ヘルパ追加 + `=== 'ProfessionalService'` 形式の strict equality を全置換:

```js
function hasType(schema, typeName) {
  const t = schema?.['@type'];
  if (Array.isArray(t)) return t.includes(typeName);
  return t === typeName;
}
```

`grep -n "=== '" tcharton/spec-checker.js` で全箇所特定 → `hasType(...)` に置換。

**検証**: `node spec-checker.js` → FAIL=0
**FAIL 時**: grep 漏れがある。全数再監査
**コミット**: `fix: spec-checker @type array support per SPEC v3.4 §4.2 #1.0`

---

## #2 JSON-LD `@type` 配列化

対象 5 ファイル:
- `tcharton/index.html`
- `tcharton/services/web/index.html`
- `tcharton/services/maintenance/index.html`
- `tcharton/services/ai-prediction/index.html`
- `tcharton/about/index.html`

各ファイルの ProfessionalService スキーマで:

```diff
- "@type": "ProfessionalService"
+ "@type": ["ProfessionalService", "LocalBusiness"]
```

**検証**: `node verify-all.js` → exit 0（S-RANK 維持）
**FAIL 時**: #1 を再確認
**コミット**: `feat: JSON-LD @type array per SPEC v3.4 §4.2 #1.0`

---

## #3 `_headers` に X-Hosting 追加

`tcharton/_headers` の `/*` ブロック末尾に 1 行追加:

```
  X-Hosting: cloudflare-workers-static-assets
```

push 後の検証:

```bash
curl -sI https://tcharton.com/ | grep -i x-hosting
```

**期待出力**: `x-hosting: cloudflare-workers-static-assets`
**FAIL 時**: Cloudflare Workers の `_headers` 反映を待つ（数分）/ 反映されない場合 ① エスカレーション
**コミット**: `feat: X-Hosting honest signaling per SPEC v3.4 §8.9.2`

---

## #4 GBP 作成 → sameAs

**代表手動作業**:
1. <https://business.google.com> で **Service Area Business** モードで HARTON GBP 作成
2. NAP（社名 / 住所 / 電話）を tcharton.com の JSON-LD と完全一致させる
3. 検証完了後、CID URL を ② に共有

**② 実装**: 5 ファイル（#2 と同一）の JSON-LD `sameAs` を:

```json
"sameAs": [
  "https://www.google.com/maps/place/?cid={代表から受領した CID}",
  "https://note.com/harton_official"
]
```

**検証**: `node verify-all.js` → exit 0
**コミット**: `feat: GBP sameAs per SPEC v3.4 §4.2 #1.3`

---

## #5 scanner 再判定で S クラス確認

**前提**: 以下すべて完了
- ② #2 #3 #4 完了 + push 済
- ④ scanner #1（`check_ssg_hint` 拡張）完了 — `HARTON/REPORT-TO-ROOT-FROM-SCANNER.md` で確認
- ④ scanner #2（`INDUSTRY_KEYWORD_MAP` 拡張）完了 — 同上

**実行**:

```bash
cd C:\Users\ohuch\Desktop\HARTON\scanner
py -c "
import os; os.environ['USE_PLAYWRIGHT']='1'
import scanner, requests
sess = requests.Session()
res = scanner.scan_single({'社名':'T.C.HARTON','業種':'コンサル','URL':'https://tcharton.com/','住所':'静岡県沼津市','電話番号':''}, sess)
print('格付け:', res['格付け'])
print('総合:', res['総合スコア'])
print('必須条件:', res['必須条件達成'])
print('致命的NG:', res['致命的NG件数'])
"
```

**完了条件（全て満たすこと）**:
- 格付け: `S`
- 総合: 90 以上
- 必須条件: `5/5`
- 致命的 NG 件数: 0

**FAIL 時**: 未達条件を特定し ① エスカレーション。具体的な不足項目を `HARTON/REPORT-TO-ROOT-FROM-TCHARTON.md` に記載。

---

## 報告

各タスク完了時、`HARTON/REPORT-TO-ROOT-FROM-TCHARTON.md` に末尾追記:

```markdown
## 2026-MM-DD タスク#N 完了
- commit: {hash}
- 検証: {コマンド} → {出力 1 行}
- 残: {残課題 / 「なし」}
```

#5 完了時は ① 最終承認案件として明示。

---

## #6 連絡導線の再設計 — 問合せフォーム主CTA + 電話は補助（Deep Work ナラティブ）

**背景**: 代表の電話番号（個人スマホ）が SPEC v3.4 §4.2 #1.1 `telephone` 必須要件で公開されているが、営業電話の負担と Deep Work（集中作業）の阻害が課題。電話番号は維持しつつ、**主 CTA を問合せフォームに集約**し、Deep Work ナラティブでブランディング転換する。

### 維持事項（変更禁止）
- JSON-LD `telephone` は既存番号を維持（scanner Sクラス + GBP NAP 完全一致を崩さない）
- 特商法表記内の電話番号も維持

### 実装事項

| # | ファイル | 操作 |
|---|---|---|
| 6.1 | `contact/index.html` | 主 CTA を「✉️ 問合せフォーム」+「📅 予約制ビデオ会議（Calendly 等の予約リンク）」の 2 本立てに変更。電話は「📞 電話（補助）」として小さく配置。営業時間「平日 10:00-17:00」明記 |
| 6.2 | `index.html` / `services/web/index.html` 等の主要ヘッダ | CTA ボタンを「お問合せ」→「📅 予約 / ✉️ 問合せ」に変更 |
| 6.3 | `about/index.html` | Deep Work ナラティブを記載（下記文例参照）|
| 6.4 | `legal/index.html` | 特商法表記の電話番号は維持。隣に「※ 緊急以外は問合せフォームにてお願いします」を追加 |
| 6.5 | `_layout` / `footer` | フッター連絡先表記を「✉️ お問合せフォーム / 📅 ご予約 / 📞 電話（特商法表記）」の優先順 |

### Deep Work ナラティブ文例（about / contact に配置）

```
当事務所では、1 ピクセル・1 ミリ秒にこだわる超集中作業（Deep Work）を
優先するため、原則として電話による窓口を主動線としていません。
すべての履歴を正確に記録し、SPEC v3.4 の厳格な品質管理を徹底するため、
テキストベース（問合せフォーム）または予約制ビデオ会議でのご相談を
お願いしております。

電話によるご連絡も承っておりますが、作業中は応答できないことがあります。
平日 10:00–17:00 を目安にご利用ください。

沼津・三島にいながら、全国・世界基準の S クラス WEB を提供するため、
非同期で効率的なコミュニケーションを基本としています。
```

### 予約制ビデオ会議リンク

代表が **Calendly** または **Google カレンダー予約スケジュール**で予約ページを作成 → URL を ② に共有。② が CTA に組込。

### 完了条件（5 件 AND）
1. `node spec-checker.js` → FAIL=0（電話 telephone 維持により §4.2 #1.1 PASS）
2. `node verify-all.js` exit 0
3. `curl -s https://tcharton.com/contact/` で「問合せフォーム」CTA が「電話」より先に表示される（HTML 順序確認）
4. about / contact に Deep Work ナラティブが配置されている
5. scanner 再判定で S クラス維持（`格付け: S` 維持）

**コミット**: `feat: tcharton contact narrative — form/booking primary, phone retained per Deep Work approach`

---

## 待ち合わせ

- **#3 push 後の scanner 再判定**: ④ #1 完了待ち（`REPORT-TO-ROOT-FROM-SCANNER.md` を ② が定期確認）
- **#4 GBP**: 代表 CID URL 共有待ち

---

## 禁止

- 3 法規（`SPEC.md` / `GOOGLE-STANDARDS.md` / `GEO-STANDARDS.md`）編集
- `scanner/` 配下編集
- `--no-verify` push
- 「ローカル PASS」のみで「S クラス取得」と称する報告
