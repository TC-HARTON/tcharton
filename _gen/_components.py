"""共通 Schema.org / レイアウト builder — v1.37 Step 1
DESIGN.md §10 LLMO + SEO 必須実装に準拠。
各 generator (_phase-alpha-gen.py / _stella-gen.py 等) が import 利用。
"""
import json


# Cache busting version
V = "202605121200"


def breadcrumb(items):
    """items = [(name, url_or_None), ...] → BreadcrumbList JSON-LD 文字列

    最終要素の url は None で可（自ページ / item 省略）。
    """
    elements = []
    for i, (name, url) in enumerate(items, 1):
        e = {"@type": "ListItem", "position": i, "name": name}
        if url:
            e["item"] = url
        elements.append(e)
    return json.dumps(
        {"@context": "https://schema.org", "@type": "BreadcrumbList",
         "itemListElement": elements},
        ensure_ascii=False)


def article_schema(*, headline, description, date_published, date_modified, url, image="https://tcharton.com/ogp.png"):
    """記事 (Tier 1 LP / Tier 2 教育記事 / Stella ranking 等) Article Schema"""
    return json.dumps({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": headline,
        "description": description,
        "datePublished": date_published,
        "dateModified": date_modified,
        "url": url,
        "image": image,
        "inLanguage": "ja",
        "author": {"@id": "https://tcharton.com/profile/#person"},
        "publisher": {"@id": "https://tcharton.com/#organization"}
    }, ensure_ascii=False)


def faq_schema(qa_list):
    """qa_list = [(Q, A), ...] → FAQPage Schema"""
    return json.dumps({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {"@type": "Question", "name": q,
             "acceptedAnswer": {"@type": "Answer", "text": a}}
            for q, a in qa_list
        ]
    }, ensure_ascii=False)


def howto_schema(*, name, description, steps, total_time=None):
    """HowTo Schema. steps = [(name, text), ...]"""
    obj = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": name,
        "description": description,
        "step": [{"@type": "HowToStep", "position": i, "name": n, "text": t}
                 for i, (n, t) in enumerate(steps, 1)]
    }
    if total_time:
        obj["totalTime"] = total_time
    return json.dumps(obj, ensure_ascii=False)


def stella_collection_schema(*, name, url, description):
    """Stella サブブランド CollectionPage Schema (/stella/ranking/ 等)"""
    return json.dumps({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": name,
        "url": url,
        "description": description,
        "inLanguage": "ja",
        "isPartOf": {"@id": "https://tcharton.com/#organization"},
        "about": {
            "@type": "Thing",
            "name": "HARTON Stella — WEB 品質評価機関 (審判ポジション)",
            "description": "scanner 機械検証による集計データのみ公開。個別企業名は掲載しない。"
        }
    }, ensure_ascii=False)


# DESIGN.md §2 Color tokens (CSS / Tailwind 連動確認用)
DESIGN_TOKENS = {
    "primary":         "#1B4965",
    "primary_light":   "#2a6a8a",
    "accent_gold":     "#D4AF37",
    "stella_navy":     "#0F2840",
    "stella_gold_lt":  "#F5E5A8",
    "stella_gold_dk":  "#B8941F",
    "callout_info":    "#eff6fb",
    "callout_hl":      "#fff8e6",
    "callout_danger":  "#fef2f2",
    "border_soft":     "#e0e6eb",
    "bg_soft":         "#fafbfc",
}


# DESIGN.md §3 共通フォント preload URL (v1.37 / Inter → Noto Serif JP 移行)
FONT_PRELOAD_URL = (
    "https://fonts.googleapis.com/css2"
    "?family=Noto+Sans+JP:wght@400;500;700"
    "&family=Noto+Serif+JP:wght@400;700"
    "&family=JetBrains+Mono:wght@400;700"
    "&display=swap"
)
