"""HARTON 本体 全ページのヘッダーナビに Stella リンク追加 v1.37.7

代表 5/14 指摘: Stella へのリンクがフッターと一部ページにしかない。
→ 全 HARTON 本体ページのデスクトップ nav + モバイル nav に Stella を追加。
V2 運用方針で Stella は差別化の中核（実演可能な証拠）のため導線必須。

冪等性: 既にデスクトップ nav に /stella/ があればスキップ。
"""
import pathlib
import re

BASE = pathlib.Path(r"C:\Users\ohuch\Desktop\HARTON\tcharton")

PAGES = ["index.html", "about/index.html", "cases/index.html", "contact/index.html",
         "faq/index.html", "methodology/index.html", "news/index.html",
         "pricing/index.html", "privacy/index.html", "problems/index.html",
         "profile/index.html", "recruit/index.html", "vision/index.html",
         "insights/index.html", "legal/index.html"]

DESKTOP_STELLA = '<a href="/stella/" class="text-dark-700 hover:text-teal-700 py-3">Stella</a>'
MOBILE_STELLA = '<a href="/stella/" class="block py-4 px-2 text-lg text-dark-800 hover:text-teal-700 border-b border-dark-100">Stella（品質評価）</a>'


def add_desktop(html: str) -> str:
    # 既にデスクトップ nav に Stella があれば触らない
    if re.search(r'<a href="/stella/" class="text-dark-700', html):
        return html
    # 事例 link の直後に挿入
    m = re.search(r'(<a href="/cases/" class="text-dark-700 hover:text-teal-700 py-3">事例</a>\s*)', html)
    if m:
        return html[:m.end()] + "\n        " + DESKTOP_STELLA + html[m.end():]
    # 事例 が無いページ（cases 自身など）→ 料金 link の直後
    m = re.search(r'(<a href="/pricing/" class="text-dark-700 hover:text-teal-700 py-3">料金</a>\s*)', html)
    if m:
        return html[:m.end()] + "\n        " + DESKTOP_STELLA + html[m.end():]
    return html


def add_mobile(html: str) -> str:
    if re.search(r'<a href="/stella/" class="block py-4', html):
        return html
    # 導入事例 mobile link の直後
    m = re.search(r'(<a href="/cases/" class="block py-4 px-2 text-lg text-dark-800 hover:text-teal-700 border-b border-dark-100">導入事例</a>\s*)', html)
    if m:
        return html[:m.end()] + "\n      " + MOBILE_STELLA + html[m.end():]
    # 料金 mobile link の直後
    m = re.search(r'(<a href="/pricing/" class="block py-4 px-2 text-lg text-dark-800 hover:text-teal-700 border-b border-dark-100">料金</a>\s*)', html)
    if m:
        return html[:m.end()] + "\n      " + MOBILE_STELLA + html[m.end():]
    return html


def main():
    changed = 0
    for rel in PAGES:
        p = BASE / rel
        if not p.exists():
            print(f"  SKIP (not found): {rel}")
            continue
        html = p.read_text(encoding="utf-8")
        orig = html
        html = add_desktop(html)
        html = add_mobile(html)
        if html != orig:
            p.write_text(html, encoding="utf-8")
            changed += 1
            print(f"  OK: {rel}")
        else:
            print(f"  no-change: {rel}")
    print(f"Stella nav added: {changed} / {len(PAGES)} pages")


if __name__ == "__main__":
    main()
