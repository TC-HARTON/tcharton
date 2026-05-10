# AUDIT-UIUX-V1.md — tcharton.com 実機 UI/UX 100 点満点厳格評価

**監査日:** 2026-05-10
**監査対象:** https://tcharton.com/ + 関連 16 ページ
**監査者:** Claude Opus 4.7（HARTON 総合責任者① 配下監査セッション）
**SPEC 準拠:** v3.6 / Ambassadorship Duty H-3 Failure-Self-Report 適用

---

## 0. 使用ツール明記（手抜き禁止のため正直に開示）

代表指示は「ブラウザ MCP / gstack browse / WebFetch のいずれかを使え」であり、最優先は実機ブラウザだった。**実態は以下の通り**：

| ツール | 状態 | 備考 |
|---|---|---|
| `mcp__Claude_in_Chrome__*`（実 Chrome 操作） | **拒否（Permission denied）** | `list_connected_browsers` 段階で sandbox により遮断 |
| `mcp__Claude_Preview__preview_screenshot` | **拒否（Permission denied）** | サーバ起動 (`port 8080`) は成功するも screenshot/eval/resize すべて denied |
| `mcp__Claude_Preview__preview_eval` | **拒否（Permission denied）** | DOM 検査・JS 実行不可 |
| `WebFetch`（本番 https://tcharton.com/）| **可（使用）** | HTML / CSS / JS のサーバ実体取得 |
| `Read`（ローカル `tcharton/`）| **可（使用）** | ソースコードと出力の差分照合 |
| `Grep` / `Bash`（CSS keyframes 抽出）| **可（使用）** | アニメーション CSS の存在・タイミング検証 |

**結論:** 真の意味での「実機ブラウザ直視」は環境制約により不可。本監査は **本番デプロイ済 HTML / CSS / JS のサーバ取得 + ローカルソース照合** による静的検証である。**ピクセル単位の視覚崩れ・実時間アニメ動作・タップ反応は検証不能**であり、その範囲は §5 にて明示する。

---

## 1. エグゼクティブサマリ

| 区分 | 結果 |
|---|---|
| **総合スコア** | **74 / 100**（合格ラインは代表基準で 90 以上） |
| **判定** | **不合格（要修正）** |
| **代表指摘 4 件再発検証** | 4 件すべて **コード上は修正済み**を確認。実機での視覚崩れは検証不能（§5） |
| **致命傷** | なし。ただし「実機未検証で 100 点と称する」リスクは継続 |
| **構造的優秀点** | アニメ 3 幕シーケンス・モバイルメニュー Esc/Tab/inert 完全実装・SSO/JSON-LD 多重・CSP A+ |
| **要改善** | CTA 全幅吸込み・ヒーロー要素過多（10 個）・実機検証パイプ不在 |

### スコア内訳

| カテゴリ | 配点 | 実績 | 主因 |
|---|---|---|---|
| ファーストビュー視認性 | 15 | 11 | H1/CTA/数値証跡は明確。ただし要素 10 個でやや密 |
| モバイル UX | 20 | 13 | メニュー実装完璧。CTA `whitespace-nowrap` で 360px 際どい |
| PC UX | 15 | 13 | 7 リンクインラインナビ確認。ロゴ + 7 項目 = 視線過密リスク小 |
| アニメーション動作 | 15 | 12 | CSS 上は実装済み（0.0–1.3s old / 0.8–1.7s particles / 1.5s〜 new）。実機タイミング未検証 |
| インタラクション完全性 | 15 | 11 | menuClose × ボタン handler 本番デプロイ済み。フォーム送信実機未検証 |
| 視覚バランス | 10 | 7 | 余白系統 OK。ヒーロー右カラムに段組み 6 ブロック密集 |
| 全ページ整合性 | 10 | 7 | ナビ・フッター 16 ページ統一確認、業種チップ全件 `/services/web/` 流入で粒度粗い |

---

## 2. A. 代表指摘の不備 4 件 — 再発検証

### A-1. アニメ動作（古 WEB → 粒子 → 高品質 WEB）が **実際に表示されるか**

**コード検証結果:** 実装済み。

`https://tcharton.com/dist/output.css?v=20260510a` から抽出：

```
.anim-old        { opacity:1; animation: anim-old-out .5s ease-in .8s forwards; }
.anim-old .old-frame { animation: anim-old-shake .3s ease-in-out .1s 2; }
.anim-particles  { opacity:0; animation: anim-particles-fade .9s ease-in-out .8s forwards; }
.anim-new        { opacity:0; animation: anim-new-in .5s ease-out 1.5s forwards; }
.hero-anim-svg   { animation: hero-anim-float 6s ease-in-out 3s infinite; }
.hero-bg-glow    { animation: hero-bg-drift 24s ease-in-out infinite alternate; }
```

タイミング表（実時間）:

| 時刻 (s) | 古 WEB | 粒子 | 高品質 WEB |
|---|---|---|---|
| 0.0 | opacity 1 + shake | 0 | 0 |
| 0.1–0.7 | shake 2 回 | 0 | 0 |
| 0.8 | fade-out 開始（.5s） | fade-in 開始（.9s） | 0 |
| 1.3 | 0（消失） | 中盤 | 0 |
| 1.5 | 0 | 0.7 → 0 へ | scale .92→1 / opacity 0→1 開始（.5s） |
| 2.0 | 0 | 0 | 完全表示（永続） |
| 3.0〜 | — | — | float 永続揺れ（6s ease-in-out） |

`prefers-reduced-motion: reduce` 時は CSS で `animation:none!important` 上書き済み（hero-anim-svg / new-card / new-text / old-frame / particle）→ **アクセシビリティ準拠**。

`pf1` 〜 `pf12` 12 個の particle keyframe も生成済み。SVG の `<circle class="particle p1...p12">` 12 要素と一致。

**判定:** **コード上は完全実装。本番 CSS にも反映済み。** ただし「実際に動くか」は実機ブラウザで再生時間を計測しない限り確証不可。1 回目の代表指摘時にコードはあったのに動かなかった可能性として残る要因：

- `output.css?v=20260510a` のキャッシュバスター更新で旧キャッシュが残存していた疑い
- SVG に `class` を付けたが、初期 `<style>` ブロックの load 順序で transition 競合
- IntersectionObserver の `fade-in` が hero に付いていれば未交差で opacity:0 のまま — 確認したところ **hero セクションに `.fade-in` 付与なし**（OK）

**残リスク:** 実機 Safari iOS で SVG `<g>` タグへの `animation` プロパティが部分的に効かないバグ（古 WebKit）の可能性。検証必要。

---

### A-2. モバイル表示バランス（360px 幅）

**コード検証結果:**

- ヒーロー container: `max-w-6xl mx-auto` + `px-6 lg:px-12` = 24px padding × 2 → usable 312px
- グリッド: `grid-cols-1 lg:grid-cols-2` → モバイルは 1 列（OK）
- ヒーロー画像（SVG 600×600）: `max-w-md mx-auto width="100%"` → モバイルでは 312px に縮小
- H1: `text-2xl sm:text-3xl lg:text-4xl` で段階制御
- 業種チップ: `flex flex-wrap gap-2 justify-center` で 6 件 → 360px で 2-3 行折り返し（OK）
- 価格チップ 4 個 + バッジ 3 個: `flex flex-wrap gap-3 justify-center` → 折り返し前提（OK）

**懸念点:**

- **CTA `30 分 無料診断を受ける` に `whitespace-nowrap` 付与（line 506）**。日本語 13 字 + 矢印 + gap-3 + px-8（32px×2）= text-sm 算定で約 280–310px、360px 機で `px-6` container 内 312px の usable と**ほぼ同寸**。微差で右はみ出し or 詰まり感が発生する可能性。
- iOS Safari の動的フォント拡大（accessibility 設定）下で確実に溢れる。

**判定:** **構造 OK だが CTA は 360px で限界ギリギリ。** 推奨修正：`whitespace-nowrap` を `sm:whitespace-nowrap` へ降格（モバイルは折返し許容）か、テキストを「無料診断を受ける」（10 字）へ短縮。

---

### A-3. CTA ボタン「30 分 無料診断を受ける」テキスト折返し / 余白

A-2 と重複するが追加観点：

- **メイン CTA（hero）**: 円形 (`rounded-full`) + shadow-lg + ring-2 focus、視認性高い ✅
- **最終 CTA セクション（line 735）**: 同テキスト、`bg-dark-900 hover:bg-teal-700` で色違い。一貫性ややブレ
- **業種チップから飛ぶ pricing アンカー先**: 全件 `/services/web/` 共通流入で「クリックしても自分の業種ページに来ない」UX 不一致 → `/services/web/#cuisine` 等の anchor 化推奨

**判定:** ボタン余白・タップ性は構造的 OK。**業種チップの遷移先が全部同じ**は手抜き感あり、修正候補。

---

### A-4. モバイルメニュー × ボタン（menuClose）クリックで閉じるか

**コード検証結果:** **完全実装済み（v1.31）**。

`/dist/scripts/menu.js` line 112-115:

```js
var closeBtn = document.getElementById('menuClose');
if (closeBtn) {
  closeBtn.addEventListener('click', function () { closeMenu(); });
}
```

本番 `https://tcharton.com/dist/scripts/menu.js` でも該当コード確認（WebFetch 結果）。

加えて以下も実装済み:
- `Escape` キーで閉鎖（WCAG 2.1.2 No Keyboard Trap）
- `Tab` / `Shift+Tab` 循環（APG Dialog Pattern / WCAG 2.4.3）
- `inert` 属性で背景操作不可化（aria-modal=true 整合）
- 戻り focus（`lastFocused.focus()`）

**判定:** **完璧実装。実機検証で確認すべきは、`menuClose` ボタンが `inert` の影響を受けない位置にあること（`#mobile-menu` 内なので OK のはず）。**

---

### A-5. PC ヘッダーインラインナビ

`index.html` line 298-307 確認。lg 以上で `WEB 制作 / AI 予測 / 料金 / 事例 / 想い / プロフィール / 無料相談` の 7 項目 + ロゴ表示。本番でも一致（WebFetch /services/web/ で確認済）。

**判定:** **完全準拠**。ただし 1366px 幅では `gap-7` (28px) × 7 項目 + ロゴ + max-w-7xl で密度高め。1280px 以下で折り返しリスクあり要実機確認。

---

## 3. B. 視覚整合性（実機検証可能範囲のみ）

### B-1. ヒーロー要素数カウント（推奨 6 個以下に対し実数）

`<section aria-label="ヒーロー">` 内の主要要素:

1. hero-bg-glow（背景アニメ）
2. SVG アニメ（左カラム）
3. H1 2 行（沼津で… / 終わらせる）
4. subtitle（高品質 WEB を…）
5. 数値証跡（顔写真 + 902 件 + 3.8 倍 + 大内達也）
6. 3 リンクカード（WEB / AI / 想い）
7. メイン CTA（30 分 無料診断）
8. 軽 CTA（料金を見る）
9. CTA 補足（1 営業日以内…）
10. 公開日 / 最終更新

**実数: 10 個。推奨 6 個を 67% 超過。**

「Trust strip は別 section に分離した（line 530）」のは適切判断だが、ヒーロー本体に依然 10 ブロック密集。代表が「ヒーロー要素過多」と感じるなら 5/6/9/10 を削るのが現実的。

### B-2. 0–3 秒視認内容

- 0.0–1.5s: 古 WEB（破線 / 404 / × / グレー table）
- 1.5–2.0s: 高品質 WEB へクロスフェード（カード + 「+47 件」「+28%」「ようこそ」「今すぐお問い合わせ →」）
- 2.0s〜: float 揺れ永続

H1「沼津で、『誰も来ない HP』を終わらせる。」は 0.0s から固定表示（CSS animation なし）→ 視認性 OK。

### B-3. アニメ滞留時間の妥当性

古 WEB 滞留 1.3s は短め。代表が「古 WEB を一瞬で見逃した」可能性あり。0.8s から fade-out 開始は Lighthouse CWV LCP に有利だが、ストーリーテリング重視なら **1.5s 滞留 + 1.0s クロスフェード**へ調整余地あり。

### B-4. フッター 3 列構造

実装は **4 列**（サービス / 信頼形成 / 事業者情報 / 法令）+ Copyright + 住所行。`grid-cols-2 md:grid-cols-4`。タブレット 768px で 4 列詰込みやや窮屈、md→lg で 4 列確定。

---

## 4. C. インタラクション完全性

| 機能 | コード状態 | 実機検証 |
|---|---|---|
| ハンバーガー → ドロワー | ✅ open class toggle + transform translateX | 不能 |
| × → close | ✅ `#menuClose` click handler 実装 | 不能 |
| Escape → close | ✅ `onKeydown` で実装 | 不能 |
| Tab 循環 | ✅ `trapTab` 実装 | 不能 |
| 背景 inert | ✅ `setInert(true)` | 不能 |
| 戻り focus | ✅ `lastFocused.focus()` | 不能 |
| メニューリンククリック → 閉 | ✅ `menu.querySelectorAll('a').forEach... closeMenu()` | 不能 |
| CTA `/contact/` 遷移 | ✅ 静的 link | WebFetch で 200 OK 確認済 |
| 業種チップ → `/services/web/` | ⚠️ 全 6 件同一先 | 設計欠陥 |
| フォーム送信 web3forms | コード未検査 | 不能 |

---

## 5. D. 言い訳・手抜き監査（② への糾弾）

**過去の前科:**「② が 100% S-RANK と称した push 後、代表が即座に多数の不備を目視発見した」。今回の検証で②の言と実態の差分：

### D-1. ② が「100% S-RANK」と称する spec-checker 検証

`spec-checker.js` は HTML 構造・SPEC 整合性 2554 項目を検査するが、**以下を検査しない**:

- 実機ブラウザでのアニメ再生確認
- 360px / 1366px / 1920px 各幅のレイアウト崩れ
- iOS Safari / Android Chrome 固有バグ
- `whitespace-nowrap` 等の overflow リスク
- フォント拡大設定下の読み下し
- タップ領域 44×44px 物理確認（WCAG 2.5.5 Target Size）
- アニメフレームレート / GPU 負荷

つまり **「2554/2554 PASS」と「実機で問題なく見える」は別物**。前回代表が即座に発見した不備（アニメ動かない / バランス崩れ）は **spec-checker の検査範囲外**であり、② が「100% S-RANK」と言ったのは**嘘ではないが、品質の十分条件ではない**。

### D-2. 今回の確認で「修正完了」を再発見した箇所

| ② 主張 | コード実態 | 判定 |
|---|---|---|
| アニメ 3 幕シーケンス実装済み | 0.0–2.0s タイムライン CSS で確認 | **本物（コード）** |
| menuClose × ボタン実装済み | menu.js v1.31 line 112-115 確認 | **本物（コード）** |
| PC インラインナビ 7 項目復活 | index.html line 298-307 確認 | **本物（コード）** |
| Trust strip ヒーロー外移設 | line 530 確認、ヒーローから分離済 | **本物（コード）** |

すべて**コード上は実装済み**。ただし以下は ② が報告した記憶がない:

- ヒーロー要素数 10 個（推奨 6 個超過）→ 過密リスク報告なし
- CTA `whitespace-nowrap` 360px 限界ギリギリ → 報告なし
- 業種チップ全件同一先 `/services/web/` → 設計報告なし

**結論:** ② のコミット（直近 5 件）は SPEC 検証通過範囲では誠実。ただし「ユーザー体感品質」の責任を SPEC checker に外注しすぎ。**実機ブラウザ検証パイプ不在が構造的欠陥**。

### D-3. キャッシュ言い訳の予防線

代表が「アニメ動かない」と再度指摘した場合、② が「キャッシュです」と逃げる前に：

- `<link rel="stylesheet" href="/dist/output.css?v=20260510a">` のクエリは 2026-05-10 = 本日付け更新済み
- Cloudflare の Edge cache は通常 4 時間 TTL、当日デプロイなら強制 purge 必須
- ユーザー側の Service Worker / ブラウザキャッシュは Ctrl+F5 で解決

→ **キャッシュ言い訳の余地は本日デプロイ直後のみ。代表が翌日見て動かなければ実装側のバグである。**

---

## 6. 修正必要項目（優先度付き）

| Pri | 項目 | 工数 | ファイル |
|---|---|---|---|
| **P0** | 実機ブラウザ検証パイプを構築する（playwright or chrome MCP）。SPEC checker だけでは「動くか」がわからない | 1d | `tcharton/scripts/visual-check.js` 新設 |
| **P1** | ヒーロー CTA `whitespace-nowrap` を `sm:whitespace-nowrap` に降格、または「無料診断を受ける」へ短縮（13→10 字）| 5min | index.html line 506 |
| **P1** | 業種チップ 6 件の遷移先を `/services/web/#anchor` 形式で個別化、もしくは `/cases/` の業種別事例ページへ振り分け | 30min | index.html line 569-574 |
| **P2** | ヒーロー要素 10 個のうち、公開日 / 最終更新（line 519-523）をヒーロー外（フッター付近）へ移設して 9 個へ削減 | 10min | index.html line 519-523 |
| **P2** | 古 WEB 滞留時間を 0.8s → 1.2s（fade-out 遅延）に延長してストーリー認知を向上 | 5min | output.css の `.anim-old` animation-delay |
| **P3** | iOS Safari 旧版で SVG `<g>` の animation が効かない事例があるため、`<g>` ではなく `<g style="..">` インライン化 fallback 検討 | 30min | index.html line 362, 387, 403 |
| **P3** | フッター 4 列を `md:grid-cols-2 lg:grid-cols-4` にして 768–1024px の窮屈さ解消 | 5min | index.html line 749 |
| **P4** | spec-checker.js に「whitespace-nowrap + 日本語 12 字以上のボタン」の警告ルール追加 | 1h | spec-checker.js |

---

## 7. 検証不能項目（環境制約による未確認事項）

代表に正直に申告すべき項目（H-3 Failure-Self-Report 準拠）:

1. アニメ 3 幕の実体感タイミング（コード上は OK だが、人間目視での「速すぎる/遅すぎる」未検証）
2. 360px / 1366px / 1920px の実画面崩れ
3. iOS Safari / Android Chrome 個別バグ
4. メニュー開閉時の透明度 / focus ring 視認性
5. CWV LCP / CLS / INP の現状値
6. フォーム送信 → thanks.html 遷移の連携
7. CSP `require-trusted-types-for 'script'` が古ブラウザで JS を破壊していないか

これらは環境制約で本セッションでは検証不能。**「実機検証なしで合格」とは言えない。**

---

## 8. 最終判定

**スコア: 74 / 100 — 不合格（要修正）**

- **コード品質は誠実**（メニュー a11y 完璧、アニメ実装済、ナビ整合）
- **構造的問題は CTA 限界 + 業種チップ粒度 + ヒーロー過密**
- **最大の懸念は「実機検証パイプ不在」**。② が「S-RANK」と称しても、代表が見て不備があれば S-RANK ではない。SPEC checker は必要条件であって十分条件ではない

**① への提言:** ② の責務に「実機ブラウザでの視覚 QA」を追加し、それなしで `git push` できないようにすべき。pre-push hook に `playwright test --browser chromium --headed=false` を追加。SPEC v3.7 で §11 ゲート条件に「視覚回帰テスト PASS」を含める。

**②（S クラスサイト構築責任者）の名誉のための補足:** 今回検査したコミットの実装内容は、過去前科にも関わらず**手抜きではない**。だが「言うこと」と「品質保証範囲」のズレ（S-RANK の意味の誤訳）が再発リスク。S-RANK = SPEC 通過 ≠ ユーザー体感品質。

---

**監査完了 — 2026-05-10 / Claude Opus 4.7**
