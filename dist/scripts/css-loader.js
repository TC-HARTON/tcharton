/**
 * css-loader.js — render-blocking でない CSS 非同期ロード (CSP 適合 / Trusted Types 安全)
 *
 * 仕組み: <link rel="stylesheet" data-defer-css media="print"> として読み込ませると
 * ブラウザは print media と認識し低優先・非ブロック取得。本スクリプトが media を 'all' に
 * 切り替えてスクリーンに適用する。display:swap と組み合わせて FOIT 解消 + LCP 短縮。
 *
 * CSP 制約: inline onload は禁止のため外部スクリプトで実装。
 * 配置: <head> 内末尾、または defer 属性で配置可。
 *
 * 作成 2026-05-16 (TCHARTON IMPROVEMENT DIRECTIVE V2 / T3 対応)
 */
(function() {
  'use strict';
  function swap() {
    var links = document.querySelectorAll('link[data-defer-css][media="print"]');
    for (var i = 0; i < links.length; i++) {
      links[i].media = 'all';
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', swap);
  } else {
    swap();
  }
})();
