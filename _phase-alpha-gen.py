"""Phase α stub generator — v1.36 Step 1
Generates 13 stub HTML pages (Tier 1 × 5 Problem LP + Tier 2 × 8 教育記事)
with noindex marker until ① 起草 + 代表検証 + ② HTML 化 完遂.
"""
import pathlib

V = "202605120100"
BASE = pathlib.Path(__file__).parent

TIER1 = [
    ("problems/site-speed",         "ホームページが遅い悩み解決",                       "ホームページの表示速度問題（LCP・INP・CLS）を Core Web Vitals に基づき解決する方法。原因 5 要因と改善ステップを完全公開。"),
    ("problems/no-inquiry",         "問合せが来ない悩み解決",                           "WEB サイトに問合せが来ない原因（導線・コピー・信頼）を構造化して解決。コンバージョン率改善の具体ステップ。"),
    ("problems/ai-search-invisible","AI 検索（ChatGPT / Perplexity）に出ない悩み解決", "ChatGPT・Perplexity・Gemini など AI 検索エンジンに引用されない原因と、LLMO / GEO 戦略に基づく解決方法。"),
    ("problems/security-risk",      "WEB サイトのセキュリティ不安を解消",                "OWASP Top 10:2025 ベースで中小企業 WEB サイトのセキュリティ不安を解消。HTTPS / CSP / 改ざん検知の必須実装。"),
    ("problems/no-mobile",          "スマホで見にくい問題を解決",                       "モバイル対応されていない WEB サイトの離脱率を改善。レスポンシブ設計・タッチターゲット 44px・モバイル可読性の必須項目。"),
]
TIER2 = [
    ("insights/core-web-vitals",        "Core Web Vitals 完全解説（LCP / INP / CLS）", "Google が定める Core Web Vitals（LCP / INP / CLS）の意味・測定方法・改善手順を完全解説。"),
    ("insights/json-ld-implementation", "JSON-LD 構造化データ実装ガイド",                "Schema.org JSON-LD の実装ガイド。ProfessionalService / Service / FAQPage / HowTo / BreadcrumbList の正しい書き方。"),
    ("insights/llmo-explained",         "LLMO とは — AI 検索時代の SEO",                "LLMO（Large Language Model Optimization）の意味と実践方法。AI 検索エンジン引用率を高める 9 戦略。"),
    ("insights/wikidata-for-ai",        "Wikidata Q コードを使った AI 検索対策",          "Schema.org additionalType に Wikidata Q コードを設定することで AI 検索エンジンの理解度を高める手法。"),
    ("insights/security-5-principles",  "中小企業 WEB セキュリティ 5 原則",              "HTTPS / HSTS / CSP / SRI / 改ざん検知の 5 原則と中小企業での実装優先順位。"),
    ("insights/eat-improvement",        "E-E-A-T 強化完全ガイド",                       "Google が定める E-E-A-T（経験・専門性・権威性・信頼性）の強化方法。中小企業向け実装ステップ。"),
    ("insights/longtail-seo",           "ロングテール SEO 戦略",                         "競合の少ない 3-5 語キーワードで上位表示を狙うロングテール SEO 戦略。中小企業に最適。"),
    ("insights/search-intent",          "検索意図への回答方法（Problem-Solution 設計）", "検索意図 4 種（Know / Do / Buy / Go）への構造化された回答設計。中小企業 WEB に必須の発想法。"),
]


def render(slug, title, desc, kind):
    url = f"https://tcharton.com/{slug}/"
    crumb_label = "悩み解決 LP" if kind == "problem" else "教育記事"
    crumb_url = "/problems/" if kind == "problem" else "/insights/"
    tag = "Problem" if kind == "problem" else "Insight"
    kind_label = "解決 LP" if kind == "problem" else "教育記事"
    return f"""<!DOCTYPE html>
<html lang="ja" class="no-js">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="/dist/scripts/js-marker.js?v={V}"></script>
  <title>{title}｜T.C.HARTON</title>
  <meta name="description" content="{desc}">
  <meta name="author" content="大内 達也">

  <meta property="og:title" content="{title}｜T.C.HARTON">
  <meta property="og:description" content="{desc}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="{url}">
  <meta property="og:image" content="https://tcharton.com/ogp.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:alt" content="T.C.HARTON サービス紹介 OGP 画像（静岡発の高品質 WEB 制作と AI 予測）">
  <meta property="og:site_name" content="T.C.HARTON">
  <meta property="og:locale" content="ja_JP">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{title}｜T.C.HARTON">
  <meta name="twitter:description" content="{desc}">
  <meta name="twitter:image" content="https://tcharton.com/ogp.png">

  <meta name="theme-color" content="#FFFFFF">
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
  {{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
    {{"@type":"ListItem","position":1,"name":"ホーム","item":"https://tcharton.com/"}},
    {{"@type":"ListItem","position":2,"name":"{crumb_label}","item":"https://tcharton.com{crumb_url}"}},
    {{"@type":"ListItem","position":3,"name":"{title}","item":"{url}"}}
  ]}}
  </script>
  <script type="application/ld+json">
  {{"@context":"https://schema.org","@type":"Article","@id":"{url}#article","headline":"{title}","description":"{desc}","author":{{"@type":"Person","name":"大内 達也","url":"https://tcharton.com/profile/"}},"publisher":{{"@id":"https://tcharton.com/#organization"}},"datePublished":"2026-05-12","dateModified":"2026-05-12","inLanguage":"ja","url":"{url}","mainEntityOfPage":"{url}","image":"https://tcharton.com/ogp.png"}}
  </script>

  <link rel="stylesheet" href="/dist/output.css?v={V}">
  <link rel="dns-prefetch" href="https://www.googletagmanager.com">
  <link rel="dns-prefetch" href="https://www.google-analytics.com">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@300;400;500;700;900&display=swap" as="style">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@300;400;500;700;900&display=swap" rel="stylesheet">

  <script src="/dist/scripts/ga4.js?v={V}" defer></script>
  <script src="/dist/scripts/trusted-types.js?v={V}"></script>
</head>
<body class="bg-white text-dark-700 font-sans antialiased">
  <a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-teal-700 focus:text-white focus:px-4 focus:py-3 focus:rounded">メインコンテンツへスキップ</a>

  <header class="fixed top-0 left-0 right-0 z-40 bg-white/90 nav-blur border-b border-dark-100">
    <nav aria-label="メインナビゲーション" class="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
      <a href="/" class="flex items-center gap-2 text-dark-900 font-display font-bold text-xl py-3" aria-label="T.C.HARTON ホームへ">
        <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
          <rect width="28" height="28" rx="6" fill="#1B4965"/>
          <text x="14" y="20" text-anchor="middle" font-family="Inter, sans-serif" font-weight="800" font-size="14" fill="#fff">T</text>
        </svg>
        <span>T.C.HARTON</span>
      </a>
      <div class="hidden lg:flex items-center gap-7 text-sm" data-nosnippet>
        <a href="/services/web/" class="text-dark-700 hover:text-teal-700 py-3">WEB 制作</a>
        <a href="/services/ai-prediction/" class="text-dark-700 hover:text-teal-700 py-3">AI 予測</a>
        <a href="/pricing/" class="text-dark-700 hover:text-teal-700 py-3">料金</a>
        <a href="/cases/" class="text-dark-700 hover:text-teal-700 py-3">事例</a>
        <a href="/vision/" class="text-dark-700 hover:text-teal-700 py-3">想い</a>
        <a href="/profile/" class="text-dark-700 hover:text-teal-700 py-3">プロフィール</a>
        <a href="/contact/" class="bg-teal-700 hover:bg-teal-600 text-white px-5 py-3 rounded-md font-medium">無料相談</a>
      </div>
      <button id="menuToggle" type="button" class="lg:hidden p-3 -mr-3 text-dark-700" aria-label="メニューを開く" aria-expanded="false" aria-controls="mobile-menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
      </button>
    </nav>
  </header>

  <nav id="mobile-menu" class="mobile-menu fixed inset-0 z-50 bg-white" aria-label="モバイルナビゲーション" role="dialog" aria-modal="true">
    <div class="flex flex-col p-6 gap-2 overflow-y-auto h-full">
      <button id="menuClose" type="button" class="self-end p-3 -mt-2 -mr-2 text-dark-700 hover:text-teal-700" aria-label="メニューを閉じる">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M6 18L18 6"/></svg>
      </button>
      <a href="/services/web/" class="block py-4 px-2 text-lg text-dark-800 hover:text-teal-700 border-b border-dark-100">WEB 制作</a>
      <a href="/services/ai-prediction/" class="block py-4 px-2 text-lg text-dark-800 hover:text-teal-700 border-b border-dark-100">AI 予測</a>
      <a href="/pricing/" class="block py-4 px-2 text-lg text-dark-800 hover:text-teal-700 border-b border-dark-100">料金</a>
      <a href="/cases/" class="block py-4 px-2 text-lg text-dark-800 hover:text-teal-700 border-b border-dark-100">導入事例</a>
      <a href="/vision/" class="block py-4 px-2 text-lg text-dark-800 hover:text-teal-700 border-b border-dark-100">私たちの想い</a>
      <a href="/profile/" class="block py-4 px-2 text-lg text-dark-800 hover:text-teal-700 border-b border-dark-100">代表プロフィール</a>
      <a href="/contact/" class="mt-4 block bg-teal-700 hover:bg-teal-600 text-white text-center px-5 py-4 rounded-md font-medium text-lg">無料相談</a>
    </div>
  </nav>

  <main id="main">
    <nav aria-label="パンくずリスト" class="max-w-3xl mx-auto px-4 lg:px-8 pt-20 pb-2 text-sm text-dark-500">
      <ol class="flex items-center gap-2 flex-wrap">
        <li><a href="/" class="hover:text-teal-700 py-3 inline-block">ホーム</a></li>
        <li aria-hidden="true">/</li>
        <li><a href="{crumb_url}" class="hover:text-teal-700 py-3 inline-block">{crumb_label}</a></li>
        <li aria-hidden="true">/</li>
        <li><span aria-current="page" class="text-dark-700">{title}</span></li>
      </ol>
    </nav>

    <article class="max-w-3xl mx-auto px-4 lg:px-8 py-12 lg:py-16 hero-content">
      <header>
        <p class="text-sm text-teal-700 font-display font-bold tracking-widest uppercase">{tag}</p>
        <h1 class="mt-3 font-display text-3xl lg:text-5xl font-extrabold text-dark-900 leading-tight tracking-tight">{title}</h1>
        <p class="mt-6 text-base sm:text-lg text-dark-700 leading-relaxed business-description">{desc}</p>
        <p class="mt-4 text-xs text-dark-500">
          <time datetime="2026-05-12">2026 年 5 月 12 日</time>
          <span class="mx-2" aria-hidden="true">/</span>
          <time datetime="2026-05-12">最終更新 2026 年 5 月 12 日</time>
        </p>
      </header>

      <div class="mt-10 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-6">
        <p class="text-sm text-amber-900"><strong>📝 Phase α 構造実装中</strong>：本記事は ① ルートで起草中です。公開準備が整い次第、本文・図解・FAQ を順次反映します（Phase α 期限 2026-05-26）。</p>
      </div>

      <section aria-label="近日公開" class="mt-12 text-dark-700 leading-relaxed text-base lg:text-lg space-y-4">
        <p>本記事は <strong class="text-dark-900">{title}</strong> をテーマに、原因分析・解決ステップ・実例・FAQ を体系的にまとめた{kind_label}です。</p>
        <p>公開準備中です。まずは <a href="/recruit/" class="text-teal-700 underline hover:text-teal-500">制作実績キャンペーン</a> または <a href="/contact/" class="text-teal-700 underline hover:text-teal-500">お問い合わせフォーム</a> から、貴社の WEB サイトの現状についてご相談ください。</p>
      </section>

      <section aria-label="CTA" class="mt-12 bg-teal-50 border-y border-teal-100 rounded-xl p-8 text-center">
        <p class="text-teal-700 font-display font-bold text-xs lg:text-sm tracking-widest uppercase">Recruitment</p>
        <h2 class="mt-3 font-display text-xl lg:text-2xl font-bold text-dark-900">10 業種 × 各 1 社限定 / 無料 WEB 構築</h2>
        <p class="mt-3 text-dark-700 text-sm">全国の中小企業様向け制作実績キャンペーン。応募ガイド PDF + 5 点セットご提出で応募成立。</p>
        <a href="/recruit/" class="mt-6 inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-600 text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg">
          <span>キャンペーン詳細</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
        </a>
      </section>
    </article>
  </main>

  <footer class="bg-dark-900 text-dark-300">
    <div class="max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-16">
      <nav aria-label="フッターナビゲーション" class="grid grid-cols-2 md:grid-cols-4 gap-8" data-nosnippet>
        <div>
          <h3 class="font-display text-sm font-bold text-white uppercase tracking-wider">サービス</h3>
          <ul class="mt-4 space-y-2 text-sm">
            <li><a href="/services/web/" class="hover:text-white py-3 inline-block">WEB 制作</a></li>
            <li><a href="/services/ai-prediction/" class="hover:text-white py-3 inline-block">AI 予測</a></li>
          </ul>
        </div>
        <div>
          <h3 class="font-display text-sm font-bold text-white uppercase tracking-wider">信頼形成</h3>
          <ul class="mt-4 space-y-2 text-sm">
            <li><a href="/pricing/" class="hover:text-white py-3 inline-block">料金</a></li>
            <li><a href="/cases/" class="hover:text-white py-3 inline-block">導入事例</a></li>
            <li><a href="/faq/" class="hover:text-white py-3 inline-block">FAQ</a></li>
            <li><a href="/profile/" class="hover:text-white py-3 inline-block">代表プロフィール</a></li>
          </ul>
        </div>
        <div>
          <h3 class="font-display text-sm font-bold text-white uppercase tracking-wider">事業者情報</h3>
          <ul class="mt-4 space-y-2 text-sm">
            <li><a href="/about/" class="hover:text-white py-3 inline-block">会社情報</a></li>
            <li><a href="/contact/" class="hover:text-white py-3 inline-block">お問い合わせ</a></li>
            <li><a href="/news/" class="hover:text-white py-3 inline-block">お知らせ</a></li>
          </ul>
        </div>
        <div>
          <h3 class="font-display text-sm font-bold text-white uppercase tracking-wider">法令</h3>
          <ul class="mt-4 space-y-2 text-sm">
            <li><a href="/legal/" class="hover:text-white py-3 inline-block">特定商取引法表記</a></li>
            <li><a href="/privacy/" class="hover:text-white py-3 inline-block">プライバシーポリシー</a></li>
          </ul>
        </div>
      </nav>
      <div class="mt-12 pt-8 border-t border-dark-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-sm">
        <p data-nosnippet class="flex items-center gap-3 flex-wrap"><span>© 2026 T.C.HARTON. All rights reserved.</span><span aria-hidden="true" class="text-dark-600">·</span><a href="https://note.com/harton_official" target="_blank" rel="noopener noreferrer" class="hover:text-white py-3 inline-block">note で日々の発信 <span aria-hidden="true">↗</span></a></p>
        <p class="text-dark-500" data-nosnippet>静岡県沼津市大岡2690 / 代表 大内 達也</p>
      </div>
    </div>
  </footer>
  <script src="/dist/scripts/menu.js?v={V}" defer></script>
</body>
</html>
"""


def render_hub(kind):
    if kind == "problem":
        url = "https://tcharton.com/problems/"
        title = "悩み解決 LP 一覧"
        desc = "WEB サイトでよくある悩み（速度・問合せ・AI 検索・セキュリティ・モバイル）を解決する LP 集。"
        items = TIER1
        tag = "Problem LP"
        slug = "problems"
    else:
        url = "https://tcharton.com/insights/"
        title = "教育記事一覧"
        desc = "Core Web Vitals / JSON-LD / LLMO / セキュリティ / E-E-A-T など WEB 制作の専門知識記事集。"
        items = TIER2
        tag = "Insights"
        slug = "insights"

    list_html = "\n".join(
        f'            <li class="bg-white border border-dark-100 rounded-xl p-5 hover:border-teal-500 transition-colors">\n'
        f'              <a href="/{s}/" class="block group">\n'
        f'                <h2 class="font-display font-bold text-lg text-dark-900 group-hover:text-teal-700">{t}</h2>\n'
        f'                <p class="mt-2 text-sm text-dark-600">{d}</p>\n'
        f'                <span class="mt-3 inline-block text-xs text-teal-700 group-hover:underline">記事を読む →</span>\n'
        f'              </a>\n'
        f'            </li>'
        for s, t, d in items
    )

    return f"""<!DOCTYPE html>
<html lang="ja" class="no-js">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="/dist/scripts/js-marker.js?v={V}"></script>
  <title>{title}｜T.C.HARTON</title>
  <meta name="description" content="{desc}">
  <meta name="author" content="大内 達也">

  <meta property="og:title" content="{title}｜T.C.HARTON">
  <meta property="og:description" content="{desc}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="{url}">
  <meta property="og:image" content="https://tcharton.com/ogp.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:alt" content="T.C.HARTON サービス紹介 OGP 画像（静岡発の高品質 WEB 制作と AI 予測）">
  <meta property="og:site_name" content="T.C.HARTON">
  <meta property="og:locale" content="ja_JP">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{title}｜T.C.HARTON">
  <meta name="twitter:description" content="{desc}">
  <meta name="twitter:image" content="https://tcharton.com/ogp.png">

  <meta name="theme-color" content="#FFFFFF">
  <meta name="color-scheme" content="light">
  <meta name="robots" content="noindex, follow">

  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' https://www.googletagmanager.com https://static.cloudflareinsights.com; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://www.google-analytics.com https://www.googletagmanager.com; connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://cloudflareinsights.com; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self' https://api.web3forms.com; require-trusted-types-for 'script'; trusted-types default; upgrade-insecure-requests">

  <link rel="canonical" href="{url}">
  <link rel="sitemap" type="application/xml" href="/sitemap.xml">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">

  <script type="application/ld+json">
  {{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
    {{"@type":"ListItem","position":1,"name":"ホーム","item":"https://tcharton.com/"}},
    {{"@type":"ListItem","position":2,"name":"{title}","item":"{url}"}}
  ]}}
  </script>
  <script type="application/ld+json">
  {{"@context":"https://schema.org","@type":"CollectionPage","@id":"{url}#collection","name":"{title}","description":"{desc}","url":"{url}","inLanguage":"ja","publisher":{{"@id":"https://tcharton.com/#organization"}}}}
  </script>

  <link rel="stylesheet" href="/dist/output.css?v={V}">
  <link rel="dns-prefetch" href="https://www.googletagmanager.com">
  <link rel="dns-prefetch" href="https://www.google-analytics.com">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@300;400;500;700;900&display=swap" as="style">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@300;400;500;700;900&display=swap" rel="stylesheet">

  <script src="/dist/scripts/ga4.js?v={V}" defer></script>
  <script src="/dist/scripts/trusted-types.js?v={V}"></script>
</head>
<body class="bg-white text-dark-700 font-sans antialiased">
  <a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-teal-700 focus:text-white focus:px-4 focus:py-3 focus:rounded">メインコンテンツへスキップ</a>

  <header class="fixed top-0 left-0 right-0 z-40 bg-white/90 nav-blur border-b border-dark-100">
    <nav aria-label="メインナビゲーション" class="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
      <a href="/" class="flex items-center gap-2 text-dark-900 font-display font-bold text-xl py-3" aria-label="T.C.HARTON ホームへ">
        <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
          <rect width="28" height="28" rx="6" fill="#1B4965"/>
          <text x="14" y="20" text-anchor="middle" font-family="Inter, sans-serif" font-weight="800" font-size="14" fill="#fff">T</text>
        </svg>
        <span>T.C.HARTON</span>
      </a>
      <div class="hidden lg:flex items-center gap-7 text-sm" data-nosnippet>
        <a href="/services/web/" class="text-dark-700 hover:text-teal-700 py-3">WEB 制作</a>
        <a href="/services/ai-prediction/" class="text-dark-700 hover:text-teal-700 py-3">AI 予測</a>
        <a href="/pricing/" class="text-dark-700 hover:text-teal-700 py-3">料金</a>
        <a href="/cases/" class="text-dark-700 hover:text-teal-700 py-3">事例</a>
        <a href="/vision/" class="text-dark-700 hover:text-teal-700 py-3">想い</a>
        <a href="/profile/" class="text-dark-700 hover:text-teal-700 py-3">プロフィール</a>
        <a href="/contact/" class="bg-teal-700 hover:bg-teal-600 text-white px-5 py-3 rounded-md font-medium">無料相談</a>
      </div>
      <button id="menuToggle" type="button" class="lg:hidden p-3 -mr-3 text-dark-700" aria-label="メニューを開く" aria-expanded="false" aria-controls="mobile-menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
      </button>
    </nav>
  </header>

  <nav id="mobile-menu" class="mobile-menu fixed inset-0 z-50 bg-white" aria-label="モバイルナビゲーション" role="dialog" aria-modal="true">
    <div class="flex flex-col p-6 gap-2 overflow-y-auto h-full">
      <button id="menuClose" type="button" class="self-end p-3 -mt-2 -mr-2 text-dark-700 hover:text-teal-700" aria-label="メニューを閉じる">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M6 18L18 6"/></svg>
      </button>
      <a href="/services/web/" class="block py-4 px-2 text-lg text-dark-800 hover:text-teal-700 border-b border-dark-100">WEB 制作</a>
      <a href="/services/ai-prediction/" class="block py-4 px-2 text-lg text-dark-800 hover:text-teal-700 border-b border-dark-100">AI 予測</a>
      <a href="/pricing/" class="block py-4 px-2 text-lg text-dark-800 hover:text-teal-700 border-b border-dark-100">料金</a>
      <a href="/cases/" class="block py-4 px-2 text-lg text-dark-800 hover:text-teal-700 border-b border-dark-100">導入事例</a>
      <a href="/vision/" class="block py-4 px-2 text-lg text-dark-800 hover:text-teal-700 border-b border-dark-100">私たちの想い</a>
      <a href="/profile/" class="block py-4 px-2 text-lg text-dark-800 hover:text-teal-700 border-b border-dark-100">代表プロフィール</a>
      <a href="/contact/" class="mt-4 block bg-teal-700 hover:bg-teal-600 text-white text-center px-5 py-4 rounded-md font-medium text-lg">無料相談</a>
    </div>
  </nav>

  <main id="main">
    <nav aria-label="パンくずリスト" class="max-w-5xl mx-auto px-4 lg:px-8 pt-20 pb-2 text-sm text-dark-500">
      <ol class="flex items-center gap-2 flex-wrap">
        <li><a href="/" class="hover:text-teal-700 py-3 inline-block">ホーム</a></li>
        <li aria-hidden="true">/</li>
        <li><span aria-current="page" class="text-dark-700">{title}</span></li>
      </ol>
    </nav>

    <article class="max-w-5xl mx-auto px-4 lg:px-8 py-12 lg:py-16 hero-content">
      <header>
        <p class="text-sm text-teal-700 font-display font-bold tracking-widest uppercase">{tag}</p>
        <h1 class="mt-3 font-display text-3xl lg:text-5xl font-extrabold text-dark-900 leading-tight tracking-tight">{title}</h1>
        <p class="mt-6 text-base sm:text-lg text-dark-700 leading-relaxed business-description max-w-3xl">{desc}</p>
      </header>

      <div class="mt-10 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-6 max-w-3xl">
        <p class="text-sm text-amber-900"><strong>📝 Phase α 構造実装中</strong>：各記事は ① ルートで起草中です。公開準備が整い次第、本文・図解・FAQ を順次反映します（Phase α 期限 2026-05-26）。</p>
      </div>

      <section aria-label="記事一覧" class="mt-12">
        <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
{list_html}
        </ul>
      </section>
    </article>
  </main>

  <footer class="bg-dark-900 text-dark-300">
    <div class="max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-16">
      <nav aria-label="フッターナビゲーション" class="grid grid-cols-2 md:grid-cols-4 gap-8" data-nosnippet>
        <div>
          <h3 class="font-display text-sm font-bold text-white uppercase tracking-wider">サービス</h3>
          <ul class="mt-4 space-y-2 text-sm">
            <li><a href="/services/web/" class="hover:text-white py-3 inline-block">WEB 制作</a></li>
            <li><a href="/services/ai-prediction/" class="hover:text-white py-3 inline-block">AI 予測</a></li>
          </ul>
        </div>
        <div>
          <h3 class="font-display text-sm font-bold text-white uppercase tracking-wider">信頼形成</h3>
          <ul class="mt-4 space-y-2 text-sm">
            <li><a href="/pricing/" class="hover:text-white py-3 inline-block">料金</a></li>
            <li><a href="/cases/" class="hover:text-white py-3 inline-block">導入事例</a></li>
            <li><a href="/faq/" class="hover:text-white py-3 inline-block">FAQ</a></li>
            <li><a href="/profile/" class="hover:text-white py-3 inline-block">代表プロフィール</a></li>
          </ul>
        </div>
        <div>
          <h3 class="font-display text-sm font-bold text-white uppercase tracking-wider">事業者情報</h3>
          <ul class="mt-4 space-y-2 text-sm">
            <li><a href="/about/" class="hover:text-white py-3 inline-block">会社情報</a></li>
            <li><a href="/contact/" class="hover:text-white py-3 inline-block">お問い合わせ</a></li>
            <li><a href="/news/" class="hover:text-white py-3 inline-block">お知らせ</a></li>
          </ul>
        </div>
        <div>
          <h3 class="font-display text-sm font-bold text-white uppercase tracking-wider">法令</h3>
          <ul class="mt-4 space-y-2 text-sm">
            <li><a href="/legal/" class="hover:text-white py-3 inline-block">特定商取引法表記</a></li>
            <li><a href="/privacy/" class="hover:text-white py-3 inline-block">プライバシーポリシー</a></li>
          </ul>
        </div>
      </nav>
      <div class="mt-12 pt-8 border-t border-dark-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-sm">
        <p data-nosnippet class="flex items-center gap-3 flex-wrap"><span>© 2026 T.C.HARTON. All rights reserved.</span><span aria-hidden="true" class="text-dark-600">·</span><a href="https://note.com/harton_official" target="_blank" rel="noopener noreferrer" class="hover:text-white py-3 inline-block">note で日々の発信 <span aria-hidden="true">↗</span></a></p>
        <p class="text-dark-500" data-nosnippet>静岡県沼津市大岡2690 / 代表 大内 達也</p>
      </div>
    </div>
  </footer>
  <script src="/dist/scripts/menu.js?v={V}" defer></script>
</body>
</html>
"""


def main():
    count = 0
    for slug, title, desc in TIER1:
        out = BASE / slug / "index.html"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(render(slug, title, desc, "problem"), encoding="utf-8")
        count += 1
    for slug, title, desc in TIER2:
        out = BASE / slug / "index.html"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(render(slug, title, desc, "insight"), encoding="utf-8")
        count += 1
    # Hub pages
    (BASE / "problems" / "index.html").write_text(render_hub("problem"), encoding="utf-8")
    (BASE / "insights" / "index.html").write_text(render_hub("insight"), encoding="utf-8")
    count += 2
    print(f"Generated {count} pages (13 stubs + 2 hubs)")


if __name__ == "__main__":
    main()
