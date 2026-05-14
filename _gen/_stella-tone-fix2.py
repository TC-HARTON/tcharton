"""Stella トーン統一 v1.37.4 — 第一弾の取りこぼし・冗長化を修復

代表 5/14 指摘:
1. 「客観検証」が残存（第一弾は「客観評価」のみ置換）
2. 「WEB 品質を評価するWEB 品質評価サービス」= 独立認定機関置換で冗長化
3. hero-eyebrow / hero-manifest の文が不自然
"""
import pathlib
import re

BASE = pathlib.Path(r"C:\Users\ohuch\Desktop\HARTON\tcharton\stella")

REPLACEMENTS = [
    # 冗長化の修復（独立認定機関 → WEB 品質評価サービス 置換で二重になった箇所）
    ("機械検証で WEB 品質を評価するWEB 品質評価サービス", "機械検証で WEB 品質を評価するサービス"),
    ("WEB 品質を機械検証 (2,554 項目 / 4 軸) で評価する掲載料無料・評価基準を公開する WEB 品質評価サービス",
     "WEB 品質を機械検証 (2,554 項目 / 4 軸) で評価する、掲載料無料・評価基準を公開するサービス"),
    ("を評価するWEB 品質評価サービス", "を評価するサービス"),
    ("WEB 品質を評価するWEB 品質評価サービス", "WEB 品質を評価するサービス"),
    ("WEB 品質評価サービスWEB 品質評価サービス", "WEB 品質評価サービス"),
    # 客観検証 → 検証
    ("機械が客観検証する", "機械が検証する"),
    ("機械が客観検証で選んだ", "機械検証で選んだ"),
    ("客観検証", "検証"),
    # manifest 文の不自然さ
    ("「S クラスとは、機械が検証する、AI 時代における信頼の指標である」",
     "「S クラスとは、機械検証で確かめる、AI 時代の信頼の目安です」"),
    # 「客観」単独の偉そうさ
    ("客観的に", ""),
    ("客観性", "中立性"),
]

def transform(p: pathlib.Path) -> bool:
    s = p.read_text(encoding="utf-8")
    orig = s
    for old, new in REPLACEMENTS:
        s = s.replace(old, new)
    s = re.sub(r"  +", " ", s)
    if s != orig:
        p.write_text(s, encoding="utf-8")
        return True
    return False

def main():
    pages = sorted(BASE.rglob("index.html"))
    changed = 0
    for p in pages:
        if transform(p):
            changed += 1
    print(f"Fixed {changed} / {len(pages)} pages")

if __name__ == "__main__":
    main()
