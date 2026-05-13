"""Stella サブセクション stub generator — v1.37 Step 1
/stella/ 配下 5 ページの stub HTML を生成 (noindex)。
内容は Step 2-4 で ① 起草 → 代表検証 → ② HTML 化。

DESIGN.md §10 Stella Sub-brand 識別 準拠:
- ヒーロー: Stella Navy (#0F2840) 背景
- Sランク Badge: Gold gradient (#F5E5A8 → #D4AF37)
- 「Stella」ribbon (右上 fixed)
- 帰属表記 (footer)
"""
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).parent))
from _components import V, breadcrumb, FONT_PRELOAD_URL  # noqa: E402

BASE = pathlib.Path(__file__).parent.parent

# Stella 5 ページ (v1.37 §Phase α §Stella)
STELLA = [
    {
        "slug": "stella",
        "title": "HARTON Stella ─ WEB 品質の審判ポジション",
        "desc":  "HARTON Stella は WEB 品質の独立評価機関。scanner 機械検証で全国 1,553 社の WEB サイトを評価し、業界中央値と上位水準を集計データとして公開。Sランク Badge オプトイン認定運用。",
        "h1":    "WEB 品質の、審判ポジション。",
        "lead":  "HARTON Stella は、scanner 独自基準で WEB サイト品質を機械検証する評価機関です。制作会社ではなく、業界中央値と上位水準を集計データとして公開する「審判」の立場を取ります。",
        "crumb_path": [("ホーム", "https://tcharton.com/"), ("Stella", None)],
    },
    {
        "slug": "stella/methodology",
        "title": "評価方法論 ─ 4 軸機械検証 / Sクラス必須 5 条件",
        "desc":  "HARTON Stella の 4 軸機械検証（技術 / セキュリティ / AI 検索適応 / 経営インパクト）と、Sクラス認定の必須 5 条件を完全公開。透明性・客観性・公平性の評価 5 原則。",
        "h1":    "評価方法論",
        "lead":  "HARTON Stella の評価は 4 軸機械検証と Sクラス必須 5 条件で構成されます。全項目と閾値を公開し、ブラックボックス認定を否定します。",
        "crumb_path": [("ホーム", "https://tcharton.com/"), ("Stella", "https://tcharton.com/stella/"), ("評価方法論", None)],
    },
    {
        "slug": "stella/ranking",
        "title": "業界中央値ランキング ─ 集計データ公開",
        "desc":  "全国 1,553 社の WEB サイト品質を業種別 / 地域別に集計。中央値・上位水準・致命的 NG 発生率を公開。個別企業名は掲載しません。",
        "h1":    "業界中央値ランキング",
        "lead":  "全国 1,553 社の WEB サイト品質を業種別・地域別に機械検証し、中央値と上位水準を集計データとして公開します。個別企業名は出しません（法的リスク回避）。",
        "crumb_path": [("ホーム", "https://tcharton.com/"), ("Stella", "https://tcharton.com/stella/"), ("業界中央値ランキング", None)],
    },
    {
        "slug": "stella/badge",
        "title": "Sランク Badge ─ オプトイン認定制",
        "desc":  "scanner 機械検証で Sランク水準（90 点超）を達成された事業者様は、オプトインで Sランク Badge を WEB サイトに掲載できます。事後同意・無料・即時取り下げ可。",
        "h1":    "Sランク Badge",
        "lead":  "Sランク水準（90 点超）を達成された事業者様向けの認定 Badge。オプトイン制で、事後同意のみ掲載します。",
        "crumb_path": [("ホーム", "https://tcharton.com/"), ("Stella", "https://tcharton.com/stella/"), ("Sランク Badge", None)],
    },
    {
        "slug": "stella/diagnose",
        "title": "無料診断 ─ 貴社サイトの品質を機械検証",
        "desc":  "貴社 WEB サイトを HARTON Stella scanner で機械検証し、4 軸スコア + 業界中央値との比較を無料でお送りします。診断結果は公開せず、貴社内のみご活用ください。",
        "h1":    "無料診断",
        "lead":  "貴社 WEB サイトを scanner で機械検証し、4 軸スコアと業界中央値との比較を無料で診断レポートにてお送りします。",
        "crumb_path": [("ホーム", "https://tcharton.com/"), ("Stella", "https://tcharton.com/stella/"), ("無料診断", None)],
    },
]


def render(p):
    url = f"https://tcharton.com/{p['slug']}/"
    crumb = breadcrumb(p["crumb_path"])
    return f"""<!DOCTYPE html>
<html lang="ja" class="no-js">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="/dist/scripts/js-marker.js?v={V}"></script>
  <title>{p['title']}｜T.C.HARTON</title>
  <meta name="description" content="{p['desc']}">
  <meta name="author" content="大内 達也">

  <meta property="og:title" content="{p['title']}｜T.C.HARTON">
  <meta property="og:description" content="{p['desc']}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="{url}">
  <meta property="og:image" content="https://tcharton.com/ogp.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:alt" content="HARTON Stella ─ WEB 品質の審判ポジション">
  <meta property="og:site_name" content="HARTON Stella">
  <meta property="og:locale" content="ja_JP">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{p['title']}｜T.C.HARTON">
  <meta name="twitter:description" content="{p['desc']}">
  <meta name="twitter:image" content="https://tcharton.com/ogp.png">

  <meta name="theme-color" content="#0F2840">
  <meta name="color-scheme" content="light">
  <!-- Phase α stub: ① 起草中 / 公開前 -->
  <meta name="robots" content="noindex, nofollow">

  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' https://www.googletagmanager.com https://static.cloudflareinsights.com; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://www.google-analytics.com https://www.googletagmanager.com; connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://cloudflareinsights.com; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self' https://api.web3forms.com; require-trusted-types-for 'script'; trusted-types default; upgrade-insecure-requests">

  <link rel="canonical" href="{url}">
  <link rel="sitemap" type="application/xml" href="/sitemap.xml">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">

  <script type="application/ld+json">
  {{"@context":"https://schema.org","@type":"WebSite","name":"HARTON Stella","url":"https://tcharton.com/stella/","inLanguage":"ja","isPartOf":{{"@id":"https://tcharton.com/#organization"}}}}
  </script>
  <script type="application/ld+json">
  {crumb}
  </script>

  <link rel="stylesheet" href="/dist/output.css?v={V}">
  <link rel="dns-prefetch" href="https://www.googletagmanager.com">
  <link rel="dns-prefetch" href="https://www.google-analytics.com">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" href="{FONT_PRELOAD_URL}" as="style">
  <link href="{FONT_PRELOAD_URL}" rel="stylesheet">

  <script src="/dist/scripts/ga4.js?v={V}" defer></script>
  <script src="/dist/scripts/trusted-types.js?v={V}"></script>
</head>
<body class="bg-white text-dark-700 font-sans antialiased">
  <a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-teal-700 focus:text-white focus:px-4 focus:py-3 focus:rounded">メインコンテンツへスキップ</a>

  <!-- Stella リボン (DESIGN.md §10 識別) -->
  <span class="stella-ribbon" aria-label="HARTON Stella 認定サブセクション">★ Stella</span>

  <!-- /stella/ 専用ヘッダー (DESIGN.md §10) -->
  <header class="bg-stella-navy text-white border-b border-gold-500/30">
    <nav aria-label="Stella ナビゲーション" class="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
      <a href="/stella/" class="flex items-center gap-2 font-display font-bold text-xl text-white" aria-label="HARTON Stella ホーム">
        <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
          <rect width="28" height="28" rx="6" fill="#D4AF37"/>
          <text x="14" y="20" text-anchor="middle" font-family="'Noto Serif JP', serif" font-weight="700" font-size="14" fill="#0F2840">★</text>
        </svg>
        <span>HARTON Stella</span>
      </a>
      <div class="hidden lg:flex items-center gap-7 text-sm">
        <a href="/stella/methodology/" class="text-white/80 hover:text-gold-500">評価方法論</a>
        <a href="/stella/ranking/" class="text-white/80 hover:text-gold-500">業界中央値</a>
        <a href="/stella/badge/" class="text-white/80 hover:text-gold-500">Sランク Badge</a>
        <a href="/stella/diagnose/" class="bg-gold-500 hover:bg-gold-600 text-stella-navy px-5 py-2 rounded-md font-bold">無料診断</a>
      </div>
      <a href="/" class="text-xs text-white/60 hover:text-white">← tcharton.com</a>
    </nav>
  </header>

  <main id="main">
    <nav aria-label="パンくずリスト" class="max-w-7xl mx-auto px-4 lg:px-8 pt-6 pb-2 text-sm text-dark-500">
      <ol class="flex items-center gap-2 flex-wrap">
        <li><a href="/" class="hover:text-teal-700 py-3 inline-block">ホーム</a></li>
        <li aria-hidden="true">/</li>
        <li><a href="/stella/" class="hover:text-teal-700 py-3 inline-block">Stella</a></li>
        {f'<li aria-hidden="true">/</li><li><span aria-current="page" class="text-dark-700">{p["crumb_path"][-1][0]}</span></li>' if len(p["crumb_path"]) > 2 else ''}
      </ol>
    </nav>

    <article>
      <header class="stella-hero">
        <div class="max-w-5xl mx-auto px-4 lg:px-8 py-20 lg:py-32">
          <p class="text-gold-500 font-display font-bold text-sm tracking-widest uppercase">HARTON Stella</p>
          <h1 class="mt-4 font-display text-3xl sm:text-4xl lg:text-6xl font-extrabold leading-tight">{p['h1']}</h1>
          <p class="mt-6 text-base sm:text-lg lg:text-xl text-white/85 leading-relaxed max-w-3xl">{p['lead']}</p>
          <p class="mt-8 inline-block bg-gold-500/10 border border-gold-500/40 text-gold-300 text-xs font-bold px-3 py-1 rounded-full">
            ⚙ Phase α stub — 本ページは ① 起草中（公開前）
          </p>
        </div>
      </header>

      <section aria-label="準備中" class="max-w-3xl mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <div class="callout-info">
          <p class="text-dark-800 leading-relaxed">本ページは v1.37 Phase α Step 1 で配置された <strong>stub</strong> です。本文（評価方法・データ集計・申請フォーム等）は Step 2-4 で順次実装予定です。</p>
        </div>
        <p class="mt-6 text-sm text-dark-600">
          公開予定: 2026 年 6 月 9 日（v1.37 §期限）/ 全 18 ページ §11 Validation 完遂後。
        </p>
        <div class="mt-10">
          <a href="/" class="btn-secondary">← tcharton.com に戻る</a>
        </div>
      </section>
    </article>
  </main>

  <footer class="bg-stella-navy-dark text-white/60 border-t border-gold-500/20">
    <div class="max-w-7xl mx-auto px-4 lg:px-8 py-10 text-sm">
      <p class="font-display font-bold text-gold-500">HARTON Stella ─ WEB 品質評価機関</p>
      <p class="mt-2">移住者の眼で、地域の真価を測る。<br>
      scanner 機械検証による集計データのみ公開。個別企業名は掲載しません。</p>
      <p class="mt-6 text-xs text-white/40">
        This page belongs to T.C.HARTON Stella Quality Index ─ a subsection of <a href="/" class="underline hover:text-gold-500">tcharton.com</a>.
        © 2026 T.C.HARTON. All rights reserved.
      </p>
    </div>
  </footer>

  <script src="/dist/scripts/menu.js?v={V}" defer></script>
</body>
</html>
"""


def main():
    for p in STELLA:
        out = BASE / p["slug"] / "index.html"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(render(p), encoding="utf-8")
        print(f"  Wrote: {out.relative_to(BASE)}")
    print(f"Done. {len(STELLA)} stub pages generated.")


if __name__ == "__main__":
    main()
