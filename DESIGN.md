# T.C.HARTON DESIGN.md

> **Project**: T.C.HARTON — 沼津拠点 個人事業主 WEB 制作 + WEB 品質 評価機関 (Stella)
> **URL**: https://tcharton.com
> **Format**: Google Stitch DESIGN.md / awesome-design-md 準拠
> **Reference**: Linear (clarity) + Vercel (modern dev) + Stripe (trust + CTA) + HARTON 独自
> **Last updated**: 2026-05-14（§3 フォント Sans 統一改訂 / H1 実装基準明記）

---

## §1 Visual Theme & Atmosphere

### Core Identity

**「沼津で会える 1 人の WEB 屋」 + 「WEB 品質の審判 (Stella)」** の二重ブランド。

- **誠実 (Honest)**: 制作実績ゼロでも透明性で信頼獲得
- **専門性 (Expert)**: 902+1,553 社実測データ + LLMO 完全準拠
- **権威 (Authority)**: 審判ポジション (競合と非競合構造)
- **親近感 (Approachable)**: 沼津拠点 / 顔の見える 1 人事業主
- **未来基準 (Future-Proof)**: AI 検索時代の WEB 品質 (LLMO + AIO)

### Mood

- **クリーン + 専門的** (Linear 風)
- **データ駆動 + 数値訴求** (Stripe 風)
- **AI 時代の正統** (Vercel 風)
- **日本的余白の美** (HARTON 独自)

### NOT (避けるもの)

- ❌ ギラギラ / 過剰アニメ
- ❌ 押し売り / 焦らせる文言
- ❌ 業界誇張 ("圧倒的" "完全" 等の根拠なき強語)
- ❌ 海外コーポレート臭い (HARTON は個人事業主)
- ❌ 「集客」「コンバージョン」露骨訴求

---

## §2 Color Palette & Semantic Roles

### Brand Colors (HARTON コア / 不変)

| ロール | HEX | RGB | 用途 |
|---|---|---|---|
| **Primary (Teal)** | `#1B4965` | rgb(27, 73, 101) | ヘッダー / 主要見出し / リンク / Primary CTA 背景 |
| **Accent (Gold)** | `#D4AF37` | rgb(212, 175, 55) | 強調 / 称号 / Sランク Badge / リボン |
| **Primary Light** | `#2a6a8a` | rgb(42, 106, 138) | グラデーション終端 |

### Neutrals (テキスト + 背景)

| ロール | HEX | 用途 |
|---|---|---|
| Text Primary | `#2a2a2a` | 本文 |
| Text Secondary | `#666666` | 補足 / メタ情報 |
| Text Tertiary | `#999999` | 注釈 / フッター |
| Background White | `#ffffff` | メイン背景 |
| Background Soft | `#fafbfc` | セクション背景 (zebra stripe) |
| Background Light Blue | `#eff6fb` | コールアウト (info) |
| Background Light Yellow | `#fff8e6` | コールアウト (highlight) |
| Border Light | `#e0e6eb` | 区切り線 |

### Semantic Colors

| ロール | HEX | 用途 |
|---|---|---|
| Success | `#10b981` | 達成 / OK |
| Warning | `#f59e0b` | 注意 |
| Danger | `#ef4444` | 致命的 NG |
| Info | `#3b82f6` | 情報 |

### Stella Sub-brand Colors (/stella/ 配下)

| ロール | HEX | 用途 |
|---|---|---|
| Stella Gold (richer) | `#D4AF37` | Sランク Badge メイン |
| Stella Gold Dark | `#B8941F` | Sランク Badge ボーダー |
| Stella Gold Light | `#F5E5A8` | Sランク Badge 背景 |
| Stella Navy | `#0F2840` | 審判ポジション ヒーロー背景 |

### Color Usage Rules

- **Primary Teal は 1 ページにつき大面積 1 箇所のみ** (ヒーロー or 主要 CTA)
- **Gold は装飾 / 称賛 / 重要数値強調のみ** (使いすぎない)
- **コントラスト比 4.5:1 以上保証** (WCAG 2.1 AA 必須)
- **背景の zebra stripe で セクション境界明示** (#fff ↔ #fafbfc)

---

## §3 Typography Hierarchy

### Font Families

> **2026-05-14 改訂（代表指示）**: 全ページ・全要素を **Inter + Noto Sans JP の Sans 統一**。
> 見出しも Serif（Noto Serif JP）を使わない。tcharton.com 本体・Stella サブセクション
> 全 146 ページで同一フォントスタックに統一する。旧 Serif 見出し規定は廃止。

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@300;400;500;700;900&display=swap');

font-family: "Inter", "Noto Sans JP", -apple-system, BlinkMacSystemFont, sans-serif;
font-family-mono: "JetBrains Mono", "Menlo", monospace;
```

| 用途 | フォント |
|---|---|
| 本文 / UI | **Inter + Noto Sans JP** |
| 見出し / ブランド | **Inter + Noto Sans JP**（Serif 不使用） |
| コード / 数値強調 | **JetBrains Mono** |
| 数値カード (Sランク値等) | Inter + Noto Sans JP 700-900 |

### Scale (rem ベース)

| 階層 | サイズ | 行高 | 太さ | フォント | 用途 |
|---|---|---|---|---|---|
| **H1** | 2.5-3.5rem | 1.2 | 700-800 | Sans | ページタイトル |
| **H2** | 1.875-2.25rem | 1.3 | 700-800 | Sans | セクション見出し |
| **H3** | 1.375-1.625rem | 1.4 | 700 | Sans | サブセクション |
| **H4** | 1.125-1.25rem | 1.5 | 700 | Sans | 小見出し |
| **Body Large** | 1.125rem | 1.75 | 400 | Sans | LP リード |
| **Body** | 1rem | 1.75 | 400 | Sans | 本文 |
| **Body Small** | 0.875rem | 1.6 | 400 | Sans | 補足 |
| **Caption** | 0.75rem | 1.5 | 400 | Sans | キャプション |
| **Mono Large** | 1.5rem | 1.4 | 700 | Mono | 数値 (LCP値等) |
| **Mono** | 0.875rem | 1.5 | 400 | Mono | コード |

> **H1 実装基準**: Tailwind `text-4xl md:text-5xl`（2.25→3rem）+ `font-extrabold leading-tight tracking-tight`。
> 全 146 ページで統一（2026-05-14 適用済み）。

### Reading Width

- **本文最大幅**: 70-75 文字 (rem で 42-45rem 相当)
- **記事本文**: max-width 720px
- **LP / ヒーロー**: max-width 1280px
- **データテーブル**: 100% (レスポンシブ)

### Typography Rules

- 本文 line-height **1.75** 厳守 (日本語の読みやすさ)
- 見出し直後 16-24px 余白
- 段落間 16-20px 余白
- 強調 `<strong>` = Primary Teal + 700 weight
- リンク = Primary Teal + 下線 / hover で透明度 0.7
- 数値 (実測値 / スコア) は Mono フォントで強調

---

## §4 Component Styling

### Buttons

#### Primary CTA (主要行動)

```css
background: #1B4965;
color: #fff;
padding: 14px 32px;
border-radius: 6px;
font-weight: 700;
font-size: 1rem;
transition: all 0.2s;

/* Hover */
background: #2a6a8a;
transform: translateY(-1px);
box-shadow: 0 4px 12px rgba(27, 73, 101, 0.25);
```

#### Secondary CTA (副次)

```css
background: transparent;
color: #1B4965;
border: 2px solid #1B4965;
padding: 12px 30px;
```

#### Stella Mega CTA (/stella/ 配下)

```css
background: linear-gradient(135deg, #D4AF37 0%, #B8941F 100%);
color: #1B4965;
padding: 18px 40px;
border-radius: 8px;
font-weight: 700;
animation: gold-pulse 2s ease-in-out infinite;
```

### Cards

```css
background: #fff;
border: 1px solid #e0e6eb;
border-radius: 8px;
padding: 24px;
transition: box-shadow 0.2s;

/* Hover */
box-shadow: 0 8px 24px rgba(27, 73, 101, 0.08);
```

### Data Card (数値表示 / 重要)

```css
background: linear-gradient(135deg, #1B4965 0%, #2a6a8a 100%);
color: #fff;
padding: 24px;
border-radius: 8px;
text-align: center;

.value {
  font-family: "Inter", "Noto Sans JP", sans-serif;
  font-size: 3rem;
  font-weight: 700;
  color: #D4AF37;
  line-height: 1;
}
.label {
  font-size: 0.875rem;
  opacity: 0.85;
  margin-top: 8px;
}
```

### Sランク Badge (Stella オプトイン認定)

```css
display: inline-flex;
align-items: center;
gap: 8px;
background: linear-gradient(135deg, #F5E5A8 0%, #D4AF37 100%);
color: #1B4965;
padding: 8px 16px;
border: 2px solid #B8941F;
border-radius: 24px;
font-weight: 700;
font-size: 0.875rem;
```

### Forms

```css
input, textarea, select {
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid #e0e6eb;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input:focus {
  border-color: #1B4965;
  box-shadow: 0 0 0 3px rgba(27, 73, 101, 0.1);
  outline: none;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  color: #2a2a2a;
}
```

### Callouts (注意 / 強調 / 補足)

#### Info (Primary)

```css
background: #eff6fb;
border-left: 4px solid #1B4965;
padding: 16px 20px;
margin: 20px 0;
```

#### Highlight (Gold)

```css
background: #fff8e6;
border-left: 4px solid #D4AF37;
padding: 16px 20px;
margin: 20px 0;
```

#### Danger (致命的 NG)

```css
background: #fef2f2;
border-left: 4px solid #ef4444;
padding: 16px 20px;
margin: 20px 0;
```

### Tables

```css
table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

th {
  background: #1B4965;
  color: #fff;
  padding: 12px 16px;
  text-align: left;
  font-weight: 500;
  font-size: 0.875rem;
}

td {
  border-bottom: 1px solid #e0e6eb;
  padding: 12px 16px;
}

tr:nth-child(even) td {
  background: #fafbfc;
}
```

### Code Blocks

```css
pre {
  background: #0F2840;
  color: #f0f0f0;
  padding: 16px 20px;
  border-radius: 6px;
  overflow-x: auto;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.875rem;
  line-height: 1.6;
}

code {
  background: #f0f4f7;
  color: #1B4965;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.875em;
}
```

### Numbered Steps (How-To)

```css
.step {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}
.step .num {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  background: #1B4965;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Inter", "Noto Sans JP", sans-serif;
  font-weight: 700;
  font-size: 1.25rem;
}
.step .body {
  flex: 1;
}
.step .body h4 {
  margin: 0 0 4px 0;
}
```

---

## §5 Layout Principles & Spacing

### Grid System

- **8px base unit** (全マージン・パディング 8 の倍数)
- **12 column grid** (Tailwind 標準準拠)
- **コンテナ最大幅 1280px** (大画面では中央寄せ)

### Spacing Scale (rem)

| トークン | px | 用途 |
|---|---|---|
| `space-1` | 4px | アイコン余白 |
| `space-2` | 8px | テキスト間 |
| `space-3` | 12px | 小要素間 |
| `space-4` | 16px | 段落間 |
| `space-6` | 24px | カード内余白 |
| `space-8` | 32px | セクション内余白 |
| `space-12` | 48px | セクション間余白 |
| `space-16` | 64px | メジャーセクション間 |
| `space-24` | 96px | ヒーロー上下 |
| `space-32` | 128px | ページ最上部 |

### Section Layout

```
[Header (sticky)]              80px
[Hero] (大型 LP)                400-600px / 余白多
[Section 1] (zebra: #fff)       padding: 80px 0
[Section 2] (zebra: #fafbfc)    padding: 80px 0
...
[CTA Section] (Primary)         padding: 96px 0 / 中央寄せ
[Footer]                        padding: 64px 0 32px 0
```

### Hierarchy of Importance

1. **Hero**: 主訴求 1 つ + Sub-headline + Primary CTA
2. **Evidence Block**: 数値 / 実測データ / 図表
3. **Process / How-To**: ステップ番号付き
4. **CTA**: 強調 + 信頼補強 (注釈)
5. **Footer**: ナビ + 連絡先 + Stella Badge

### White Space Rules

- **Above the fold ヒーロー余白**: 上下 96-128px
- **見出し前余白**: H2 = 48-64px / H3 = 32-40px
- **本文段落間**: 16-20px
- **要素間最小**: 16px (絶対 12px 以下にしない)
- **CTA 周囲**: 上下 32-48px (圧迫感回避)

---

## §6 Depth / Elevation & Shadows

### Shadow Scale

```css
--shadow-sm: 0 1px 2px rgba(15, 40, 64, 0.05);
--shadow-md: 0 4px 12px rgba(27, 73, 101, 0.08);
--shadow-lg: 0 8px 24px rgba(27, 73, 101, 0.12);
--shadow-xl: 0 16px 48px rgba(27, 73, 101, 0.16);
--shadow-stella: 0 8px 24px rgba(212, 175, 55, 0.25);  /* Gold glow */
```

### 使用ガイド

- **Hover カード**: `--shadow-md` → `--shadow-lg`
- **Modal / Popover**: `--shadow-xl`
- **Sticky Header**: `--shadow-sm`
- **Stella Badge / Mega CTA**: `--shadow-stella`

### Elevation Layers (z-index)

```
0:    background
10:   sticky header
20:   dropdown / tooltip
30:   modal backdrop
40:   modal
50:   notification / toast
```

### Border Radius Scale

```css
--radius-sm: 3px;   /* 小要素 / inline code */
--radius-md: 6px;   /* button / input / card */
--radius-lg: 8px;   /* large card / data card */
--radius-xl: 12px;  /* modal / hero card */
--radius-full: 9999px;  /* pill button / badge / avatar */
```

---

## §7 Design Do's and Don'ts

### ✅ Do

- **数値で訴求** (中央値 17 vs 90 = 5.3 倍 等)
- **出典明記** (KDD 2024 / 厚労省 / 経産省 等)
- **行動を 1 つに絞る** (ヒーローの CTA は 1 つ)
- **コードサンプルで専門性証明** (教育記事 Tier 2)
- **業界データ提示** (Stella Sub-brand)
- **沼津地名 + 顔写真**で親近感 (代表ページ)
- **「事例 1 号募集中」を透明性として訴求** (実績ゼロを正直に)
- **JSON-LD + Schema.org 完備** (LLMO + SEO)
- **Wikidata Q コード掲載** (AI 検索対応)
- **ProfessionalService + LocalBusiness 複合 type** (LLM 業種分類)
- **llms.txt + llms-full.txt 配信** (AI クローラー対応)
- **Mobile First レスポンシブ**
- **WCAG 2.1 AA 準拠** (コントラスト 4.5:1 / フォーカス可視 / alt 完備)
- **CWV 全指標 GOOD** (LCP ≤ 2.5s / INP ≤ 200ms / CLS ≤ 0.1)

### ❌ Don't

- **「圧倒的」「完全」根拠なき強語** (景表法リスク)
- **個別企業批判** (名誉毀損 / 不正競争防止法)
- **「全国 1 位」「業界 No.1」称号** (景表法 / 第三者認定なし)
- **誇張アニメーション** (UX 阻害)
- **押し売り CTA** (3 つ以上の CTA / ポップアップ多用)
- **株式会社風コーポレート文体** (HARTON は個人事業主)
- **AI 生成感丸出し** (テンプレ羅列 / 画一的)
- **ストックフォト乱用** (リアル写真優先 / 沼津地域写真等)
- **無意味なサイドバー / 装飾** (Linear 風 minimalism)
- **複数フォント混在** (Inter + Noto Sans JP の 1 スタックのみ / Serif 不使用)
- **過剰グラデーション** (Primary グラデは 1 ページ 1 箇所まで)
- **モバイルでの極小タップ領域** (最小 44x44px)

### Stella サブブランド限定 Do

- ✅ Sランク Badge (オプトイン認定企業のみ)
- ✅ 業界中央値ベンチマーク (集計データ / 個別企業名なし)
- ✅ 「審判」立場宣言
- ✅ Gold アクセント強調

### Stella サブブランド限定 Don't

- ❌ 個別企業の低スコア晒し (法的リスク)
- ❌ 競合制作会社の名指しスキャン
- ❌ 「保守費用払って放置」競合顧客横取り訴求
- ❌ 「業界 1 位 HARTON」自称

---

## §8 Responsive Breakpoints

```css
/* Mobile First */
/* Default: < 640px (mobile) */

@media (min-width: 640px) {
  /* sm: tablet portrait */
}

@media (min-width: 768px) {
  /* md: tablet landscape */
}

@media (min-width: 1024px) {
  /* lg: desktop */
}

@media (min-width: 1280px) {
  /* xl: large desktop */
}

@media (min-width: 1536px) {
  /* 2xl: extra large */
}
```

### Breakpoint Behavior

| ブレイクポイント | レイアウト変化 |
|---|---|
| Mobile (< 640px) | 1 column / Hamburger menu / フォント基本 16px |
| Tablet (640-1024px) | 2 column where appropriate / Top nav |
| Desktop (1024px+) | 3-4 column grid / フル機能 |

### Mobile-Specific Rules

- **タップ領域最小 44x44px** (WCAG 2.5.5)
- **本文 16px 以上** (ズーム回避)
- **Sticky CTA bottom** (購入 / 応募 LP のみ)
- **画像 srcset で容量最適化**
- **Hero は 1 行 + Sub 1 行** (3 行以上禁止)

---

## §9 Agent Prompt Guide

### Claude Code (HARTON 開発時) への指示テンプレ

```
HARTON tcharton.com の [ページ名] を実装してください。

【厳守事項】
1. tcharton/DESIGN.md §1-§8 に厳格準拠
2. tcharton/CLAUDE.md の規律遵守
3. HARTON SPEC §8.5.1 5 必須条件達成
4. WCAG 2.1 AA 準拠 (コントラスト 4.5:1)
5. CWV 全 GOOD (LCP ≤ 2.5s / INP ≤ 200ms / CLS ≤ 0.1)
6. JSON-LD: Article + (該当時) FAQPage + HowTo + LocalBusiness
7. ブランド色: Primary #1B4965 / Accent #D4AF37
8. フォント: Inter + Noto Sans JP (本文・見出し共通 / Serif 不使用)
9. 余白: 8px base unit (全マージン 8 の倍数)
10. Mobile First レスポンシブ (sm/md/lg/xl/2xl breakpoints)

【Don't】
- 個別企業批判
- 「圧倒的」「完全」等の根拠なき強語
- 誇張アニメーション / 押し売り
- AI 生成感丸出しのテンプレ羅列

【Do】
- 数値で訴求 + 出典明記
- 行動を 1 つに絞る (CTA 1 つ)
- 沼津地名 + 顔の見える 1 人事業主スタンス
- 業界データ提示 (Stella Sub-brand 該当時)

【出力】
- HTML + Tailwind CSS (既存 dist/output.css 利用)
- インライン script 最小化 (CSP unsafe-inline 回避)
- JSON-LD は <head> 内
- Schema.org 完備
```

### Stella サブセクション (/stella/) 専用追加指示

```
追加厳守:
- Sランク Badge は希望企業のみ (オプトイン)
- 個別企業名公開禁止 (集計データのみ)
- 「審判」立場明確化 (制作会社ではない)
- Gold アクセント (#D4AF37) 強調
- 業界中央値・上位・下位 表示 (集計のみ)
- データ出典: HARTON scanner Phase F (47 都道府県 / 200 市町村 / 10 業種)
- 月次更新明示
```

---

## §10 HARTON 独自項目 (DESIGN.md 標準外)

### LLMO + SEO 必須実装

| 項目 | 必須実装 |
|---|---|
| JSON-LD ProfessionalService + LocalBusiness 複合 type | ✅ |
| Wikidata Q コード (additionalType に URL 配列) | ✅ |
| knowsAbout / areaServed / founder / sameAs | ✅ |
| SpeakableSpecification (音声 LLM) | ✅ |
| FAQPage 自動生成 | ✅ (該当ページ) |
| llms.txt + llms-full.txt | ✅ |
| robots.txt に AI ボット明示許可 | ✅ |
| Open Graph + Twitter Card | ✅ |
| Canonical URL | ✅ |
| Sitemap XML | ✅ |

### セキュリティヘッダー必須

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Content-Security-Policy: default-src 'self'; ... (unsafe-inline 禁止)
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: ... (最小権限)
```

### パフォーマンス必須

| 指標 | 必達 |
|---|---|
| TTFB | ≤ 600ms |
| LCP | ≤ 2.5s |
| INP | ≤ 200ms |
| CLS | ≤ 0.1 |
| 完全読込 | ≤ 1.5s |
| Lighthouse Performance | ≥ 90 |
| Lighthouse Accessibility | 100 |
| Lighthouse SEO | 100 |
| Lighthouse Best Practices | 100 |

### Stella Sub-brand 識別

`/stella/` 配下:
- ヘッダー右上に「Stella」金色リボン
- フッターに「This page belongs to T.C.HARTON Stella Quality Index」表記
- ヒーロー背景は Stella Navy `#0F2840`
- Gold アクセント `#D4AF37` 強調
- 「審判ポジション」明示文言

---

## §11 Validation Checklist (実装後検証)

### 各ページ公開前必須チェック

- [ ] DESIGN.md §1-§10 全項目準拠
- [ ] WCAG 2.1 AA (axe-core / Pa11y で検証)
- [ ] CWV 全 GOOD (PageSpeed Insights)
- [ ] Lighthouse 全カテゴリ 90+ (Best Practices / SEO 100)
- [ ] JSON-LD バリデーション PASS (Google Rich Results Test)
- [ ] Schema.org 構造化データ完備
- [ ] llms.txt + llms-full.txt 反映
- [ ] securityheaders.com A+
- [ ] Mozilla Observatory A+
- [ ] Mobile レスポンシブ (320px-1920px)
- [ ] Cross-browser (Chrome / Edge / Safari / Firefox)
- [ ] ④ scanner.py 実測 (TTFB ≤ 600ms / 致命的 NG 0)
- [ ] HSCEL §3.3 事実確認 (出典明記)
- [ ] ブランド禁止用語 grep 0 件 ("圧倒的" "完全" 等)

---

## §12 Update Policy

- **Major version (vX.0)**: ブランド戦略変更時 (Stella 統合等)
- **Minor version (v1.X)**: 新コンポーネント追加 / 配色調整
- **Patch (v1.0.X)**: 小規模修正

### 改訂時の必須プロセス

1. ① ルートが改訂案起草
2. 代表承認
3. ② tcharton 全ページ影響範囲チェック
4. 改訂版適用 (変更箇所のみ)
5. 全ページ再検証 (§11 チェックリスト)

---

**Version**: 1.0
**Adopted**: 2026-05-12
**License**: Internal HARTON use (将来 awesome-design-md 寄稿視野)
**Maintainer**: T.C.HARTON 大内 達也 + ① ルート (Claude Code)
