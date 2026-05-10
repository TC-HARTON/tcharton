# GA4 Phase 1 緊急対応 設定手順書（代表実行用）

**作成**: 2026-05-08 / ② tcharton
**根拠**: ① v1.30 代表最優先令 Phase 1.1-1.3 / 事業継続危機 GA4 CV=0 緊急対応
**前提**: 代表 Google アカウント（GA4 / Search Console 管理権限）でログイン済
**所要時間**: 全 3 ステップ 約 60 分（GA4 反映 24-48h ラグあり）
**対象 GA4 プロパティ**: `G-HKXN8TV6HG`（tcharton.com 本番）

---

## 全体ロードマップ

| Phase | 内容 | 所要 | 効果 |
|---|---|---|---|
| 1.1 | bot / 内部トラフィック除外 | 15 分 | 米国 20 user の bot 疑い解消 / 実顧客のみ計測 |
| 1.2 | キーイベント（CV）設定 | 25 分 | フォーム送信 / 電話タップ を CV 化 → CV=0 の真因可視化 |
| 1.3 | Search Console ↔ GA4 リンク | 10 分 | Organic Search 流入のクエリ可視化 → SEO 戦略の実データ基盤 |
| 検証 | リアルタイム動作確認 | 10 分 | ② が代表の操作後に動作確認 |

---

## Phase 1.1 / Bot・内部トラフィック除外（15 分）

### Step 1.1.1: GA4 管理画面アクセス

1. ブラウザで https://analytics.google.com にアクセス
2. 左下の **歯車アイコン（管理）** クリック
3. プロパティ列の **「tcharton」**（G-HKXN8TV6HG）が選択されている事を確認

### Step 1.1.2: データストリーム設定

1. 「プロパティ」列 → **「データストリーム」** クリック
2. 「tcharton.com」のストリーム行をクリック
3. 下部 **「タグの設定を行う」** をクリック → 設定ページ展開

### Step 1.1.3: 内部トラフィック定義

1. **「内部トラフィックの定義」** をクリック
2. **「作成」** ボタンクリック
3. 以下入力:
   - **ルール名**: `代表自宅・事務所`
   - **traffic_type の値**: `internal`（既定値そのまま）
   - **マッチタイプ**: 「IP アドレスが次と等しい」
   - **値**: 代表の自宅 + 事務所 + スマホテザリング IP
     - 確認方法: https://www.cman.jp/network/support/go_access.cgi で代表の IP 確認
     - 複数 IP の場合「条件を追加」で OR 結合
4. **「作成」** クリック

### Step 1.1.4: データフィルタ有効化

1. 管理画面に戻り、プロパティ列 → **「データ設定」** → **「データフィルタ」**
2. 「Internal Traffic」フィルタ行が **「テスト」** 状態 → 行クリック
3. **「フィルタの状態」** を **「有効」** に変更
4. **「保存」** クリック

✅ **完了基準**: データフィルタ一覧で「Internal Traffic / 状態: 有効」が表示

### Step 1.1.5: 既知の bot 除外（自動機能の確認）

1. 管理画面 → **「データストリーム」** → tcharton.com → **「タグの設定を行う」**
2. **「既知の bot からのトラフィックを除外する」** がオンである事を確認（GA4 既定 ON）
3. オフだった場合 → オン

✅ **完了基準**: 「既知の bot 除外: ON」表示

### Step 1.1.6: Developer Traffic 除外（任意）

代表が DevTools で開発確認する場合の追加除外:
1. Chrome 拡張「GA Debugger」を代表ブラウザにインストール
2. tcharton.com で拡張オン → debug_mode 自動付与 → DebugView でのみ表示・本番に混入しない

---

## Phase 1.2 / キーイベント（CV）設定（25 分）

### 前提知識

GA4 の「コンバージョン」は v4 から **「キーイベント」** に名称変更（2024-03-）。
tcharton.com の CV 候補:

| 優先度 | イベント | 発火タイミング | 設定方式 |
|---|---|---|---|
| 🔴 最重要 | `form_submit` | お問い合わせフォーム送信成功時 | GA4 自動収集 + 拡張計測 |
| 🟠 重要 | `phone_tap` | 電話番号 `tel:` リンクタップ | カスタムイベント（② 実装必要）|
| 🟡 補助 | `simulator_complete` | 無料診断シミュレーター完了 | カスタムイベント（既存？要確認）|

### Step 1.2.1: 拡張計測機能の有効化

1. GA4 管理画面 → **「データストリーム」** → tcharton.com クリック
2. **「拡張計測機能」** セクションの **歯車アイコン** クリック
3. 以下を全て **オン** に確認:
   - ✅ ページビュー
   - ✅ スクロール数
   - ✅ 離脱クリック
   - ✅ サイト内検索
   - ✅ 動画エンゲージメント
   - ✅ ファイルのダウンロード
   - ✅ **フォームの操作**（← 重要 / これで `form_start` / `form_submit` 自動収集）
4. **「保存」** クリック

✅ **完了基準**: 「フォームの操作」がオン

### Step 1.2.2: form_submit をキーイベント化

1. GA4 左メニュー **「管理」** → プロパティ列 **「イベント」**
2. イベント一覧から **`form_submit`** 行を探す
3. **「キーイベントとしてマークを付ける」** トグルをオン
   - ⚠️ **注意**: form_submit イベントは初回発火後にのみ一覧表示される
   - フォームに表示されない場合 → ② が下記 1.2.5 で手動発火スクリプト追加 → 24h 待つ → 再確認

### Step 1.2.3: phone_tap カスタムイベント実装依頼（② 作業）

代表は本ステップ実行不要。② が以下を本日中にコード実装:

- 全 HTML の `<a href="tel:...">` に `data-cta="phone-tap"` 属性追加
- `dist/scripts/ga4.js` に click listener 追加 → `gtag('event', 'phone_tap', {...})` 発火
- 本番デプロイ後、GA4 リアルタイム → イベント発火確認 → キーイベント化

### Step 1.2.4: 既存 simulator_complete 確認（② 調査）

② が既存 JS（free-diagnosis シミュレーター）に GA4 イベントが実装済か確認 → 未実装なら追加。

### Step 1.2.5: form_submit が GA4 に届かない場合の対処（② 作業）

Web3Forms 経由の送信は別ドメイン（api.web3forms.com）に POST → ページ遷移発生 → 「フォーム操作」拡張計測が捕捉できない可能性。
② は以下を実装:

```javascript
// dist/scripts/contact-form.js（新規）
document.getElementById('contactForm')?.addEventListener('submit', function(e) {
  if (window.gtag) {
    gtag('event', 'form_submit', {
      form_id: 'contactForm',
      form_destination: 'web3forms'
    });
  }
});
```

contact/index.html に `<script src="/dist/scripts/contact-form.js" defer></script>` 追加。

---

## Phase 1.3 / Search Console ↔ GA4 リンク（10 分）

### Step 1.3.1: Search Console プロパティ確認

1. https://search.google.com/search-console アクセス
2. 左上ドロップダウン → `tcharton.com` プロパティが存在する事を確認
3. **存在しない場合**: 新規追加
   - **ドメインプロパティ**（DNS 認証）推奨: 全サブドメイン + http/https 統合計測
   - **URL プレフィックス**でも可（HTML / DNS / GA / GTM 認証から選択）

### Step 1.3.2: GA4 から Search Console を関連付け

1. GA4 管理画面 → プロパティ列 **「Search Console のリンク」**
2. **「リンク」** ボタンクリック
3. **「アカウントを選択」** → tcharton.com Search Console プロパティ選択 → 「確認」
4. **「ウェブストリームを選択」** → tcharton.com データストリーム選択
5. **「送信」** クリック

✅ **完了基準**: リンク一覧に Search Console プロパティが表示

### Step 1.3.3: レポート可視化（GA4 側）

1. GA4 左メニュー **「ライブラリ」**（管理 → ライブラリ）
2. **「Search Console」** コレクションを **「公開」** に変更
3. 左メニューに「Search Console」セクションが表示されるようになる
4. **「クエリ」** / **「Google オーガニック検索のトラフィック」** レポートで実データ閲覧可能

✅ **完了基準**: GA4 レポート左メニューに「Search Console」が表示

---

## 動作確認（10 分 / 代表実行 + ② 確認）

### 検証 V1: リアルタイム表示確認

1. 代表が**自分のスマートフォンの 4G 回線**（Wi-Fi オフ）で tcharton.com にアクセス
   - 自宅 IP は内部トラフィック除外されたので Wi-Fi では表示されない（正常）
   - 4G で「実顧客」相当の計測テスト可能
2. GA4 → **「レポート」** → **「リアルタイム」** で 1 分以内に user 1 が表示される事を確認
3. tcharton.com 上で `tel:` リンクタップ → リアルタイムイベントに `phone_tap` 表示される事を確認（② 実装後）
4. 別タブで /contact/ → フォーム送信 → リアルタイムイベントに `form_submit` 表示される事を確認

### 検証 V2: 内部トラフィック除外動作確認

1. 代表が**自宅 Wi-Fi** で tcharton.com にアクセス
2. GA4 リアルタイムに **表示されない** 事を確認（除外動作正常）
3. ※ 反映に 24-48h ラグあり、即時表示される場合は数日後に再検証

### 検証 V3: bot 流入の前後比較

1. Phase 1.1 完了 24 時間後、GA4 「ユーザー」レポートで **米国 user 数の変化**を確認
2. 期待挙動:
   - 米国 20 user → 大幅減少（1-3 user 程度）= 残存は実顧客
   - 米国 user が変わらない場合 → bot ではなく実流入 → 別途調査必要

---

## ② 完遂条件（HSCEL §3.1 4 Skill）

| Skill | 起動契機 | 成果物 |
|---|---|---|
| /feature-dev:feature-dev | Phase 1 着手 | 本書 + GA4 イベント実装計画 |
| /requesting-code-review | phone_tap / contact-form.js 実装後 | 並列 2+ reviewer 成果物 |
| /receiving-code-review | review feedback | 修正 commit |
| /gstack | 本番 push 後 | リアルタイム発火 screenshot |

---

## トラブルシュート

| 症状 | 原因候補 | 対処 |
|---|---|---|
| form_submit が GA4 に出ない | 拡張計測「フォーム操作」オフ / Web3Forms 遷移で計測中断 | Step 1.2.1 確認 + 1.2.5 手動発火実装 |
| 内部トラフィック除外が効かない | IP 動的変動 / フィルタ「テスト」状態のまま | Step 1.1.4 で「有効」化 / 動的 IP は IPv6 prefix で範囲指定 |
| Search Console リンクボタンが灰色 | Search Console 側の編集権限なし | Search Console 設定 → ユーザー追加 → 代表 Google アカウントを「所有者」に |
| キーイベントトグルが見えない | イベント未発火 = 一覧に項目なし | フォーム送信 / 電話タップを 1 回実行 → 24h 後に表示 |

---

## 次フェーズ（本書完遂後）

- **Phase 1.4**: 米国流入実態確認（GA4 探索レポート / 実態が bot 確定 or 実顧客判明後 1.5 へ）
- **Phase 1.5**: フォーム障壁分析（② 単独実行可能 / 別 disk artifact 化予定）
- **Phase 2**: コンテンツマーケティング起点（業界比較データ front line / ⑤ Stella レポート連携）

---

## 完遂報告

代表が Phase 1.1-1.3 完了したら、以下を ② に共有:

1. GA4 「データフィルタ」一覧の screenshot（Internal Traffic 有効状態）
2. GA4 「キーイベント」一覧の screenshot（form_submit にチェックマーク）
3. GA4 「Search Console のリンク」一覧の screenshot

② 受領後 → 並列 reviewer + REPORT v1.30-Phase1 起票 → ① 完遂報告。
