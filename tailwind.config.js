/** @type {import('tailwindcss').Config} */
// SPEC v3.2 §2.2 準拠 — プライマリカラー: ディープティール（青緑寄りの深い青）
// 主軸 700 = #1B4965（信頼の深さ + 緑寄りの温度）
module.exports = {
  content: ['./*.html', './**/*.html', '!./node_modules/**'],
  theme: {
    extend: {
      colors: {
        // プライマリ: ディープティール
        // 700 を主軸として、上下の階調を WCAG コントラスト基準を満たすよう設計
        teal: {
          50:  '#f0f6f9',
          100: '#d9e7ee',
          200: '#b3cfdc',
          300: '#7eb0c5',
          400: '#4a8aa6',
          500: '#2c6e8c',
          600: '#225770',
          700: '#1B4965',
          800: '#143548',
          900: '#0d2333',
        },
        // ニュートラル（SPEC §2.2 原則固定）
        dark: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        // DESIGN.md §2 Stella Sub-brand (v1.37 追加)
        gold: {
          50:  '#fdfbf3',
          100: '#fbf5e0',
          200: '#f8ecc4',
          300: '#F5E5A8',  // Stella Gold Light (Badge 背景)
          400: '#e9ce72',
          500: '#D4AF37',  // Stella Gold (Accent / Badge メイン)
          600: '#c19a2a',
          700: '#B8941F',  // Stella Gold Dark (Badge ボーダー)
          800: '#8f7218',
          900: '#664f10',
        },
        'stella-navy': '#0F2840',       // /stella/ ヒーロー背景
        'stella-navy-dark': '#0a1c2e',  // footer / より深い navy
        // Callout 色（DESIGN.md §4 Callouts）
        'callout-info':      '#eff6fb',
        'callout-highlight': '#fff8e6',
        'callout-danger':    '#fef2f2',
        'border-soft':       '#e0e6eb',
        'bg-soft':           '#fafbfc',  // zebra stripe
      },
      fontFamily: {
        // DESIGN.md §3 Typography v1.37 採用
        sans:    ['"Noto Sans JP"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif:   ['"Noto Serif JP"', 'serif'],
        display: ['"Noto Serif JP"', '"Noto Sans JP"', 'serif'],  // 見出し
        mono:    ['"JetBrains Mono"', '"Menlo"', 'monospace'],
      },
    },
  },
  plugins: [],
};
