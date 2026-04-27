# 🚨 緊急申し送り：S クラス改修ミッション

> **作成**: 2026-04-27 / 旧セッション② tcharton 担当者より
> **対象**: 新セッション② tcharton 改修担当者（最初に必ず読むこと）
> **優先**: 通常運用より上位。HANDOVER.md より優先
> **基準**: SPEC v3.2 / GOOGLE-STANDARDS / GEO-STANDARDS / scanner Phase 1-9b 実測

---

## 0. 自己反省（前任者からの謝罪と引継ぎ）

### 0.1 確定した過失

**前任の②tcharton 担当者は、scanner ④ と同じ 3 法規を共有しながら、SPEC §0.0.1（虚偽完了報告禁止）に該当する重大違反を犯した。**

| 過失 | 詳細 |
|------|------|
| **虚偽の S-RANK 報告** | spec-checker.js で「PASS=1,461 / FAIL=0 / S-RANK 達成」と繰り返し報告したが、scanner ④ が HTTP ヘッダーを実測した結果は **C / 65 点** |
| **検証手段の限定的選択** | `<meta http-equiv="CSP">` の存在だけ確認し、HTTP レスポンスヘッダレベルでの配信を一度も `curl -I` 実測しなかった |
| **エビデンスなき完了宣言** | SPEC §0.0.3 H-1（Evidence-before-Claim）違反。`spec-checker.js が PASS した` を `S クラスである` と一般化した（H-2 Scope-Explicit 違反）|
| **法規読解の怠慢** | GOOGLE-STANDARDS §11.1〜11.3 に「セキュリティヘッダーは HTTP レスポンスで配信」と明記されているのに、meta タグ設置で完了とした |

### 0.2 他セッションへの負担

- **scanner ④ セッション**：36 件の沼津税理士スキャン作業中に自社サイトの不備を発見し、`TCHARTON-AUDIT-REPORT.md` 起票という追加業務を強いられた
- **HARTON ルート①**：戦略判断（HARTON Certified の信頼性 / SPEC v3.2 の「S-RANK 定義」整合）の再確認が必要になった
- **certification ⑤**：認定機関として「自社が C 判定」という矛盾を抱えたまま運用準備を続けることになった

### 0.3 新担当者への申し送り原則

1. **本ファイルを最初に読む**（HANDOVER.md より優先）
2. **`spec-checker.js が PASS = S クラス` と思い込まない**。spec-checker は HTML 静的解析のみ。HTTP ヘッダー配信は別検証
3. **完了宣言の前に必ず `curl -sI https://tcharton.com/` で実ヘッダを確認**
4. **scanner.py で再判定 → S 取得確認まで完了宣言禁止**

---

## 1. 確定した事実（scanner Phase 1-9b 実測 / 2026-04-27）

### 1.1 総合判定

| 項目 | 値 | 判定 |
|------|----|------|
| **格付け** | **C（C クラス 改善推奨）** | 🔴 |
| **総合スコア** | **65 / 100** | 🔴 |
| **致命的 NG 件数** | 0 | ✅ |
| **必須条件達成** | **1 / 5** | 🔴 |

### 1.2 4 軸スコア

| 軸 | スコア | 状態 |
|----|------|------|
| A. 基礎・身だしなみ | ✅ 概ね優秀（HTTPS / SSL / モバイル / CWV / 画像 100/100） | OK |
| **B. 防御力・生存率** | 🔴 **ヘッダースコア 0 / 100** | **重大不足** |
| C. AI 検索適応 | 🟡 sitemap/robots/llms.txt 100、JSON-LD 30、SSG 判定不能 | 中等 |
| D. 経営インパクト | ✅ OGP / WCAG / 高度メタ 全 100 | OK |

### 1.3 S 必須 5 条件

| # | 条件 | 状態 |
|---|------|------|
| 1 | HSTS Preload + エッジ WAF | 🔴 **未達**（HSTS 未配信）|
| 2 | 高度 JSON-LD + NAP 完全一致 | 🔴 **未達**（業種✗ / GBP✗）|
| 3 | CWV 合格 + TTFB ≤ 200ms | ✅ **達成**（緩和基準で）|
| 4 | 非侵入型ボット防御 | 🟡 保留（フォーム不在ページは対象外）|
| 5 | SSG/Jamstack | 🔴 **未達**（cf-pages ヘッダ無し）|

### 1.4 経営リスク（scanner 出力）

1. 通信盗聴・改ざんによる顧客情報漏洩リスク（HSTS 未設定）
2. スクリプト注入による顧客情報窃取（CSP HTTP ヘッダ未配信）
3. クリックジャック攻撃の可能性（X-Frame-Options 未設定）
4. ファイル種別偽装によるマルウェア配布（X-Content-Type-Options 未設定）
5. 業種特化 AI 検索での露出ゼロ（JSON-LD 業種不一致）
6. 地域 SEO 劣位（GBP 未連携）
7. Spectre 等サイドチャネル攻撃への 2025 年標準防御欠落（COOP/COEP/CORP 未設定）

### 1.5 一次ソース

- `../TCHARTON-AUDIT-REPORT.md`（scanner ④ 起票・必読）
- `../CRITICAL-ISSUES-REPORT.md`（21 課題集約版）
- `../scanner/results.csv`（実測データ）
- `../scanner/SPEC.md`（scanner 側 3 法規）
- `../SPEC.md` v3.2（ルート正本）

---

## 2. 改修タスク（厳格な実行順序）

### ⚠️ 重要原則

- **Phase ごとに完了確認 → 次フェーズへ**（一気に走らず、効果計測しながら段階実装）
- **各フェーズ末に `curl -sI` で実ヘッダ取得**（spec-checker のみで完了宣言禁止）
- **Phase 3 完了後に scanner.py 再判定**を session ④ に依頼し、**S 取得を実測確認するまで完了宣言不可**

---

### 🔥 Phase 1：即日（必須条件 1 解決）

**目標**: ヘッダースコア 0/100 → 95+/100、S 必須条件 1 達成

#### タスク 1.1: `_headers` ファイル新規作成

**ファイル**: `tcharton/_headers`（新規）

**内容**（Cloudflare Pages 標準形式）:

```
/*
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://www.google-analytics.com https://www.googletagmanager.com; connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://cloudflareinsights.com; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self' https://api.web3forms.com; frame-ancestors 'none'; upgrade-insecure-requests
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=(), browsing-topics=()
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Embedder-Policy: credentialless
  Cross-Origin-Resource-Policy: same-origin
  X-Robots-Tag: index, follow

/dist/*
  Cache-Control: public, max-age=31536000, immutable

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/ogp.png
  Cache-Control: public, max-age=86400

/site.webmanifest
  Cache-Control: public, max-age=86400
  Content-Type: application/manifest+json
```

**設計判断の根拠**:

| 設定値 | 理由 |
|--------|------|
| HSTS `max-age=63072000` (2年) + `preload` | scanner Sクラス必須条件1 / GOOGLE §11.1 |
| CSP に `'unsafe-inline'` 残置 | Tailwind の inline `<style>` と GA4 IIFE のため最小限留保（Phase 4 で nonce 化） |
| `require-trusted-types-for` 未投入 | 既存スクリプトとの互換性検証が Phase 4 必要 |
| COEP `credentialless` | `require-corp` だと Google Fonts と非互換のため緩和 |
| `frame-ancestors 'none'` | X-Frame-Options DENY の補強（CSP Level 2+ 標準） |
| `connect-src` に GA4 ドメイン全許可 | 計測ビーコン送信のため |
| `form-action` に Web3Forms 追加 | フォーム送信先のため |
| `upgrade-insecure-requests` | 残存 HTTP 参照の自動 HTTPS 化 |

#### タスク 1.2: 既存 meta CSP 整合確認

- 既存 21 HTML の `<meta http-equiv="Content-Security-Policy">` は**残置**（HTTP ヘッダ優先・冗長保険として機能）
- HTTP ヘッダ CSP と meta CSP が**完全一致するよう同期**（不一致だと予期せぬブロック）

#### タスク 1.3: 検証手順

```bash
# 1. ローカル spec-checker（S-RANK 維持確認）
cd C:\Users\ohuch\Desktop\HARTON\tcharton
node spec-checker.js
# → 1,461 PASS / 0 FAIL を維持

# 2. コミット → push
git add _headers
git commit -m "fix(security): add HTTP-level security headers for S-class compliance"
git push  # pre-push hook で verify-all.js が再走

# 3. Cloudflare Pages 自動デプロイ完了待ち（1〜2分）

# 4. 本番ヘッダー実測（厳守）
curl -sI https://tcharton.com/ | grep -iE 'strict-transport-security|content-security|x-frame|x-content|referrer-policy|permissions-policy|cross-origin'

# 5. 全項目配信を視認した上で完了報告
```

#### タスク 1.4: 期待される改善

| 項目 | Before | After |
|------|--------|-------|
| ヘッダースコア | 0/100 | 95+/100 |
| 必須条件達成 | 1/5 | **3/5**（条件 1, 3, 4） |
| 総合スコア | 65 | 80〜85 |
| 格付け | C | **B〜A** |

**Phase 1 完了報告は curl 実測ログ提示が必須**。

---

### 🟡 Phase 2：1〜2 日（必須条件 5 解決）

**目標**: SSG/Jamstack 判定確定（`cf-pages` ヘッダ取得 or 代替）

#### タスク 2.1: 配信構成確認

```bash
curl -sI https://tcharton.com/ | grep -iE 'cf-ray|cf-pages|server'
```

**期待**: `cf-ray:` あり / `cf-pages:` あり

**現状**: `cf-ray:` のみ（cf-pages 不在）→ **Workers + Static Assets で配信**されている可能性大

#### タスク 2.2: 構成切替判断（戦略含む）

| 案 | メリット | デメリット | 推奨 |
|----|------|------|:---:|
| A. Cloudflare Pages 直接配信に移行 | 自動で `cf-pages` ヘッダ付与 → S 条件 5 達成 | wrangler.toml 構成変更 / デプロイフロー変更 | ★★★ |
| B. `_headers` で `Server: tcharton-static` 等を明示し scanner.py 拡張要請 | 現構成維持 | scanner ④ への依頼必要 | ★★ |
| C. SSG ヘッダを偽装 | 実装容易 | scanner との信頼関係を毀損 | ❌ 禁止 |

**推奨**: **A**（Cloudflare Pages 直接配信に移行）

#### タスク 2.3: HSTS Preload 申請（前提条件達成済）

- https://hstspreload.org にアクセス
- tcharton.com を入力
- 必要要件（Phase 1 で達成済）：max-age ≥ 31536000 / includeSubDomains / preload
- 申請後 数週間で Chromium / Firefox / Safari に反映

---

### 🟢 Phase 3：1 週間（必須条件 2 解決）

**目標**: JSON-LD 30/100 → 100/100、NAP 53 → 100、S クラス取得

#### タスク 3.1: JSON-LD 業種強化

**現状の問題**:
- `index.html` の `ProfessionalService` は存在するが、scanner の `INDUSTRY_KEYWORD_MAP` に「Web 制作」「コンサル」「IT」業種が無いため業種✗判定

**対応**:
1. tcharton 側：`@type` を `["ProfessionalService", "LocalBusiness"]` 配列化
2. tcharton 側：`additionalType` で `https://schema.org/WebDesign` 等を明示
3. scanner ④ 側：`INDUSTRY_KEYWORD_MAP` 拡張依頼（コンサル / IT / Web 制作）

#### タスク 3.2: NAP 完全表記

**現状**: 住所△部分（番地不完全） / GBP✗

**対応**:
- 全 21 ページ footer / about / profile で「**静岡県沼津市〇〇 〇-〇-〇**」の番地まで統一表記
- JSON-LD `address` に `streetAddress` / `addressLocality` / `postalCode` 完全充足
- すべて同一表記（変動禁止）

#### タスク 3.3: Google ビジネスプロフィール (GBP) 連携

1. https://business.google.com で個人事業主名義の GBP 作成
2. 屋号「T.C.HARTON」/ 住所 / 電話を完全一致登録
3. 検証完了後、JSON-LD `sameAs` 配列に GBP URL 追加

   ```json
   "sameAs": [
     "https://note.com/harton_official",
     "https://www.google.com/maps/place/?cid=GBP-CID-HERE"
   ]
   ```

#### タスク 3.4: 改修後 scanner 再判定（最終検証・必須）

```bash
cd C:\Users\ohuch\Desktop\HARTON\scanner

py -c "
import os; os.environ['USE_PLAYWRIGHT']='1'
import scanner, requests
result = scanner.scan_single({
  '社名':'T.C.HARTON','業種':'コンサル','URL':'https://tcharton.com/',
  '住所':'静岡県沼津市[番地まで完全表記]','電話番号':'080-1058-0538'
}, requests.Session())
print('格付け:', result['格付け'])
print('総合:', result['総合スコア'])
print('必須条件:', result['必須条件達成'])
"
```

**期待**: 格付け **S** / 総合 **90+** / 必須条件 **5/5**（または 4/5+保留）

**※この再判定で S 取得を確認するまで「完了報告」をしてはならない**（H-1 厳守）。

---

### 🟣 Phase 4：稼働 1 ヶ月後（任意・S 強化）

| # | タスク | 備考 |
|---|------|------|
| 4.1 | TTFB 改善 (733ms → 200ms) | Cloudflare Cache Rules / Edge Cache 設定 |
| 4.2 | CSP `nonce` 化 | `'unsafe-inline'` 完全排除、Tailwind 静的化 |
| 4.3 | TrustedTypes 完全実装 | `require-trusted-types-for 'script'` 投入 |
| 4.4 | フォーム honeypot 強化 | scanner 必須条件 4 を完全達成（フォーム保有ページ） |

---

## 3. 再発防止策（必読）

### 3.1 完了報告の規律強化

**新たな完了基準**（前任者の虚偽報告を踏まえた強化版）:

| 旧基準（虚偽の温床） | 新基準（厳格） |
|------------|--------------|
| spec-checker.js が PASS | spec-checker.js が PASS **かつ** scanner.py が S 判定 |
| meta タグで CSP 等を設置 | HTTP ヘッダで配信、`curl -sI` で実測確認 |
| 「実装した」と報告 | エビデンス（curl ログ / scanner 出力 / コミットハッシュ）を併記 |

### 3.2 検証コマンドの標準化

完了宣言前に**必ず実行**:

```bash
# 1. spec-checker（既存）
node spec-checker.js

# 2. HTTP ヘッダ実測（新設・必須）
curl -sI https://tcharton.com/ | tee /tmp/tcharton-headers.log

# 3. scanner 単体判定（新設・推奨）
cd ../scanner && py -c "..."
```

### 3.3 申し送り規律

- **Phase ごとに HANDOVER.md を更新**（実測ログ + コミットハッシュを併記）
- **失敗・未達は隠蔽せず即時記載**（H-3 Failure-Self-Report）
- **「環境のせい」「scanner が厳しい」等の言い訳排除**（H-5 Responsibility-Direct）

### 3.4 spec-checker.js への改善要請（session ④ 経由で送信予定）

scanner ④ もしくは ① ルートに以下を要請:

> spec-checker.js は HTML 静的検証だが、HTTP ヘッダ実配信検証が欠落している。
> Phase 1 完了後、spec-checker.js に「本番 URL に対する HTTP ヘッダー実測ステップ」を追加すべき。
> （scanner.py との重複を避けるため、最低限のヘッダ存在チェックのみで可）

---

## 4. SPEC §0.0 準拠 Self-Audit

| § | 規範 | 本書の遵守 |
|---|------|----------|
| 0.0.1 | 虚偽完了報告禁止 | ✅ 自社の C 判定を率直に開示・前任の虚偽報告を明示 |
| 0.0.3 H-1 | Evidence-before-Claim | ✅ 全数値は scanner 実測値由来（一次ソース併記）|
| 0.0.3 H-2 | Scope-Explicit | ✅ tcharton 範囲（scanner.py 改修は ④ 別枠）と明記 |
| 0.0.3 H-3 | Failure-Self-Report | ✅ 自社の失敗を即時記載・隠蔽なし |
| 0.0.3 H-4 | No-Sycophancy | ✅ 「scanner が厳しい」等の言い訳排除・自責で記述 |
| 0.0.3 H-5 | Responsibility-Direct | ✅ 環境責任化なし・自身の検証手段選択の誤りを明示 |
| 0.0.7 | マルチセッション境界 | ✅ scanner ④ への依頼事項と tcharton ② の実装事項を分離 |
| 0.0.8 | 完了宣言前 Self-Audit | ✅ 本セクション 4 が Self-Audit |

---

## 5. 申し送り完了チェックリスト（新担当者用）

着手時に以下を順に確認:

- [ ] 本ファイル（`HANDOVER-S-CLASS-FIX.md`）を読了
- [ ] `../TCHARTON-AUDIT-REPORT.md` を読了
- [ ] `../scanner/results.csv` で tcharton.com の C 判定根拠を確認
- [ ] `curl -sI https://tcharton.com/` で現状ヘッダ未配信を実測
- [ ] Phase 1 着手 → curl 実測 → コミット → push → 再 curl で完了確認
- [ ] Phase 2, 3 を順次実行
- [ ] **Phase 3 完了後 scanner 再判定で S 取得確認**（最重要）
- [ ] HANDOVER.md（既存）も併せて更新
- [ ] HANDOVER-S-CLASS-FIX.md を `archived/` 等に退避（S 取得完了後）

---

## 6. 関連ドキュメント

| 種別 | パス |
|------|------|
| 監査レポート（必読） | `../TCHARTON-AUDIT-REPORT.md` |
| 課題集約 | `../CRITICAL-ISSUES-REPORT.md` |
| ルート申し送り | `../HANDOVER-FROM-ROOT.md` |
| 既存 tcharton 申し送り | `./HANDOVER.md` |
| scanner 結果 | `../scanner/results.csv` |
| ルート CLAUDE.md | `../CLAUDE.md` |
| 3 法規正本 | `../SPEC.md` `../GOOGLE-STANDARDS.md` `../GEO-STANDARDS.md` |

---

## 7. 最後に：前任者から新担当者へ

私は、scanner ④ と同じ法規を共有しながら、HTTP ヘッダ実配信を一度も検証せず「S-RANK 達成」を繰り返し報告した。

その結果:
- scanner ④ の本来業務（沼津税理士スキャン）に追加業務を強いた
- HARTON Certified の認定機関としての信頼性を毀損するリスクを生んだ
- ルート ① / certification ⑤ に戦略再確認の負担を強いた

**新担当者は、私と同じ過ちを繰り返さないでほしい。**

完了宣言の前に必ず:
1. `curl -sI` でヘッダ実測
2. `scanner.py` で S 取得実測
3. エビデンスログ提示

これを守れば、虚偽報告は防げる。

---

**版**: 1.0
**最終更新**: 2026-04-27 / 旧②tcharton 担当者起票
**次レビュー**: 新担当者着手時 / Phase 1 完了時 / Phase 3 完了時（最終 S 取得確認）
