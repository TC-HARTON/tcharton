# AUDIT-CONSISTENCY-V1: tcharton.com 全 21 ページ間 文脈不整合監査

**監査日:** 2026-05-10
**対象:** tcharton.com 全 21 ページ（HTML 19 ページ + 404.html + thanks.html）
**監査者:** ① HARTON 総合責任者（厳格監査モード）
**監査範囲:** A〜H 8 カテゴリの厳格監査

---

## エグゼクティブ・サマリ

**重大度別 件数:**

| 重大度 | 件数 | 主な内容 |
|---|---|---|
| 🔴 Critical（致命的） | **3 件** | 壊れた HTML タグ 14 ページ / 「保守込み」表記の services 配下 完全欠落 / SPEC v3.7 表記混在 |
| 🟠 High（高） | **5 件** | 「2 軸 vs 4 事業」記述ズレ / SPEC §0.0 等内部用語の対外露出 / 数値出所揺れ（902/1830）/ Sクラス→★★★ 混在 / 「データサイエンス 15 年」と「プログラミング歴 15 年」併記 |
| 🟡 Medium（中） | **4 件** | sed 残骸の二重スペース / 「主軸 / 副軸」用語の文脈衝突 / 期間表記揺れ / 「★ S-Class」と「★★★ S-Class」混在 |
| 🟢 Low（低） | **2 件** | 電話番号方針の言及揺れ / 受付時間表記の一貫性 |

**総不整合件数: 14 件 / 推定影響ページ数 19 ページ（21 ページ中 90%）**

---

## A. 価格情報の整合性

### A-1. 主要 4 プラン価格（WordPress 35 万 / 静的 70 万 / LP 18 万 / 改修 40 万 / AI 100 万）

**判定: ✅ 整合（軽微な表記ゆれのみ）**

確認:
- `pricing/index.html:7` description で 4 プラン全部記載
- `services/web/index.html:73-74,82,249` Schema + 表で WP 35 万 / HTML 70 万 / 改修 40 万
- `services/lp/index.html:7,11,22,110` LP 18 万円〜
- `services/refurbish/index.html:7,11,22` 改修 40 万円〜
- `services/ai-prediction/index.html:85,88,352` AI 100 万円〜
- `index.html:108-136,536-548` JSON-LD + 視覚カードで 4 プラン全提示
- `vision/` には価格直接掲載なし（戦略ページのため OK）

🟡 **A-1a 表記揺れ（軽微）:** `services/refurbish/index.html:223` は「60-100 万円 / フルリニューアル」、`pricing/index.html:242` は「40-60 万円 / 60-100 万円」の 2 段表示。pricing 側がより詳細で正しい。**修正案: refurbish 側にも 40-60 万円帯（軽微改修 + プラン移行）を追記して統一。**

🟡 **A-1b LP 上限価格:** `services/lp/index.html:169` 「25-35 万円 / 動画組込み + アニメーション」と記載。pricing には LP 上限の記述なし。**修正案: pricing/index.html の単発 LP セクションに 25-35 万円帯を追記し、両ページ整合。**

---

## B. 期間情報の整合性

### B-1. WEB 制作期間（標準 4 週間 / 1.5-3 ヶ月）

**判定: 🟡 軽微な揺れあり**

- `faq/index.html:62,235` 「標準で 4 週間（W1〜W4）/ 5〜6 週間も」
- `services/web/index.html:81,271` 「標準で約 4 週間。規模により 1.5〜3 ヶ月」「約 1.5〜3 ヶ月」
- `services/web/index.html:62` Schema `totalTime:"PT28D"` = 28 日 = 4 週間
- `legal/index.html:129` 「WEB 構築 4 週間」

🟡 **B-1a:** `services/web/index.html:271` 「無料診断から納品まで、約 1.5〜3 ヶ月」と faq の「標準 4 週間」が両立しないように見える。**修正案:** services/web に注記を追加 — 「実装期間 4 週間 + 前後の診断・要件・公開準備で全体 1.5〜3 ヶ月」と明示し、faq との整合を取る。

### B-2. AI 予測 Phase 期間

**判定: ✅ ほぼ整合**

- `services/ai-prediction/index.html:112-113` Phase 1 / Phase 2 各「約 4 週間」
- `services/ai-prediction/sales/index.html:350` Phase 3「W9-12」
- `faq/index.html:90` 「標準 12 週間（Phase 1 が 4 週、Phase 2 が 4 週、Phase 3 が 4 週）」
- `legal/index.html:129` 「AI 予測 Phase 別に 2〜4 週」← 🟡 ここだけ「2〜4 週」と幅が広い

🟡 **B-2a:** `legal/index.html:129` の「2〜4 週」表記は他全ページの「各 4 週 / 12 週合計」と齟齬。**修正案:** legal を「Phase 別に各 4 週・合計約 12 週」へ書換。

---

## C. サービス構造の整合性

### C-1. 「2 軸」 vs 「3 本柱」 vs 「4 つの事業」

**判定: 🟠 重大な記述ズレ**

| ページ | 行 | 表記 |
|---|---|---|
| `index.html:7,11,23,57` | meta | **2 軸**（WEB 制作（保守込み）/ AI 予測） |
| `about/index.html:68,377` | 説明・沿革 | **2 軸** |
| `news/index.html:204` | 開設お知らせ | **2 軸** |
| `profile/index.html:7,11` | meta | **2 軸** |
| `cases/index.html:219` | 本文 | **「4 つの事業（WEB構築 / 保守運用 / AI予測 / 認定）」** |
| `news/index.html:205` | 診断ツール説明 | **「3 軸スコア」（WEB 信頼力 / 保守運用力 / AI 予測活用度）** |
| `index.html:476` | サービス概要 | 「3 プラン」（WP / 静的 / LP） |

🟠 **C-1a:** 同一サイト内で **「2 軸」「3 軸」「3 プラン」「4 つの事業」** の 4 種類が混在。
- 「2 軸」は事業構造、「3 軸スコア」は診断ツールの評価軸、「3 プラン」は WEB 制作内訳、「4 つの事業」は cases のみ独自で内訳が異なる。
- 特に `cases/index.html:219` の「4 つの事業（WEB構築 / 保守運用 / AI予測 / 認定）」は他ページ全てと不整合。「保守運用」を独立事業として扱い、かつ「認定」（HARTON Certified / Stella）を含めている。
- **修正案:** cases を「WEB 制作（保守込み）/ AI 予測 の 2 軸 + 第三者認定の Stella（準備中）」へ書換。または全ページで「2 事業 + 認定機関 Stella（準備中）」へ統一。① の戦略確定が必要。

### C-2. 「保守込み」表記の一貫性

**判定: 🔴 致命的不整合**

`services/` 配下の主要 4 ページに「保守込み」が **0 件**:

| ファイル | 「保守込み」出現数 |
|---|---|
| `index.html` | **10 回** |
| `about/index.html` | **6 回** |
| `profile/index.html` | **6 回** |
| `services/web/index.html` | **0 回** ⚠️ |
| `services/lp/index.html` | **0 回** ⚠️ |
| `services/refurbish/index.html` | **0 回** ⚠️ |
| `services/ai-prediction/index.html` | **0 回** ⚠️ |
| `vision/index.html` | **0 回** |
| `pricing/index.html` | **0 回** ⚠️ |

🔴 **C-2a:** ホーム / about / profile では「WEB 制作（保守込み）」を強く打ち出しているのに、肝心の **サービス詳細ページ（services/web 等）と料金ページ（pricing）に「保守込み」の記述が一切ない**。これは購買意思決定段階で重大な情報落差を生む。
**修正案:** services/web/index.html の H1 直下、pricing/index.html の各プラン見出しに「保守込み」を明示する語句を必須挿入。具体的には WordPress プラン / 静的 HTML プランの見出しに「（保守運用込み）」を併記し、料金表に保守内容（月次再判定・LCP 維持・セキュリティパッチ等）を 1 列追加。

---

## D. 数値情報の整合性

### D-1. 902 件 / 1,830 社 / 業界中央値 24 / 当社 90 点 / 3.8 倍

**判定: 🟠 高（出所と母集団のズレ）**

- `index.html:460,709` 「静岡県 902 件調査」「902 社」
- `vision/index.html:206,214,232,291,295,299,303,307` 「静岡県東部 902 社」+ 多数の派生統計
- `vision/index.html:316` 「沼津市内 134 社の中央値は 22 点（県平均 24 点）」
- `methodology/index.html:405,407,414,418` 「業界実測 902 件 / 静岡県 5 都市 11 業種 / 業界中央値 24 vs 当社 90 = 3.8 倍」
- `methodology/index.html:428,441` 「プライム市場全 1,830 社」+「プライム平均 TBD」
- `cases/index.html:227,471,484,503` 「静岡県 5 都市 902 件」と「東証プライム 全 1,830 社」を併用

🟠 **D-1a「902」の母集団記述揺れ:**
- vision: 「静岡県**東部**の中小企業 902 社」
- methodology: 「静岡県 **5 都市 11 業種**」
- cases: 「静岡県 **5 都市** 902 件 / 沼津周辺」
- index: 単に「静岡県 902 件」

**修正案:** 母集団定義を 1 文で統一し、全ページ同一フレーズ「静岡県東部 5 都市 11 業種 902 サイト（自社調査 2026-05）」を使用。vision の「東部」と methodology の「5 都市」の不整合は、5 都市が「沼津・三島・富士・静岡・浜松」（methodology:412）であり、静岡市・浜松市は東部ではないため、**vision の「東部」記述が不正確**。

🟠 **D-1b 「業界平均」 vs 「業界中央値」の用語混在:**
- `index.html:461` 「業界平均 3.8 倍品質」
- `vision/index.html:145` 「業界平均 3.8 倍品質」
- `vision/index.html:220,316` 「業界中央値」
- `methodology/index.html:407,418` 「業界中央値 24」
- `cases/index.html:227,471` 「業界中央値」

「3.8 倍 = 90 ÷ 24」の 24 は **methodology が中央値と明示**。よって index / vision の「業界平均」は誤り。**修正案:** index:461 / vision:145 を「業界中央値の 3.8 倍品質」に修正（統計用語として正確）。

🟢 **D-1c 沼津市内データ:** `vision/index.html:316` 「沼津市内 134 社の中央値 22 点」のみ。他ページには登場しない（vision 専用情報なので問題なし）。

🟠 **D-1d 1,830 社の状態:** `methodology/index.html:441` および `cases/index.html:484,503` で「プライム平均 TBD（④ scanner.py 全 1,830 社スキャン完了 + ⑤ 業界レポート公開後に確定値挿入）」と未確定値が露出。これは**サイト訪問者から見ると未完成の印象**を与える。
**修正案:** TBD ブロックは確定までは「Phase E 公開予定」のティーザーに改め、本文中の「1,830 社」「TBD」を訪問者向けに減らす。または「Coming Soon」セクションとして明確に分離。

---

## E. 連絡情報

### E-1. メール / 受付時間

**判定: ✅ ほぼ整合**

メール `info@tcharton.com` は以下に統一: index, about, profile, contact, privacy, legal

受付時間表記:
- 「24 時間受付・原則 1 営業日以内に返信」: contact, about
- 「24 時間以内（土日祝除く）」: thanks, faq, methodology, cases, services/* 全フッター, news, about, profile

🟢 **E-1a 軽微な揺れ:** 「1 営業日以内」と「24 時間以内（土日祝除く）」は実質同義だが文言が異なる。**修正案:** 両表記を「24 時間以内（土日祝除く / 1 営業日基準）」に統一。

### E-2. 電話番号 完全削除確認

**判定: ✅ 完全削除済**

`tel:` リンク・電話番号文字列は **0 件**。`legal/index.html:116` のみ「電話番号: 請求があった場合は遅滞なく開示します（特商法 §11-1-2 適合）」と方針記載のみ。✅ ポリシー一貫。

---

## F. ジャーゴン残存

### F-1. 内部用語の対外露出

**判定: 🔴 致命的**

| ジャーゴン | 出現箇所 | 重大度 |
|---|---|---|
| `★★★` | cases:204,219,223,247,254,270,272,425,427,428,438,446,447,456,457,490 / methodology:416 | 🟠 多すぎ・サイト全体の語彙設計を要する |
| `S-Class` / `S クラス` | methodology:416 / cases:490 | 🟡 用語混在（後述 F-3） |
| `機械検証` | methodology:198,352,354,407,425,428,439,490 / vision:206,281 / cases:282,471,484,490,503 | 🟡 多用は OK だが「機械保証」「機械診断」と混在 |
| `scanner.py` | methodology:407 / cases:503 / methodology:441 | 🔴 **対外サイトでツール内部名を露出するのは致命的** |
| `dogfooding` | cases:456,490 | 🔴 一般訪問者には意味不明な英語 |
| `LLMO` | methodology:238 | 🟡 H3 見出しなので括弧内補足あり OK |
| `SPEC §0.0` / `SPEC v3.7` / `H-1` | contact:190 / cases:411 / index:227 (CSS comment) / methodology:198,220,394 / news:204 / services/ai-prediction/sales:376 / services/ai-prediction/inventory:264 | 🔴 内部仕様書参照が本文に露出 |
| `2,554 検証項目` | methodology:11,23,60,175,356 / news:204 | 🟡 自社仕様だが対外説明文脈では OK |
| `2 軸並列独立評価フレーム + CV 補完軸` | methodology:198 | 🔴 完全な内部設計用語 |
| `pre-push hook` | methodology:209,356 / cases:490 | 🔴 開発者用語の露出 |
| `Phase E` | cases:503 / methodology:441 | 🔴 内部マイルストーン名 |
| `④ scanner.py` / `⑤ 業界レポート` | methodology:441 / cases:503 | 🔴 ① ② ③ ④ ⑤ セッション役割名の露出 |
| `Body Theme Variants` / `19 ページ階層` | methodology:394 | 🔴 内部 SPEC 用語 |
| `Lead Evidence Block` | methodology:220 | 🔴 内部 SPEC 用語 |
| `HARTON Stella` / `Stella` | cases:219（「stella.tcharton.com（準備中）」） | 🟡 サブドメイン名としては OK |
| `Certified` (英語) | about:457 「Self-Certified by Design」 | 🟡 キャッチコピーなので OK |
| `Deep Work` | 検出なし | ✅ 削除済 |
| `GEO 9` | 検出なし | ✅ 削除済 |
| `HARTON Certified` の生語 | サイト本文には未出（cases では「認定」と日本語化） | ✅ |

🔴 **F-1a 修正案（cases/index.html）:**
- `cases:219` 「（ stella.tcharton.com（準備中））」→「（第三者認定機関 Stella、準備中）」
- `cases:456,490` `dogfooding` → 「自社サイトでも同じ基準を実証」
- `cases:490` `pre-push hook` → 「公開前自動検証」
- `cases:503` 「④ scanner.py プライム全 1,830 社スキャン完了 + ⑤ 業界レポート公開後」→「機械検証エンジンによるプライム全社スキャン + 業界レポート公開後」

🔴 **F-1b 修正案（methodology/index.html）:**
- `methodology:198` 「（4 軸並列独立評価フレーム + CV 補完軸 / SPEC §0.0.10 厳格化原則準拠）」→ 削除または「（5 軸独立評価）」
- `methodology:220` 「Lead Evidence Block（最初の `<h2>` より前に〜）必須配置（SPEC §4.13）」→「冒頭エビデンス・ブロック（数値・公的リンク・引用句）を必須配置」
- `methodology:354` H2「機械検証エンジン spec-checker.js」→ 「機械検証エンジン」（ファイル名露出を削除し本文で補足）
- `methodology:394` 「492 PASS / SPEC v3.7 全条項 + Body Theme Variants + 19 ページ階層」→「全 19 ページ・全条項を pre-push 検証で 100% 通過」
- `methodology:407` 「scanner.py で静岡県 5 都市 11 業種を機械検証」→「機械検証エンジンで静岡県 5 都市 11 業種を実測」
- `methodology:441` 「④ scanner.py 全 1,830 社」→ 単に「機械検証エンジンで全 1,830 社」

🔴 **F-1c 修正案（services/ai-prediction/{sales,inventory}/index.html:264,376）:**
- 「（SPEC §0.0 Ambassadorship Duty H-1 準拠）」→ 削除または「（当社品質誓約に基づく方針）」

🔴 **F-1d 修正案（contact/index.html:190）:**
- 「SPEC §0.0 Ambassadorship Duty に基づき」→「当社の品質方針（社外公開ポリシー）に基づき」

🔴 **F-1e 修正案（cases/index.html:411）:**
- 「（SPEC §0.0 H-2 準拠）」→ 削除

🟡 **F-1f index.html:227（CSS コメント）:** `/* SPEC §9 カスタムCSS */` は HTML コメントではなく `<style>` 内の CSS コメント。HTML view-source で見える。**修正案:** `/* カスタム CSS — ディープティール ベース */` へ書換。

### F-2. ★★★ 表記の語彙設計

🟡 **F-2a:** `★★★` は cases / methodology に頻出するが、初見の訪問者向けに **「★★★ とは何か」の定義が cases:219 周辺にしか出てこない**。pricing / services/web には未出のため、ファネル誘導されて来た訪問者が cases で初めて「★★★」を見る順序になる。
**修正案:** services/web の H1 直下または pricing 冒頭に「★★★ とは Stella 認定機関の最高ランク（90 点以上 + 致命的 NG 0 件 + 必須条件 5 件）」の 1 行説明を追加。

### F-3. 「S-Class」「S クラス」「★★★」混在

🟡 **F-3a:**
- `methodology:416` 「90 点 / ★★★（ S-Class）」← 半角空白が混入（sed 残骸）
- `cases:490` 「★★★ 取得」のみ（S クラス語なし）
- `cases:204` 「★★★ 自己実証体」

「S-Class」「S クラス」「Sクラス」「★★★」が同一概念。**修正案:** 全サイトで「★★★（最上位）」へ用語統一し、英語 S-Class は廃止。

---

## G. 代表ストーリーの一貫性

### G-1. 「データサイエンス 15 年」 vs 「プログラミング歴 15 年」

**判定: 🟠 高**

- `vision/index.html:339` 「東京で 15 年、**データサイエンス**の仕事をしてきました」
- `about/index.html:373` 「**機械学習プロジェクト経験** / 15 年間にわたり、金融アルゴリズム + 機械学習プロジェクトの実務経験」
- `services/ai-prediction/index.html:7,247` 「**プログラミング歴 15 年**」「金融アルゴリズム開発・機械学習プロジェクト経験」
- `profile/index.html:7,11,23,191,272` 「**プログラミング歴 15 年**」（全 5 箇所）
- `pricing/index.html:218` 「代表 大内 達也（**データサイエンス 15 年**）が直接設計」

🟠 **G-1a:** 「プログラミング歴 15 年」「データサイエンス 15 年」「機械学習プロジェクト 15 年」の 3 種類が混在。実体は「金融アルゴリズム + 機械学習」のため、最も正確なのは about の「金融アルゴリズム + 機械学習プロジェクト 15 年」。
**修正案:** 全ページで以下に統一:
- 短縮形: 「プログラミング歴 15 年（金融アルゴリズム + 機械学習）」
- 詳細形（profile・about）: 現行「金融アルゴリズム開発 + 機械学習プロジェクト 15 年」
- `pricing:218` の「データサイエンス 15 年」と `vision:339` の「東京で 15 年、データサイエンス」を「金融アルゴリズム + 機械学習 15 年」に修正。

### G-2. 沿革の整合

✅ profile / about / vision の沿革は概ね整合。`about:369` 「沼津拠点でプログラミング業務を開始」 ↔ `vision:339` 「東京で 15 年」は時系列として両立する（東京 → 沼津移住）が、移住タイミングが明示されていない。
🟢 **G-2a 修正案:** about 沿革に「東京から沼津へ拠点移転」の年次を追記。

---

## H. 壊れた HTML タグ（② sed 盲打ちの残存）

### H-1. フッターの `<a>` タグ閉じ忘れ

**判定: 🔴 致命的（14 ページに同一バグ）**

以下 14 ファイルの全てに同じ壊れた行:

```html
<li><a href="/services/web/" class="hover:text-white py-3 inline-block"</li>
```

`>` が欠落し、`</a>` も欠落、リンクテキストも空。HTML パーサーは li 全体を破棄するか、後続要素を巻き込む。

| ファイル | 行 |
|---|---|
| `about/index.html` | 525 |
| `cases/index.html` | 535 |
| `contact/index.html` | 361 |
| `faq/index.html` | 402 |
| `index.html` | 754 |
| `legal/index.html` | 167 |
| `methodology/index.html` | 476 |
| `news/index.html` | 271 |
| `privacy/index.html` | 217 |
| `profile/index.html` | 379 |
| `services/ai-prediction/index.html` | 442 |
| `services/ai-prediction/inventory/index.html` | 403 |
| `services/ai-prediction/sales/index.html` | 427 |
| `services/web/industries/index.html` | 370 |

文脈（about:524-526 抜粋）:
```html
524: <li><a href="/services/web/" class="hover:text-white py-3 inline-block">WEB 制作</a></li>
525: <li><a href="/services/web/" class="hover:text-white py-3 inline-block"</li>   ← 壊れている
526: <li><a href="/services/ai-prediction/" class="hover:text-white py-3 inline-block">AI 予測</a></li>
```

🔴 **H-1a 修正案:** 524 行目との重複であり、おそらく**「単発 LP」「既存サイト改修」のいずれかへのリンク**を意図していたと推測される。`<li><a href="/services/lp/" class="hover:text-white py-3 inline-block">単発 LP</a></li>` または `<li><a href="/services/refurbish/" class="hover:text-white py-3 inline-block">既存サイト改修</a></li>` に置換。または完全削除。
**全 14 ファイル一括修正必須。** これは sed 等で `>WEB 制作</a>` を一括削除した跡と思われる（「② の sed 盲打ち」と完全一致）。

### H-2. sed 残骸の二重スペース・全角半角混在

🟡 **H-2a:**
- `cases:219` 「4 つの事業（WEB構築 / 保守運用 / AI予測 / **`  `認定**）」← 半角スペース 2 個
- `cases:471` 「`            ` 認定機関は」← 行頭全角スペース過多（インデント逸脱）
- `cases:438` 「**` `機械診断**」← 行頭半角スペース
- `cases:447` 「他社制作サイトを **` `★★★** 基準にリフト」← 行頭半角スペース
- `methodology:421` 「（ 認定機関 / 機械検証データ）」← 半角スペース
- `methodology:407` 「（認定機関）が `<strong>scanner.py</strong>`」← 行頭文として違和感
- `methodology:430` 「`             `認定機関は」← 行頭スペース大量

これらは **「Stella」「HARTON Certified」を sed で空白に置換した残骸** と判定。
**修正案:** 全該当箇所の連続スペースを除去し、欠落した固有名詞（Stella / 認定機関）を文意に応じて補完。具体的には `cases:219` を「4 つの事業（WEB 制作（保守込み）/ AI 予測 / 第三者認定機関 Stella（準備中）の 3 + 1 体制）」へ書換。

### H-3. その他の構文異常

🟢 **H-3a 軽微:** `contact:177` 「主動線とし。ビデオ会議〜」← 「とし」で句点で終わっているが「とし、」が正しい（読点が句点に置換された痕跡）。**修正案:** 「主動線とします。ビデオ会議〜」へ修正。

🟢 **H-3b 軽微:** `contact:7,22` description「フォーム内容欄でその旨ご連絡をにて承ります。」← 助詞「を」が余分。**修正案:** 「フォーム内容欄にてご連絡を承ります。」

---

## 修正優先度マトリクス

### 🔴 即時修正（P0 / S-RANK 維持に必須）

1. **H-1（14 ページ）** フッター `<a ... class="..."</li>` 修正 — **HTML として壊れている。spec-checker が PASS でも browser parse error の可能性高**
2. **C-2** services/web, services/lp, services/refurbish, services/ai-prediction, pricing に「保守込み」を追記 — **購買意思決定段階の情報落差**
3. **F-1a〜F-1f** ジャーゴン（scanner.py / SPEC §X / dogfooding / pre-push hook / ④ ⑤ / Phase E / Body Theme Variants / Lead Evidence Block）を全削除・日本語化

### 🟠 早期修正（P1 / 品質一貫性のため）

4. **C-1** 「2 軸 / 3 軸 / 3 プラン / 4 つの事業」を ① で戦略確定し全ページ統一
5. **D-1a/b** 「業界平均」→「業界中央値」、母集団記述を 1 文に統一
6. **G-1** 「データサイエンス 15 年 / プログラミング歴 15 年 / 機械学習 15 年」を統一
7. **F-3** 「S-Class / S クラス / Sクラス / ★★★」を「★★★（最上位）」に統一
8. **D-1d** 「TBD」「1,830 社 Phase E」露出を Coming Soon ブロックに集約
9. **H-2** sed 残骸の連続スペースを全削除し固有名詞補完

### 🟡 計画修正（P2 / ファネル品質）

10. **A-1a/b** 改修・LP 価格帯を pricing と詳細ページで対称化
11. **B-1a/B-2a** 期間表記を「実装 + 全体」の 2 軸で統一
12. **F-2a** ★★★ の定義を services/web / pricing 冒頭に挿入

### 🟢 軽微修正（P3）

13. **E-1a** 受付時間文言統一
14. **G-2a** 沿革に拠点移転年次追加

---

## 監査結論

**総評:** tcharton.com は外形的には S-RANK 機械検証 100% 通過しているが、**spec-checker が検出できない領域（文脈整合性・ジャーゴン露出・壊れた HTML タグ・概念用語の戦略統一）に重大な不整合が 14 件残存**している。特に:

1. **🔴 14 ページに同一の壊れた `<a>` タグ**が残っている（フッター 1 リンクが完全破壊）
2. **🔴 「保守込み」が services 配下と pricing から完全に欠落** — トップで打ち出す主張が詳細ページで消える致命的な情報落差
3. **🔴 内部用語（scanner.py / SPEC §X / dogfooding / pre-push hook / ④ ⑤）が本文中に多数露出** — 訪問者には意味不明、不信感を生む
4. **🟠 「2 軸 vs 4 事業 vs 3 プラン vs 3 軸」の概念混在** — ① の戦略レベル統一が必要
5. **🟠 「データサイエンス 15 年 vs プログラミング歴 15 年」の代表ストーリー揺れ** — 信頼形成の核

これらは **② tcharton セッションの sed 盲打ち（一括置換）** と、**ページ間の戦略用語が確定しないまま個別ページが進化したこと**が原因と推定される。

**次アクション提案（① 総合責任者の判断要請事項）:**

- (a) 「2 軸 / 4 事業 / 認定機関」の事業構造ナラティブを ① で確定し、SPEC v3.8 で文脈整合条項を追加
- (b) 上記 P0 の 3 項目を ② tcharton で即時修正 → spec-checker + verify-all.js で再検証
- (c) ジャーゴン用語表（内部用語 → 対外日本語の変換辞書）を SPEC §16 として正本化し、機械検証項目に追加（`scanner.py`「SPEC §」「H-1」「dogfooding」「pre-push」「④」「⑤」「Phase E」等の対外露出を FAIL 化）

**監査終了。**

---

**監査ファイル:** `docs/AUDIT-CONSISTENCY-V1.md`
**監査者署名:** ① HARTON 総合責任者
**次回監査:** P0 修正完了後、AUDIT-CONSISTENCY-V2 として再監査
