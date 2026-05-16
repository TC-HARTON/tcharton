#!/usr/bin/env node
/**
 * SPEC.md v3.2 完全自動検証エージェント (tcharton.com 18ページ)
 * ─────────────────────────────────────
 * SPEC.md v3.2 §1.2 18ページ階層 + §10.6 Body Theme Variants
 * + 納品前チェックリスト全項目
 * + Google Search Central準拠チェック
 * + GEO/LLMO (G-1〜G-6, KDD2024 arXiv:2311.09735)
 * + 本文仕様の全項目を機械的にチェック
 *
 * 使い方:
 *   node spec-checker.js              # 全対象ファイルを検証
 *   node spec-checker.js index.html   # 個別ファイル検証
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// ═══════════════════ 設定 ═══════════════════
const ROOT = __dirname;
const DOMAIN = 'https://tcharton.com';

// SPEC v3.2 §1.2 — tcharton.com 18ページ階層 + 補助ページ (404/thanks)
// 本配列は SPEC §1.2 マッピング表の正典に対応する。
// 新規ページ追加時は SPEC §1.5 に従い 5 項目同時更新（ディレクトリ図 / §1.2 / sitemap.xml / 本配列 / llms.txt）。
const STATIC_TARGETS = [
  // TOP
  'index.html',

  // WEB 制作（WP + HTML 2 プラン）
  'services/web/index.html',

  // 単発 LP
  'services/lp/index.html',

  // 既存サイト改修
  'services/refurbish/index.html',

  // AI 予測
  'services/ai-prediction/index.html',

  // 想い
  'vision/index.html',

  // 信頼形成
  'pricing/index.html',
  'cases/index.html',
  'faq/index.html',
  'methodology/index.html',
  'profile/index.html',

  // 必須情報
  'about/index.html',
  'contact/index.html',
  'legal/index.html',
  'privacy/index.html',
  'news/index.html',

  // 制作実績キャンペーン LP
  'recruit/index.html',

  // Phase α: Problem LP × 5 (Tier 1) + Insights 記事 × 8 (Tier 2) + Hub × 2 / 全 noindex（① 起草中）
  'problems/index.html',
  'problems/site-speed/index.html',
  'problems/no-inquiry/index.html',
  'problems/ai-search-invisible/index.html',
  'problems/security-risk/index.html',
  'problems/no-mobile/index.html',
  // Areas LP × 7 + Hub（地域別 LP セット）
  'areas/index.html',
  'areas/numazu/index.html',
  'areas/mishima/index.html',
  'areas/fuji/index.html',
  'areas/fujinomiya/index.html',
  'areas/susono/index.html',
  'areas/nagaizumi/index.html',
  'areas/shimizu/index.html',
  // Industries LP × 7（業種別 LP セット）
  'services/web/industries/manufacturing/index.html',
  'services/web/industries/clinic/index.html',
  'services/web/industries/construction/index.html',
  'services/web/industries/legal/index.html',
  'services/web/industries/restaurant/index.html',
  'services/web/industries/beauty/index.html',
  'services/web/industries/real-estate/index.html',
  // Press Release（プレスリリース ハブ + 雛形 1 枚）
  'press/index.html',
  'press/2026-05-jpx-prime-1553/index.html',
  'insights/index.html',
  'insights/core-web-vitals/index.html',
  'insights/json-ld-implementation/index.html',
  'insights/llmo-explained/index.html',
  'insights/wikidata-for-ai/index.html',
  'insights/security-5-principles/index.html',
  'insights/eat-improvement/index.html',
  'insights/longtail-seo/index.html',
  'insights/search-intent/index.html',
  'insights/geo-complete-guide/index.html',
  'insights/ai-search-engines-compared/index.html',
  'insights/llms-txt-debate/index.html',
  'insights/get-cited-by-ai/index.html',
  'insights/why-slow-site-loses-sales/index.html',
  'insights/inp-deep-dive/index.html',
  'insights/wordpress-vs-static/index.html',
  'insights/modern-build-astro/index.html',
  'insights/image-font-optimization/index.html',
  'insights/are-you-really-safe/index.html',
  'insights/wordpress-security-basics/index.html',
  'insights/local-seo-guide/index.html',
  'insights/google-business-profile/index.html',
  'insights/seo-from-zero-backlinks/index.html',
  'insights/measure-ai-traffic-ga4/index.html',
  'insights/publish-is-not-the-goal/index.html',
  'insights/accessibility-wcag22/index.html',
  'insights/how-to-read-a-quote/index.html',
  'insights/cheap-vs-expensive-site/index.html',
  'insights/when-to-rebuild/index.html',
  'insights/how-to-choose-web-company/index.html',
  'insights/subsidy-for-website/index.html',
  'insights/no-results-after-launch/index.html',
  // Insights 業界レポート / 方法論（Stella scanner Phase E 連動 / 2026-05-15 公開）
  'insights/jpx-prime-1553-deep-dive/index.html',
  'insights/standard-market-prediction/index.html',
  'insights/from-17-to-90-points/index.html',


    // Stella サブセクション (v1.37 / certification 完全再現 / 131 pages)
  'stella/about/index.html',
  'stella/apply/index.html',
  'stella/case-studies/index.html',
  'stella/case-studies/tcharton-com/index.html',
  'stella/comparison/regions/shizuoka/index.html',
  'stella/comparison/regions/tokyo/index.html',
  'stella/contact/index.html',
  'stella/faq/index.html',
  'stella/improvement-guide/index.html',
  'stella/index.html',
  'stella/industries/administrative-scrivener/index.html',
  'stella/industries/beauty/index.html',
  'stella/industries/clinic/index.html',
  'stella/industries/cosmetic-clinic/index.html',
  'stella/industries/cram-school/index.html',
  'stella/industries/index.html',
  'stella/industries/judicial-scrivener/index.html',
  'stella/industries/lawyer/index.html',
  'stella/industries/lodging/index.html',
  'stella/industries/real-estate/index.html',
  'stella/industries/restaurant/index.html',
  'stella/industries/tax-accountant/index.html',
  'stella/legal/index.html',
  'stella/methodology/ai-search/index.html',
  'stella/methodology/business-impact/index.html',
  'stella/methodology/index.html',
  'stella/methodology/security/index.html',
  'stella/methodology/technical/index.html',
  'stella/news/index.html',
  'stella/news/shizuoka-industry-report-2026-q2/index.html',
  'stella/opt-out/index.html',
  'stella/press/index.html',
  'stella/privacy/index.html',
  'stella/rankings/2026/05/index.html',
  'stella/regions/index.html',
  'stella/regions/shizuoka/fuji/index.html',
  'stella/regions/shizuoka/fuji/industries/administrative-scrivener/index.html',
  'stella/regions/shizuoka/fuji/industries/beauty/index.html',
  'stella/regions/shizuoka/fuji/industries/clinic/index.html',
  'stella/regions/shizuoka/fuji/industries/cosmetic-clinic/index.html',
  'stella/regions/shizuoka/fuji/industries/cram-school/index.html',
  'stella/regions/shizuoka/fuji/industries/judicial-scrivener/index.html',
  'stella/regions/shizuoka/fuji/industries/lawyer/index.html',
  'stella/regions/shizuoka/fuji/industries/lodging/index.html',
  'stella/regions/shizuoka/fuji/industries/real-estate/index.html',
  'stella/regions/shizuoka/fuji/industries/restaurant/index.html',
  'stella/regions/shizuoka/fuji/industries/tax-accountant/index.html',
  'stella/regions/shizuoka/hamamatsu/index.html',
  'stella/regions/shizuoka/hamamatsu/industries/administrative-scrivener/index.html',
  'stella/regions/shizuoka/hamamatsu/industries/beauty/index.html',
  'stella/regions/shizuoka/hamamatsu/industries/clinic/index.html',
  'stella/regions/shizuoka/hamamatsu/industries/cosmetic-clinic/index.html',
  'stella/regions/shizuoka/hamamatsu/industries/cram-school/index.html',
  'stella/regions/shizuoka/hamamatsu/industries/judicial-scrivener/index.html',
  'stella/regions/shizuoka/hamamatsu/industries/lawyer/index.html',
  'stella/regions/shizuoka/hamamatsu/industries/lodging/index.html',
  'stella/regions/shizuoka/hamamatsu/industries/real-estate/index.html',
  'stella/regions/shizuoka/hamamatsu/industries/restaurant/index.html',
  'stella/regions/shizuoka/hamamatsu/industries/tax-accountant/index.html',
  'stella/regions/shizuoka/index.html',
  'stella/regions/shizuoka/industries/administrative-scrivener/index.html',
  'stella/regions/shizuoka/industries/beauty/index.html',
  'stella/regions/shizuoka/industries/clinic/index.html',
  'stella/regions/shizuoka/industries/cosmetic-clinic/index.html',
  'stella/regions/shizuoka/industries/cram-school/index.html',
  'stella/regions/shizuoka/industries/judicial-scrivener/index.html',
  'stella/regions/shizuoka/industries/lawyer/index.html',
  'stella/regions/shizuoka/industries/lodging/index.html',
  'stella/regions/shizuoka/industries/real-estate/index.html',
  'stella/regions/shizuoka/industries/restaurant/index.html',
  'stella/regions/shizuoka/industries/tax-accountant/index.html',
  'stella/regions/shizuoka/mishima/index.html',
  'stella/regions/shizuoka/mishima/industries/administrative-scrivener/index.html',
  'stella/regions/shizuoka/mishima/industries/beauty/index.html',
  'stella/regions/shizuoka/mishima/industries/clinic/index.html',
  'stella/regions/shizuoka/mishima/industries/cosmetic-clinic/index.html',
  'stella/regions/shizuoka/mishima/industries/cram-school/index.html',
  'stella/regions/shizuoka/mishima/industries/judicial-scrivener/index.html',
  'stella/regions/shizuoka/mishima/industries/lawyer/index.html',
  'stella/regions/shizuoka/mishima/industries/lodging/index.html',
  'stella/regions/shizuoka/mishima/industries/real-estate/index.html',
  'stella/regions/shizuoka/mishima/industries/restaurant/index.html',
  'stella/regions/shizuoka/mishima/industries/tax-accountant/index.html',
  'stella/regions/shizuoka/numazu/index.html',
  'stella/regions/shizuoka/numazu/industries/administrative-scrivener/index.html',
  'stella/regions/shizuoka/numazu/industries/beauty/index.html',
  'stella/regions/shizuoka/numazu/industries/clinic/index.html',
  'stella/regions/shizuoka/numazu/industries/cosmetic-clinic/index.html',
  'stella/regions/shizuoka/numazu/industries/cram-school/index.html',
  'stella/regions/shizuoka/numazu/industries/judicial-scrivener/index.html',
  'stella/regions/shizuoka/numazu/industries/lawyer/index.html',
  'stella/regions/shizuoka/numazu/industries/lodging/index.html',
  'stella/regions/shizuoka/numazu/industries/real-estate/index.html',
  'stella/regions/shizuoka/numazu/industries/restaurant/index.html',
  'stella/regions/shizuoka/numazu/industries/tax-accountant/index.html',
  'stella/regions/shizuoka/shizuoka/index.html',
  'stella/regions/shizuoka/shizuoka/industries/administrative-scrivener/index.html',
  'stella/regions/shizuoka/shizuoka/industries/beauty/index.html',
  'stella/regions/shizuoka/shizuoka/industries/clinic/index.html',
  'stella/regions/shizuoka/shizuoka/industries/cosmetic-clinic/index.html',
  'stella/regions/shizuoka/shizuoka/industries/cram-school/index.html',
  'stella/regions/shizuoka/shizuoka/industries/judicial-scrivener/index.html',
  'stella/regions/shizuoka/shizuoka/industries/lawyer/index.html',
  'stella/regions/shizuoka/shizuoka/industries/lodging/index.html',
  'stella/regions/shizuoka/shizuoka/industries/real-estate/index.html',
  'stella/regions/shizuoka/shizuoka/industries/restaurant/index.html',
  'stella/regions/shizuoka/shizuoka/industries/tax-accountant/index.html',
  'stella/regions/tokyo/index.html',
  'stella/regions/tokyo/industries/administrative-scrivener/index.html',
  'stella/regions/tokyo/industries/beauty/index.html',
  'stella/regions/tokyo/industries/clinic/index.html',
  'stella/regions/tokyo/industries/cosmetic-clinic/index.html',
  'stella/regions/tokyo/industries/cram-school/index.html',
  'stella/regions/tokyo/industries/judicial-scrivener/index.html',
  'stella/regions/tokyo/industries/lawyer/index.html',
  'stella/regions/tokyo/industries/lodging/index.html',
  'stella/regions/tokyo/industries/real-estate/index.html',
  'stella/regions/tokyo/industries/restaurant/index.html',
  'stella/regions/tokyo/industries/tax-accountant/index.html',
  'stella/regions/tokyo/shibuya/index.html',
  'stella/regions/tokyo/shibuya/industries/administrative-scrivener/index.html',
  'stella/regions/tokyo/shibuya/industries/beauty/index.html',
  'stella/regions/tokyo/shibuya/industries/clinic/index.html',
  'stella/regions/tokyo/shibuya/industries/cosmetic-clinic/index.html',
  'stella/regions/tokyo/shibuya/industries/cram-school/index.html',
  'stella/regions/tokyo/shibuya/industries/judicial-scrivener/index.html',
  'stella/regions/tokyo/shibuya/industries/lawyer/index.html',
  'stella/regions/tokyo/shibuya/industries/lodging/index.html',
  'stella/regions/tokyo/shibuya/industries/real-estate/index.html',
  'stella/regions/tokyo/shibuya/industries/restaurant/index.html',
  'stella/regions/tokyo/shibuya/industries/tax-accountant/index.html',
// エラー・確認画面
  '404.html',
  'thanks.html',
];

const TARGET_FILES = [...STATIC_TARGETS];

// ページ種別 → 検証強度のマッピング
// full    : TOP（4 種 JSON-LD: ProfessionalService/WebSite/BreadcrumbList/Person）
//           v1.20: FAQPage は /faq/ のみに集約（重複コンテンツシグナル排除 / Google Q-A 表示縮小対応）
// service : 3 ハブ（2 種 JSON-LD: WebSite/BreadcrumbList）
//           v1.20: ProfessionalService は index.html のみで定義し、他は @id reference に集約
// subpage : 階層下位ページ（BreadcrumbList のみ必須・モバイル品質検証あり）
// profile : 代表プロフィール（subpage 相当・モバイル品質はスキップ）
// minimal : 法務/エラー/確認（最小チェック）
const PAGE_TYPE = {
  'index.html': 'full',

  'services/web/index.html': 'service',
  'services/lp/index.html': 'subpage',
  'services/refurbish/index.html': 'subpage',
  'services/ai-prediction/index.html': 'service',
  'vision/index.html': 'subpage',

  'pricing/index.html': 'subpage',
  'cases/index.html': 'subpage',
  'faq/index.html': 'subpage',
  'methodology/index.html': 'subpage',
  'profile/index.html': 'profile',

  'about/index.html': 'subpage',
  'contact/index.html': 'subpage',
  'legal/index.html': 'minimal',
  'privacy/index.html': 'minimal',
  'news/index.html': 'subpage',
  'recruit/index.html': 'subpage',
  'problems/index.html': 'minimal',  // Phase α stub / ① 起草中
  'problems/site-speed/index.html': 'minimal',  // Phase α stub / ① 起草中
  'problems/no-inquiry/index.html': 'minimal',  // Phase α stub / ① 起草中
  'problems/ai-search-invisible/index.html': 'minimal',  // Phase α stub / ① 起草中
  'problems/security-risk/index.html': 'minimal',  // Phase α stub / ① 起草中
  'problems/no-mobile/index.html': 'minimal',  // Phase α stub / ① 起草中
  'areas/index.html': 'minimal',  // Areas hub
  'areas/numazu/index.html': 'minimal',  // Areas city LP
  'areas/mishima/index.html': 'minimal',
  'areas/fuji/index.html': 'minimal',
  'areas/fujinomiya/index.html': 'minimal',
  'areas/susono/index.html': 'minimal',
  'areas/nagaizumi/index.html': 'minimal',
  'areas/shimizu/index.html': 'minimal',
  'services/web/industries/manufacturing/index.html': 'minimal',  // Industry LP
  'services/web/industries/clinic/index.html': 'minimal',
  'services/web/industries/construction/index.html': 'minimal',
  'services/web/industries/legal/index.html': 'minimal',
  'services/web/industries/restaurant/index.html': 'minimal',
  'services/web/industries/beauty/index.html': 'minimal',
  'services/web/industries/real-estate/index.html': 'minimal',
  'press/index.html': 'minimal',  // Press Release hub
  'press/2026-05-jpx-prime-1553/index.html': 'minimal',  // Press Release
  'insights/index.html': 'minimal',  // Phase α stub / ① 起草中
  'insights/core-web-vitals/index.html': 'minimal',  // Phase α stub / ① 起草中
  'insights/json-ld-implementation/index.html': 'minimal',  // Phase α stub / ① 起草中
  'insights/llmo-explained/index.html': 'minimal',  // Phase α stub / ① 起草中
  'insights/wikidata-for-ai/index.html': 'minimal',  // Phase α stub / ① 起草中
  'insights/security-5-principles/index.html': 'minimal',  // Phase α stub / ① 起草中
  'insights/eat-improvement/index.html': 'minimal',  // Phase α stub / ① 起草中
  'insights/longtail-seo/index.html': 'minimal',  // Phase α stub / ① 起草中
  'insights/search-intent/index.html': 'minimal',  // Phase α stub / ① 起草中
  'insights/geo-complete-guide/index.html': 'minimal',  // Insights 記事（本実装済み）
  'insights/ai-search-engines-compared/index.html': 'minimal',  // Insights 記事（本実装済み）
  'insights/llms-txt-debate/index.html': 'minimal',  // Insights 記事（本実装済み）
  'insights/get-cited-by-ai/index.html': 'minimal',  // Insights 記事（本実装済み）
  'insights/why-slow-site-loses-sales/index.html': 'minimal',  // Insights 記事（本実装済み）
  'insights/inp-deep-dive/index.html': 'minimal',  // Insights 記事（本実装済み）
  'insights/wordpress-vs-static/index.html': 'minimal',  // Insights 記事（本実装済み）
  'insights/modern-build-astro/index.html': 'minimal',  // Insights 記事（本実装済み）
  'insights/image-font-optimization/index.html': 'minimal',  // Insights 記事（本実装済み）
  'insights/are-you-really-safe/index.html': 'minimal',  // Insights 記事（本実装済み）
  'insights/wordpress-security-basics/index.html': 'minimal',  // Insights 記事（本実装済み）
  'insights/local-seo-guide/index.html': 'minimal',  // Insights 記事（本実装済み）
  'insights/google-business-profile/index.html': 'minimal',  // Insights 記事（本実装済み）
  'insights/seo-from-zero-backlinks/index.html': 'minimal',  // Insights 記事（本実装済み）
  'insights/measure-ai-traffic-ga4/index.html': 'minimal',  // Insights 記事（本実装済み）
  'insights/publish-is-not-the-goal/index.html': 'minimal',  // Insights 記事（本実装済み）
  'insights/accessibility-wcag22/index.html': 'minimal',  // Insights 記事（本実装済み）
  'insights/how-to-read-a-quote/index.html': 'minimal',  // Insights 記事（本実装済み）
  'insights/cheap-vs-expensive-site/index.html': 'minimal',  // Insights 記事（本実装済み）
  'insights/when-to-rebuild/index.html': 'minimal',  // Insights 記事（本実装済み）
  'insights/how-to-choose-web-company/index.html': 'minimal',  // Insights 記事（本実装済み）
  'insights/subsidy-for-website/index.html': 'minimal',  // Insights 記事（本実装済み）
  'insights/no-results-after-launch/index.html': 'minimal',  // Insights 記事（本実装済み）
  'insights/jpx-prime-1553-deep-dive/index.html': 'minimal',  // Insights 業界レポート (Phase E 連動)
  'insights/standard-market-prediction/index.html': 'minimal',  // Insights 業界レポート (Phase F 予測)
  'insights/from-17-to-90-points/index.html': 'minimal',  // Insights 方法論 (改善 10 ステップ)
  // Stella サブセクション (v1.37 Step 1 stub / ① 起草中)
  'stella/index.html': 'minimal',
  'stella/methodology/index.html': 'minimal',

  'stella/about/index.html': 'minimal',
  'stella/apply/index.html': 'minimal',
  'stella/case-studies/index.html': 'minimal',
  'stella/case-studies/tcharton-com/index.html': 'minimal',
  'stella/comparison/regions/shizuoka/index.html': 'minimal',
  'stella/comparison/regions/tokyo/index.html': 'minimal',
  'stella/contact/index.html': 'minimal',
  'stella/faq/index.html': 'minimal',
  'stella/improvement-guide/index.html': 'minimal',
  'stella/index.html': 'minimal',
  'stella/industries/administrative-scrivener/index.html': 'minimal',
  'stella/industries/beauty/index.html': 'minimal',
  'stella/industries/clinic/index.html': 'minimal',
  'stella/industries/cosmetic-clinic/index.html': 'minimal',
  'stella/industries/cram-school/index.html': 'minimal',
  'stella/industries/index.html': 'minimal',
  'stella/industries/judicial-scrivener/index.html': 'minimal',
  'stella/industries/lawyer/index.html': 'minimal',
  'stella/industries/lodging/index.html': 'minimal',
  'stella/industries/real-estate/index.html': 'minimal',
  'stella/industries/restaurant/index.html': 'minimal',
  'stella/industries/tax-accountant/index.html': 'minimal',
  'stella/legal/index.html': 'minimal',
  'stella/methodology/ai-search/index.html': 'minimal',
  'stella/methodology/business-impact/index.html': 'minimal',
  'stella/methodology/security/index.html': 'minimal',
  'stella/methodology/technical/index.html': 'minimal',
  'stella/news/index.html': 'minimal',
  'stella/news/shizuoka-industry-report-2026-q2/index.html': 'minimal',
  'stella/opt-out/index.html': 'minimal',
  'stella/press/index.html': 'minimal',
  'stella/privacy/index.html': 'minimal',
  'stella/rankings/2026/05/index.html': 'minimal',
  'stella/regions/index.html': 'minimal',
  'stella/regions/shizuoka/fuji/index.html': 'minimal',
  'stella/regions/shizuoka/fuji/industries/administrative-scrivener/index.html': 'minimal',
  'stella/regions/shizuoka/fuji/industries/beauty/index.html': 'minimal',
  'stella/regions/shizuoka/fuji/industries/clinic/index.html': 'minimal',
  'stella/regions/shizuoka/fuji/industries/cosmetic-clinic/index.html': 'minimal',
  'stella/regions/shizuoka/fuji/industries/cram-school/index.html': 'minimal',
  'stella/regions/shizuoka/fuji/industries/judicial-scrivener/index.html': 'minimal',
  'stella/regions/shizuoka/fuji/industries/lawyer/index.html': 'minimal',
  'stella/regions/shizuoka/fuji/industries/lodging/index.html': 'minimal',
  'stella/regions/shizuoka/fuji/industries/real-estate/index.html': 'minimal',
  'stella/regions/shizuoka/fuji/industries/restaurant/index.html': 'minimal',
  'stella/regions/shizuoka/fuji/industries/tax-accountant/index.html': 'minimal',
  'stella/regions/shizuoka/hamamatsu/index.html': 'minimal',
  'stella/regions/shizuoka/hamamatsu/industries/administrative-scrivener/index.html': 'minimal',
  'stella/regions/shizuoka/hamamatsu/industries/beauty/index.html': 'minimal',
  'stella/regions/shizuoka/hamamatsu/industries/clinic/index.html': 'minimal',
  'stella/regions/shizuoka/hamamatsu/industries/cosmetic-clinic/index.html': 'minimal',
  'stella/regions/shizuoka/hamamatsu/industries/cram-school/index.html': 'minimal',
  'stella/regions/shizuoka/hamamatsu/industries/judicial-scrivener/index.html': 'minimal',
  'stella/regions/shizuoka/hamamatsu/industries/lawyer/index.html': 'minimal',
  'stella/regions/shizuoka/hamamatsu/industries/lodging/index.html': 'minimal',
  'stella/regions/shizuoka/hamamatsu/industries/real-estate/index.html': 'minimal',
  'stella/regions/shizuoka/hamamatsu/industries/restaurant/index.html': 'minimal',
  'stella/regions/shizuoka/hamamatsu/industries/tax-accountant/index.html': 'minimal',
  'stella/regions/shizuoka/index.html': 'minimal',
  'stella/regions/shizuoka/industries/administrative-scrivener/index.html': 'minimal',
  'stella/regions/shizuoka/industries/beauty/index.html': 'minimal',
  'stella/regions/shizuoka/industries/clinic/index.html': 'minimal',
  'stella/regions/shizuoka/industries/cosmetic-clinic/index.html': 'minimal',
  'stella/regions/shizuoka/industries/cram-school/index.html': 'minimal',
  'stella/regions/shizuoka/industries/judicial-scrivener/index.html': 'minimal',
  'stella/regions/shizuoka/industries/lawyer/index.html': 'minimal',
  'stella/regions/shizuoka/industries/lodging/index.html': 'minimal',
  'stella/regions/shizuoka/industries/real-estate/index.html': 'minimal',
  'stella/regions/shizuoka/industries/restaurant/index.html': 'minimal',
  'stella/regions/shizuoka/industries/tax-accountant/index.html': 'minimal',
  'stella/regions/shizuoka/mishima/index.html': 'minimal',
  'stella/regions/shizuoka/mishima/industries/administrative-scrivener/index.html': 'minimal',
  'stella/regions/shizuoka/mishima/industries/beauty/index.html': 'minimal',
  'stella/regions/shizuoka/mishima/industries/clinic/index.html': 'minimal',
  'stella/regions/shizuoka/mishima/industries/cosmetic-clinic/index.html': 'minimal',
  'stella/regions/shizuoka/mishima/industries/cram-school/index.html': 'minimal',
  'stella/regions/shizuoka/mishima/industries/judicial-scrivener/index.html': 'minimal',
  'stella/regions/shizuoka/mishima/industries/lawyer/index.html': 'minimal',
  'stella/regions/shizuoka/mishima/industries/lodging/index.html': 'minimal',
  'stella/regions/shizuoka/mishima/industries/real-estate/index.html': 'minimal',
  'stella/regions/shizuoka/mishima/industries/restaurant/index.html': 'minimal',
  'stella/regions/shizuoka/mishima/industries/tax-accountant/index.html': 'minimal',
  'stella/regions/shizuoka/numazu/index.html': 'minimal',
  'stella/regions/shizuoka/numazu/industries/administrative-scrivener/index.html': 'minimal',
  'stella/regions/shizuoka/numazu/industries/beauty/index.html': 'minimal',
  'stella/regions/shizuoka/numazu/industries/clinic/index.html': 'minimal',
  'stella/regions/shizuoka/numazu/industries/cosmetic-clinic/index.html': 'minimal',
  'stella/regions/shizuoka/numazu/industries/cram-school/index.html': 'minimal',
  'stella/regions/shizuoka/numazu/industries/judicial-scrivener/index.html': 'minimal',
  'stella/regions/shizuoka/numazu/industries/lawyer/index.html': 'minimal',
  'stella/regions/shizuoka/numazu/industries/lodging/index.html': 'minimal',
  'stella/regions/shizuoka/numazu/industries/real-estate/index.html': 'minimal',
  'stella/regions/shizuoka/numazu/industries/restaurant/index.html': 'minimal',
  'stella/regions/shizuoka/numazu/industries/tax-accountant/index.html': 'minimal',
  'stella/regions/shizuoka/shizuoka/index.html': 'minimal',
  'stella/regions/shizuoka/shizuoka/industries/administrative-scrivener/index.html': 'minimal',
  'stella/regions/shizuoka/shizuoka/industries/beauty/index.html': 'minimal',
  'stella/regions/shizuoka/shizuoka/industries/clinic/index.html': 'minimal',
  'stella/regions/shizuoka/shizuoka/industries/cosmetic-clinic/index.html': 'minimal',
  'stella/regions/shizuoka/shizuoka/industries/cram-school/index.html': 'minimal',
  'stella/regions/shizuoka/shizuoka/industries/judicial-scrivener/index.html': 'minimal',
  'stella/regions/shizuoka/shizuoka/industries/lawyer/index.html': 'minimal',
  'stella/regions/shizuoka/shizuoka/industries/lodging/index.html': 'minimal',
  'stella/regions/shizuoka/shizuoka/industries/real-estate/index.html': 'minimal',
  'stella/regions/shizuoka/shizuoka/industries/restaurant/index.html': 'minimal',
  'stella/regions/shizuoka/shizuoka/industries/tax-accountant/index.html': 'minimal',
  'stella/regions/tokyo/index.html': 'minimal',
  'stella/regions/tokyo/industries/administrative-scrivener/index.html': 'minimal',
  'stella/regions/tokyo/industries/beauty/index.html': 'minimal',
  'stella/regions/tokyo/industries/clinic/index.html': 'minimal',
  'stella/regions/tokyo/industries/cosmetic-clinic/index.html': 'minimal',
  'stella/regions/tokyo/industries/cram-school/index.html': 'minimal',
  'stella/regions/tokyo/industries/judicial-scrivener/index.html': 'minimal',
  'stella/regions/tokyo/industries/lawyer/index.html': 'minimal',
  'stella/regions/tokyo/industries/lodging/index.html': 'minimal',
  'stella/regions/tokyo/industries/real-estate/index.html': 'minimal',
  'stella/regions/tokyo/industries/restaurant/index.html': 'minimal',
  'stella/regions/tokyo/industries/tax-accountant/index.html': 'minimal',
  'stella/regions/tokyo/shibuya/index.html': 'minimal',
  'stella/regions/tokyo/shibuya/industries/administrative-scrivener/index.html': 'minimal',
  'stella/regions/tokyo/shibuya/industries/beauty/index.html': 'minimal',
  'stella/regions/tokyo/shibuya/industries/clinic/index.html': 'minimal',
  'stella/regions/tokyo/shibuya/industries/cosmetic-clinic/index.html': 'minimal',
  'stella/regions/tokyo/shibuya/industries/cram-school/index.html': 'minimal',
  'stella/regions/tokyo/shibuya/industries/judicial-scrivener/index.html': 'minimal',
  'stella/regions/tokyo/shibuya/industries/lawyer/index.html': 'minimal',
  'stella/regions/tokyo/shibuya/industries/lodging/index.html': 'minimal',
  'stella/regions/tokyo/shibuya/industries/real-estate/index.html': 'minimal',
  'stella/regions/tokyo/shibuya/industries/restaurant/index.html': 'minimal',
  'stella/regions/tokyo/shibuya/industries/tax-accountant/index.html': 'minimal',
  '404.html': 'minimal',
  'thanks.html': 'minimal',
};

// ─── SPEC 10.6 Body Theme Variants（v2.4 必須） ───
// 各ページがどの Variant を採用すべきかを定義（SPEC 10.6.2 準拠）
const THEME_VARIANTS = {
  marketing: {
    required: ['bg-white', 'text-dark-700', 'font-sans', 'antialiased'],
    forbidden: ['bg-dark-900', 'text-dark-300'],
    colorScheme: 'light',
  },
  reading: {
    required: ['bg-dark-900', 'text-dark-300', 'font-sans', 'antialiased'],
    forbidden: ['bg-white', 'text-dark-700'],
    colorScheme: 'dark',
  },
};

// SPEC v3.2 §1.2 / §10.6.2 — Body Theme Variant 正典マッピング
// marketing: 訴求・コンバージョン用途（明色）
// reading  : 集中閲覧・長文用途（暗色）
function getVariant(relPath) {
  // 全ページ Light 統一 (Stella 含む / 代表 5/13 指示: HARTON サイト完全一致)
  return 'marketing';
}

// カスタムCSSクラス（output.css照合から除外）
const CUSTOM_CLASSES = new Set([
  'fade-in','visible','hero-grid','glow','card-hover','nav-blur',
  'mobile-menu','open','float','pulse-line','gradient-text',
  'cat-tab','active','sr-only','fade-in-delay-1','fade-in-delay-2',
  'fade-in-delay-3','check-circle','check-ring',
  // v1.17 観点 1 マイクロインタラクション 追加 (Reviewer C-CRITICAL: 既存規約整合)
  'intent-hover',
  // v1.19 観点 4 Hero SVG オーバーレイ
  'hero-overlay','hero-overlay-lines','hero-overlay-nodes',
]);

// ═══════════════════ 結果クラス ═══════════════════
class R {
  constructor(id, sec, name, status, detail = '') {
    this.id = id; this.sec = sec; this.name = name;
    this.status = status; this.detail = detail;
  }
}
const PASS = (id, s, n, d) => new R(id, s, n, 'PASS', d || '');
const FAIL = (id, s, n, d) => new R(id, s, n, 'FAIL', d || '');
const WARN = (id, s, n, d) => new R(id, s, n, 'WARN', d || '');
const SKIP = (id, s, n, d) => new R(id, s, n, 'SKIP', d || '');

// ═══════════════════ パーサ ═══════════════════
const head = h => (h.match(/<head[^>]*>([\s\S]*?)<\/head>/i) || [])[1] || '';
const body = h => (h.match(/<body[^>]*>([\s\S]*?)<\/body>/i) || [])[1] || '';
const bodyClass = h => (h.match(/<body\s+class=["']([^"']*)["']/i) || [])[1] || '';
const title = h => (h.match(/<title>([^<]*)<\/title>/i) || [])[1] || null;
const len = s => [...s].length;

function meta(html, name) {
  let m = html.match(new RegExp(`<meta\\s+name=["']${name}["']\\s+content=["']([^"']*)["']`, 'i'));
  if (m) return m[1];
  m = html.match(new RegExp(`<meta\\s+content=["']([^"']*)["']\\s+name=["']${name}["']`, 'i'));
  return m ? m[1] : null;
}
function ogp(html, prop) {
  let m = html.match(new RegExp(`<meta\\s+property=["']${prop}["']\\s+content=["']([^"']*)["']`, 'i'));
  if (m) return m[1];
  m = html.match(new RegExp(`<meta\\s+content=["']([^"']*)["']\\s+property=["']${prop}["']`, 'i'));
  return m ? m[1] : null;
}
function jsonld(html) {
  const r = []; let m;
  const rx = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
  while ((m = rx.exec(html)) !== null) {
    try { r.push(JSON.parse(m[1])); } catch { r.push({ _err: true }); }
  }
  return r;
}
function jsonldTypes(schemas) {
  const t = new Set();
  const addType = (v) => {
    if (Array.isArray(v)) v.forEach(x => x && t.add(x));
    else if (v) t.add(v);
  };
  for (const s of schemas) {
    addType(s['@type']);
    if (s['@graph']) s['@graph'].forEach(i => addType(i['@type']));
  }
  return t;
}
function hasType(schema, typeName) {
  const t = schema?.['@type'];
  if (Array.isArray(t)) return t.includes(typeName);
  return t === typeName;
}
function headings(html) {
  const h = []; let m;
  const rx = /<(h[1-6])[^>]*>([\s\S]*?)<\/\1>/gi;
  while ((m = rx.exec(html)) !== null)
    h.push({ lv: +m[1][1], txt: m[2].replace(/<[^>]+>/g, '').trim() });
  return h;
}
function csp(html) {
  const m = html.match(/<meta\s+http-equiv=["']Content-Security-Policy["']\s+content="([^"]*)"/i) ||
            html.match(/<meta\s+http-equiv=["']Content-Security-Policy["']\s+content='([^']*)'/i);
  return m ? m[1] : null;
}
function loadCSS() {
  const p = path.join(ROOT, 'dist', 'output.css');
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf-8') : null;
}
function hexLum(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const rgb = [0,2,4].map(i => parseInt(hex.substring(i, i+2), 16) / 255);
  const lin = rgb.map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}
function contrast(a, b) {
  const la = hexLum(a), lb = hexLum(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

// ═══════════════════ 11.1 パフォーマンス・CWV (6) ═══════════════════

function c11_1(html, pt) {
  const S = '11.1パフォ', r = [], hd = head(html), bd = body(html);

  // 1. CLS/LCP/INP 静的リスクチェック
  let clsRisk = 0;
  const imgs = bd.match(/<img\s[^>]*>/gi) || [];
  imgs.forEach(i => { if (!/width=/i.test(i) || !/height=/i.test(i)) clsRisk++; });
  if (/cdn\.tailwindcss\.com/i.test(html)) clsRisk += 10;
  (html.match(/fonts\.googleapis\.com\/css2[^"']*/gi) || []).forEach(u => {
    if (!u.includes('display=swap')) clsRisk++;
  });
  r.push(clsRisk === 0
    ? PASS('11.1-cwv', S, 'CWV静的リスク')
    : FAIL('11.1-cwv', S, 'CWV静的リスク', `${clsRisk}件のリスク要因`));

  // 2. Tailwind CDN禁止
  r.push(/cdn\.tailwindcss\.com/i.test(html)
    ? FAIL('11.1-cdn', S, 'Tailwind CDN禁止', 'cdn.tailwindcss.com使用')
    : PASS('11.1-cdn', S, 'Tailwind CDN不使用'));

  // 3. ビルドCSS照合
  const css = loadCSS();
  if (!css) {
    r.push(FAIL('11.1-css', S, 'CSSクラス照合', 'dist/output.css不存在'));
  } else {
    const clsRx = /class=["']([^"']*)["']/gi; let m; const all = new Set();
    while ((m = clsRx.exec(html)) !== null) m[1].split(/\s+/).forEach(c => c && all.add(c));
    const miss = [];
    for (const c of all) {
      if (CUSTOM_CLASSES.has(c) || /^[{$]/.test(c)) continue;
      // Tailwindクラス判定
      if (!/^(bg-|text-|font-|p-|px-|py-|pt-|pb-|m-|mx-|my-|mt-|mb-|w-|h-|min-|max-|flex|grid|block|inline|hidden|absolute|relative|fixed|sticky|top-|bottom-|left-|right-|z-|border|rounded|shadow|opacity-|transition|transform|scale-|gap-|space-|items-|justify-|self-|order-|col-|row-|overflow|truncate|whitespace|tracking-|leading-|decoration-|underline|list-|table|divide|ring|outline|cursor|pointer|select-|fill-|stroke-|object-|aspect-|sm:|md:|lg:|xl:|2xl:|hover:|focus:|active:|group|dark:|disabled:)/.test(c))
        continue;
      // Tailwind CSSではセレクタ内の特殊文字をバックスラッシュでエスケープする
      // 例: focus:z-[9999] → .focus\:z-\[9999\]:focus
      //     bg-white/80 → .bg-white\/80
      const escCSS = s => s.replace(/([[\]()/:.,!#%])/g, '\\$1');
      const base = c.replace(/^(sm:|md:|lg:|xl:|2xl:|hover:|focus:|active:|group-hover:|dark:|disabled:)+/, '');
      const baseEsc = escCSS(base);
      const fullEsc = escCSS(c);
      if (!css.includes(base) && !css.includes(baseEsc) && !css.includes(fullEsc)) miss.push(c);
    }
    r.push(miss.length === 0
      ? PASS('11.1-css', S, 'CSSクラス照合', `${all.size}クラス検証済`)
      : FAIL('11.1-css', S, 'CSSクラス照合', `${miss.length}欠落: ${miss.slice(0, 5).join(', ')}`));
  }

  // 4. コンソールエラー(静的)
  const schemas = jsonld(html);
  if (schemas.some(s => s._err)) {
    r.push(FAIL('11.1-err', S, 'JSON-LDパースエラー'));
  } else {
    const scripts = bd.match(/<script[^>]*>[\s\S]*?<\/script>/gi) || [];
    let jsErr = false;
    scripts.forEach(s => {
      const c = s.replace(/<\/?script[^>]*>/gi, '');
      if ((c.match(/\{/g) || []).length !== (c.match(/\}/g) || []).length) jsErr = true;
    });
    r.push(jsErr ? FAIL('11.1-err', S, 'JS構文エラー', '括弧不一致') : PASS('11.1-err', S, '静的エラーチェック'));
  }

  // 5. 画像(WebP/picture/wh/lazy/fetchpriority)
  if (imgs.length === 0) {
    r.push(SKIP('11.1-img', S, '画像チェック', '画像なし'));
  } else {
    let noAlt = 0, noWH = 0;
    const raster = imgs.filter(i => !/\.svg/i.test(i) && !/data:image\/svg/i.test(i));
    imgs.forEach(i => { if (!/alt=/i.test(i)) noAlt++; });
    raster.forEach(i => { if (!/width=/i.test(i) || !/height=/i.test(i)) noWH++; });
    r.push(noAlt > 0
      ? FAIL('11.1-alt', S, '画像alt', `${noAlt}個にalt不足`)
      : PASS('11.1-alt', S, '画像alt', `${imgs.length}個OK`));
    r.push(noWH > 0
      ? FAIL('11.1-wh', S, '画像width/height', `${noWH}個に不足`)
      : PASS('11.1-wh', S, '画像width/height'));
    // fetchpriority on hero(fullのみ)
    if (pt === 'full') {
      const hasFP = /fetchpriority=["']high["']/i.test(bd);
      r.push(hasFP ? PASS('11.1-fp', S, 'fetchpriority="high"') : WARN('11.1-fp', S, 'fetchpriority="high"', 'ヒーロー画像に未設定'));
    }
    // alt日本語
    const alts = [];
    imgs.forEach(i => { const a = (i.match(/alt=["']([^"']*)["']/i) || [])[1]; if (a) alts.push(a); });
    const nonJa = alts.filter(a => a && !/[\u3000-\u9fff\uff00-\uffef]/.test(a));
    r.push(nonJa.length > 0 ? WARN('11.1-altja', S, '画像alt日本語', `非日本語: "${nonJa.slice(0,2).join('","')}"`) : PASS('11.1-altja', S, '画像alt日本語'));
  }

  // 6. サードパーティスクリプト遅延
  const extScripts = (hd.match(/<script\s[^>]*src=["'][^"']*["'][^>]*>/gi) || [])
    .filter(s => /https?:\/\//i.test(s));
  const syncExt = extScripts.filter(s => !/async|defer/i.test(s));
  r.push(syncExt.length > 0
    ? FAIL('11.1-defer', S, 'サードパーティ遅延', `${syncExt.length}件同期読込`)
    : PASS('11.1-defer', S, 'サードパーティ遅延'));

  // CSSサイズ
  const cssPath = path.join(ROOT, 'dist', 'output.css');
  if (fs.existsSync(cssPath)) {
    const kb = fs.statSync(cssPath).size / 1024;
    r.push(kb <= 40
      ? PASS('11.1-csssz', S, `CSSサイズ ${kb.toFixed(1)}KB`)
      : WARN('11.1-csssz', S, 'CSSサイズ', `${kb.toFixed(1)}KB (目標40KB以下)`));
  }

  return r;
}

// ═══════════════════ 11.2 SEO・E-E-A-T (12) ═══════════════════

function c11_2(html, pt) {
  const S = '11.2SEO', r = [];

  // 1. title
  const t = title(html);
  if (!t) { r.push(FAIL('11.2-title', S, 'title', '未設定')); }
  else {
    const l = len(t);
    if (pt === 'minimal') r.push(l > 0 ? PASS('11.2-title', S, `title(${l}文字)`, `"${t}"`) : FAIL('11.2-title', S, 'title', '空'));
    else if (pt === 'subpage' || pt === 'profile') r.push(l >= 15 && l <= 60 ? PASS('11.2-title', S, `title ${l}文字(15-60)`) : FAIL('11.2-title', S, `title ${l}文字`, '15-60文字必須'));
    else r.push(l >= 30 && l <= 60 ? PASS('11.2-title', S, `title ${l}文字(30-60)`) : FAIL('11.2-title', S, `title ${l}文字`, '30-60文字必須'));
  }

  // 2. description
  const d = meta(html, 'description');
  if (pt === 'minimal') { r.push(d ? PASS('11.2-desc', S, 'description') : WARN('11.2-desc', S, 'description', 'なし')); }
  else {
    if (!d) r.push(FAIL('11.2-desc', S, 'description', '未設定'));
    else { const l = len(d); r.push(l >= 70 && l <= 160 ? PASS('11.2-desc', S, `description ${l}文字`) : FAIL('11.2-desc', S, `description ${l}文字`, '70-160必須')); }
  }

  // 3. meta author
  const auth = meta(html, 'author');
  if (pt === 'minimal') r.push(auth ? PASS('11.2-author', S, 'meta author') : SKIP('11.2-author', S, 'meta author'));
  else r.push(auth ? PASS('11.2-author', S, 'meta author', auth) : FAIL('11.2-author', S, 'meta author', '未設定'));

  // 4. canonical
  const canon = (html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i) || [])[1];
  if (!canon) r.push(pt === 'minimal' ? WARN('11.2-canon', S, 'canonical', '未設定') : FAIL('11.2-canon', S, 'canonical', '未設定'));
  else r.push(canon.startsWith(DOMAIN) ? PASS('11.2-canon', S, 'canonical') : FAIL('11.2-canon', S, 'canonical', `ドメイン不一致: ${canon}`));

  // 5. robots max-snippet:-1
  const rob = meta(html, 'robots');
  if (pt === 'minimal') {
    r.push(rob && (rob.includes('noindex') || rob.includes('nofollow')) ? PASS('11.2-robots', S, 'robots(noindex)') : (rob ? PASS('11.2-robots', S, 'robots') : WARN('11.2-robots', S, 'robots')));
  } else {
    if (!rob) r.push(FAIL('11.2-robots', S, 'robots', '未設定'));
    else {
      const need = ['index', 'follow', 'max-image-preview:large', 'max-snippet:-1'];
      const miss = need.filter(n => !rob.includes(n));
      r.push(miss.length === 0 ? PASS('11.2-robots', S, 'robots') : FAIL('11.2-robots', S, 'robots', `不足: ${miss.join(',')}`));
    }
  }

  // 6. OGP 7項目
  if (pt === 'minimal') { r.push(SKIP('11.2-ogp', S, 'OGP')); }
  else {
    const need = ['og:title','og:description','og:type','og:url','og:image','og:site_name','og:locale'];
    const miss = need.filter(p => !ogp(html, p));
    r.push(miss.length === 0 ? PASS('11.2-ogp', S, 'OGP全7項目') : FAIL('11.2-ogp', S, 'OGP', `不足: ${miss.join(',')}`));
    const img = ogp(html, 'og:image');
    if (img && !img.startsWith(DOMAIN)) r.push(FAIL('11.2-ogimg', S, 'OGP画像URL', img));
  }

  // 7. Twitter Card
  if (pt === 'minimal') { r.push(SKIP('11.2-tw', S, 'Twitter Card')); }
  else {
    const miss = [];
    if (meta(html, 'twitter:card') !== 'summary_large_image') miss.push('card');
    if (!meta(html, 'twitter:title')) miss.push('title');
    if (!meta(html, 'twitter:description')) miss.push('desc');
    if (!meta(html, 'twitter:image')) miss.push('image');
    r.push(miss.length === 0 ? PASS('11.2-tw', S, 'Twitter Card') : FAIL('11.2-tw', S, 'Twitter Card', `不足: ${miss.join(',')}`));
  }

  // 8. JSON-LD 5種
  if (pt === 'minimal') { r.push(SKIP('11.2-jld', S, 'JSON-LD')); }
  else {
    const types = jsonldTypes(jsonld(html));
    const need = pt === 'full'
      ? ['ProfessionalService', 'WebSite', 'BreadcrumbList', 'Person']      // v1.20: FAQPage 削除
      : (pt === 'subpage' || pt === 'profile') ? ['BreadcrumbList']
      : ['WebSite', 'BreadcrumbList'];                                       // v1.20: ProfessionalService 削除
    need.forEach(t => r.push(types.has(t)
      ? PASS(`11.2-${t}`, S, `JSON-LD: ${t}`)
      : FAIL(`11.2-${t}`, S, `JSON-LD: ${t}`, '未定義')));
    // ProfessionalService プロパティ
    // v1.20: @id reference 化した schema は必須プロパティチェックをスキップ
    // (集約先 = index.html "https://tcharton.com/#professional-service" 側で完全定義済)
    if (types.has('ProfessionalService')) {
      const schemas = jsonld(html);
      const ps = schemas.find(s => hasType(s, 'ProfessionalService')) ||
                 schemas.flatMap(s => s['@graph'] || []).find(i => hasType(i, 'ProfessionalService'));
      if (ps) {
        const isIdReference = ps['@id'] && Object.keys(ps).filter(k => k !== '@context' && k !== '@type' && k !== '@id').length === 0;
        if (isIdReference) {
          r.push(PASS('11.2-ps', S, 'PS必須プロパティ',
            `@id reference (集約元 = ${ps['@id']}) / v1.20 SoT 構造`));
        } else {
          const need2 = ['name','description','url','address','geo','knowsAbout','areaServed'];
          const miss = need2.filter(p => !ps[p]);
          r.push(miss.length === 0 ? PASS('11.2-ps', S, 'PS必須プロパティ') : FAIL('11.2-ps', S, 'PS必須プロパティ', `不足: ${miss.join(',')}`));
        }
      }
    }
  }

  // 9. (リッチリザルトテストは外部APIのため静的チェック不可→パース成功で代替)
  if (pt !== 'minimal') {
    const schemas = jsonld(html);
    r.push(schemas.some(s => s._err)
      ? FAIL('11.2-rich', S, 'JSON-LD構文', 'パースエラー→リッチリザルトテスト不合格の可能性')
      : PASS('11.2-rich', S, 'JSON-LD構文(パース成功)'));
  }

  // 10,11. sitemap.xml / robots.txt → グローバルチェックで実施

  // 12. <time> タグ(datePublished/dateModified)
  if (pt === 'minimal') { r.push(SKIP('11.2-time', S, '<time>タグ')); }
  else {
    const bd2 = body(html);
    const hasPub = /itemprop=["']datePublished["']/i.test(bd2) || /<time[^>]*datetime=/i.test(bd2);
    r.push(hasPub ? PASS('11.2-time', S, '<time>タグ') : WARN('11.2-time', S, '<time>タグ', '公開日/更新日の<time>未検出'));
  }

  return r;
}

// ═══════════════════ 11.3 E-E-A-Tコンテンツ (3) ═══════════════════

function c11_3_eeat() {
  const S = '11.3E-E-AT', r = [];

  // 1. profile/index.html 存在
  const pp = path.join(ROOT, 'profile', 'index.html');
  r.push(fs.existsSync(pp)
    ? PASS('11.3-profile', S, 'プロフィールページ')
    : FAIL('11.3-profile', S, 'プロフィールページ', 'profile/index.html不存在'));

  // 2. 一次情報（自動検出は困難→プロフィールページに内容があるかで簡易チェック）
  if (fs.existsSync(pp)) {
    const c = fs.readFileSync(pp, 'utf-8');
    const bodyLen = (body(c) || c).replace(/<[^>]+>/g, '').trim().length;
    r.push(bodyLen > 200
      ? PASS('11.3-1st', S, '一次情報(プロフィール内容)', `${bodyLen}文字`)
      : WARN('11.3-1st', S, '一次情報', `プロフィール内容が少ない(${bodyLen}文字)`));
  } else {
    r.push(FAIL('11.3-1st', S, '一次情報', 'プロフィールページ不存在'));
  }

  // 3. 孤立ページなし（TOP からの主要ハブ・必須情報層へのリンクがあるか）
  // SPEC v3.2 §1.2 18ページのうち、TOPから直接導線が必要な主要ページ
  const mainHtml = fs.existsSync(path.join(ROOT, 'index.html'))
    ? fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8') : '';
  const pages = [
    'services/web/', 'services/maintenance/', 'services/ai-prediction/',
    'pricing/', 'cases/', 'faq/', 'profile/',
    'about/', 'contact/', 'legal/', 'privacy/', 'news/',
  ];
  const orphans = pages.filter(p => !mainHtml.includes(p));
  r.push(orphans.length === 0
    ? PASS('11.3-orphan', S, '孤立ページなし')
    : WARN('11.3-orphan', S, '孤立ページ', `index.htmlからリンクなし: ${orphans.join(', ')}`));

  return r;
}

// ═══════════════════ 11.4 LLMO (7) ═══════════════════

function c11_4(html, pt) {
  const S = '11.4LLMO', r = [], bd = body(html);

  // 1. 全sectionにaria-label
  if (pt === 'minimal') { r.push(SKIP('11.4-sec', S, 'section aria-label')); }
  else {
    const secs = bd.match(/<section[^>]*>/gi) || [];
    const noL = secs.filter(s => !/aria-label(ledby)?=/i.test(s));
    r.push(noL.length === 0 && secs.length > 0
      ? PASS('11.4-sec', S, `section aria-label(${secs.length}個)`)
      : (secs.length === 0 ? SKIP('11.4-sec', S, 'section') : FAIL('11.4-sec', S, 'section aria-label', `${noL.length}個に不足`)));
  }

  // 2. 全navにaria-label（メイン,モバイル,パンくず,フッター = 最低4）
  if (pt === 'minimal') { r.push(SKIP('11.4-nav', S, 'nav aria-label')); }
  else {
    const navs = bd.match(/<nav[^>]*>/gi) || [];
    const noL = navs.filter(n => !/aria-label(ledby)?=/i.test(n));
    r.push(noL.length === 0 && navs.length > 0
      ? PASS('11.4-nav', S, `nav aria-label(${navs.length}個)`)
      : FAIL('11.4-nav', S, 'nav aria-label', noL.length > 0 ? `${noL.length}個に不足` : 'navなし'));
    // 最低4チェック(full/serviceで期待)
    if (pt === 'full' && navs.length < 4) {
      r.push(WARN('11.4-nav4', S, 'nav数(4以上推奨)', `現在${navs.length}個`));
    }
  }

  // 3. H1→H2→H3スキップなし
  const hs = headings(html);
  const h1s = hs.filter(h => h.lv === 1);
  if (h1s.length === 0) r.push(FAIL('11.4-h1', S, 'H1', 'H1なし'));
  else if (h1s.length > 1) r.push(FAIL('11.4-h1', S, 'H1', `${h1s.length}個(1個必須)`));
  else r.push(PASS('11.4-h1', S, 'H1', h1s[0].txt.substring(0, 40)));
  let prev = 0, skip = false;
  for (const h of hs) {
    if (prev > 0 && h.lv > prev + 1) {
      r.push(FAIL('11.4-hskip', S, '見出し階層', `H${prev}→H${h.lv}`));
      skip = true; break;
    }
    prev = h.lv;
  }
  if (!skip && hs.length > 0) r.push(PASS('11.4-hskip', S, '見出し階層スキップなし'));

  // 4. table caption + th scope
  const tables = bd.match(/<table[\s\S]*?<\/table>/gi) || [];
  if (tables.length === 0) r.push(SKIP('11.4-tbl', S, 'table'));
  else {
    let issue = 0;
    tables.forEach(t => { if (!/<caption/i.test(t) || !/<th[^>]*scope=/i.test(t)) issue++; });
    r.push(issue === 0 ? PASS('11.4-tbl', S, 'table caption+th scope') : FAIL('11.4-tbl', S, 'table', `${issue}件問題`));
  }

  // 5. JSON-LD機械可読
  if (pt === 'minimal') r.push(SKIP('11.4-jld', S, 'JSON-LD機械可読'));
  else {
    const s = jsonld(html);
    r.push(s.length > 0 && !s.some(x => x._err) ? PASS('11.4-jld', S, 'JSON-LD機械可読', `${s.length}ブロック`) : FAIL('11.4-jld', S, 'JSON-LD機械可読'));
  }

  // 6. JSなしで全情報取得可能
  r.push(/innerHTML\s*=|document\.write|\.insertAdjacentHTML/i.test(bd)
    ? WARN('11.4-nojs', S, 'JSなし情報取得', 'JS動的コンテンツ生成あり')
    : PASS('11.4-nojs', S, 'JSなし情報取得'));

  // 7. lang="ja"
  const lang = (html.match(/<html[^>]*\slang=["']([^"']*)["']/i) || [])[1];
  r.push(lang === 'ja' ? PASS('11.4-lang', S, 'lang="ja"') : FAIL('11.4-lang', S, 'lang="ja"', lang ? `lang="${lang}"` : 'なし'));

  return r;
}

// ═══════════════════ 11.5 アクセシビリティ (7) ═══════════════════

function c11_5(html) {
  const S = '11.5a11y', r = [], bd = body(html);

  // 1. タッチターゲット44px
  const btns = bd.match(/<button[^>]*class=["'][^"']*["'][^>]*>/gi) || [];
  const links = bd.match(/<a[^>]*class=["'][^"']*["'][^>]*>/gi) || [];
  let viol = 0;
  [...btns, ...links].forEach(el => {
    const cls = (el.match(/class=["']([^"']*)["']/i) || [])[1] || '';
    if (cls.includes('sr-only') || cls.includes('hidden')) return;
    const py = (cls.match(/\bpy-(\d+)\b/) || [])[1];
    const h = (cls.match(/\bh-(\d+)\b/) || [])[1];
    const p = (cls.match(/\bp-(\d+)\b/) || [])[1];
    if ((py && +py >= 3) || (h && +h >= 10) || (p && +p >= 3)) return;
    if (cls.includes('py-[') || cls.includes('min-h-')) return;
    // インラインリンク除外
    if (!py && !h && !p && !cls.includes('rounded') && !cls.includes('bg-') && !cls.includes('block') && !cls.includes('flex') && !cls.includes('inline-flex')) return;
    viol++;
  });
  r.push(viol === 0 ? PASS('11.5-touch', S, 'タッチターゲット44px') : WARN('11.5-touch', S, 'タッチターゲット', `${viol}件がpy-3未満`));

  // 2. フォーカスリング不透明
  const semi = bd.match(/focus:ring-[^"'\s]*\/\d+/g);
  let focusFail = semi && semi.length > 0;
  if (!focusFail) {
    (bd.match(/class=["'][^"']*focus:outline-none[^"']*["']/gi) || []).forEach(el => {
      if (!/focus:ring/i.test(el)) focusFail = true;
    });
  }
  r.push(focusFail ? FAIL('11.5-focus', S, 'フォーカスリング不透明') : PASS('11.5-focus', S, 'フォーカスリング不透明'));

  // 3. prefers-reduced-motion (v1.34: HTML inline OR 外部 CSS で許容 / CSP 'unsafe-inline' 解消対応)
  const inlineMotion = html.match(/@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{([\s\S]*?)\}\s*\}/i);
  const externalCss = (() => {
    const m = html.match(/<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/i);
    if (!m) return '';
    let href = m[1].split('?')[0];
    if (href.startsWith('/')) href = href.slice(1);
    try { return fs.readFileSync(path.join(ROOT, href), 'utf-8'); } catch { return ''; }
  })();
  const cssMotion = externalCss.match(/@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{([\s\S]*?)\}\s*\}/i);
  const motionContent = (inlineMotion && inlineMotion[1]) || (cssMotion && cssMotion[1]) || '';
  if (!motionContent) r.push(FAIL('11.5-motion', S, 'prefers-reduced-motion'));
  else {
    r.push(/animation-duration/i.test(motionContent) && /transition-duration/i.test(motionContent) && /scroll-behavior/i.test(motionContent)
      ? PASS('11.5-motion', S, 'prefers-reduced-motion')
      : FAIL('11.5-motion', S, 'prefers-reduced-motion', '必須プロパティ不足'));
  }

  // 4. noscript / JS 無効時 fallback (v1.34: html.no-js 経由 + js-marker.js も許容)
  const noscFallback =
    /<noscript>[\s\S]*?\.fade-in[\s\S]*?<\/noscript>/i.test(html) ||
    (/<html[^>]*class=["'][^"']*\bno-js\b[^"']*["']/i.test(html) && /html\.no-js\s+\.fade-in/i.test(externalCss));
  r.push(noscFallback ? PASS('11.5-nosc', S, 'noscript / no-js fallback')
                      : FAIL('11.5-nosc', S, 'noscript / no-js fallback'));

  // 5. スキップリンク
  r.push(/href=["']#main["'][^>]*>.*スキップ/is.test(bd) || /sr-only[^>]*href=["']#main["']/is.test(bd) || /href=["']#main["'][^>]*class=["'][^"']*sr-only/is.test(bd)
    ? PASS('11.5-skip', S, 'スキップリンク')
    : FAIL('11.5-skip', S, 'スキップリンク'));

  // 6. 画像alt日本語 → 11.1で実施済み(重複回避SKIP)
  // 7. フォームlabel
  const inputs = (bd.match(/<input\s[^>]*>/gi) || []).concat(bd.match(/<textarea[^>]*>/gi) || [], bd.match(/<select[^>]*>/gi) || []);
  const fields = inputs.filter(e => !/type=["'](hidden|submit|button|checkbox)["']/i.test(e) && !/display:\s*none/i.test(e) && !/class=["'][^"']*hidden/i.test(e));
  if (fields.length === 0) { r.push(SKIP('11.5-label', S, 'フォームlabel')); }
  else {
    const labelFors = (bd.match(/<label[^>]*>/gi) || []).map(l => (l.match(/for=["']([^"']*)["']/i) || [])[1]).filter(Boolean);
    const ids = fields.map(e => (e.match(/id=["']([^"']*)["']/i) || [])[1]).filter(Boolean);
    const unl = ids.filter(id => !labelFors.includes(id));
    r.push(unl.length === 0 ? PASS('11.5-label', S, 'フォームlabel', `${fields.length}フィールド`) : FAIL('11.5-label', S, 'フォームlabel', `不足: ${unl.join(',')}`));
  }

  return r;
}

// ═══════════════════ 11.6 セキュリティ (4) ═══════════════════

function c11_6(html, pt) {
  const S = '11.6セキュリティ', r = [], c2 = csp(html), bd = body(html);

  // 1. CSP
  if (!c2) r.push(pt === 'minimal' ? WARN('11.6-csp', S, 'CSP', '未設定') : FAIL('11.6-csp', S, 'CSP', '未設定'));
  else {
    const need = ['default-src','script-src','style-src','font-src','img-src','frame-src','object-src','base-uri','form-action'];
    const miss = need.filter(d => !c2.includes(d));
    r.push(miss.length === 0 ? PASS('11.6-csp', S, 'CSP全ディレクティブ') : FAIL('11.6-csp', S, 'CSP', `不足: ${miss.join(',')}`));
  }

  // 2. target="_blank" rel
  const blanks = bd.match(/<a\s[^>]*target=["']_blank["'][^>]*>/gi) || [];
  let bv = 0;
  blanks.forEach(l => { if (!/noopener/i.test(l) || !/noreferrer/i.test(l)) bv++; });
  r.push(bv === 0 ? PASS('11.6-blank', S, 'target="_blank" rel', `${blanks.length}件OK`) : FAIL('11.6-blank', S, 'target="_blank"', `${bv}件にrel不足`));

  // 3. frame-src 'none'
  if (!c2) r.push(pt === 'minimal' ? SKIP('11.6-frame', S, "frame-src") : FAIL('11.6-frame', S, "frame-src 'none'", 'CSPなし'));
  else r.push(c2.includes("frame-src 'none'") ? PASS('11.6-frame', S, "frame-src 'none'") : FAIL('11.6-frame', S, "frame-src 'none'"));

  // 4. object-src 'none'
  if (!c2) r.push(pt === 'minimal' ? SKIP('11.6-obj', S, "object-src") : FAIL('11.6-obj', S, "object-src 'none'", 'CSPなし'));
  else r.push(c2.includes("object-src 'none'") ? PASS('11.6-obj', S, "object-src 'none'") : FAIL('11.6-obj', S, "object-src 'none'"));

  return r;
}

// ═══════════════════ 11.7 モバイル品質 (10) ═══════════════════

function c11_7_mobile(html, pt) {
  const S = '11.7モバイル', r = [], bd = body(html);
  if (pt === 'minimal' || pt === 'profile') return [SKIP('11.7-mob', S, 'モバイル品質', `${pt}ページ`)];

  // 1. モバイルメニューがフルスクリーンオーバーレイ
  // mobile-menu / mobileMenu / モバイルナビゲーション のいずれかで検出
  const menuPatterns = [
    /<(?:nav|div)[^>]*id=["']mobile-menu["'][^>]*>/i,
    /<(?:nav|div)[^>]*id=["']mobileMenu["'][^>]*>/i,
    /<(?:nav|div)[^>]*aria-label=["']モバイルナビゲーション["'][^>]*>/i,
  ];
  let mobileMenu = null;
  for (const p of menuPatterns) { mobileMenu = bd.match(p); if (mobileMenu) break; }
  // Also check parent div wrapping nav for mobileMenu pattern
  if (!mobileMenu) {
    const divMenu = bd.match(/<div[^>]*id=["']mobileMenu["'][^>]*class=["']([^"']*)["'][^>]*>/i) ||
                    bd.match(/<div[^>]*class=["']([^"']*)["'][^>]*id=["']mobileMenu["'][^>]*>/i);
    if (divMenu) mobileMenu = divMenu;
  }
  if (mobileMenu) {
    const cls = (mobileMenu[0].match(/class=["']([^"']*)["']/i) || [])[1] || '';
    const isFixed = cls.includes('fixed');
    const hasBg = /bg-(white|dark-\d+|black|gray-\d+|slate-\d+)/i.test(cls);
    const hasZ = /z-\d+/i.test(cls);
    r.push(isFixed && hasBg ? PASS('11.7-overlay', S, 'フルスクリーンオーバーレイ') : FAIL('11.7-overlay', S, 'モバイルメニュー', `fixed:${isFixed} bg:${hasBg}`));
    if (isFixed) r.push(hasZ ? PASS('11.7-z', S, 'z-index設定') : WARN('11.7-z', S, 'z-index', '未設定'));

    // 【SPEC 10.5.1.1 準拠】Containing Block 汚染検証
    // position:fixed オーバーレイの祖先に backdrop-filter / filter / transform / perspective / will-change
    // を持つ要素があると、CSS仕様上 containing block が viewport から祖先に書き換わり、
    // `inset-0` などの viewport 基準配置が壊れる（W3C CSS Positioned Layout L3 §2.1）
    const menuPos = bd.indexOf(mobileMenu[0]);
    if (isFixed && menuPos >= 0) {
      const before = bd.slice(0, menuPos);
      const voidTags = new Set(['meta','link','br','hr','img','input','source','area','base','col','embed','param','track','wbr']);
      const tagRegex = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)([^>]*?)(\/?)>/g;
      const stack = [];
      let m;
      while ((m = tagRegex.exec(before)) !== null) {
        const isClose = m[1] === '/';
        const tagName = m[2].toLowerCase();
        const attrs = m[3] || '';
        const selfClose = m[4] === '/' || voidTags.has(tagName);
        if (selfClose) continue;
        if (isClose) {
          for (let i = stack.length - 1; i >= 0; i--) {
            if (stack[i].tag === tagName) { stack.splice(i, 1); break; }
          }
        } else {
          stack.push({ tag: tagName, attrs });
        }
      }
      // 禁止パターン: containing block を生成するプロパティ
      const FORBIDDEN_CLASS = /\bnav-blur\b|\bbackdrop-blur(-[a-z0-9]+)?\b|\bbackdrop-filter\b/i;
      const FORBIDDEN_STYLE = /backdrop-filter\s*:(?!\s*none)|(?<!-)filter\s*:(?!\s*none)|(?<![-])transform\s*:(?!\s*none)|perspective\s*:(?!\s*none)|will-change\s*:\s*(transform|perspective|filter|backdrop-filter)/i;
      const offenders = [];
      for (const a of stack) {
        const classMatch = a.attrs.match(/class=["']([^"']*)["']/i);
        const styleMatch = a.attrs.match(/style=["']([^"']*)["']/i);
        const classes = classMatch ? classMatch[1] : '';
        const style = styleMatch ? styleMatch[1] : '';
        if (FORBIDDEN_CLASS.test(classes) || FORBIDDEN_STYLE.test(style)) {
          const excerpt = classes ? classes.slice(0, 50) : style.slice(0, 50);
          offenders.push(`<${a.tag} class="${excerpt}">`);
        }
      }
      r.push(offenders.length === 0
        ? PASS('11.7-ancestor', S, 'containing block汚染なし')
        : FAIL('11.7-ancestor', S, 'モバイルメニューの祖先にbackdrop-filter/filter/transform等あり（SPEC 10.5.1.1 違反）', offenders.join(' / ')));
    }
  } else {
    r.push(WARN('11.7-overlay', S, 'モバイルメニュー', 'mobile-menu未検出'));
  }

  // 2. スクロールロック (v1.15: 外部 .js 参照も検査対象に拡張 / inline 外部化対応)
  // HTML 内 inline + 参照される外部 .js (/dist/scripts/*.js) を結合して検査
  let scrollLockSource = bd;
  // <script src> で参照される /dist/scripts/*.js を読込結合
  const scriptSrcMatches = bd.match(/<script\s[^>]*\bsrc=["']\/dist\/scripts\/([^"']+\.js)["'][^>]*>/gi) || [];
  for (const m of scriptSrcMatches) {
    const fileMatch = m.match(/src=["']\/dist\/scripts\/([^"']+\.js)["']/i);
    if (fileMatch) {
      const jsPath = path.join(ROOT, 'dist', 'scripts', fileMatch[1]);
      if (fs.existsSync(jsPath)) {
        scrollLockSource += '\n' + fs.readFileSync(jsPath, 'utf-8');
      }
    }
  }
  const hasScrollLock = /overflow\s*=\s*['"]hidden['"]|overflow\s*=\s*'hidden'/i.test(scrollLockSource) ||
                        /body\.style\.overflow/i.test(scrollLockSource);
  r.push(hasScrollLock ? PASS('11.7-scroll', S, 'スクロールロック') : WARN('11.7-scroll', S, 'スクロールロック', 'JS未検出'));

  // 3. aria-expanded連動
  const hasAriaExp = /aria-expanded/i.test(bd);
  r.push(hasAriaExp ? PASS('11.7-aria', S, 'aria-expanded') : FAIL('11.7-aria', S, 'aria-expanded', '未設定'));

  // 4. ハンバーガーボタンARIA (aria-label, aria-expanded, aria-controls)
  const menuBtn = bd.match(/<button[^>]*aria-controls=["']mobile-menu["'][^>]*>/i) ||
                  bd.match(/<button[^>]*aria-controls=["']mobileMenu["'][^>]*>/i) ||
                  bd.match(/<button[^>]*id=["']menuToggle["'][^>]*>/i) ||
                  bd.match(/<button[^>]*id=["']mobileMenuBtn["'][^>]*>/i) ||
                  bd.match(/<button[^>]*class=["'][^"']*lg:hidden[^"']*["'][^>]*>/i) ||
                  bd.match(/<button[^>]*class=["'][^"']*md:hidden[^"']*["'][^>]*>/i);
  if (menuBtn) {
    const b = menuBtn[0], issues = [];
    if (!/aria-label=/i.test(b)) issues.push('aria-label');
    if (!/aria-expanded=/i.test(b)) issues.push('aria-expanded');
    if (!/aria-controls=/i.test(b)) issues.push('aria-controls');
    r.push(issues.length === 0 ? PASS('11.7-hmb', S, 'ハンバーガーARIA') : FAIL('11.7-hmb', S, 'ハンバーガーARIA', `不足: ${issues.join(',')}`));
  } else {
    r.push(WARN('11.7-hmb', S, 'ハンバーガーボタン', '未検出'));
  }

  // 5. lang="ja" (再確認)
  // Already checked in 11.4 — skip here

  return r;
}

// ═══════════════════ 11.8 Google Search Central準拠 ═══════════════════

function c11_8_google(html, pt) {
  const S = '11.8Google', r = [], bd = body(html), hd = head(html);

  // 1. meta keywordsが使われていないこと
  const mkw = meta(html, 'keywords');
  r.push(mkw ? WARN('11.8-mkw', S, 'meta keywords', 'Googleは無視するため不要') : PASS('11.8-mkw', S, 'meta keywords不使用'));

  // 2. リンクテキストチェック（曖昧な「こちら」「クリック」等を検出）
  if (pt !== 'minimal') {
    const vague = bd.match(/<a[^>]*>\s*(こちら|ここ|クリック|click here|here|詳細|more|read more)\s*<\/a>/gi) || [];
    r.push(vague.length === 0
      ? PASS('11.8-link', S, '説明的リンクテキスト')
      : WARN('11.8-link', S, 'リンクテキスト', `曖昧なリンク${vague.length}件: ${vague.slice(0,3).map(v => v.replace(/<[^>]+>/g,'')).join(',')}`));
  }

  // 3. canonical設定
  const canon = (hd.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i) || [])[1];
  if (pt !== 'minimal') {
    r.push(canon ? PASS('11.8-canon', S, 'canonical設定') : WARN('11.8-canon', S, 'canonical', '未設定（クロール統合に推奨）'));
  }

  // 4. JSレンダリング — クリティカル情報がHTML直書きか
  const hasInnerHTML = /innerHTML\s*=\s*[`'"]/i.test(bd);
  const hasDocWrite = /document\.write/i.test(bd);
  r.push(!hasInnerHTML && !hasDocWrite
    ? PASS('11.8-jsrender', S, 'HTML直接記述')
    : WARN('11.8-jsrender', S, 'JS動的生成', 'innerHTML/document.write使用 → Googlebot確認推奨'));

  return r;
}

// ═══════════════════ GEO/LLMO 検証 (Aggarwal et al. KDD2024 arXiv:2311.09735) ═══════════════════
// G-1〜G-6: 生成エンジン (Perplexity/SGE/BingChat) 引用率最大化のための検証
// 典拠: GEO-STANDARDS.md §8

function cGeo(html, pt) {
  const S = 'GEO/LLMO', r = [], bd = body(html);
  if (pt === 'minimal') return [SKIP('G-skip', S, 'GEO検証', 'minimalページ対象外')];

  // G-1: blockquote または <q cite> が 1 ページ最低 1 件以上 (Quotation Addition: +27.8%)
  const blockquotes = (bd.match(/<blockquote[\s>][\s\S]*?<\/blockquote>/gi) || []).length;
  const qCites = (bd.match(/<q\s+[^>]*cite=/gi) || []).length;
  const quoteCount = blockquotes + qCites;
  r.push(quoteCount >= 1
    ? PASS('G-1', S, 'Quotation Addition (引用句)', `${quoteCount}件 (blockquote:${blockquotes}, q[cite]:${qCites})`)
    : WARN('G-1', S, 'Quotation Addition', '<blockquote>/<q cite>未検出 — 引用句を追加すべき (論文+27.8%)'));

  // G-2: 公的ソース (.go.jp/.gov/.edu/.ac.jp) への被リンクが 1 件以上 (Cite Sources: +24.9%)
  const allLinks = bd.match(/<a\s+[^>]*href=["']([^"']+)["']/gi) || [];
  const authoritativeLinks = allLinks.filter(l =>
    /href=["'][^"']*\.(go\.jp|gov|edu|ac\.jp|or\.jp\/[a-z]+)/i.test(l)
  );
  r.push(authoritativeLinks.length >= 1
    ? PASS('G-2', S, '公的ソース被リンク (Cite Sources)', `${authoritativeLinks.length}件 (.go.jp/.gov/.edu/.ac.jp)`)
    : WARN('G-2', S, '公的ソース被リンク', '.go.jp/.gov/.edu等への被リンクなし (論文+24.9%)'));

  // G-3: 数値 (パーセンテージ/円/件数/年) が本文中に 3 件以上 (Statistics Addition: +25.9%)
  const text = bd.replace(/<script[\s\S]*?<\/script>/gi, '')
                 .replace(/<style[\s\S]*?<\/style>/gi, '')
                 .replace(/<[^>]+>/g, ' ');
  const stats = (text.match(/\d+(?:\.\d+)?\s*(?:%|％|円|万円|件|名|年|位|倍|分|秒|時間|kg|cm|m²|平方メートル|社|店|人)/g) || []);
  r.push(stats.length >= 3
    ? PASS('G-3', S, 'Statistics Addition (数値)', `${stats.length}件の数値`)
    : WARN('G-3', S, 'Statistics Addition', `数値${stats.length}件 (3件以上推奨, 論文+25.9%)`));

  // G-4: schema.org Quotation または Claim の JSON-LD 存在
  const schemas = jsonld(html);
  let hasQuoteSchema = false;
  const QUOTE_TYPES = ['Quotation', 'Claim', 'ClaimReview'];
  for (const s of schemas) {
    if (QUOTE_TYPES.some(qt => hasType(s, qt))) { hasQuoteSchema = true; break; }
    if (s['@graph'] && s['@graph'].some(i => QUOTE_TYPES.some(qt => hasType(i, qt)))) {
      hasQuoteSchema = true; break;
    }
  }
  r.push(hasQuoteSchema
    ? PASS('G-4', S, 'JSON-LD Quotation/Claim')
    : SKIP('G-4', S, 'JSON-LD Quotation/Claim', '構造化マークアップ補強 (任意・推奨)'));

  // G-5: 曖昧表現「思います/かもしれません/らしい」の出現 ≦ 2 (Authoritative: +21.8%)
  const vague = (text.match(/(思います|思われる|かもしれません|かもしれない|らしいです|多分|たぶん|おそらく)/g) || []);
  r.push(vague.length <= 2
    ? PASS('G-5', S, 'Authoritative tone (曖昧表現)', `曖昧表現 ${vague.length}件 (≦2)`)
    : WARN('G-5', S, 'Authoritative tone', `曖昧表現${vague.length}件: ${[...new Set(vague)].slice(0,3).join('/')} (断定調へ修正推奨, 論文+21.8%)`));

  // G-6: 記事冒頭 Lead Evidence 配置 (Position-Adjusted / SPEC 4.13 準拠)
  // 意味論的判定: <main> 内部で、最初の <h2> 以前（＝導入部）にエビデンスが出現すること。
  // <h2> が無いページは <main> 先頭 40% を導入部と見なす。<main> が無いページは body 先頭 30% にフォールバック。
  const mainMatch = bd.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  const scope = mainMatch ? mainMatch[1] : bd;
  const firstH2Idx = scope.search(/<h2[\s>]/i);
  const leadRegion = firstH2Idx > 0
    ? scope.slice(0, firstH2Idx)
    : scope.slice(0, Math.floor(scope.length * (mainMatch ? 0.40 : 0.30)));
  const leadText = leadRegion.replace(/<[^>]+>/g, ' ');
  const leadHasStat = /\d+(?:\.\d+)?\s*(?:%|％|円|万円|ドル|\$|件|名|年|位|倍|KB|MB|GB)/.test(leadText);
  const leadHasAuthLink = /href=["'][^"']*(?:\.go\.jp|\.gov|\.edu|\.ac\.jp|arxiv\.org|doi\.org|anthropic\.com|google\.com\/search-central|developers\.google\.com|schema\.org|w3\.org|wcag|cloudflare\.com|github\.com|web\.dev|meti\.go\.jp|ppc\.go\.jp)/i.test(leadRegion);
  const leadHasQuote = /<blockquote|<q\s+[^>]*cite=/i.test(leadRegion);
  const leadSignals = [leadHasStat && '数値', leadHasAuthLink && '公的リンク', leadHasQuote && '引用句'].filter(Boolean);
  r.push(leadSignals.length >= 1
    ? PASS('G-6', S, '位置最適化 (Lead Evidence — 最初のh2以前)', leadSignals.join('+'))
    : FAIL('G-6', S, '位置最適化 (Position-Adjusted / SPEC 4.13 Lead Evidence Block)', '記事冒頭（最初の<h2>以前）に数値/公的リンク/引用句なし — Lead Evidence Block必須'));

  return r;
}

// ═══════════════════ 11.9 追加要件 (2) ═══════════════════

function c11_7() {
  const S = '11.7追加', r = [];

  // 1. カスタム404
  const p404 = path.join(ROOT, '404.html');
  if (!fs.existsSync(p404)) {
    r.push(FAIL('11.7-404', S, 'カスタム404', '404.html不存在'));
  } else {
    const c = fs.readFileSync(p404, 'utf-8');
    const hasNav = /href=["'](\/|index\.html|https?:\/\/)/i.test(c);
    r.push(hasNav ? PASS('11.7-404', S, 'カスタム404') : WARN('11.7-404', S, '404.html', 'トップへのリンクなし'));
  }

  // 2. 301リダイレクト準備
  const redir = fs.existsSync(path.join(ROOT, '_redirects'));
  r.push(redir ? PASS('11.7-301', S, '301リダイレクト準備') : WARN('11.7-301', S, '301リダイレクト', '_redirectsファイル未作成'));

  return r;
}

// ═══════════════════ SPEC本文 追加チェック ═══════════════════

function cSpec(html, pt, variant) {
  const S = 'SPEC本文', r = [], hd = head(html), bd = body(html);
  variant = variant || 'marketing';
  const vspec = THEME_VARIANTS[variant] || THEME_VARIANTS.marketing;

  // charset
  r.push(/<meta\s+charset=["']UTF-8["']/i.test(html) ? PASS('sp-char', S, 'charset') : FAIL('sp-char', S, 'charset'));

  // viewport
  const vp = meta(html, 'viewport');
  r.push(vp && vp.includes('width=device-width') && vp.includes('initial-scale=1')
    ? PASS('sp-vp', S, 'viewport') : FAIL('sp-vp', S, 'viewport'));

  // theme-color
  r.push(meta(html, 'theme-color') ? PASS('sp-theme', S, 'theme-color') : FAIL('sp-theme', S, 'theme-color', '未設定'));

  // color-scheme (SPEC 10.6.3 準拠: Variant と一致必須)
  const cs = meta(html, 'color-scheme');
  if (!cs) {
    r.push(FAIL('sp-cs', S, 'color-scheme', '未設定'));
  } else {
    r.push(cs.trim() === vspec.colorScheme
      ? PASS('sp-cs', S, `color-scheme=${cs} (Variant: ${variant})`)
      : FAIL('sp-cs', S, 'color-scheme Variant不一致', `期待: ${vspec.colorScheme} / 実際: ${cs}`));
  }

  // favicon 3種
  r.push(/<link[^>]*type=["']image\/svg\+xml["'][^>]*>/i.test(hd) ? PASS('sp-fsv', S, 'favicon SVG') : FAIL('sp-fsv', S, 'favicon SVG'));
  r.push(/<link[^>]*sizes=["']32x32["'][^>]*>/i.test(hd) ? PASS('sp-f32', S, 'favicon 32px') : FAIL('sp-f32', S, 'favicon 32px'));
  r.push(/<link[^>]*apple-touch-icon/i.test(hd) ? PASS('sp-fat', S, 'apple-touch-icon') : FAIL('sp-fat', S, 'apple-touch-icon'));

  // body class (SPEC 10.6.1 Body Theme Variants 準拠)
  const bc = bodyClass(html);
  const miss = vspec.required.filter(c => !bc.includes(c));
  const forbidHits = vspec.forbidden.filter(c => bc.includes(c));
  if (miss.length === 0 && forbidHits.length === 0) {
    r.push(PASS('sp-body', S, `body class (Variant: ${variant})`));
  } else {
    const msg = [];
    if (miss.length) msg.push(`不足: ${miss.join(',')}`);
    if (forbidHits.length) msg.push(`Variant違反: ${forbidHits.join(',')}`);
    r.push(FAIL('sp-body', S, `body class (Variant: ${variant} 違反)`, `${msg.join(' / ')} 現在: "${bc}"`));
  }

  // semantic landmarks
  r.push(/<header[\s>]/i.test(bd) ? PASS('sp-hdr', S, '<header>') : FAIL('sp-hdr', S, '<header>'));
  r.push(/<main[\s>]/i.test(bd) ? PASS('sp-main', S, '<main>') : FAIL('sp-main', S, '<main>'));
  r.push(/<footer[\s>]/i.test(bd) ? PASS('sp-ftr', S, '<footer>') : FAIL('sp-ftr', S, '<footer>'));
  if (/<main[\s>]/i.test(bd))
    r.push(/<main[^>]*id=["']main["']/i.test(bd) ? PASS('sp-mid', S, 'main#main') : FAIL('sp-mid', S, 'main#main'));

  // フッターnavにaria-label
  const ftr = (bd.match(/<footer[\s\S]*?<\/footer>/i) || [])[0] || '';
  if (pt !== 'minimal' && ftr) {
    const fNavs = ftr.match(/<nav[^>]*>/gi) || [];
    const fNoL = fNavs.filter(n => !/aria-label/i.test(n));
    if (fNavs.length === 0) r.push(WARN('sp-fnav', S, 'フッターnav', 'footer内にnavなし'));
    else r.push(fNoL.length === 0 ? PASS('sp-fnav', S, 'フッターnav aria-label') : FAIL('sp-fnav', S, 'フッターnav', 'aria-labelなし'));
  }

  // fade-in
  const fi = html.match(/\.fade-in\s*\{[^}]*opacity:\s*0[^}]*\}/);
  if (!fi) r.push(SKIP('sp-fi', S, 'fade-in'));
  else {
    r.push(fi[0].includes('translateY(30px)') ? PASS('sp-fi-y', S, 'fade-in 30px') : FAIL('sp-fi-y', S, 'fade-in', '30px必須'));
    r.push(fi[0].includes('0.8s') ? PASS('sp-fi-d', S, 'fade-in 0.8s') : FAIL('sp-fi-d', S, 'fade-in', '0.8s必須'));
  }

  // fonts
  r.push(/preconnect[^>]*fonts\.googleapis/i.test(hd) && /preconnect[^>]*fonts\.gstatic/i.test(hd)
    ? PASS('sp-pcon', S, 'フォントpreconnect') : FAIL('sp-pcon', S, 'preconnect'));
  const preload = /preload[^>]*fonts\.googleapis/i.test(hd) || /fonts\.googleapis[^>]*preload/i.test(hd);
  r.push(preload ? PASS('sp-pload', S, 'フォントpreload') : WARN('sp-pload', S, 'preload未設定'));
  // font-display:swap
  const fUrls = hd.match(/fonts\.googleapis\.com\/css2[^"']*/gi) || [];
  const noSwap = fUrls.filter(u => !u.includes('display=swap'));
  if (fUrls.length > 0) r.push(noSwap.length === 0 ? PASS('sp-swap', S, 'display=swap') : FAIL('sp-swap', S, 'display=swap'));

  // GA async
  const ga = html.match(/<script[^>]*googletagmanager[^>]*>/i);
  if (ga) r.push(/async/i.test(ga[0]) ? PASS('sp-ga', S, 'GA async') : FAIL('sp-ga', S, 'GA async'));

  // head order
  const cp = hd.indexOf('charset='), vpp = hd.indexOf('name="viewport"'), tp = hd.indexOf('<title>');
  if (cp > -1 && vpp > -1 && cp > vpp) r.push(FAIL('sp-ord', S, 'head順序', 'viewport < charset'));
  else if (cp > -1 && tp > -1 && cp > tp) r.push(FAIL('sp-ord', S, 'head順序', 'title < charset'));
  else r.push(PASS('sp-ord', S, 'head要素順序'));

  // footer copyright (SPEC v3.2 — ブランド名 T.C.HARTON 対応)
  if (ftr) {
    if (/(?:T\.C\.)?HARTON\s*Inc\./i.test(ftr)) r.push(FAIL('sp-cr', S, 'フッターCR', '"HARTON Inc."は不正'));
    else if (/2026\s*(?:T\.C\.)?HARTON/i.test(ftr)) r.push(PASS('sp-cr', S, 'フッターCR'));
    else r.push(WARN('sp-cr', S, 'フッターCR', '形式不明'));
  }

  // URL整合性 — 旧ドメイン残存検出 (harton.netlify.app / harton.pages.dev)
  const oldDomainMatches = html.match(/harton\.(?:netlify\.app|pages\.dev)/g) || [];
  r.push(oldDomainMatches.length === 0
    ? PASS('sp-url', S, '旧ドメイン残存なし')
    : FAIL('sp-url', S, '旧ドメイン', `${oldDomainMatches.length}箇所 (harton.netlify.app/pages.dev)`));

  // sitemap link
  r.push(/rel=["']sitemap["']/i.test(hd) ? PASS('sp-sm', S, 'sitemap link') : WARN('sp-sm', S, 'sitemap link'));

  // ハンバーガーaria
  if (pt !== 'minimal') {
    const mBtn = bd.match(/<button[^>]*aria-controls=["']mobile-menu["'][^>]*>/i) ||
                 bd.match(/<button[^>]*id=["']menuToggle["'][^>]*>/i);
    if (mBtn) {
      const b = mBtn[0], issue = [];
      if (!/aria-label=/i.test(b)) issue.push('aria-label');
      if (!/aria-expanded=/i.test(b)) issue.push('aria-expanded');
      if (!/aria-controls=/i.test(b)) issue.push('aria-controls');
      r.push(issue.length === 0 ? PASS('sp-hmb', S, 'ハンバーガーARIA') : FAIL('sp-hmb', S, 'ハンバーガーARIA', `不足: ${issue.join(',')}`));
    }
  }

  // article + time (E-E-A-T)
  if (pt !== 'minimal') {
    r.push(/<article/i.test(bd) ? PASS('sp-article', S, '<article>タグ') : WARN('sp-article', S, '<article>タグ', '未使用'));
  }

  return r;
}

// ═══════════════════ グローバルチェック ═══════════════════

function cGlobal() {
  const S = 'グローバル', r = [];

  // sitemap.xml
  const smP = path.join(ROOT, 'sitemap.xml');
  if (!fs.existsSync(smP)) r.push(FAIL('gl-sm', S, 'sitemap.xml', 'なし'));
  else {
    const c = fs.readFileSync(smP, 'utf-8');
    if (!c.includes('<urlset')) r.push(FAIL('gl-sm', S, 'sitemap.xml', 'urlsetなし'));
    else if (!c.includes(DOMAIN)) r.push(FAIL('gl-sm', S, 'sitemap.xml', 'ドメイン不一致'));
    else if (/harton\.(?:netlify\.app|pages\.dev)/.test(c)) r.push(FAIL('gl-sm', S, 'sitemap.xml', '旧ドメイン残存'));
    else r.push(PASS('gl-sm', S, 'sitemap.xml'));
    if (!c.includes('<lastmod>')) r.push(WARN('gl-sm-lm', S, 'sitemap lastmod'));
  }

  // robots.txt
  const rbP = path.join(ROOT, 'robots.txt');
  if (!fs.existsSync(rbP)) r.push(FAIL('gl-rb', S, 'robots.txt', 'なし'));
  else {
    const c = fs.readFileSync(rbP, 'utf-8');
    const issues = [];
    if (!c.includes('User-agent:')) issues.push('User-agentなし');
    if (!c.includes('Sitemap:')) issues.push('Sitemapなし');
    else if (!c.includes(DOMAIN)) issues.push('ドメイン不一致');
    // SPEC v3.2 §1.3.2 — 主要 AI クローラーの明示許可（Allow: / ）が必須
    const requiredBots = ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'Googlebot'];
    const missingBots = requiredBots.filter(b => !new RegExp(`User-agent:\\s*${b}\\b`, 'i').test(c));
    if (missingBots.length > 0) issues.push(`AIクローラ未許可: ${missingBots.join(',')}`);
    r.push(issues.length === 0 ? PASS('gl-rb', S, 'robots.txt') : FAIL('gl-rb', S, 'robots.txt', issues.join(',')));
  }

  // コントラスト比
  const combos = [
    { bg: '#0f172a', fg: '#cbd5e1', lbl: 'dark-900+dark-300(本文)', min: 4.5 },
    { bg: '#0f172a', fg: '#ffffff', lbl: 'dark-900+white(見出し)', min: 4.5 },
    { bg: '#0f172a', fg: '#94a3b8', lbl: 'dark-900+dark-400(補足)', min: 3.0 },
    { bg: '#ffffff', fg: '#334155', lbl: 'white+dark-700(ライト本文)', min: 4.5 },
    { bg: '#ffffff', fg: '#1e293b', lbl: 'white+dark-800(ライト見出し)', min: 4.5 },
    { bg: '#0d9ed8', fg: '#ffffff', lbl: 'sky-500+white(ボタン大文字)', min: 3.0 },
  ];
  combos.forEach(c => {
    const cr = contrast(c.bg, c.fg);
    r.push(cr >= c.min
      ? PASS('gl-ct', S, `コントラスト ${c.lbl}`, `${cr.toFixed(1)}:1`)
      : FAIL('gl-ct', S, `コントラスト ${c.lbl}`, `${cr.toFixed(1)}:1 (必要${c.min}:1)`));
  });

  // SPEC §1.5 5 項目同時更新ルール — STATIC_TARGETS ↔ PAGE_TYPE 整合性チェック
  // 案 B 取り込み: validatePageTypeConsistency() machine gate（v1.1.16 / 2026-05-03）
  // 新規ページ追加時にディレクトリ図 / §1.2 / sitemap.xml / STATIC_TARGETS / llms.txt の
  // 同時更新が漏れないよう、配列とマッピングの双方向整合を機械検証する。
  const targetsSet = new Set(STATIC_TARGETS);
  const pageTypeKeys = new Set(Object.keys(PAGE_TYPE));
  const missingInPageType = [...targetsSet].filter(t => !pageTypeKeys.has(t));
  const missingInTargets = [...pageTypeKeys].filter(k => !targetsSet.has(k));
  if (missingInPageType.length === 0 && missingInTargets.length === 0) {
    r.push(PASS('gl-pt-consistency', S, 'STATIC_TARGETS ↔ PAGE_TYPE 整合性 (SPEC §1.5)', `${STATIC_TARGETS.length} ページ完全整合`));
  } else {
    const issues = [];
    if (missingInPageType.length > 0) issues.push(`PAGE_TYPE 欠落: ${missingInPageType.join(',')}`);
    if (missingInTargets.length > 0) issues.push(`STATIC_TARGETS 欠落: ${missingInTargets.join(',')}`);
    r.push(FAIL('gl-pt-consistency', S, 'STATIC_TARGETS ↔ PAGE_TYPE 整合性 (SPEC §1.5)', issues.join(' / ')));
  }

  // sitemap.xml ↔ STATIC_TARGETS 整合性チェック（§1.5 連動）
  // STATIC_TARGETS の全 HTML ページが sitemap.xml に登録されているか機械検証
  // 例外: 404.html / thanks.html は noindex のため sitemap 登録対象外
  const smPath = path.join(ROOT, 'sitemap.xml');
  if (fs.existsSync(smPath)) {
    const smContent = fs.readFileSync(smPath, 'utf-8');
    // noindex stub (Phase α stub / Stella stub) は Google ガイドライン整合のため sitemap 除外
    // 公開時 (Step 4-5 完遂後) に sitemap 登録予定
    const NO_SITEMAP = new Set([
      '404.html', 'thanks.html',
      // Problem LP 全 5 本 + ハブを sitemap 登録済み（2026-05-15 公開）
      // Insights は全 31 記事 + ハブを sitemap 登録済み（2026-05-15 公開）
]);
    const sitemapMissing = STATIC_TARGETS
      .filter(t => !NO_SITEMAP.has(t))
      .filter(t => {
        // index.html → / 、その他 'foo/index.html' → /foo/
        const url = t === 'index.html'
          ? `${DOMAIN}/`
          : `${DOMAIN}/${t.replace(/index\.html$/, '')}`;
        return !smContent.includes(url);
      });
    if (sitemapMissing.length === 0) {
      r.push(PASS('gl-sm-consistency', S, 'sitemap.xml ↔ STATIC_TARGETS 整合性 (SPEC §1.5)'));
    } else {
      r.push(FAIL('gl-sm-consistency', S, 'sitemap.xml ↔ STATIC_TARGETS 整合性 (SPEC §1.5)', `sitemap 未登録: ${sitemapMissing.join(',')}`));
    }
  }

  // ─── insights/_categories.json ↔ insights/{slug}/index.html 整合性 ───
  // 記事追加時のハブ漏れ事故（2026-05-15）の再発防止 machine gate
  // 物理ファイル insights/{slug}/index.html が _categories.json articles[] に登録されているか
  const catsPath = path.join(ROOT, 'insights', '_categories.json');
  if (fs.existsSync(catsPath)) {
    const cats = JSON.parse(fs.readFileSync(catsPath, 'utf-8'));
    // JSON に登録された insights slug のセット（cat-industry 等の外部パスは除外）
    const registeredSlugs = new Set();
    for (const cat of cats.categories) {
      const ap = cat.articlesPath || '/insights/';
      if (ap === '/insights/') {
        for (const art of cat.articles) registeredSlugs.add(art.slug);
      }
    }
    // 物理ファイル insights/{slug}/index.html を走査
    const insightsDir = path.join(ROOT, 'insights');
    const physicalSlugs = fs.readdirSync(insightsDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name)
      .filter(s => fs.existsSync(path.join(insightsDir, s, 'index.html')));
    const orphans = physicalSlugs.filter(s => !registeredSlugs.has(s));
    const ghosts = [...registeredSlugs].filter(s => !physicalSlugs.includes(s));

    if (orphans.length === 0 && ghosts.length === 0) {
      r.push(PASS('gl-insights-hub', S, 'insights/_categories.json ↔ 物理ファイル整合性',
                  `${registeredSlugs.size} 記事 完全整合（hub 自動同期）`));
    } else {
      const issues = [];
      if (orphans.length > 0) issues.push(`hub 未登録（孤立記事）: ${orphans.join(',')}`);
      if (ghosts.length > 0) issues.push(`JSON あり物理なし: ${ghosts.join(',')}`);
      r.push(FAIL('gl-insights-hub', S, 'insights/_categories.json ↔ 物理ファイル整合性',
                  issues.join(' / ') + ' — _categories.json を更新後 node gen-insights-hub.js'));
    }
  }

  // ─── 古い母集団数 1,830 / 1830 の再混入禁止 (2026-05-15 事故再発防止) ───
  // 真値: 東証プライム上場企業 = 1,553 社 (scanner Phase E 実測 / 2026-05-11)
  // 旧値 1,830 は v1.26.1 (2026-05-08) の暫定目標値で v1.27 以降 1,553 に確定
  // 公開 HTML への 1,830 混入を機械検証で禁止（archive 履歴 .md は対象外）
  const oldStaleNumber = /1[,，]?830/g;
  const allHtmlFiles = STATIC_TARGETS.filter(t => t.endsWith('.html'));
  const offenders1830 = [];
  for (const t of allHtmlFiles) {
    const fp = path.join(ROOT, t);
    if (!fs.existsSync(fp)) continue;
    const c = fs.readFileSync(fp, 'utf-8');
    if (oldStaleNumber.test(c)) offenders1830.push(t);
  }
  if (offenders1830.length === 0) {
    r.push(PASS('gl-stale-1830', S, '旧母集団数 1,830 の再混入禁止',
                `全 ${allHtmlFiles.length} HTML ファイルに 1,830 残存なし`));
  } else {
    r.push(FAIL('gl-stale-1830', S, '旧母集団数 1,830 の再混入禁止',
                `1,830 残存検出: ${offenders1830.join(',')} — 真値は 1,553 社（scanner Phase E 実測）`));
  }

  // ─── DESIGN.md ↔ 実装 整合性 / メインブランドはライトテーマ (2026-05-15 事故再発防止) ───
  // 真実: DESIGN.md L57 「Background White: #ffffff = メイン背景」
  // 実装: 全メインブランドページの body class は bg-white
  // 過去事故: /about/ で「ダークテーマを基調にした」と虚偽記述 → 実物 light との drift
  // /stella/ は別サブブランド（dark navy 許容）のため対象外
  const driftClaims = [
    'ダークテーマを基調',
    'ダーク基調を採用',
    'dark theme based',
    'ダークモードを基調',
  ];
  const themeOffenders = [];
  for (const t of allHtmlFiles) {
    if (t.startsWith('stella/')) continue;  // Stella は別サブブランド
    const fp = path.join(ROOT, t);
    if (!fs.existsSync(fp)) continue;
    const c = fs.readFileSync(fp, 'utf-8');
    // body の bg-white チェック
    const bodyMatch = c.match(/<body[^>]*class="([^"]+)"/);
    if (bodyMatch && !bodyMatch[1].includes('bg-white')) {
      themeOffenders.push(`${t} (body bg=${bodyMatch[1].split(/\s+/).find(c => c.startsWith('bg-')) || 'none'})`);
    }
    // 虚偽の「ダークテーマ」主張チェック
    for (const claim of driftClaims) {
      if (c.includes(claim)) {
        themeOffenders.push(`${t} (drift claim: "${claim}")`);
        break;
      }
    }
  }
  if (themeOffenders.length === 0) {
    r.push(PASS('gl-light-theme', S, 'メインブランド ライトテーマ整合性 (DESIGN.md L57)',
                `全 ${allHtmlFiles.filter(t => !t.startsWith('stella/')).length} ページ bg-white + ダークテーマ虚偽記述なし`));
  } else {
    r.push(FAIL('gl-light-theme', S, 'メインブランド ライトテーマ整合性 (DESIGN.md L57)',
                themeOffenders.slice(0, 5).join(' / ') + ' — DESIGN.md 「Background White メイン」と齟齬'));
  }

  // ─── scanner Phase 0.5 / Phase E 数値の捏造禁止 (2026-05-16 /vision/ 事故再発防止) ───
  // 真値: scanner/phase-0.5-shizuoka-summary.json + phase-e-prime-summary.json
  // - Phase 0.5 静岡 902 社: max 56 / median 24 / mean 22.7 / NG 292 (32.4%) / ★ 取得 0
  //   分布: 90+ 0 / 70-89 0 / 40-69 110 (12.2%) / 20-39 442 (49.0%) / <20 350 (38.8%)
  // - Phase E プライム 1,553 社: max 52 / median 17 / mean 16.6 / NG 149 (9.6%) / ★ 取得 0
  // 過去事故: /vision/ で「高品質 9 件」「モバイル遅延 627 / AI 758 / WCAG 412」を捏造
  const fabricatedNumbers = [
    // Phase 0.5 静岡県 902 社の捏造パターン（最大の事故 / 過去 vision）
    { pattern: /高品質[^0-9]*9 ?件/, label: 'Phase 0.5 高品質 9 件（実測 0 件 / max=52）' },
    { pattern: /良好[^0-9]*54 ?件/, label: 'Phase 0.5 良好 54 件（実測 0 件 / max=52）' },
    { pattern: /235 ?件[^0-9]*26\.1/, label: 'Phase 0.5 標準 235 件（実測 51 件）' },
    { pattern: /311 ?件[^0-9]*34\.5/, label: 'Phase 0.5 要改善 311 件（実測 344 件）' },
    { pattern: /293 ?件[^0-9]*32\.5/, label: 'Phase 0.5 緊急対応 293 件 32.5%（実測 NG 277 件 30.7%）' },
    // 架空指標（scanner 未測定）
    { pattern: /627 ?社[^A-Za-z]*69\.5/, label: 'モバイル遅延 627 社（scanner 未測定指標 / 削除）' },
    { pattern: /758 ?社[^A-Za-z]*84\.0/, label: 'AI 引用 758 社（scanner 未測定指標 / 削除）' },
    { pattern: /412 ?社[^A-Za-z]*45\.7/, label: 'WCAG 違反 412 社（scanner 未測定指標 / 削除）' },
    // 沼津市の旧数値
    { pattern: /沼津市内[^0-9]*134 ?社/, label: '沼津 134 社（実測 171 社）' },
    // Consolidated CSV stale values (2026-05-16 per-industry latest 反映後)
    { pattern: /中央値 24 ?点 vs/, label: '業界中央値 24（旧 consolidated / 実測 17）' },
    { pattern: /3\.8 ?倍 ?= ?当社実測/, label: '3.8 倍 = 90/24（旧 consolidated / 実測 90/17 = 5.3 倍）' },
    { pattern: /業界中央値の 3\.8 ?倍/, label: '業界中央値の 3.8 倍（旧 / 実測 5.3 倍）' },
    { pattern: /32\.4%（292\/902/, label: '32.4% 292 社（旧 consolidated / 実測 30.7% 277 社）' },
    { pattern: /232 ?社（25\.7%）.*WordPress 管理面/, label: 'WP 管理面 232 社 25.7%（旧 / 実測 212 社 23.5%）' },
    { pattern: /業界 max <strong>56<\/strong> 点/, label: '業界 max 56 点（旧 consolidated / 実測 52 点）' },
    { pattern: /中央値 <strong[^>]*>23 ?点<\/strong>（県/, label: '沼津 中央値 23 点（旧 / 実測 18 点）' },
    { pattern: /3\.9 ?倍</, label: '沼津 3.9 倍 = 90/23（旧 / 実測 90/18 = 5.0 倍）' },
  ];
  const dataOffenders = [];
  for (const t of allHtmlFiles) {
    const fp = path.join(ROOT, t);
    if (!fs.existsSync(fp)) continue;
    const c = fs.readFileSync(fp, 'utf-8');
    for (const f of fabricatedNumbers) {
      if (f.pattern.test(c)) dataOffenders.push(`${t} (${f.label})`);
    }
  }
  if (dataOffenders.length === 0) {
    r.push(PASS('gl-scanner-data', S, 'scanner Phase 0.5 / Phase E 実測値整合性',
                `全 ${allHtmlFiles.length} HTML ファイルに捏造パターン 9 種残存なし`));
  } else {
    r.push(FAIL('gl-scanner-data', S, 'scanner Phase 0.5 / Phase E 実測値整合性',
                dataOffenders.slice(0, 5).join(' / ') + ' — scanner/phase-*-summary.json と齟齬'));
  }

  // ─── inline script ↔ CSP 'unsafe-inline' 整合性 machine gate (v1.15 ① 追加条件 3) ───
  // SPEC §8.1.4「script-src 'unsafe-inline' 🔴 禁止」規範違反再発防止
  // 4 象限判定: inline > 0 + 'unsafe-inline' あり → FAIL（規範違反）
  //              inline > 0 + 'unsafe-inline' なし → FAIL（実行不能）
  //              inline = 0 + 'unsafe-inline' あり → WARN（不要許容残置）
  //              inline = 0 + 'unsafe-inline' なし → PASS（理想状態 / SPEC §8.1.4 完全遵守）
  {
    // JSON-LD ブロック先行除去 + 外部 src 付き script 除外 + inline script 検出
    const RE_JSONLD  = /<script\s+type=["']application\/ld\+json["'][\s\S]*?<\/script>/gi;
    const RE_EXT_SRC = /<script\s[^>]*\bsrc=["'][^"']*["'][^>]*>(?:<\/script>)?/gi;
    const RE_INLINE  = /<script(?:\s+type=["']text\/javascript["'])?\s*>[\s\S]*?<\/script>/gi;

    let totalInline = 0;
    const inlineByFile = {};
    for (const t of STATIC_TARGETS) {
      const fp = path.join(ROOT, t);
      if (!fs.existsSync(fp)) continue;
      let html = fs.readFileSync(fp, 'utf-8');
      html = html.replace(RE_JSONLD, '').replace(RE_EXT_SRC, '');
      const matches = html.match(RE_INLINE) || [];
      if (matches.length > 0) {
        inlineByFile[t] = matches.length;
        totalInline += matches.length;
      }
    }

    // _headers + meta CSP の script-src で 'unsafe-inline' 検出
    let headersUnsafe = false;
    const headersPath = path.join(ROOT, '_headers');
    if (fs.existsSync(headersPath)) {
      const hContent = fs.readFileSync(headersPath, 'utf-8');
      const cspLine = hContent.match(/Content-Security-Policy:\s*([^\n]+)/i);
      if (cspLine) {
        const ssMatch = cspLine[1].match(/script-src\s+([^;]+)/i);
        if (ssMatch && /'unsafe-inline'/i.test(ssMatch[1])) headersUnsafe = true;
      }
    }
    let metaUnsafeFiles = [];
    for (const t of STATIC_TARGETS) {
      const fp = path.join(ROOT, t);
      if (!fs.existsSync(fp)) continue;
      const html = fs.readFileSync(fp, 'utf-8');
      const metaCsp = html.match(/<meta\s+http-equiv=["']Content-Security-Policy["']\s+content=["']([^"']*)["']/i);
      if (metaCsp) {
        const ssMatch = metaCsp[1].match(/script-src\s+([^;]+)/i);
        if (ssMatch && /'unsafe-inline'/i.test(ssMatch[1])) metaUnsafeFiles.push(t);
      }
    }
    const anyUnsafe = headersUnsafe || metaUnsafeFiles.length > 0;

    if (totalInline === 0 && !anyUnsafe) {
      r.push(PASS('gl-csp-inline', S, 'inline script ↔ CSP 整合性 (SPEC §8.1.4)',
        `inline:0件 / _headers unsafe-inline:なし / meta unsafe-inline:0件 — 規範完全遵守`));
    } else if (totalInline === 0 && anyUnsafe) {
      const src = [];
      if (headersUnsafe) src.push('_headers');
      if (metaUnsafeFiles.length > 0) src.push(`meta(${metaUnsafeFiles.length}件)`);
      r.push(WARN('gl-csp-inline', S, 'inline script ↔ CSP 整合性 (SPEC §8.1.4)',
        `inline:0件 だが unsafe-inline 残置: ${src.join(' / ')} — CSP 強化推奨`));
    } else if (totalInline > 0 && anyUnsafe) {
      const files = Object.entries(inlineByFile).map(([f, n]) => `${f}(${n})`).join(',');
      r.push(FAIL('gl-csp-inline', S, 'inline script ↔ CSP 整合性 (SPEC §8.1.4)',
        `inline ${totalInline}件 [${files}] + unsafe-inline 許可 — §8.1.4 違反 / Mozilla Observatory -20 候補`));
    } else {
      const files = Object.entries(inlineByFile).map(([f, n]) => `${f}(${n})`).join(',');
      r.push(FAIL('gl-csp-inline', S, 'inline script ↔ CSP 整合性 (SPEC §8.1.4)',
        `inline ${totalInline}件 [${files}] だが unsafe-inline 未許可 — inline 実行不能`));
    }
  }

  // ─── .assetsignore glob anchor 整合性 machine gate (v1.16 / DEPLOY-3 拡張 / ① v1.22 採用) ───
  // ② v1.16 commit f825ff7 push 後の dist/scripts/*.js 6 件 404 真因:
  //   .assetsignore line 20 'scripts/' (anchor 不在) → gitignore 構文で全深度マッチ
  //   → ルート scripts/ + dist/scripts/ 両方を Cloudflare upload から除外
  // 再発防止: 非 anchor dir パターン × 同名 dir が depth ≥ 2 に存在 → FAIL
  // 既知の意図的 any-depth (node_modules / .wrangler / .git 等) は collision なしで PASS
  // HSCEL §0.0.10 厳格化原則 + §6.3 Tier 3 machine gate 精神準拠
  //
  // 設計上の限界 (Reviewer B v1.16 H-1 / H-3 受領):
  //   - trailing-slash 必須: 'foo' (slash なし) は dir/file 区別不能のため対象外。
  //     .assetsignore に dir 排除を書く際は必ず 'foo/' 形式で書くプロジェクト規約とする
  //   - '**/foo/' / '*/foo/' 等の glob 接頭辞付きパターンは line.startsWith('*') で対象外
  //     これらが必要な場合は手動レビュー要 (実用ケース極稀)
  {
    const aiPath = path.join(ROOT, '.assetsignore');
    if (!fs.existsSync(aiPath)) {
      // Reviewer B-1 CRITICAL / C-2 HIGH: 不在は 4-state invariant 違反 + 実害大
      // (.assetsignore なし = node_modules/.wrangler 等が全件 upload 試行 / 25 MiB per-file 上限抵触)
      r.push(FAIL('gl-ai-anchor', S, '.assetsignore glob anchor 整合性 (DEPLOY-3 / v1.16)',
        '.assetsignore が存在しない — Cloudflare Workers Static Assets 除外設定が失われている'));
    } else {
      const lines = fs.readFileSync(aiPath, 'utf-8').split(/\r?\n/);
      const SKIP_WALK = new Set(['.git', 'node_modules', '.wrangler', '.claude', '.vscode', '.idea']);

      function findCollisions(dirname) {
        const hits = [];
        function walk(dir, depth) {
          let entries;
          try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
          catch { return; }
          for (const e of entries) {
            if (!e.isDirectory()) continue;
            if (SKIP_WALK.has(e.name)) continue;
            const rel = path.relative(ROOT, path.join(dir, e.name)).replace(/\\/g, '/');
            if (depth >= 1 && e.name === dirname) hits.push(rel);
            walk(path.join(dir, e.name), depth + 1);
          }
        }
        walk(ROOT, 0);
        return hits;
      }

      const collisions = [];
      for (const raw of lines) {
        const line = raw.trim();
        if (!line || line.startsWith('#')) continue;
        if (!line.endsWith('/')) continue;
        if (line.startsWith('/') || line.startsWith('*') || line.startsWith('!')) continue;
        const dirname = line.replace(/\/$/, '');
        if (!dirname || dirname.includes('/')) continue;
        const hits = findCollisions(dirname);
        if (hits.length > 0) collisions.push({ pattern: line, hits });
      }

      if (collisions.length === 0) {
        r.push(PASS('gl-ai-anchor', S, '.assetsignore glob anchor 整合性 (DEPLOY-3 / v1.16)',
          '非 anchor dir パターン × depth≥2 同名 dir 衝突なし'));
      } else {
        const detail = collisions
          .map(c => `${c.pattern}→[${c.hits.join(',')}]`)
          .join(' ; ');
        r.push(FAIL('gl-ai-anchor', S, '.assetsignore glob anchor 整合性 (DEPLOY-3 / v1.16)',
          `非 anchor パターンが意図外 dir に衝突: ${detail} — root anchor (/前置) を検討`));
      }
    }
  }

  // ═══════════════════ v1.20 canonical SoT 整合性 7 gate ═══════════════════
  // 「検証の度に問題が出続ける」構造を断つ machine gate 群（HSCEL §0.0.10 §6.3 整合）
  // config/canonical.json を Single Source of Truth とし、全 HTML との verbatim 一致を検証
  {
    const canonicalPath = path.join(ROOT, 'config', 'canonical.json');
    if (!fs.existsSync(canonicalPath)) {
      r.push(FAIL('gl-canonical', S, 'config/canonical.json 存在 (v1.20 SoT)',
        'config/canonical.json が存在しない — Single Source of Truth が失われている'));
    } else {
      let canonical;
      try {
        canonical = JSON.parse(fs.readFileSync(canonicalPath, 'utf-8'));
      } catch (e) {
        r.push(FAIL('gl-canonical', S, 'config/canonical.json パース', e.message));
        return r;
      }
      r.push(PASS('gl-canonical', S, 'config/canonical.json 存在 (v1.20 SoT)',
        `version=${canonical.version} / lastSynced=${canonical.lastSynced}`));

      // ─── 共有: index.html を 1 回読込（Reviewer A-C-2 / C-I-1: I/O 重複排除） ───
      const indexPath = path.join(ROOT, 'index.html');
      const indexHtml = fs.existsSync(indexPath) ? fs.readFileSync(indexPath, 'utf-8') : null;

      // ─── gl-numbers-sync: 全 22 ページ で旧数値 (陳腐化) 残存禁止 (Reviewer C-C-1 採用) ───
      // index.html だけでなく STATIC_TARGETS 全件で「自社サイトの過去数値文字列」が残存していないか検証
      // 例: 旧 PASS 数値 "1,461" / WARN 残存 "1 件" 等が methodology や services 残置されているケース
      {
        const n = canonical.numbers;
        const STALE_NUMBERS = [
          // 過去 PASS 数値群（v1.14: 1,461 / v1.15: 1,536 / 現在: 1,537 / 1,540）
          { stale: '1,461', label: '旧 PASS 数値' },
          { stale: '1,536', label: '旧 PASS 数値' },
          // 旧 WARN 状態 (現在 0)
          { stale: 'WARN=1', label: '旧 WARN 残存' }
        ];
        // 現行値はチェック対象外
        const currentPassStr = n.specCheckerPass.toLocaleString();
        const stalehits = [];
        for (const t of STATIC_TARGETS) {
          const fp = path.join(ROOT, t);
          if (!fs.existsSync(fp)) continue;
          const html = fs.readFileSync(fp, 'utf-8');
          STALE_NUMBERS.forEach(({ stale, label }) => {
            if (stale === currentPassStr) return;
            if (html.includes(stale)) stalehits.push(`${t}: "${stale}" (${label})`);
          });
        }
        // index.html の verbatim 値も併せ確認
        const indexChecks = indexHtml ? [
          ['industrySampleN', `${n.industrySampleN}`],
          ['qualityMultiple', `${n.qualityMultiple}`]
        ] : [];
        const indexMissing = indexChecks.filter(([k, v]) => !indexHtml.includes(v));
        if (stalehits.length === 0 && indexMissing.length === 0) {
          r.push(PASS('gl-numbers-sync', S, 'canonical 数値 ↔ 全 22 ページ 整合性 (v1.20)',
            `index.html ${indexChecks.length} 件 verbatim 一致 / 全ページ 旧数値残存 0`));
        } else {
          const detail = [];
          if (indexMissing.length > 0) detail.push(`index 不一致: ${indexMissing.map(([k]) => k).join(',')}`);
          if (stalehits.length > 0) detail.push(`旧数値残存: ${stalehits.slice(0, 5).join(' / ')}${stalehits.length > 5 ? ` 他 ${stalehits.length - 5}` : ''}`);
          r.push(FAIL('gl-numbers-sync', S, 'canonical 数値 ↔ 全 22 ページ 整合性 (v1.20)',
            detail.join(' ; ')));
        }
      }

      // ─── gl-searchaction: index.html に SearchAction 残存禁止 ───
      if (indexHtml !== null) {
        const hasSearchAction = /["']@type["']\s*:\s*["']SearchAction["']/.test(indexHtml)
          || /potentialAction/.test(indexHtml);
        r.push(hasSearchAction
          ? FAIL('gl-searchaction', S, 'index.html SearchAction 削除 (v1.20)',
            'SearchAction / potentialAction 残存 — 検索機能未実装のため削除（Google スパム判定リスク）')
          : PASS('gl-searchaction', S, 'index.html SearchAction 削除 (v1.20)',
            'WebSite SearchAction 不在 / Google Sitelinks Searchbox 仕様準拠'));
      }

      // ─── gl-faqpage-top: index.html に FAQPage 残存禁止（/faq/ に集約） ───
      if (indexHtml !== null) {
        const hasFAQPage = /["']@type["']\s*:\s*["']FAQPage["']/.test(indexHtml);
        r.push(hasFAQPage
          ? FAIL('gl-faqpage-top', S, 'index.html FAQPage 削除 (v1.20)',
            'FAQPage 残存 — /faq/ と重複 / Google Q-A 表示縮小対応で削除')
          : PASS('gl-faqpage-top', S, 'index.html FAQPage 削除 (v1.20)',
            'FAQPage は /faq/ のみ / index 重複なし'));
      }

      // ─── gl-menu-js-ref: marketing variant 全ページが menu.js 参照 ───
      // Reviewer B-C-2: NO_MENU_JS と MENU_PAGES の交差を正確に算出
      const NO_MENU_JS = new Set(['contact/index.html', 'thanks.html', '404.html']);
      const MENU_PAGES = STATIC_TARGETS.filter(t => (PAGE_TYPE[t] || 'minimal') !== 'minimal');
      const MENU_PAGES_REQUIRED = MENU_PAGES.filter(t => !NO_MENU_JS.has(t));
      const menuJsMissing = MENU_PAGES_REQUIRED.filter(t => {
        const fp = path.join(ROOT, t);
        if (!fs.existsSync(fp)) return false;
        const html = fs.readFileSync(fp, 'utf-8');
        return !/<script[^>]+src=["'][^"']*\/dist\/scripts\/menu\.js(\?[^"']*)?["']/.test(html);
      });
      r.push(menuJsMissing.length === 0
        ? PASS('gl-menu-js-ref', S, 'menu.js 参照整合性 (v1.20)',
          `${MENU_PAGES_REQUIRED.length} ページ全件 menu.js 参照あり`)
        : FAIL('gl-menu-js-ref', S, 'menu.js 参照整合性 (v1.20)',
          `参照欠落: ${menuJsMissing.join(',')}`));

      // ─── gl-sameAs-github: index.html sameAs に GitHub 含まれる ───
      if (indexHtml !== null) {
        const hasGitHub = /sameAs[\s\S]*?github\.com\/TC-HARTON/.test(indexHtml);
        r.push(hasGitHub
          ? PASS('gl-sameAs-github', S, 'Person/Org sameAs に GitHub URL (v1.20)',
            'https://github.com/TC-HARTON 含有 / E-E-A-T 強化')
          : FAIL('gl-sameAs-github', S, 'Person/Org sameAs に GitHub URL (v1.20)',
            'GitHub URL なし — canonical.organization.sameAs と同期'));
      }

      // ─── gl-canonical-text: 主要テキスト ラベルが index.html に verbatim 出現 ───
      if (indexHtml !== null) {
        const labelChecks = [
          ['regionLabel', canonical.labels.regionLabel]
        ];
        const labelMissing = labelChecks.filter(([k, v]) => !indexHtml.includes(v));
        r.push(labelMissing.length === 0
          ? PASS('gl-canonical-text', S, 'canonical テキスト ↔ index.html 整合性 (v1.20)',
            `${labelChecks.length} ラベル verbatim 一致`)
          : FAIL('gl-canonical-text', S, 'canonical テキスト ↔ index.html 整合性 (v1.20)',
            `不一致: ${labelMissing.map(([k]) => k).join(',')} — canonical.json と同期`));
      }

      // ─── gl-no-old-cert-url: certification.tcharton.com 残存禁止 (v1.23 / Stella ブランド統一) ───
      // 代表確定 UX-UI-DIRECTIVE-V1 line 4/7: certification.tcharton.com → stella.tcharton.com
      // ② tcharton 側で旧ドメイン参照が残存していないかリグレッション防止
      //
      // 検証範囲 (v1.28 LOW 整合修正で明示化):
      //   - HTML 全 STATIC_TARGETS (= 25 ページ) 走査
      //   - sitemap.xml も走査対象に追加（旧 URL の lastmod が残存するリグレッション防止）
      //   - canonical.json は labels.certificationDomainNote で stella 表記済 (走査対象外)
      //   - brandHistory.originalName で「HARTON Certified」テキスト言及は許容 / URL は許容しない
      {
        const OLD_DOMAIN = 'certification.tcharton.com';
        const offenders = [];
        // Stella サブセクション内の改名履歴 (旧 HARTON Certified ←→ HARTON Stella) 言及は許容
        const HISTORY_CONTEXT_EXEMPT = /stella\//;
        for (const t of STATIC_TARGETS) {
          if (HISTORY_CONTEXT_EXEMPT.test(t)) continue;
          const fp = path.join(ROOT, t);
          if (!fs.existsSync(fp)) continue;
          const html = fs.readFileSync(fp, 'utf-8');
          if (html.includes(OLD_DOMAIN)) offenders.push(t);
        }
        // sitemap.xml も検証
        const smPath2 = path.join(ROOT, 'sitemap.xml');
        if (fs.existsSync(smPath2)) {
          const sm = fs.readFileSync(smPath2, 'utf-8');
          if (sm.includes(OLD_DOMAIN)) offenders.push('sitemap.xml');
        }
        r.push(offenders.length === 0
          ? PASS('gl-no-old-cert-url', S, '旧 certification.tcharton.com 残存禁止 (v1.23 Stella 統一)',
            `全 ${STATIC_TARGETS.length} ページ + sitemap.xml で旧ドメイン参照なし`)
          : FAIL('gl-no-old-cert-url', S, '旧 certification.tcharton.com 残存禁止 (v1.23 Stella 統一)',
            `残存: ${offenders.join(',')} — stella.tcharton.com（準備中）に置換`));
      }

      // ─── gl-no-anti-competitive: 営業妨害表現 残存禁止 (v1.29 / Phase E 法令 gate) ───
      // 出典: 不正競争防止法 2 条 1 項 21 号 (営業誹謗) + 景表法 5 条 (優良誤認 / 比較対象貶め禁止)
      // canonical.phaseE.prohibitedAntiCompetitivePhrases を全 STATIC_TARGETS 走査で残存検出
      if (canonical.phaseE && canonical.phaseE.prohibitedAntiCompetitivePhrases) {
        const phrases = canonical.phaseE.prohibitedAntiCompetitivePhrases;
        const offenders = [];
        for (const t of STATIC_TARGETS) {
          const fp = path.join(ROOT, t);
          if (!fs.existsSync(fp)) continue;
          const html = fs.readFileSync(fp, 'utf-8');
          for (const phrase of phrases) {
            if (html.includes(phrase)) {
              offenders.push(`${t}: "${phrase}"`);
              break;
            }
          }
        }
        r.push(offenders.length === 0
          ? PASS('gl-no-anti-competitive', S, '営業妨害表現 残存禁止 (v1.29 / Phase E 法令)',
            `全 ${STATIC_TARGETS.length} ページ で禁止表現 ${phrases.length} 件残存なし`)
          : FAIL('gl-no-anti-competitive', S, '営業妨害表現 残存禁止 (v1.29 / Phase E 法令)',
            `残存: ${offenders.slice(0, 3).join(' / ')} — 不正競争防止法 2 条 1 項 21 号 + 景表法 5 条 抵触リスク`));
      }

      // ─── gl-no-corp-name: Phase E 関連ページで個別企業名残存禁止 (v1.29 / 個別企業名完全非公開原則) ───
      // 出典: ① v1.34 / CRITICAL §47 「個別企業名完全非公開 / 業種別集計のみ」
      // 検証範囲: cases/index.html + methodology/index.html (Phase E 言及ページ)
      // 検出: 「プライム」「3 段階比較」近傍に「株式会社 [a-zA-Z0-9]+」等の固有名詞パターン
      {
        const PHASE_E_TARGETS = ['cases/index.html', 'methodology/index.html'];
        const CORP_PATTERNS = [
          /株式会社\s*[A-Z][a-zA-Z]+/,        // 株式会社 Sony 等
          /\b(?:Sony|Toyota|Honda|Nissan|Toshiba|Hitachi|Panasonic|Mitsubishi|Sumitomo|Mizuho|Nomura|Rakuten|SoftBank|NTT|KDDI)\b/,
          /[A-Z][a-zA-Z]+\s*Holdings/,         // XXX Holdings 等
        ];
        const offenders = [];
        for (const t of PHASE_E_TARGETS) {
          const fp = path.join(ROOT, t);
          if (!fs.existsSync(fp)) continue;
          const html = fs.readFileSync(fp, 'utf-8');
          // Phase E 言及があるページのみ厳格判定
          if (!/プライム|3 段階比較|業界 3 段階|機械検証の社会的証明/.test(html)) continue;
          for (const re of CORP_PATTERNS) {
            const m = html.match(re);
            if (m) { offenders.push(`${t}: "${m[0]}"`); break; }
          }
        }
        r.push(offenders.length === 0
          ? PASS('gl-no-corp-name', S, 'Phase E ページ 個別企業名 残存禁止 (v1.29)',
            'プライム企業名パターン残存なし / 業種別集計のみ公開原則 整合')
          : FAIL('gl-no-corp-name', S, 'Phase E ページ 個別企業名 残存禁止 (v1.29)',
            `残存: ${offenders.join(' / ')} — ① v1.34 個別企業名完全非公開原則違反`));
      }

      // ─── gl-neutrality-clause: Phase E ページに中立性条項配置検証 (v1.29 / 法令遵守 positive 検証) ───
      // canonical.phaseE.requiredNeutralityLabels の全件存在確認
      if (canonical.phaseE && canonical.phaseE.requiredNeutralityLabels) {
        const labels = canonical.phaseE.requiredNeutralityLabels;
        const PHASE_E_TARGETS = ['cases/index.html', 'methodology/index.html'];
        const missing = [];
        for (const t of PHASE_E_TARGETS) {
          const fp = path.join(ROOT, t);
          if (!fs.existsSync(fp)) continue;
          const html = fs.readFileSync(fp, 'utf-8');
          // Phase E 言及があるページのみ厳格判定
          if (!/プライム|3 段階比較|業界 3 段階|機械検証の社会的証明/.test(html)) continue;
          for (const label of labels) {
            if (!html.includes(label)) {
              missing.push(`${t}: "${label}"`);
            }
          }
        }
        r.push(missing.length === 0
          ? PASS('gl-neutrality-clause', S, 'Phase E ページ 中立性条項配置 (v1.29)',
            'Phase E 言及ページで中立性ラベル全件 verbatim 配置')
          : FAIL('gl-neutrality-clause', S, 'Phase E ページ 中立性条項配置 (v1.29)',
            `欠落: ${missing.slice(0, 3).join(' / ')} — canonical.phaseE.requiredNeutralityLabels 全件配置必須`));
      }

      // ─── gl-monthly-mandatory-text: ★★★ 表記近傍に月額契約 mandatory 併記検証 (v1.23 dogfooding 倫理) ───
      // ① v1.24 C-1/C-6 確定: ★★★ 保証 = 月額保守契約 mandatory (HSCEL §0.0.10 最大適用)
      // 「★★★ 保証」「★★★ 取得」表記を持つページで「月額」併記がない場合 = 看板倒れリスク = FAIL
      // 例外: 「★★★ 自社取得済」(自社実績言及) や cases/ の事例記述は 自動 PASS
      {
        const STAR_PROMISE_RE = /★★★\s*(保証|基準|パッケージ|維持|取得|級|認定)/;
        const MONTHLY_CONTEXT_RE = /月額|月次|保守|maintenance|サブスクリプション/;
        // Reviewer B-C-1 採用: g フラグで全マッチ削除しないと SELF_REFERENCE が部分残しで判定不能
        const SELF_REFERENCE_RE = /★★★\s*自社取得|★★★\s*取得済|自社で.*★★★|★★★\s*を自社/g;
        const SCAN_TARGETS = STATIC_TARGETS.filter(t => {
          const pt = PAGE_TYPE[t] || 'minimal';
          return pt !== 'minimal'; // 404/thanks/legal/privacy 除外
        });
        const offenders = [];
        for (const t of SCAN_TARGETS) {
          const fp = path.join(ROOT, t);
          if (!fs.existsSync(fp)) continue;
          const html = fs.readFileSync(fp, 'utf-8');
          // ページ内で ★★★ 商品保証言及があるか
          if (!STAR_PROMISE_RE.test(html)) continue;
          // 月額言及があれば PASS
          if (MONTHLY_CONTEXT_RE.test(html)) continue;
          // 自社実績言及を全件除去後に商品保証言及が残らなければ PASS
          if (!STAR_PROMISE_RE.test(html.replace(SELF_REFERENCE_RE, ''))) continue;
          offenders.push(t);
        }
        r.push(offenders.length === 0
          ? PASS('gl-monthly-mandatory-text', S, '★★★ 表記近傍に月額契約 mandatory 併記 (v1.23 / HSCEL §0.0.10)',
            `★★★ 商品保証言及ページ全件で「月額/保守」併記あり`)
          : FAIL('gl-monthly-mandatory-text', S, '★★★ 表記近傍に月額契約 mandatory 併記 (v1.23 / HSCEL §0.0.10)',
            `併記欠落: ${offenders.join(',')} — dogfooding 倫理矛盾 / canonical.labels.monthlyMandatoryClause 反映必要`));
      }
    }
  }

  return r;
}

// ═══════════════════ ファイル検証 ═══════════════════

function verify(filePath) {
  const rel = path.relative(ROOT, filePath).replace(/\\/g, '/');
  const pt = PAGE_TYPE[rel] || 'minimal';
  const variant = getVariant(rel);
  const html = fs.readFileSync(filePath, 'utf-8');
  return {
    file: rel, pt, variant,
    results: [
      ...c11_1(html, pt),
      ...c11_2(html, pt),
      ...c11_4(html, pt),
      ...c11_5(html),
      ...c11_6(html, pt),
      ...c11_7_mobile(html, pt),
      ...c11_8_google(html, pt),
      ...cGeo(html, pt),
      ...cSpec(html, pt, variant),
    ],
  };
}

// ═══════════════════ レポート出力 ═══════════════════

function report(all) {
  let tP = 0, tF = 0, tW = 0, tS = 0;
  all.forEach(f => f.results.forEach(r => {
    if (r.status === 'PASS') tP++; else if (r.status === 'FAIL') tF++;
    else if (r.status === 'WARN') tW++; else tS++;
  }));

  console.log('\n' + '='.repeat(72));
  console.log('  SPEC.md v3.2 完全自動検証レポート (tcharton.com 18ページ)');
  console.log('  検証日時: ' + new Date().toISOString());
  console.log('  チェックリスト: 11.1(6)+11.2(12)+11.3(3)+11.4(7)+11.5(7)+11.6(4)+11.7モバイル+11.8Google+11.9(2)');
  console.log('                 + GEO/LLMO(G-1〜G-6) + SPEC本文 + グローバル + コントラスト比');
  console.log('                 GEO典拠: Aggarwal et al. KDD2024 arXiv:2311.09735');
  console.log('='.repeat(72));

  for (const f of all) {
    const fails = f.results.filter(r => r.status === 'FAIL');
    const warns = f.results.filter(r => r.status === 'WARN');
    const p = f.results.filter(r => r.status === 'PASS').length;
    const s = f.results.filter(r => r.status === 'SKIP').length;
    console.log(`\n${fails.length === 0 ? '✅' : '❌'} ${f.file} [${f.pt}]`);
    console.log(`   PASS:${p}  FAIL:${fails.length}  WARN:${warns.length}  SKIP:${s}`);
    if (fails.length) { console.log('   --- FAIL ---'); fails.forEach(r => console.log(`   ❌ [${r.id}] ${r.name}${r.detail ? ' → ' + r.detail : ''}`)); }
    if (warns.length) { console.log('   --- WARN ---'); warns.forEach(r => console.log(`   ⚠️  [${r.id}] ${r.name}${r.detail ? ' → ' + r.detail : ''}`)); }
  }

  // セクション別
  console.log('\n' + '-'.repeat(72));
  const secs = {};
  all.forEach(f => f.results.forEach(r => {
    if (!secs[r.sec]) secs[r.sec] = { p: 0, f: 0, w: 0, s: 0 };
    secs[r.sec][r.status === 'PASS' ? 'p' : r.status === 'FAIL' ? 'f' : r.status === 'WARN' ? 'w' : 's']++;
  }));
  for (const [s, c] of Object.entries(secs))
    console.log(`  ${c.f === 0 ? '✅' : '❌'} ${s}: P=${c.p} F=${c.f} W=${c.w} S=${c.s}`);

  console.log('\n' + '='.repeat(72));
  console.log(`  検証項目: ${tP + tF + tW + tS}`);
  console.log(`  ✅ PASS: ${tP}  ❌ FAIL: ${tF}  ⚠️ WARN: ${tW}  ⏭️ SKIP: ${tS}`);
  console.log(`  合格率: ${((tP / (tP + tF)) * 100).toFixed(1)}%`);
  console.log(tF === 0 ? '\n  🏆 S-RANK 合格！全FAIL項目ゼロ' : `\n  ❌ 不合格: ${tF}件のFAILを修正してください`);
  console.log('='.repeat(72) + '\n');
  return tF;
}

// ═══════════════════ LIVE モード（HTTP ヘッダ実配信検証）═══════════════════
// SPEC v3.4 §8.1 / §8.9.2 / INSTRUCTION-FROM-ROOT-SPEC-V3.4.md §3.3
// 旧②セッション虚偽 S-RANK 報告（meta CSP 存在のみで PASS）の再発防止 machine gate

function fetchHeaders(targetUrl) {
  return new Promise((resolve, reject) => {
    let u;
    try { u = new URL(targetUrl); } catch (e) { return reject(new Error(`不正な URL: ${targetUrl}`)); }
    if (u.protocol !== 'https:') return reject(new Error(`https のみサポート: ${targetUrl}`));
    const req = https.request({
      method: 'HEAD',
      hostname: u.hostname,
      port: u.port || 443,
      path: u.pathname + u.search,
      headers: { 'User-Agent': 'spec-checker-live/1.0' },
    }, (res) => {
      // リダイレクト追跡（最大 1 段）
      if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location) {
        const next = new URL(res.headers.location, targetUrl).toString();
        res.resume();
        return fetchHeaders(next).then(resolve).catch(reject);
      }
      resolve({ status: res.statusCode, headers: res.headers, finalUrl: targetUrl });
      res.resume();
    });
    req.on('error', reject);
    req.setTimeout(10000, () => req.destroy(new Error('timeout 10s')));
    req.end();
  });
}

async function liveHeaderCheck(targetUrl) {
  const S = 'LIVE-HTTP-headers';
  const r = [];
  let resp;
  try { resp = await fetchHeaders(targetUrl); }
  catch (e) {
    r.push(FAIL('LIVE-fetch', S, 'HTTP HEAD 取得', e.message));
    return r;
  }
  const h = resp.headers;
  const get = (k) => (h[k.toLowerCase()] || '').toString();

  // 1. HSTS（max-age ≥ 31536000 + includeSubDomains + preload）
  const hsts = get('strict-transport-security');
  const hstsMatch = /max-age\s*=\s*(\d+)/i.exec(hsts);
  const hstsAge = hstsMatch ? parseInt(hstsMatch[1], 10) : 0;
  const hstsOK = !!hsts && hstsAge >= 31536000 && /includeSubDomains/i.test(hsts) && /preload/i.test(hsts);
  r.push(hstsOK
    ? PASS('LIVE-hsts', S, 'HSTS', `max-age=${hstsAge} +includeSubDomains +preload`)
    : FAIL('LIVE-hsts', S, 'HSTS', hsts ? `不備: "${hsts}"` : '未配信'));

  // 2. CSP（必須コア 6 個 + 推奨拡張 3 個 = 静的検証と同じ 9 個）
  const csp = get('content-security-policy');
  if (!csp) r.push(FAIL('LIVE-csp', S, 'CSP', '未配信'));
  else {
    const need = ['default-src','script-src','style-src','font-src','img-src','frame-src','object-src','base-uri','form-action'];
    const miss = need.filter(d => !csp.includes(d));
    r.push(miss.length === 0
      ? PASS('LIVE-csp', S, 'CSP 9 ディレクティブ配信')
      : FAIL('LIVE-csp', S, 'CSP', `不足: ${miss.join(',')}`));
  }

  // 3. X-Frame-Options（DENY / SAMEORIGIN）
  const xfo = get('x-frame-options');
  r.push(/^(DENY|SAMEORIGIN)$/i.test(xfo)
    ? PASS('LIVE-xfo', S, 'X-Frame-Options', xfo)
    : FAIL('LIVE-xfo', S, 'X-Frame-Options', xfo || '未配信'));

  // 4. X-Content-Type-Options（nosniff）
  const xcto = get('x-content-type-options');
  r.push(/^nosniff$/i.test(xcto)
    ? PASS('LIVE-xcto', S, 'X-Content-Type-Options', 'nosniff')
    : FAIL('LIVE-xcto', S, 'X-Content-Type-Options', xcto || '未配信'));

  // 5-9. COOP / COEP / CORP / Referrer-Policy / Permissions-Policy（値存在）
  const presenceChecks = [
    ['LIVE-coop', 'cross-origin-opener-policy', 'COOP'],
    ['LIVE-coep', 'cross-origin-embedder-policy', 'COEP'],
    ['LIVE-corp', 'cross-origin-resource-policy', 'CORP'],
    ['LIVE-rp',   'referrer-policy',              'Referrer-Policy'],
    ['LIVE-pp',   'permissions-policy',           'Permissions-Policy'],
  ];
  for (const [id, key, label] of presenceChecks) {
    const v = get(key);
    r.push(v
      ? PASS(id, S, label, v.length > 60 ? v.substring(0, 60) + '…' : v)
      : FAIL(id, S, label, '未配信'));
  }

  // 10. X-Hosting honest signaling（SPEC §8.9.2 許可リスト・任意推奨）
  const xh = get('x-hosting');
  const allowedHosts = ['cloudflare-pages','cloudflare-workers-static-assets','vercel','netlify','github-pages','custom-static-cdn'];
  if (!xh) r.push(WARN('LIVE-xh', S, 'X-Hosting', '未配信（任意推奨・honest signaling）'));
  else r.push(allowedHosts.includes(xh)
    ? PASS('LIVE-xh', S, 'X-Hosting', xh)
    : FAIL('LIVE-xh', S, 'X-Hosting', `不正値（許可リスト外）: ${xh}`));

  return r;
}

// ═══════════════════ main ═══════════════════

async function main() {
  const args = process.argv.slice(2);
  const liveIdx = args.indexOf('--live');
  let liveUrl = null;
  if (liveIdx >= 0) {
    liveUrl = args[liveIdx + 1];
    if (!liveUrl || liveUrl.startsWith('-')) {
      console.error('  ERROR: --live は URL を引数に取ります（例: --live https://tcharton.com/）');
      process.exit(1);
    }
    args.splice(liveIdx, 2);
  }

  const files = args.length > 0
    ? args.map(f => path.resolve(f))
    : TARGET_FILES.map(f => path.join(ROOT, f));

  const miss = files.filter(f => !fs.existsSync(f));
  if (miss.length) { miss.forEach(f => console.error('  NOT FOUND: ' + f)); process.exit(1); }

  const all = files.map(f => verify(f));

  // 11.3 E-E-A-Tコンテンツ（グローバル）
  all.push({ file: '[11.3 E-E-A-Tコンテンツ]', pt: 'global', results: c11_3_eeat() });

  // 11.9 追加要件（グローバル）
  all.push({ file: '[11.9 追加要件]', pt: 'global', results: c11_7() });

  // グローバル(sitemap/robots/コントラスト)
  all.push({ file: '[グローバル] sitemap+robots+コントラスト', pt: 'global', results: cGlobal() });

  // LIVE モード: HTTP ヘッダ実配信検証（旧②虚偽 S-RANK 報告再発防止 machine gate）
  if (liveUrl) {
    const liveResults = await liveHeaderCheck(liveUrl);
    all.push({ file: `[LIVE: ${liveUrl}]`, pt: 'live', results: liveResults });
  }

  process.exit(report(all) > 0 ? 1 : 0);
}

main().catch(e => { console.error('  FATAL: ' + e.message); process.exit(1); });
