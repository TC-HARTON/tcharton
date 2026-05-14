"""HARTON 本体 全ページ クローム統一 v2 — ファイルシステム駆動（ハードコード廃止）

代表 5/14 指摘: ハードコード 15 ページリストが諸悪の根源。services/insights サブ/
problems サブ/404/thanks が対象外になっていた。

本スクリプトは PAGES をハードコードしない。`Path.rglob('*.html')` で全列挙し、
node_modules / _gen / dist / stella/ / google 認証ファイルのみ除外する。
正典ヘッダー/フッター/モバイルメニューは tcharton/index.html から実行時に抽出する
（定数のコピペもしない = ドリフト不能）。

冪等: 既に統一済みのページは無変更。
"""
import pathlib
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")
BASE = pathlib.Path(r"C:\Users\ohuch\Desktop\HARTON\tcharton")

# --- 正典ブロックを index.html から実行時抽出 ---
SRC = (BASE / "index.html").read_text(encoding="utf-8")
HEADER = re.search(r'  <header class="fixed[\s\S]*?  </header>', SRC).group(0)
MOBILE = re.search(r'  <nav id="mobile-menu"[\s\S]*?  </nav>', SRC).group(0)
FOOTER = re.search(r'  <footer class="bg-dark-900[\s\S]*?  </footer>', SRC).group(0)
MENUJS = '  <script src="/dist/scripts/menu.js?v=202605141500" defer></script>'

# --- 対象列挙: 全 *.html からシステム的に除外のみ ---
EXCLUDE_DIRS = ("node_modules", "_gen", "dist")
def is_target(p: pathlib.Path) -> bool:
    parts = p.parts
    if any(d in parts for d in EXCLUDE_DIRS):
        return False
    if "stella" in parts:                      # Stella は別スクリプトで統一済み
        return False
    if p.name.startswith("googleb"):           # Google 認証トークンファイル
        return False
    return True

ALL_HTML = sorted(q for q in BASE.rglob("*.html") if is_target(q))


def transform(p: pathlib.Path) -> bool:
    html = p.read_text(encoding="utf-8")
    orig = html

    # 1. サイトヘッダー（最初の <header>...</header>）を正典に
    if re.search(r'  ?<header[\s\S]*?</header>', html):
        html = re.sub(r'  ?<header[\s\S]*?</header>', HEADER, html, count=1)

    # 2. モバイルメニュー: あれば置換 / 無ければ </header> 直後に挿入
    if '<nav id="mobile-menu"' in html:
        html = re.sub(r'  ?<nav id="mobile-menu"[\s\S]*?</nav>', MOBILE, html, count=1)
    else:
        html = html.replace('</header>', '</header>\n\n' + MOBILE, 1)

    # 3. サイトフッター（最後の <footer>...</footer>）+ 後続 menu.js を正典に
    if re.search(r'  ?<footer[\s\S]*?</footer>', html):
        html = re.sub(
            r'  ?<footer[\s\S]*?</footer>(\s*<script src="/dist/scripts/menu\.js[^>]*>\s*</script>)?',
            FOOTER + '\n' + MENUJS,
            html, count=1
        )

    # 4. <main id="main"> に pt-16 付与（冪等）
    def add_pt16(m):
        cls = m.group(1)
        return m.group(0) if 'pt-16' in cls else f'<main id="main" class="pt-16 {cls}">'
    html = re.sub(r'<main id="main" class="((?:(?!pt-16)[^"])*)">', add_pt16, html, count=1)
    html = re.sub(r'<main id="main">', '<main id="main" class="pt-16">', html, count=1)

    # 5. output.css バージョン統一
    html = re.sub(r'output\.css\?v=[0-9]+', 'output.css?v=202605141500', html)

    if html != orig:
        p.write_text(html, encoding="utf-8")
        return True
    return False


def main():
    print(f"対象 HTML（ファイルシステム全列挙 / 除外: node_modules,_gen,dist,stella,google）: {len(ALL_HTML)} 件")
    changed = 0
    for p in ALL_HTML:
        rel = p.relative_to(BASE).as_posix()
        if transform(p):
            changed += 1
            print(f"  OK        {rel}")
        else:
            print(f"  no-change {rel}")
    print(f"\n統一: {changed} / {len(ALL_HTML)} ページ変更")


if __name__ == "__main__":
    main()
