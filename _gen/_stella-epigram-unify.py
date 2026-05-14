"""Stella 権威的「表現スタイル」一掃 v1.37.6

代表 5/14 指摘: キーワードだけでなく断定・格言・原則調の表現スタイルを統一。

対象パターン:
1. 「Xとは、Yだ／である」断定定義エピグラム → 事実陳述に
2. 「〜しない」創 creed 調 → 「〜しません」事実説明に
3. 帰属辞「— HARTON Stella 評価原則／進化原則／信頼根拠の核／ブランドナラティブ／ブランドメッセージ」
   → 「— HARTON Stella」に統一（大袈裟な肩書を削除）
"""
import pathlib
import re

BASE = pathlib.Path(r"C:\Users\ohuch\Desktop\HARTON\tcharton\stella")

REPLACEMENTS = [
    # ── 断定定義エピグラム → 事実陳述
    ("「測るとは、評価方法のすべてを公開することだ」",
     "「評価方法はすべて公開しています」"),
    ("「自分が達成できない基準で他者を測ることはしない」",
     "「自分が達成していない基準で、他社を測ることはしません」"),
    ("「評価項目は全公開、再現性のある機械検証である」",
     "「評価項目はすべて公開し、機械検証は誰でも再現できます」"),
    ("「年次で基準を改訂、過去評価もアーカイブとして残す」",
     "「基準は年次で改訂し、過去の評価もアーカイブとして残します」"),
    ("「全評価項目を /methodology/ で公開し、再現性のある機械検証で運用する」",
     "「全評価項目を /methodology/ で公開し、再現できる機械検証で運用しています」"),
    ("「機械検証で、Sクラス WEB の普及を支える」",
     "「機械検証で、Sクラス WEB の普及を支えます」"),
    ("「非侵入型ボット防御を必須とする」",
     "「非侵入型ボット防御を必須としています」"),
    # ── 大袈裟な帰属肩書 → 「— HARTON Stella」に統一
    ("— HARTON Stella 信頼根拠の核（MASTER-PLAN §2.0.4）", "— HARTON Stella"),
    ("— HARTON Stella 信頼根拠の核", "— HARTON Stella"),
    ("— HARTON Stella ブランドメッセージ", "— HARTON Stella"),
    ("— HARTON Stella ブランドナラティブ", "— HARTON Stella"),
    ("— HARTON Stella 進化原則", "— HARTON Stella"),
    ("— HARTON Stella 評価原則", "— HARTON Stella"),
    # 全角ダッシュ違いの保険
    ("― HARTON Stella 信頼根拠の核", "― HARTON Stella"),
    ("- HARTON Stella 信頼根拠の核", "- HARTON Stella"),
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
    print(f"Epigram-unified {changed} / {len(pages)} pages")

if __name__ == "__main__":
    main()
