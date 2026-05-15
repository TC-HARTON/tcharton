# -*- coding: utf-8 -*-
"""
gen-site-plan-pdf.py — tcharton.com サイト構造マップ + 今後の計画 PDF 生成

使い方: py docs/gen-site-plan-pdf.py
出力: docs/SITE-STRUCTURE-PLAN-2026-05-15.pdf
"""
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm, cm
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
    KeepTogether, Image as RLImage, HRFlowable
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
from datetime import datetime
import os

# ─── Japanese font ───────────────────────────────────────────────────
pdfmetrics.registerFont(UnicodeCIDFont("HeiseiKakuGo-W5"))   # Bold sans
pdfmetrics.registerFont(UnicodeCIDFont("HeiseiMin-W3"))      # Mincho

JP_BOLD = "HeiseiKakuGo-W5"
JP_REGULAR = "HeiseiKakuGo-W5"   # ReportLab 4.x lacks W3 sans by default; reuse W5
JP_MIN = "HeiseiMin-W3"

# ─── Brand colors ─────────────────────────────────────────────────────
BRAND_NAVY = colors.HexColor("#1B4965")
BRAND_TEAL = colors.HexColor("#2A9D8F")
BRAND_GOLD = colors.HexColor("#D4AF37")
BRAND_DARK = colors.HexColor("#1a1a1a")
BRAND_GRAY = colors.HexColor("#666666")
BRAND_LIGHT = colors.HexColor("#f6f8fa")
BRAND_BORDER = colors.HexColor("#e0e6eb")
COLOR_DONE = colors.HexColor("#198754")     # ✅ green
COLOR_NEW = colors.HexColor("#0d6efd")      # 🆕 blue
COLOR_PROGRESS = colors.HexColor("#ff8c00") # ⏳ orange
COLOR_PLANNED = colors.HexColor("#6c757d")  # 📋 gray

# ─── Styles ───────────────────────────────────────────────────────────
styles = getSampleStyleSheet()

H1 = ParagraphStyle("H1", fontName=JP_BOLD, fontSize=22, leading=28,
                    textColor=BRAND_NAVY, spaceAfter=10, spaceBefore=4)
H2 = ParagraphStyle("H2", fontName=JP_BOLD, fontSize=15, leading=20,
                    textColor=BRAND_NAVY, spaceAfter=8, spaceBefore=14,
                    borderPadding=4)
H3 = ParagraphStyle("H3", fontName=JP_BOLD, fontSize=12, leading=16,
                    textColor=BRAND_DARK, spaceAfter=6, spaceBefore=8)
BODY = ParagraphStyle("BODY", fontName=JP_REGULAR, fontSize=10, leading=15,
                      textColor=BRAND_DARK, spaceAfter=4, alignment=TA_LEFT)
SMALL = ParagraphStyle("SMALL", fontName=JP_REGULAR, fontSize=8.5, leading=12,
                       textColor=BRAND_GRAY, alignment=TA_LEFT)
META = ParagraphStyle("META", fontName=JP_REGULAR, fontSize=9, leading=13,
                      textColor=BRAND_GRAY, alignment=TA_RIGHT)
COVER_TITLE = ParagraphStyle("COVER_TITLE", fontName=JP_BOLD, fontSize=32,
                             leading=44, textColor=BRAND_NAVY, alignment=TA_CENTER,
                             spaceAfter=8)
COVER_SUB = ParagraphStyle("COVER_SUB", fontName=JP_REGULAR, fontSize=14,
                           leading=22, textColor=BRAND_DARK, alignment=TA_CENTER,
                           spaceAfter=4)
COVER_META = ParagraphStyle("COVER_META", fontName=JP_REGULAR, fontSize=11,
                            leading=18, textColor=BRAND_GRAY, alignment=TA_CENTER)
TREE = ParagraphStyle("TREE", fontName="Courier", fontSize=8.5, leading=12,
                      textColor=BRAND_DARK, leftIndent=0)

# ─── Page templates ───────────────────────────────────────────────────
def add_header_footer(canvas, doc):
    canvas.saveState()
    page_num = doc.page
    # Header
    canvas.setFont(JP_BOLD, 9)
    canvas.setFillColor(BRAND_NAVY)
    canvas.drawString(15 * mm, A4[1] - 12 * mm, "T.C.HARTON")
    canvas.setFont(JP_REGULAR, 8.5)
    canvas.setFillColor(BRAND_GRAY)
    canvas.drawRightString(A4[0] - 15 * mm, A4[1] - 12 * mm,
                           "サイト構造マップ + 今後の計画 ／ 2026-05-15")
    canvas.setStrokeColor(BRAND_BORDER)
    canvas.setLineWidth(0.5)
    canvas.line(15 * mm, A4[1] - 14 * mm, A4[0] - 15 * mm, A4[1] - 14 * mm)
    # Footer
    canvas.setFont(JP_REGULAR, 8)
    canvas.setFillColor(BRAND_GRAY)
    canvas.drawString(15 * mm, 10 * mm, "tcharton.com — 内部計画ドキュメント")
    canvas.drawRightString(A4[0] - 15 * mm, 10 * mm, f"p. {page_num}")
    canvas.restoreState()

# ─── Content builders ────────────────────────────────────────────────
def cover_page(story):
    story.append(Spacer(1, 60 * mm))
    story.append(Paragraph("tcharton.com", COVER_TITLE))
    story.append(Paragraph("サイト構造マップ + 今後の計画", COVER_SUB))
    story.append(Spacer(1, 8 * mm))
    story.append(HRFlowable(width="40%", thickness=1.5, color=BRAND_GOLD,
                            hAlign="CENTER"))
    story.append(Spacer(1, 12 * mm))
    story.append(Paragraph("2026 年 5 月 15 日 時点", COVER_META))
    story.append(Paragraph("Git commit: <font face='Courier'>fbcb73d</font> "
                           "／ Branch: main", COVER_META))
    story.append(Paragraph("総ページ数: <b>206 HTML</b>", COVER_META))
    story.append(Spacer(1, 60 * mm))
    story.append(Paragraph(
        "目的: 計画をブレなく進めるため、現在の到達点と次の一手を可視化する。",
        BODY))
    story.append(Paragraph(
        "対象: ① HARTON 総合責任者（戦略判断）／ ② tcharton 構築チーム（実装）",
        BODY))
    story.append(PageBreak())

def section_header(story, num, title):
    story.append(Paragraph(f"<b>{num}.</b> {title}", H1))
    story.append(HRFlowable(width="100%", thickness=2, color=BRAND_NAVY,
                            spaceBefore=2, spaceAfter=10))

def status_legend(story):
    legend_data = [[
        Paragraph('<font color="#198754"><b>✅ 完了</b></font>', SMALL),
        Paragraph('<font color="#0d6efd"><b>🆕 本セッション実装</b></font>', SMALL),
        Paragraph('<font color="#ff8c00"><b>⏳ 進行中</b></font>', SMALL),
        Paragraph('<font color="#6c757d"><b>📋 計画中</b></font>', SMALL),
    ]]
    t = Table(legend_data, colWidths=[42*mm, 50*mm, 42*mm, 42*mm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), BRAND_LIGHT),
        ("BOX", (0, 0), (-1, -1), 0.5, BRAND_BORDER),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(t)
    story.append(Spacer(1, 8))

# ─── Section: Executive summary ───────────────────────────────────────
def section_summary(story):
    section_header(story, "1", "エグゼクティブ・サマリ")

    story.append(Paragraph("到達点（2026-05-15 現在）", H3))
    story.append(Paragraph(
        "tcharton.com は <b>206 HTML ページ</b>を擁する WEB 制作 + AI 予測サービスサイト。"
        "本セッション（2026-05-15）で <b>+33 ページ</b>追加し、"
        "営業導線の主要素子（Problem LP / Areas / Industries / Press）を完備。"
        "spec-checker は <b>PASS:9,473 / FAIL:0 / 100% S-RANK</b>。",
        BODY))
    story.append(Spacer(1, 6))

    story.append(Paragraph("本セッション完遂ブロック", H3))
    summary_data = [
        ["カテゴリ", "ページ数", "内容", "状態"],
        ["P0-3 Problem LP", "5 + 1 ハブ", "site-speed / no-inquiry / ai-search-invisible / security-risk / no-mobile", "🆕"],
        ["P1-② Areas", "7 + 1 ハブ", "沼津(HQ) / 三島 / 富士 / 富士宮 / 裾野 / 長泉 / 清水", "🆕"],
        ["P1-③ Industries", "7", "manufacturing / clinic / construction / legal / restaurant / beauty / real-estate", "🆕"],
        ["P1-④ Press Release", "1 + 1 ハブ", "東証プライム上場 1,553 社 機械検証データ公開（CC BY 4.0）", "🆕"],
        ["訂正", "5", "1,553 = 東証プライム上場（捏造の全面訂正）", "✅"],
    ]
    t = Table(summary_data, colWidths=[35*mm, 25*mm, 95*mm, 18*mm], repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), BRAND_NAVY),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), JP_BOLD),
        ("FONTSIZE", (0, 0), (-1, 0), 10),
        ("FONTNAME", (0, 1), (-1, -1), JP_REGULAR),
        ("FONTSIZE", (0, 1), (-1, -1), 9),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ALIGN", (1, 0), (1, -1), "CENTER"),
        ("ALIGN", (3, 0), (3, -1), "CENTER"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, BRAND_LIGHT]),
        ("GRID", (0, 0), (-1, -1), 0.4, BRAND_BORDER),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    story.append(t)
    story.append(Spacer(1, 12))

    story.append(Paragraph("KPI（spec-checker 基準）", H3))
    kpi_data = [
        ["指標", "P0-3 開始時", "セッション完了時", "差分"],
        ["PASS 数", "8,740", "9,473", "+733"],
        ["FAIL 数", "0", "0", "±0"],
        ["合格率", "100.0%", "100.0%", "S-RANK 維持"],
        ["HTML ページ数", "173", "206", "+33"],
    ]
    t = Table(kpi_data, colWidths=[40*mm, 35*mm, 40*mm, 35*mm], repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), BRAND_TEAL),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), JP_BOLD),
        ("FONTNAME", (0, 1), (-1, -1), JP_REGULAR),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ALIGN", (1, 0), (-1, -1), "CENTER"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, BRAND_LIGHT]),
        ("GRID", (0, 0), (-1, -1), 0.4, BRAND_BORDER),
        ("TEXTCOLOR", (3, 1), (3, -1), COLOR_DONE),
        ("FONTNAME", (3, 1), (3, -1), JP_BOLD),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    story.append(t)
    story.append(PageBreak())

# ─── Section: Site tree ───────────────────────────────────────────────
def section_tree(story):
    section_header(story, "2", "現在の site 構造（206 ページ）")
    status_legend(story)

    story.append(Paragraph("2.1 サイト全体ツリー", H2))

    # Build the tree as a sequence of styled lines
    tree_lines = [
        ('🏠 / (トップページ)                                                          ', 'done'),
        ('│                                                                           ', None),
        ('├─ 💼 サービス系（14 ページ）                                                  ', 'header'),
        ('│  ├─ /services/web/                          WEB 制作トップ                 ', 'done'),
        ('│  │  └─ /services/web/industries/            業種別ガイド ハブ（50 業種一覧）  ', 'done'),
        ('│  │     ├─ /manufacturing/                   BtoB 製造業                    ', 'new'),
        ('│  │     ├─ /clinic/                          医療・クリニック                ', 'new'),
        ('│  │     ├─ /construction/                    建設・工務店                   ', 'new'),
        ('│  │     ├─ /legal/                           士業                          ', 'new'),
        ('│  │     ├─ /restaurant/                      飲食店                        ', 'new'),
        ('│  │     ├─ /beauty/                          美容・サロン                   ', 'new'),
        ('│  │     └─ /real-estate/                     不動産                        ', 'new'),
        ('│  ├─ /services/ai-prediction/                AI 予測トップ                  ', 'done'),
        ('│  │  ├─ /sales/                              売上予測                      ', 'done'),
        ('│  │  └─ /inventory/                          在庫予測                      ', 'done'),
        ('│  ├─ /services/lp/                           単発 LP                       ', 'done'),
        ('│  └─ /services/refurbish/                    リフレッシュ                   ', 'done'),
        ('│                                                                           ', None),
        ('├─ 💰 /pricing/                               料金プラン（3 + 単発）          ', 'done'),
        ('│                                                                           ', None),
        ('├─ 🎯 顧客接点（16 ページ）                                                    ', 'header'),
        ('│  ├─ /problems/                              Problem LP ハブ               ', 'new'),
        ('│  │  ├─ /site-speed/                         表示速度                      ', 'new'),
        ('│  │  ├─ /no-inquiry/                         問合せ来ない                   ', 'new'),
        ('│  │  ├─ /ai-search-invisible/                AI 検索不在                    ', 'new'),
        ('│  │  ├─ /security-risk/                      セキュリティ                   ', 'new'),
        ('│  │  └─ /no-mobile/                          スマホ最適化                   ', 'new'),
        ('│  ├─ /areas/                                 対応エリア ハブ                 ', 'new'),
        ('│  │  ├─ /numazu/  ★ HQ                       沼津市（本社）                  ', 'new'),
        ('│  │  ├─ /mishima/                            三島市                        ', 'new'),
        ('│  │  ├─ /fuji/                               富士市                        ', 'new'),
        ('│  │  ├─ /fujinomiya/                         富士宮市                      ', 'new'),
        ('│  │  ├─ /susono/                             裾野市                        ', 'new'),
        ('│  │  ├─ /nagaizumi/                          長泉町                        ', 'new'),
        ('│  │  └─ /shimizu/                            静岡市清水区                   ', 'new'),
        ('│  ├─ /cases/                                 導入事例                      ', 'done'),
        ('│  └─ /contact/                               問合せフォーム                  ', 'done'),
        ('│                                                                           ', None),
        ('├─ 📚 コンテンツ・信頼形成（41 ページ）                                          ', 'header'),
        ('│  ├─ /insights/                              教育記事ハブ（7 カテゴリ）        ', 'done'),
        ('│  │  └─ × 31 記事                             CWV / LLMO / セキュリティ等     ', 'done'),
        ('│  ├─ /methodology/                           方法論・品質根拠                ', 'done'),
        ('│  ├─ /faq/                                   FAQ                          ', 'done'),
        ('│  ├─ /profile/                               代表プロフィール                ', 'done'),
        ('│  ├─ /vision/                                私たちの想い                   ', 'done'),
        ('│  ├─ /about/                                 会社情報                      ', 'done'),
        ('│  └─ /press/                                 プレスリリース ハブ              ', 'new'),
        ('│     └─ /2026-05-jpx-prime-1553/             第 1 弾（CC BY 4.0）           ', 'new'),
        ('│                                                                           ', None),
        ('├─ 🛡️ /stella/  ⭐ 評価サブセクション（131 ページ）                              ', 'header'),
        ('│  │     【WEB 品質審判ポジション = HARTON の戦略軸】                           ', None),
        ('│  ├─ /                                       Stella ハブ                   ', 'done'),
        ('│  ├─ /methodology/  + 4 サブ                  評価方法論                    ', 'done'),
        ('│  ├─ /industries/   + 11 業種                 業種別集計                    ', 'done'),
        ('│  ├─ /comparison/regions/                                                  ', None),
        ('│  │  ├─ /shizuoka/                           静岡県 5 都市                  ', 'done'),
        ('│  │  └─ /tokyo/                              東京 比較                     ', 'done'),
        ('│  ├─ /case-studies/                          事例                          ', 'done'),
        ('│  ├─ /improvement-guide/                     改善ガイド                     ', 'done'),
        ('│  ├─ /apply/  /opt-out/  /faq/               オプトイン・FAQ                ', 'done'),
        ('│  ├─ /press/                                 Stella プレス                  ', 'done'),
        ('│  ├─ /news/shizuoka-industry-report/         業界レポート                    ', 'done'),
        ('│  ├─ /data/  /datasets/                      データ配布                     ', 'done'),
        ('│  └─ /legal/  /contact/                      法務・連絡先                    ', 'done'),
        ('│                                                                           ', None),
        ('├─ 🔧 採用・補助                                                              ', 'header'),
        ('│  ├─ /recruit/                               制作実績キャンペーン             ', 'done'),
        ('│  └─ /news/                                  お知らせ                      ', 'done'),
        ('│                                                                           ', None),
        ('└─ ⚖️ 法務                                                                  ', 'header'),
        ('   ├─ /legal/                                 特商法                        ', 'done'),
        ('   └─ /privacy/                               プライバシー                   ', 'done'),
    ]

    # Render as monospace with status colors
    color_map = {
        'done': COLOR_DONE,
        'new': COLOR_NEW,
        'progress': COLOR_PROGRESS,
        'planned': COLOR_PLANNED,
        'header': BRAND_NAVY,
    }
    def hex_for_para(c):
        # color.hexval() returns '0xRRGGBB' — convert to '#RRGGBB' for Paragraph font tag
        return '#' + c.hexval()[2:]

    for line, status in tree_lines:
        # Escape XML chars
        safe = line.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
        if status:
            color = color_map.get(status, BRAND_DARK)
            font_w = "<b>" if status == "header" else ""
            font_w_close = "</b>" if status == "header" else ""
            html = f'<font color="{hex_for_para(color)}" face="Courier" size="8.5">{font_w}{safe}{font_w_close}</font>'
        else:
            html = f'<font color="#666666" face="Courier" size="8.5">{safe}</font>'
        story.append(Paragraph(html, TREE))

    story.append(PageBreak())

# ─── Section: Recent additions detail ─────────────────────────────────
def section_recent(story):
    section_header(story, "3", "本セッション実装の詳細（33 ページ追加）")

    # Problem LPs
    story.append(Paragraph("3.1 Problem LP セット（5 本 + ハブ）", H2))
    story.append(Paragraph(
        "顧客の悩み起点で来訪させ、HARTON の解決策に着地させる導線。"
        "Verizon 2025 DBIR / Web Almanac 2025 / WCAG 2.2 等の最新一次出典付き。",
        BODY))

    p_data = [
        ["URL", "ファイル名", "字数", "主出典"],
        ["/problems/site-speed/", "表示速度", "5,000字", "Deloitte 2020 / Web Almanac 2025"],
        ["/problems/no-inquiry/", "問合せ来ない", "4,800字", "Baymard / NN/g"],
        ["/problems/ai-search-invisible/", "AI 検索不在", "5,000字", "Pew Research / KDD 2024"],
        ["/problems/security-risk/", "セキュリティ", "5,500字", "Verizon DBIR 2025 / OWASP 2025 / Patchstack 2025"],
        ["/problems/no-mobile/", "スマホ最適化", "5,500字", "StatCounter 2025-04 / WCAG 2.2"],
    ]
    t = Table(p_data, colWidths=[55*mm, 28*mm, 18*mm, 70*mm], repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), BRAND_NAVY),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), JP_BOLD),
        ("FONTNAME", (0, 1), (-1, -1), JP_REGULAR),
        ("FONTNAME", (0, 1), (0, -1), "Courier"),
        ("FONTSIZE", (0, 0), (-1, -1), 8.5),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ALIGN", (2, 0), (2, -1), "CENTER"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, BRAND_LIGHT]),
        ("GRID", (0, 0), (-1, -1), 0.4, BRAND_BORDER),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    story.append(t)
    story.append(Spacer(1, 14))

    # Areas
    story.append(Paragraph("3.2 Areas（地域別 LP 7 都市 + ハブ）", H2))
    story.append(Paragraph(
        "沼津本社から車 60 分圏の対応エリア。LocalBusiness JSON-LD + Wikipedia "
        "sameAs で「{都市名} WEB 制作」のロングテール獲得を狙う。",
        BODY))
    a_data = [
        ["URL", "都市", "人口", "本社距離", "主要産業"],
        ["/areas/numazu/  ★ HQ", "沼津市", "約 18.6 万", "0 km", "水産・物流・製造・観光"],
        ["/areas/mishima/", "三島市", "約 10.6 万", "8 km / 15 分", "商業・観光・教育（新幹線）"],
        ["/areas/fuji/", "富士市", "約 24.1 万", "25 km / 30 分", "製紙・化学・物流"],
        ["/areas/fujinomiya/", "富士宮市", "約 12.8 万", "35 km / 45 分", "観光・食品・農業（世界遺産）"],
        ["/areas/susono/", "裾野市", "約 5.0 万", "12 km / 20 分", "自動車部品（Woven City）"],
        ["/areas/nagaizumi/", "長泉町", "約 4.4 万", "10 km / 15 分", "医療・住宅（がんセンター）"],
        ["/areas/shimizu/", "静岡市清水区", "約 22.4 万", "50 km / 60 分", "港湾物流・水産・観光"],
    ]
    t = Table(a_data, colWidths=[40*mm, 25*mm, 22*mm, 28*mm, 56*mm], repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), BRAND_NAVY),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), JP_BOLD),
        ("FONTNAME", (0, 1), (-1, -1), JP_REGULAR),
        ("FONTNAME", (0, 1), (0, -1), "Courier"),
        ("FONTSIZE", (0, 0), (-1, -1), 8.5),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ALIGN", (2, 0), (3, -1), "CENTER"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, BRAND_LIGHT]),
        ("BACKGROUND", (0, 1), (-1, 1), colors.HexColor("#fff8e6")),  # HQ row
        ("GRID", (0, 0), (-1, -1), 0.4, BRAND_BORDER),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    story.append(t)
    story.append(Spacer(1, 14))

    # Industries
    story.append(Paragraph("3.3 Industries（業種別 LP 7 業種）", H2))
    story.append(Paragraph(
        "業種別の必須実装 + 法令論点を網羅。既存ハブ /services/web/industries/ "
        "（50 業種一覧）から内部リンク導線。",
        BODY))
    i_data = [
        ["URL", "業種", "法令カバレッジ"],
        ["/services/web/industries/manufacturing/", "製造業", "不正競争防止法 §2(1)14 + 景表法 §5"],
        ["/services/web/industries/clinic/", "医療・クリニック", "医療広告ガイドライン + 薬機法"],
        ["/services/web/industries/construction/", "建設・工務店", "建設業法 + 建築基準法 + 景表法"],
        ["/services/web/industries/legal/", "士業", "個人情報保護法 2022 + 各士業法広告規制"],
        ["/services/web/industries/restaurant/", "飲食店", "食品衛生法 + 食品表示法 + 景表法"],
        ["/services/web/industries/beauty/", "美容・サロン", "美容師法 + 特商法 + 景表法"],
        ["/services/web/industries/real-estate/", "不動産", "宅建業法 §32/§34/§47 + 不動産公正競争規約"],
    ]
    t = Table(i_data, colWidths=[78*mm, 32*mm, 61*mm], repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), BRAND_NAVY),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), JP_BOLD),
        ("FONTNAME", (0, 1), (-1, -1), JP_REGULAR),
        ("FONTNAME", (0, 1), (0, -1), "Courier"),
        ("FONTSIZE", (0, 0), (-1, -1), 8.5),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, BRAND_LIGHT]),
        ("GRID", (0, 0), (-1, -1), 0.4, BRAND_BORDER),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    story.append(t)
    story.append(Spacer(1, 14))

    # Press
    story.append(Paragraph("3.4 Press Release（雛形 + 第 1 弾）", H2))
    story.append(Paragraph(
        "報道機関向け正式公表の枠組みを設置。第 1 弾は scanner Phase E の実データ"
        "（東証プライム上場 1,553 社 / JPX 公式 / 東証 33 業種）を CC BY 4.0 で公開。",
        BODY))
    pr_data = [
        ["URL", "公開日", "内容"],
        ["/press/", "—", "プレスリリース ハブ + 報道機関連絡先"],
        ["/press/2026-05-jpx-prime-1553/", "2026-05-15", "東証プライム 1,553 社 機械検証データ公開（CC BY 4.0）"],
    ]
    t = Table(pr_data, colWidths=[80*mm, 28*mm, 63*mm], repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), BRAND_NAVY),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), JP_BOLD),
        ("FONTNAME", (0, 1), (-1, -1), JP_REGULAR),
        ("FONTNAME", (0, 1), (0, -1), "Courier"),
        ("FONTSIZE", (0, 0), (-1, -1), 8.5),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ALIGN", (1, 0), (1, -1), "CENTER"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, BRAND_LIGHT]),
        ("GRID", (0, 0), (-1, -1), 0.4, BRAND_BORDER),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    story.append(t)
    story.append(PageBreak())

# ─── Section: Future plan ─────────────────────────────────────────────
def section_plan(story):
    section_header(story, "4", "今後の計画（P2 候補）")
    story.append(Paragraph(
        "P0-3 + P1 完遂を受け、次フェーズ P2 の候補を 7 ブロックに整理。"
        "代表（① HARTON 総合責任者）の判断で実行順を確定する。",
        BODY))
    story.append(Spacer(1, 8))

    story.append(Paragraph("4.1 進行中（既存・並行）", H2))
    progress_data = [
        ["項目", "内容", "状態"],
        ["scanner Phase F", "全国再スキャン（東証スタンダード市場 1,600 社想定）", "⏳ 進行中"],
        ["Insights 31 記事 改善", "表示速度・SEO 等の追加検証で品質磨き", "⏳ 進行中"],
    ]
    t = Table(progress_data, colWidths=[40*mm, 110*mm, 25*mm], repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), COLOR_PROGRESS),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), JP_BOLD),
        ("FONTNAME", (0, 1), (-1, -1), JP_REGULAR),
        ("FONTSIZE", (0, 0), (-1, -1), 9.5),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ALIGN", (2, 0), (2, -1), "CENTER"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, BRAND_LIGHT]),
        ("GRID", (0, 0), (-1, -1), 0.4, BRAND_BORDER),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    story.append(t)
    story.append(Spacer(1, 14))

    story.append(Paragraph("4.2 P2 候補（7 ブロック）", H2))
    plan_data = [
        ["#", "ブロック", "内容（要点）", "推定工数", "影響度", "依存"],
        ["①", "Stella 月次自動化",
         "scanner 実行 → /stella/data/ 自動更新 → /press/2026-MM-... 自動生成。月次プレスリリース運用化",
         "中 (3-5 日)", "★★★", "scanner + press 雛形"],
        ["②", "Insights 拡充",
         "ローカル SEO × 業種掛け算 / 補助金 2026 年度版 / AI Overviews 事例ベース。月 2-4 本ペース",
         "高 (継続)", "★★★", "—"],
        ["③", "Cases 拡充",
         "実績事例 5-10 件追加。業種 × 課題 × 結果 のフォーマット化 + Person/Review Schema",
         "中 (5-7 日)", "★★★", "クライアント許諾"],
        ["④", "業種ガイド第 2 期",
         "整骨院 / 歯科 / 学習塾 / 介護 / 自動車整備 など 3-5 業種追加",
         "低 (2-3 日)", "★★", "gen-industries.js"],
        ["⑤", "Areas 第 2 期",
         "県外主要 5 都市（東京 / 横浜 / 名古屋 / 大阪 / 福岡）リモート対応訴求",
         "低 (2-3 日)", "★★", "gen-areas.js"],
        ["⑥", "Press 第 2 弾",
         "東証スタンダード市場結果 / WCAG 2.2 適合率業種別 / 中小企業セキュリティ年次",
         "中 (各 1-2 日)", "★★★", "scanner Phase F"],
        ["⑦", "/docs/ 内部整備",
         "INSIGHTS-RESEARCH-BASE-2026-05.md 継続更新 + 月次レポート定型化",
         "低 (1 日)", "★", "—"],
    ]
    t = Table(plan_data, colWidths=[8*mm, 35*mm, 75*mm, 22*mm, 15*mm, 25*mm], repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), BRAND_NAVY),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), JP_BOLD),
        ("FONTNAME", (0, 1), (-1, -1), JP_REGULAR),
        ("FONTNAME", (0, 1), (0, -1), JP_BOLD),
        ("FONTSIZE", (0, 0), (-1, -1), 8.5),
        ("LEADING", (0, 1), (-1, -1), 11),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ALIGN", (0, 0), (0, -1), "CENTER"),
        ("ALIGN", (3, 0), (5, -1), "CENTER"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, BRAND_LIGHT]),
        ("GRID", (0, 0), (-1, -1), 0.4, BRAND_BORDER),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    story.append(t)
    story.append(Spacer(1, 12))

    story.append(Paragraph("4.3 戦略的検討（要 ① 代表判断）", H2))
    strategic = [
        ["項目", "判断軸"],
        ["certification/ 統合方針", "Stella ブランドへの収束完了確認 / 旧 archive 整理"],
        ["海外展開", "英語版 LP + hreflang 設定 / 翻訳パートナー確保"],
        ["note 連携強化", "/insights/ 記事 ↔ note 投稿の双方向動線 / ブログ担当 ③ と協業"],
        ["Tier 別商品化", "Standard / Premium / Enterprise の差別化軸の明確化"],
    ]
    t = Table(strategic, colWidths=[55*mm, 125*mm], repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), BRAND_GOLD),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), JP_BOLD),
        ("FONTNAME", (0, 1), (-1, -1), JP_REGULAR),
        ("FONTSIZE", (0, 0), (-1, -1), 9.5),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, BRAND_LIGHT]),
        ("GRID", (0, 0), (-1, -1), 0.4, BRAND_BORDER),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    story.append(t)

    story.append(PageBreak())

# ─── Section: Decision matrix ─────────────────────────────────────────
def section_decision(story):
    section_header(story, "5", "実行判断マトリクス")
    story.append(Paragraph(
        "P2 候補 ①〜⑦ の優先順位を決める判断軸。"
        "<b>今期の主目的</b>（売上獲得 vs ブランド構築 vs 効率化）を明確にして選ぶ。",
        BODY))
    story.append(Spacer(1, 8))

    story.append(Paragraph("5.1 主目的別の推奨 P2 順序", H2))
    matrix = [
        ["主目的", "推奨実行順", "理由"],
        ["売上獲得最大化",
         "③ Cases → ④ 業種第 2 期 → ⑤ Areas 第 2 期",
         "事例 + ロングテール SEO で問合せ動線を最大化"],
        ["ブランド構築・PR",
         "① Stella 月次自動化 → ⑥ Press 第 2 弾 → ② Insights",
         "メディア露出と AI 引用率を最優先"],
        ["効率化・運用基盤",
         "① Stella 月次自動化 → ⑦ /docs/ 整備 → ② Insights",
         "次回スケールアップに備えた基盤整備"],
        ["バランス型（推奨デフォルト）",
         "① → ③ → ② → ⑥ → ④ → ⑤ → ⑦",
         "Stella を運用基盤化しつつ営業導線も並行強化"],
    ]
    t = Table(matrix, colWidths=[40*mm, 80*mm, 60*mm], repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), BRAND_TEAL),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), JP_BOLD),
        ("FONTNAME", (0, 1), (-1, -1), JP_REGULAR),
        ("FONTNAME", (0, 1), (0, -1), JP_BOLD),
        ("FONTSIZE", (0, 0), (-1, -1), 9.5),
        ("LEADING", (0, 0), (-1, -1), 13),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, BRAND_LIGHT]),
        ("BACKGROUND", (0, 4), (-1, 4), colors.HexColor("#fff8e6")),
        ("GRID", (0, 0), (-1, -1), 0.4, BRAND_BORDER),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    story.append(t)
    story.append(Spacer(1, 14))

    story.append(Paragraph("5.2 ブレ防止チェックリスト", H2))
    story.append(Paragraph(
        "P2 着手時に毎回確認する項目。記事・ページ追加前の <b>必須ゲート</b>。",
        BODY))
    checklist = [
        "1. <b>scanner CSV / 一次出典を Read 済み</b>か（数値の捏造禁止）",
        "2. <b>spec-checker FAIL:0 / S-RANK</b> を維持できる実装か",
        "3. <b>ブランド禁止用語</b>（圧倒的・最高・No.1 等）grep 0 件か",
        "4. <b>Insights リンク</b>は実在 slug を指しているか（404 禁止）",
        "5. <b>OGP 画像</b>を個別生成したか（gen-ogp-* スクリプト活用）",
        "6. <b>sitemap.xml + spec-checker.js</b> を同期更新したか",
        "7. <b>本文中の冗長な所在地・代表名</b>を埋め込んでいないか",
        "8. <b>商標・法令</b>遵守（医療広告 / 薬機 / 宅建 / 景表法 / 個人情報）",
        "9. <b>preview server で実機確認</b>（h1 / breadcrumb / リンク）",
        "10. <b>main + worktree branch</b> 両方に push したか",
    ]
    for item in checklist:
        story.append(Paragraph(f"☐  {item}", BODY))
    story.append(Spacer(1, 14))

    story.append(Paragraph("5.3 過去の失敗から得た教訓（再発防止）", H2))
    lessons = [
        ["事象", "教訓"],
        ["1,553 社 = 静岡県プライム企業 と捏造",
         "scanner/phase-e-prime-summary.json を Read してから書く。"
         "「プライム」を勝手に「主要企業」と訳さない（東証プライム市場上場の意）"],
        ["/insights/local-seo-for-shizuoka/ 等の存在しない slug を 6 種類リンク",
         "リンク先 URL は ls insights/ で実在確認してから書く"],
        ["「完全リモート」「圧倒的に高比率」等のブランド禁止用語混入",
         "公開前 grep -E '(圧倒的|完全|業界一|...)' で 0 件確認"],
        ["sed で 168 ページの header を上書き → chrome 不一致",
         "ページ全体一括上書きは spec-checker で必ず確認後 push"],
    ]
    t = Table(lessons, colWidths=[70*mm, 110*mm], repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#dc3545")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), JP_BOLD),
        ("FONTNAME", (0, 1), (-1, -1), JP_REGULAR),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("LEADING", (0, 0), (-1, -1), 12),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, BRAND_LIGHT]),
        ("GRID", (0, 0), (-1, -1), 0.4, BRAND_BORDER),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(t)

# ─── Build PDF ────────────────────────────────────────────────────────
def build():
    output = os.path.join(os.path.dirname(__file__),
                          "SITE-STRUCTURE-PLAN-2026-05-15.pdf")
    doc = SimpleDocTemplate(
        output, pagesize=A4,
        leftMargin=15 * mm, rightMargin=15 * mm,
        topMargin=20 * mm, bottomMargin=15 * mm,
        title="tcharton.com サイト構造マップ + 今後の計画",
        author="T.C.HARTON",
        subject="2026-05-15 内部計画ドキュメント",
    )
    story = []
    cover_page(story)
    section_summary(story)
    section_tree(story)
    section_recent(story)
    section_plan(story)
    section_decision(story)
    doc.build(story, onFirstPage=lambda c, d: None, onLaterPages=add_header_footer)
    print(f"OK -> {output}")
    print(f"Size: {os.path.getsize(output)} bytes")

if __name__ == "__main__":
    build()
