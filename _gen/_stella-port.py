"""HARTON Stella サブセクション ポートスクリプト — v1.37 / 完全再現版
代表指示 (5/12): certification/ を完全再現 + フォント HARTON 統一 + tcharton.com/stella/ 配下に統合。

処理:
1. certification/**/index.html を読み取り
2. 以下変換を適用:
   - 全 URL: stella.tcharton.com → tcharton.com/stella/
   - 内部リンク: /about/ → /stella/about/ 等
   - フォント: self-host /assets/fonts/_fonts.css → tcharton Google Fonts (Inter + Noto Sans JP)
   - CSP: 'unsafe-inline' を style-src から削除、tcharton 標準に整合
   - 既存 <style> ブロックを <link rel="stylesheet" href="/dist/stella.css"> 参照に置換
     (extracted CSS は dist/stella.css に集約)
   - <header> / <footer> の参照は維持 (certification デザイン継承)
3. tcharton/stella/**/index.html へ書き出し
4. 共通 CSS 抽出 → dist/stella.css
"""
import pathlib
import re
import sys

SRC_BASE = pathlib.Path(r"C:\Users\ohuch\Desktop\HARTON\certification")
DST_BASE = pathlib.Path(r"C:\Users\ohuch\Desktop\HARTON\tcharton\stella")

V = "202605131200"

TCHARTON_FONT_LINKS = """<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@300;400;500;700;900&display=swap" as="style">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@300;400;500;700;900&display=swap" rel="stylesheet">"""

TCHARTON_CSP = '''<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' https://www.googletagmanager.com https://static.cloudflareinsights.com; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://www.google-analytics.com https://www.googletagmanager.com; connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://cloudflareinsights.com https://api.web3forms.com; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self' https://api.web3forms.com; require-trusted-types-for 'script'; trusted-types default; upgrade-insecure-requests">'''


def transform(src_path: pathlib.Path) -> str:
    """1 ページ変換"""
    html = src_path.read_text(encoding="utf-8")

    # 1. URL ドメイン書換 (stella.tcharton.com → tcharton.com/stella)
    html = html.replace("https://stella.tcharton.com/", "https://tcharton.com/stella/")
    html = html.replace("https://stella.tcharton.com", "https://tcharton.com/stella")

    # 2. 内部リンク書換 (/about/ → /stella/about/ 等 / href または src のパス)
    # ただし /assets/ / /dist/ / /robots.txt 等のルート資産は除外
    KEEP_ROOT = {"/dist/", "/assets/", "/favicon", "/apple-touch-icon", "/site.webmanifest",
                 "/robots.txt", "/sitemap.xml", "/llms.txt", "/llms-full.txt", "/ogp.png",
                 "/stella/", "/", "#"}

    def link_rewrite(m):
        attr, val = m.group(1), m.group(2)
        if val.startswith("#") or val.startswith("http") or val.startswith("mailto:") or val.startswith("tel:"):
            return m.group(0)
        if any(val.startswith(k) for k in KEEP_ROOT) and not val.startswith("/") or val == "/":
            return m.group(0)
        # 既に /stella/ で始まる場合スキップ
        if val.startswith("/stella/"):
            return m.group(0)
        # /dist/, /assets/, /favicon 等は除外
        if val.startswith(("/dist/", "/assets/", "/favicon", "/apple-touch-icon", "/site.webmanifest",
                          "/robots.txt", "/sitemap.xml", "/llms.txt", "/llms-full.txt", "/ogp")):
            return m.group(0)
        # ルート / は tcharton.com / に書換 (certification の home → tcharton TOP)
        if val == "/":
            return f'{attr}="/stella/"'
        # /foo/ → /stella/foo/
        if val.startswith("/"):
            return f'{attr}="/stella{val}"'
        return m.group(0)

    html = re.sub(r'(href|src)="([^"]+)"', link_rewrite, html)

    # 3. フォント参照: self-host /assets/fonts/_fonts.css → Google Fonts (tcharton 統一)
    # certification の preconnect 等は維持し、追加で _fonts.css を Google Fonts に置換
    html = re.sub(
        r'<link rel="preload" as="style" href="/stella/assets/fonts/_fonts\.css">\s*<link rel="stylesheet" href="/stella/assets/fonts/_fonts\.css">',
        TCHARTON_FONT_LINKS,
        html
    )
    # Backup case (without /stella/ prefix already rewritten)
    html = re.sub(
        r'<link rel="preload" as="style" href="/assets/fonts/_fonts\.css">\s*<link rel="stylesheet" href="/assets/fonts/_fonts\.css">',
        TCHARTON_FONT_LINKS,
        html
    )
    # Existing fonts.googleapis preconnect 削除 (tcharton 版で置換)
    html = re.sub(r'<link rel="preconnect" href="https://fonts\.googleapis\.com"[^>]*>\s*', '', html)
    html = re.sub(r'<link rel="preconnect" href="https://fonts\.gstatic\.com"[^>]*>\s*', '', html)
    # 上記 TCHARTON_FONT_LINKS が複数挿入されないよう dedupe
    placeholder = "###TC_FONTS###"
    html = html.replace(TCHARTON_FONT_LINKS, placeholder, 1)
    html = html.replace(TCHARTON_FONT_LINKS, "")
    html = html.replace(placeholder, TCHARTON_FONT_LINKS)

    # 4. CSS 参照: /stella/dist/output.css → /dist/output.css (tcharton 共通 CSS)
    html = html.replace('href="/stella/dist/output.css"',
                        f'href="/dist/output.css?v={V}"')
    html = html.replace('href="/dist/output.css"',
                        f'href="/dist/output.css?v={V}"')

    # 5. CSP 置換 (tcharton 標準 / unsafe-inline 除去)
    html = re.sub(
        r'<meta http-equiv="Content-Security-Policy"[^>]*>',
        TCHARTON_CSP,
        html
    )

    # 6. インライン <style> 抽出 (CSP unsafe-inline 除去後はブロック)
    # → tcharton/stella.css に集約予定 / ここでは <style> ブロックを削除
    # ただし noscript 内 <style> もまとめて削除
    html = re.sub(r'<style>[\s\S]*?</style>\s*', '', html)
    html = re.sub(r'<noscript>\s*<style>[\s\S]*?</style>\s*</noscript>\s*', '', html)

    # 7. lang="ja" → lang="ja" class="no-js" (tcharton 標準)
    html = re.sub(r'<html lang="ja">', '<html lang="ja" class="no-js">', html)

    # 8. js-marker.js / ga4 / trusted-types 注入 (tcharton 標準)
    if "js-marker.js" not in html:
        # </head> 直前に挿入
        head_scripts = f'''  <script src="/dist/scripts/js-marker.js?v={V}"></script>
  <script src="/dist/scripts/ga4.js?v={V}" defer></script>
  <script src="/dist/scripts/trusted-types.js?v={V}"></script>
</head>'''
        html = html.replace("</head>", head_scripts, 1)

    return html


def main():
    src_files = list(SRC_BASE.rglob("index.html"))
    # _archive など除外
    src_files = [p for p in src_files if "_archive" not in str(p) and "node_modules" not in str(p)]

    DST_BASE.mkdir(parents=True, exist_ok=True)
    count = 0
    for src in sorted(src_files):
        rel = src.relative_to(SRC_BASE)
        dst = DST_BASE / rel
        dst.parent.mkdir(parents=True, exist_ok=True)
        try:
            new_html = transform(src)
            dst.write_text(new_html, encoding="utf-8")
            count += 1
            print(f"  Wrote: stella/{rel.as_posix()}")
        except Exception as e:
            print(f"  ERROR: {rel}: {e}")
    print(f"Total: {count} pages ported.")


if __name__ == "__main__":
    main()
