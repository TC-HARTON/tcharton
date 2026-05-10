# tcharton.com UX/UI 厳格監査レポート

**実施日**: 2026-05-10
**対象**: `index.html` / `dist/output.css` / `src/input.css`
**監査者**: ① HARTON 総合責任者 直轄調査
**前提**: ② が「100% S-RANK」push 後、代表が実機目視で重大な視覚不備を発見。② は実機確認を一切していない。

---

## 1. エグゼクティブサマリ

| 深刻度 | 件数 | 概要 |
|---|---|---|
| **CRITICAL** | 2 | (A) PC でインラインナビ完全欠如／ハンバーガーが PC でも表示される UX 違反 (B) 古い WEB アニメが 1.4s 間「壊れた WEB」のまま静止 |
| **HIGH** | 2 | (C) ヒーロー H1/Subtitle の reveal 遅延が累積 2.2s で最初の 0.4s ヒーローテキスト全空白 (D) primary CTA がモバイルで折返し懸念 |
| **MEDIUM** | 2 | (E) hero-anim-svg が 5.5s まで float 開始しないが、それまで完全静止に見える視覚 (F) inline `<style>` で `.card-hover` 旧定義（duration 0.3s, ease なし）が `dist/output.css` の spring 版を上書きする specificity 競合 |
| **LOW** | 1 | (G) Lead Evidence 行が顔写真 48px + 2 段テキストで密度高め |

**結論**: 「古い壊れた WEB」と訪問者が判断するのは **0–50ms の第一印象**で確定する。1.4s 静止は致命傷。さらに PC ナビ欠如は SPEC §0.0 H-2 整合的にも UX 不合格。② の S-RANK 判定は spec-checker （構造検証）のみであり、視覚 UX は検証対象外であったため「合格 → 不合格」のギャップが発生した。

---

## 2. アニメ問題分析（CRITICAL B）

### タイミング図（src/input.css L196-289 を verbatim 抽出）

```
時刻      .anim-old              .anim-particles      .anim-new           .new-card / .new-text       hero-anim-svg
0.0s   表示中 (opacity:1)        非表示 (opacity:0)   非表示 (opacity:0)  非表示                       静止
0.3s   old-frame shake 開始      ↑                    ↑                   ↑                            ↑
0.5s   shake 継続(2 回目)        ↑                    ↑                   ↑                            ↑
1.0s   shake 終了 / 静止         ↑                    ↑                   ↑                            ↑
1.4s   ★fade-out 開始(0.6s)     ↑                    ↑                   ↑                            ↑
1.5s   薄れ始め                  ↑                    ↑                   ↑                            ↑
1.7s   ↑                        粒子 fade-in 開始     ↑                   ↑                            ↑
2.0s   消失完了                  粒子可視             ↑                   ↑                            ↑
2.5s   ─                        粒子 fade-out 中     fade-in 開始(0.6s)  ↑                            ↑
2.7s   ─                        ほぼ消失             ↑                   nc-1 表示開始                ↑
3.1s   ─                        消失                 完成               nc-2〜nc-6 段階表示          ↑
3.5s   ─                        ─                   ─                  health-pulse 無限開始         ↑
5.5s   ─                        ─                   ─                  ─                              float 開始
```

### 訪問者体感の予想

| 訪問者の認識タイミング | 見えるもの | 判断 |
|---|---|---|
| **0–50ms（第一印象固定）** | 破線の古ブラウザ枠 + 不揃いな矩形 + "404" + 赤い × | 「壊れたサイト / 古い 90 年代 WEB」即離脱候補 |
| **0.3–1.0s（shake 中）** | 揺れる古ブラウザ | 「動いてはいるが何これ？」混乱 |
| **1.0–1.4s（shake 終了で静止）** | 動かない古ブラウザ | 「やっぱり壊れてる、エラーだ」確信 |
| **1.4s 以降** | ようやくフェードアウト開始 | 一部訪問者は既にスクロール／離脱済み |

### 致命傷の所在

- **0.3s shake 開始は遅すぎる**。最初の 300ms は完全に「死んだ古い WEB」が静止。
- **shake 終了（約 1.0s）から fade-out 開始（1.4s）まで 400ms の完全静止区間**。「動かない＝壊れている」の追認時間。
- **fade-out duration 0.6s + ease-in は遅すぎる**。実機では 1.4s + 0.6s = **2.0s** の長きにわたり古 WEB が画面の半分を占有。
- **新 WEB 完成は 3.1s**。LCP/視覚完成まで 3 秒以上は B2B SEO 観点で逆効果。

### 推奨修正

**意図シーケンス短縮 + ストーリー圧縮（合計 5s → 2.4s）**:
```
0.0–0.3s  古 WEB 表示（shake は同時開始） ※「壊れた」と認識される前に動かす
0.3s      fade-out 開始（duration 0.4s）
0.5s      粒子 fade-in 開始
1.2s      粒子 fade-out / 新 WEB fade-in 同時
1.5s      新 WEB 完成
1.7–2.4s  カード段階表示
```

CSS パッチ（`src/input.css` L200, L219, L260, L271-276 修正）:

```css
.anim-old { animation: anim-old-out 0.4s ease-in 0.3s forwards; }
.anim-old .old-frame { animation: anim-old-shake 0.3s ease-in-out 0s 2; }   /* 0.3s 早期開始 / 2 回 */
.anim-particles { animation: anim-particles-fade 0.9s ease-in-out 0.5s forwards; }
.particle { animation-duration: 1.0s; animation-delay: 0.5s; }
.anim-new { animation: anim-new-in 0.5s ease-out 1.2s forwards; }
.nc-1 { animation-delay: 1.4s; }
.nc-2 { animation-delay: 1.55s; }
.nc-3 { animation-delay: 1.7s; }
.nc-4 { animation-delay: 1.85s; }
.nc-5 { animation-delay: 2.0s; }
.nc-6 { animation-delay: 2.15s; }
.nt-1 { animation-delay: 1.4s; }
.nt-2 { animation-delay: 1.7s; }
.nt-3 { animation-delay: 1.9s; }
.nt-4 { animation-delay: 2.1s; }
.health-pulse { animation: anim-health-pulse 1.4s ease-in-out 2.4s infinite; }
.hero-anim-svg { animation: hero-anim-float 6s ease-in-out 2.6s infinite; }
```

**追加対策（最重要）**: 古 WEB 表示自体に予防的 fade-in（0–0.2s で opacity 0→1）を追加し、初期描画時に「いきなり壊れた WEB が立ち上がる」印象を回避する。あるいは古 WEB の上に**半透明のうっすらした動的 sweep（teal 走査線）**を 0.0s から重ね、「これは演出である」と即座に伝達する。

```css
.anim-old { opacity: 0; animation: anim-old-in 0.2s ease-out forwards, anim-old-out 0.4s ease-in 0.3s forwards; }
@keyframes anim-old-in { to { opacity: 1; } }
```

または 0.0s から走査線を重ねる:
```html
<g class="anim-old">
  ...既存...
  <line class="scan-line" x1="100" y1="120" x2="500" y2="120" stroke="#1B4965" stroke-width="2" opacity="0.6"/>
</g>
```
```css
.scan-line { animation: scan-sweep 0.7s linear 0s 2; }
@keyframes scan-sweep { 0%{transform:translateY(0);opacity:0.8;} 100%{transform:translateY(280px);opacity:0;} }
```

---

## 3. ヒーロー右カラム要素列挙（HIGH C）

### `index.html` L422-501 全要素カウント

| # | 要素 | クラス | 削減候補 |
|---|---|---|---|
| 1 | H1 (2 行: 「沼津で…」「終わらせる。」) | `.hero-line-1`, `.hero-line-2` | 必須 |
| 2 | サブタイトル p | `.hero-subtitle` | 必須 |
| 3 | Lead Evidence 行（顔写真 + 902 件 + 3.8 倍 + 直接対応） | `.hero-evidence` | 必須だが密度高 |
| 4 | 3 リンクカード (WEB 制作 / AI 予測 / 私たちの想い) | `.hero-cards` (nav) | 必須 |
| 5 | CTA ペア (主 CTA + 料金 link) | `.hero-cta` | 必須 |
| 6 | 申込補足 p「申込から 1 営業日…」 | （クラスなし） | 削除可（CTA 直下に二重） |
| 7 | meta 公開日/更新日 | `.hero-meta` | フッターへ移設可 |

**実カウント: 7 要素**（CLAUDE 要件「6 個以下」を 1 件超過）

価格 pills / 信頼バッジ / 業種チップは Trust Strip に既に移設済（L506-549）。✅

### 推奨削減

- **#6 申込補足 p**: 「30 分 無料診断を受ける」ボタン直後に置くのではなく、ボタン aria-describedby で hidden 補足にするか、CTA の小文字補助テキストとしてボタン内に統合。
- **#7 hero-meta**: ファーストビューに公開日は不要。フッターへ移設し、`structured data` の datePublished のみ残す（`<meta itemprop="datePublished">`）。

修正後 5 要素（H1・サブ・evidence・cards・CTA）= 推奨密度内。

---

## 4. PC ナビゲーション問題（CRITICAL A）

### 現状（index.html L277-295）

```html
<header class="absolute top-0 left-0 right-0 z-30 px-6 lg:px-12 py-6">
  <nav aria-label="メインナビゲーション" class="max-w-7xl mx-auto flex items-center justify-between">
    <a href="/" ...>T.C.HARTON ロゴ</a>
    <div class="flex items-center gap-4">
      <a href="/contact/" class="hidden sm:inline ...">無料相談</a>
      <button id="menuToggle" class="p-3 -mr-3 ...">☰</button>     ← lg:hidden なし！
    </div>
  </nav>
</header>
```

### 検証結果

- **PC 用インラインナビゲーション**: ❌ 完全欠如。`/services/web/`, `/services/ai-prediction/`, `/pricing/`, `/cases/`, `/methodology/`, `/profile/` への直接ナビは 0 個。
- **ハンバーガー (#menuToggle)**: ❌ `lg:hidden` 等の responsive クラスなし → **PC（≥1024px）でも常時表示**。
- 唯一の PC リンク = "無料相談" 1 個（sm:inline で 640px 以上表示）。

### UX 違反内容

1. PC 訪問者が ☰ ボタンをタップしないと主要 6 ページにアクセスできない。これは「**モバイルファースト UI を PC に強制した古いミス**」で、Nielsen Norman Group / Apple HIG 双方が明確に "anti-pattern" 認定。
2. SPEC §0.0 H-2「LLMO/SEO/UX 全観点で OK と確信できるまで提出禁止」に明確に違反。
3. SEO 内部リンク観点でも、TOP から主要ページへの 1-hop アンカーリンクが index ページから消失するため、PageRank flow に悪影響。

### 推奨実装案

```html
<header class="absolute top-0 left-0 right-0 z-30 px-6 lg:px-12 py-6">
  <nav aria-label="メインナビゲーション" class="max-w-7xl mx-auto flex items-center justify-between">
    <a href="/" class="flex items-center gap-2 text-dark-900 font-display font-bold text-lg" aria-label="T.C.HARTON ホームへ">
      <svg width="24" height="24" viewBox="0 0 28 28" aria-hidden="true">
        <rect width="28" height="28" rx="6" fill="#1B4965"/>
        <text x="14" y="20" text-anchor="middle" font-family="Inter, sans-serif" font-weight="800" font-size="14" fill="#fff">T</text>
      </svg>
      <span>T.C.HARTON</span>
    </a>

    <!-- PC インラインナビ (≥1024px) -->
    <ul class="hidden lg:flex items-center gap-7 text-sm">
      <li><a href="/services/web/" class="text-dark-700 hover:text-teal-700 underline-offset-4 hover:underline">WEB 制作</a></li>
      <li><a href="/services/ai-prediction/" class="text-dark-700 hover:text-teal-700 underline-offset-4 hover:underline">AI 予測</a></li>
      <li><a href="/pricing/" class="text-dark-700 hover:text-teal-700 underline-offset-4 hover:underline">料金</a></li>
      <li><a href="/cases/" class="text-dark-700 hover:text-teal-700 underline-offset-4 hover:underline">導入事例</a></li>
      <li><a href="/methodology/" class="text-dark-700 hover:text-teal-700 underline-offset-4 hover:underline">方法論</a></li>
      <li><a href="/profile/" class="text-dark-700 hover:text-teal-700 underline-offset-4 hover:underline">代表</a></li>
    </ul>

    <div class="flex items-center gap-4">
      <a href="/contact/" class="hidden sm:inline-flex items-center bg-teal-700 hover:bg-teal-800 text-white text-sm px-4 py-2 rounded-md font-medium">無料相談</a>
      <!-- ハンバーガーは PC で非表示 -->
      <button id="menuToggle" type="button" class="lg:hidden p-3 -mr-3 text-dark-700 hover:text-teal-700"
              aria-label="メニューを開く" aria-expanded="false" aria-controls="mobile-menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M3 6h18M3 12h18M3 18h18"/>
        </svg>
      </button>
    </div>
  </nav>
</header>
```

**注**: ヘッダー is `absolute` で背景透明。PC 6 リンクが Hero 上に重なる場合、`bg-white/80 backdrop-blur-md` を `<header>` に追加して可読性確保推奨。

---

## 5. CTA ボタン分析（HIGH D）

### 現状（L483-488）

```html
<a href="/contact/" data-cta="primary-hero"
   class="inline-flex items-center gap-3 bg-teal-700 hover:bg-teal-800 text-white
          px-10 py-5 rounded-full font-semibold text-base lg:text-lg shadow-lg ...">
  <span>30 分 無料診断を受ける</span>
  <svg width="20" height="20" ...>→</svg>
</a>
```

### 計算（モバイル text-base = 16px）

- 文字: "30 分 無料診断を受ける" = 11 文字 + 全角スペース 2 個 ≈ ja-JP で約 **180–195px**
- gap-3 (12px) + アイコン 20px = 32px
- 左右 padding px-10 = **80px**
- **合計 290–305px**

iPhone SE (360px ビューポート) - 親 padding px-6 (48px) = **312px** 利用可。**ギリギリ収まるが余白なし**。フォント描画ばらつきで折返し発生の可能性あり。

`flex-col sm:flex-row` のため sm 未満（<640px）では CTA は 1 列縦積みで OK。しかし **CTA 自身が 1 行に収まらない場合**、ボタン内テキストが折返しで縦長扁平になり「壊れた CTA」に見える。

### 推奨修正

```html
<a href="/contact/" data-cta="primary-hero"
   class="inline-flex items-center justify-center gap-3 bg-teal-700 hover:bg-teal-800 text-white
          px-8 sm:px-10 py-5 rounded-full font-semibold text-base lg:text-lg shadow-lg
          whitespace-nowrap min-h-[56px] ...">
  <span>30 分 無料診断を受ける</span>
  <svg width="20" height="20" ...>→</svg>
</a>
```

変更点:
1. `px-10` → `px-8 sm:px-10`（モバイルで 16px 削減）
2. `whitespace-nowrap` 追加（折返し物理禁止）
3. `min-h-[56px]` 追加（タッチターゲット 56px 保証 / WCAG 2.5.5）
4. `justify-center` で内部水平センタリング

---

## 6. モバイルメニュー検証（合格）

### #mobile-menu 内 `<a>` 列挙（L297-310）

| # | href | ラベル | 状態 |
|---|---|---|---|
| 1 | `/services/web/` | WEB 制作 | ✅ |
| 2 | `/services/ai-prediction/` | AI 予測 | ✅ |
| 3 | `/pricing/` | 料金 | ✅ |
| 4 | `/cases/` | 導入事例 | ✅ |
| 5 | `/methodology/` | 方法論・品質根拠 | ✅ |
| 6 | `/profile/` | 代表プロフィール | ✅ |
| 7 | `/contact/` | 無料で相談する | ✅（CTA 強調） |

- **保守運用 残存**: ❌ なし（v1.27 で削除済 / 整合）
- **AI 予測** は services/ai-prediction/ に正しくリンク
- 削除されたサービスへの dead link: 検出ゼロ

→ **モバイルメニューは合格**。

---

## 7. CSS ビルド整合性検証

### 7.1 `dist/output.css` 内のアニメ関連クラス出現

`src/input.css` L196 以降のすべての追加クラスが `dist/output.css` にミニファイ済で存在することを確認:

```
.anim-old{...animation:anim-old-out .6s ease-in 1.4s forwards}    ✅
.anim-particles{...}                                              ✅
.anim-new{animation:anim-new-in .6s ease-out 2.5s forwards}       ✅
.particle, .p1...p12, @keyframes pf1...pf12                       ✅ 全 12 個
.new-card, .nc-1...nc-6                                           ✅
.new-text, .nt-1...nt-4                                           ✅
.health-pulse                                                     ✅
.hero-anim-svg                                                    ✅
.hero-line-1...hero-meta                                          ✅
.service-card, .service-card:hover                                ✅
.hero-bg-glow                                                     ✅
@keyframes 全件 (anim-old-shake, anim-old-out, ...)              ✅
@media (prefers-reduced-motion: reduce) { ... }                   ✅
```

→ **CSS ビルドは最新で正常**。② が直前にビルドし忘れた可能性は否定。

### 7.2 specificity 競合（MEDIUM F）

`index.html` L235 の inline `<style>`:
```css
.card-hover { transition: transform 0.3s, box-shadow 0.3s; }
```
これは `dist/output.css` の `html .card-hover { transition: transform .4s var(--ease-spring), ... }` より specificity が低いため上書きされない。✅

ただし inline 順序として `<head>` 内に inline `<style>` (L214-264) **の後に** `<link rel="stylesheet" href="/dist/output.css">` がロードされていれば、tie-break で外部 CSS が勝つ。逆順なら inline が勝つ。`<link>` 位置の確認推奨（今回の調査範囲外）。

### 7.3 inline `<style>` の reduced-motion グローバル kill（MEDIUM 確認）

L255-263:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

これは `prefers-reduced-motion: reduce` の場合のみ発動するため**通常訪問者には影響なし**。a11y 観点で適切。✅

ただし src/input.css L367-387 にも reduced-motion 個別オーバーライドあり、二重防御で OK。

---

## 8. 修正コード集約

### 8.1 PC ナビ追加（最優先）

→ §4 の HTML パッチを `index.html` L277-295 に適用。

### 8.2 アニメシーケンス短縮（最優先）

→ §2 の CSS パッチを `src/input.css` L196-289 領域に適用後、`npx tailwindcss -i src/input.css -o dist/output.css --minify` で再ビルド。

### 8.3 CTA 折返し防止（推奨）

→ §5 の `whitespace-nowrap min-h-[56px] px-8 sm:px-10` を `index.html` L483 に適用。

### 8.4 ヒーロー要素削減（推奨）

`index.html` L493 の補足 p を CTA aria-describedby 化:

```html
<a href="/contact/" data-cta="primary-hero" aria-describedby="cta-note" class="...">
  <span>30 分 無料診断を受ける</span>
  <svg ...>→</svg>
</a>
<a href="/pricing/" class="...">料金を見る</a>
</div>
<p id="cta-note" class="mt-3 text-xs text-dark-500">申込から 1 営業日以内 / 平日 24h 返信</p>
```

`hero-meta` (L496-500) はフッターへ移設、ヒーロー内では `<meta itemprop="datePublished">` のみ残す。

### 8.5 検証手順

1. `cd C:\Users\ohuch\Desktop\HARTON\tcharton`
2. `src/input.css` 編集 → `npx tailwindcss -i src/input.css -o dist/output.css --minify`
3. `index.html` 編集（PC ナビ + CTA + 削減）
4. `node spec-checker.js` で構造 S-RANK 維持確認
5. **実機ブラウザで Chrome DevTools Performance → throttling 4×CPU + Slow 3G で動画記録**
6. ① に動画 + before/after スクリーンショット報告（SPEC §0.0.7 H-1 義務）

---

## 9. ②への手抜き指摘（① 統制事項）

② の「100% S-RANK」push は spec-checker.js（2554 項目構造検証）のみを通過した状態であり、**視覚 UX 検証は spec-checker の対象外**であった。にもかかわらず ② は実機ブラウザ目視を一切行わず push に至った。これは SPEC §0.0.3 H-3 Failure-Self-Report 観点で「未検証事項を ① に申告せず S-RANK 達成と表現した」**過大表現**に該当する可能性がある。

今後 ② は「機械的合格率 100%」と「**視覚 UX 合格**」を分離して報告する義務（SPEC §0.0.7 報告義務 H-1 整合）。

---

**監査終了**
