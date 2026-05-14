"""v1.37 Step 1 redo-3: sitemap + llms + CSP finalize"""
import pathlib
import re

base = pathlib.Path(__file__).parent.parent

# 1. sitemap.xml に Stella 131 ページ追加
stella_dir = base / "stella"
stella_paths = sorted(stella_dir.rglob("index.html"))

stella_urls = []
for p in stella_paths:
    rel = p.relative_to(stella_dir).parent.as_posix()
    if rel == ".":
        stella_urls.append("")
    else:
        stella_urls.append(rel + "/")

sm = base / "sitemap.xml"
s = sm.read_text(encoding="utf-8")
new_entries = "\n".join(
    f'  <url><loc>https://tcharton.com/stella/{u}</loc><lastmod>2026-05-14</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>'
    for u in stella_urls
)
# Remove existing stella URLs first (idempotency)
s = re.sub(
    r'  <url><loc>https://tcharton\.com/stella/[^<]*</loc>[^\n]+\n',
    "",
    s,
)
s = s.replace("</urlset>", new_entries + "\n</urlset>")
sm.write_text(s, encoding="utf-8")
print(f"sitemap.xml: +{len(stella_urls)} Stella URLs")

# 2. spec-checker NO_SITEMAP から Stella 除外
sc = base / "spec-checker.js"
s = sc.read_text(encoding="utf-8")
s = re.sub(
    r"      // Stella サブセクション[^\n]*\n      ('stella/[^']+',?\s*)+",
    "",
    s,
)
sc.write_text(s, encoding="utf-8")
print("NO_SITEMAP from Stella entries removed")

# 3. llms.txt に Stella セクション追加
llms = base / "llms.txt"
s = llms.read_text(encoding="utf-8")
if "## Stella" not in s:
    stella_section = """
## Stella（WEB 品質評価機関）

- [Stella ハブ](/stella/): 移住者の眼で、地域の真価を測る。SPEC v3.4 / 2,554 項目 / 4 軸機械検証で WEB 品質評価。
- [評価方法論](/stella/methodology/): 4 軸（技術 / セキュリティ / AI 検索 / 経営インパクト）+ Sクラス必須 5 条件。
- [業種別ランキング](/stella/industries/): 11 業種 × 集計データ（個別企業名なし）。
- [地域別](/stella/regions/): 静岡県・東京都の業種別中央値・上位水準。
- [認定申請](/stella/apply/): Sランク Badge オプトイン申請窓口。
- [掲載拒否](/stella/opt-out/): 即時削除対応 / 24 時間以内。
- [FAQ](/stella/faq/): 評価基準・スキャン仕様・認定プロセス。
- [改善ガイド](/stella/improvement-guide/): ★ 昇格までの具体的改善ステップ。
- [事例研究](/stella/case-studies/): tcharton.com 自己実証 等。
- [プレスリリース](/stella/press/): 認定機関ローンチ・業界レポート。
"""
    if "## 法令" in s:
        s = s.replace("## 法令", stella_section + "\n## 法令")
    else:
        s += stella_section
    llms.write_text(s, encoding="utf-8")
    print("llms.txt: Stella セクション追加")

# 4. CSP font-src 'self' → 'self' https://fonts.gstatic.com
fixed = 0
for p in (base / "stella").rglob("index.html"):
    c = p.read_text(encoding="utf-8")
    if "font-src 'self';" in c:
        c = c.replace("font-src 'self';", "font-src 'self' https://fonts.gstatic.com;")
        p.write_text(c, encoding="utf-8")
        fixed += 1
print(f"CSP font-src updated: {fixed} pages")
