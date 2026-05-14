"""Stella サブセクション HARTON 完全統一スクリプト — v1.37 Step 1 redo-2
代表指示: certification/ 完全再現 (内容) + HARTON サイト完全一致 (visual).

処理:
1. 既存 <header>...</header> (certification dark nav) を削除
2. HARTON 標準 header + mobile-menu drawer を注入 (light theme / teal-700)
3. <footer>...</footer> を HARTON 標準 footer に置換 (Stella カラム追加)
4. <link rel="stylesheet" href="/dist/stella.css"> 削除 (dark theme 削除)
5. body class を HARTON 標準に統一: bg-white text-dark-700 font-sans antialiased
6. theme-color: #FFFFFF / color-scheme: light
7. 「stella-mobile-menu」「stellaMenuToggle」等 cert 固有 ID を削除 (HARTON menuToggle に統一)

CSS / カラー / フォント:
- フォント: Inter + Noto Sans JP (既に Phase 1 で統一済)
- 主色: teal-700 (#1B4965)
- 背景: white / dark-50 (zebra)
- ボタン: bg-teal-700 hover:bg-teal-600 text-white px-5 py-3 rounded-md font-medium
"""
import pathlib
import re

BASE = pathlib.Path(r"C:\Users\ohuch\Desktop\HARTON\tcharton\stella")
V = "202605131500"

HARTON_HEADER = '''  <header class="fixed top-0 left-0 right-0 z-40 bg-white/90 nav-blur border-b border-dark-100">
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
        <a href="/stella/" class="text-dark-700 hover:text-teal-700 py-3">Stella</a>
        <a href="/profile/" class="text-dark-700 hover:text-teal-700 py-3">プロフィール</a>
        <a href="/contact/" class="bg-teal-700 hover:bg-teal-600 text-white px-5 py-3 rounded-md font-medium">無料相談</a>
      </div>
      <button id="menuToggle" type="button" class="lg:hidden p-3 -mr-3 text-dark-700" aria-label="メニューを開く" aria-expanded="false" aria-controls="mobile-menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M3 6h18M3 12h18M3 18h18"/>
        </svg>
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
      <a href="/stella/" class="block py-4 px-2 text-lg text-dark-800 hover:text-teal-700 border-b border-dark-100">Stella（品質評価）</a>
      <a href="/faq/" class="block py-4 px-2 text-lg text-dark-800 hover:text-teal-700 border-b border-dark-100">FAQ</a>
      <a href="/profile/" class="block py-4 px-2 text-lg text-dark-800 hover:text-teal-700 border-b border-dark-100">代表プロフィール</a>
      <a href="/about/" class="block py-4 px-2 text-lg text-dark-800 hover:text-teal-700 border-b border-dark-100">会社情報</a>
      <a href="/news/" class="block py-4 px-2 text-lg text-dark-800 hover:text-teal-700 border-b border-dark-100">お知らせ</a>
      <a href="/contact/" class="mt-4 block bg-teal-700 hover:bg-teal-600 text-white text-center px-5 py-4 rounded-md font-medium text-lg">無料相談</a>
    </div>
  </nav>
'''

HARTON_FOOTER = '''  <footer class="bg-dark-900 text-dark-300">
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
          <h3 class="font-display text-sm font-bold text-white uppercase tracking-wider">Stella</h3>
          <ul class="mt-4 space-y-2 text-sm">
            <li><a href="/stella/" class="hover:text-white py-3 inline-block">Stella ハブ</a></li>
            <li><a href="/stella/methodology/" class="hover:text-white py-3 inline-block">評価方法論</a></li>
            <li><a href="/stella/industries/" class="hover:text-white py-3 inline-block">業種別</a></li>
            <li><a href="/stella/regions/" class="hover:text-white py-3 inline-block">地域別</a></li>
          </ul>
        </div>
        <div>
          <h3 class="font-display text-sm font-bold text-white uppercase tracking-wider">事業者情報</h3>
          <ul class="mt-4 space-y-2 text-sm">
            <li><a href="/about/" class="hover:text-white py-3 inline-block">会社情報</a></li>
            <li><a href="/contact/" class="hover:text-white py-3 inline-block">お問い合わせ</a></li>
            <li><a href="/news/" class="hover:text-white py-3 inline-block">お知らせ</a></li>
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
  <script src="/dist/scripts/menu.js?v=''' + V + '''" defer></script>
'''


def transform(path: pathlib.Path):
    """1 ページ HARTON 統一変換"""
    html = path.read_text(encoding="utf-8")
    original = html

    # 1. 旧 <header>...</header> を削除 (certification の dark nav)
    html = re.sub(r'<header[\s\S]*?</header>\s*', '', html, count=1)

    # 2. 旧 <footer>...</footer> を削除
    html = re.sub(r'<footer[\s\S]*?</footer>\s*', '', html, count=1)

    # 3. cert 固有 mobile-menu があれば削除 (#stella-mobile-menu / #header-mobile-menu 等)
    html = re.sub(r'<nav id="(stella-mobile-menu|header-mobile-menu|mobile-menu)"[\s\S]*?</nav>\s*', '', html, count=1)

    # 4. <link rel="stylesheet" href="/dist/stella.css..."> 削除
    html = re.sub(r'<link rel="stylesheet" href="/dist/stella\.css[^"]*">\s*', '', html)

    # 5. body class を HARTON 標準に統一
    html = re.sub(
        r'<body[^>]*class="[^"]*"',
        '<body class="bg-white text-dark-700 font-sans antialiased"',
        html, count=1
    )
    # body 自体 class なし → 追加
    if '<body class=' not in html and '<body>' in html:
        html = html.replace('<body>', '<body class="bg-white text-dark-700 font-sans antialiased">', 1)

    # 6. theme-color → #FFFFFF
    html = re.sub(
        r'<meta name="theme-color" content="[^"]*">',
        '<meta name="theme-color" content="#FFFFFF">',
        html
    )
    # color-scheme → light
    html = re.sub(
        r'<meta name="color-scheme" content="[^"]*">',
        '<meta name="color-scheme" content="light">',
        html
    )

    # 7. HARTON header 注入: <body ...> 直後
    html = re.sub(
        r'(<body[^>]*>\s*)',
        r'\1<a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-teal-700 focus:text-white focus:px-4 focus:py-3 focus:rounded">メインコンテンツへスキップ</a>\n\n'
        + HARTON_HEADER + '\n',
        html, count=1
    )

    # 8. HARTON footer 注入: </body> 直前
    html = html.replace('</body>', HARTON_FOOTER + '</body>', 1)

    # 9. <main> が無い場合は <main id="main"> wrapper 追加 (cert は main を持つ場合あり)
    # 既存 <main を保持

    # 10. 不要な空白行整理
    html = re.sub(r'\n{4,}', '\n\n\n', html)

    if html != original:
        path.write_text(html, encoding="utf-8")
        return True
    return False


def main():
    pages = list(BASE.rglob("index.html"))
    changed = 0
    for p in sorted(pages):
        if transform(p):
            changed += 1
    print(f"Unified {changed} / {len(pages)} pages")


if __name__ == "__main__":
    main()
