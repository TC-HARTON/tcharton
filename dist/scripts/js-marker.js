/* v1.34 / 2026-05-10 — JS 検出マーカー（CSP unsafe-inline 解消用）
 * 旧 <noscript><style>...</style></noscript> の代替実装。
 * <html> から no-js クラスを除去 → CSS の html.no-js セレクタが無効化 → fade-in 等のアニメ有効
 * 配置: <head> 内 / 全 HTML ページの最初の <script> として読み込む（defer なし / 同期実行）
 */
document.documentElement.classList.remove('no-js');
