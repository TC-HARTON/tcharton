// v1.15.1: asset cache refresh (Cloudflare wrangler hash 再計算トリガー / 6 .js 強制 re-upload)
/**
 * /dist/scripts/simulator.js
 * 外部化元: index.html line 940-1065（無料診断シミュレーター simAdvance/showSimResult/simReset）
 *           ※ menu+IO は menu.js で別ロード
 * v1.15 / 2026-05-03 / Mozilla Observatory CSP 'unsafe-inline' → A+ 解消
 * 適用ページ: 1 件（index.html のみ）
 * 依存: なし（IIFE 完結）/ DOM 操作: createElement + textContent + appendChild（innerHTML 不使用 / TT 違反なし）
 * 規範: SPEC §7.3 prefers-reduced-motion 対応（CSS 側で transition-duration: 0.01ms 強制）
 */
(function () {
  'use strict';
  // 必須要素存在ガード（他ページ誤読込防止）
  if (!document.getElementById('simBox')) return;

  var simScores = {};
  function simAdvance(q, val) {
    simScores[q] = val;
    var step = document.querySelector('.sim-step[data-step="' + q + '"]');
    if (q < 5) {
      step.classList.add('hidden');
      document.querySelector('.sim-step[data-step="' + (q + 1) + '"]').classList.remove('hidden');
      var pct = (q / 5) * 100;
      document.getElementById('simBar').style.width = pct + '%';
      document.getElementById('simProgress').textContent = '質問 ' + (q + 1) + ' / 5';
      document.getElementById('simPercent').textContent = Math.round(pct) + '%';
    } else {
      document.getElementById('simBar').style.width = '100%';
      document.getElementById('simProgress').textContent = '診断完了';
      document.getElementById('simPercent').textContent = '100%';
      step.classList.add('hidden');
      showSimResult();
    }
  }
  function showSimResult() {
    var webScore = simScores[1] || 0;
    var maintScore = ((simScores[2] || 0) + (3 - (simScores[4] || 0))) / 2;
    var aiScore = simScores[3] || 0;
    var sizeIdx = simScores[5] || 0;
    var sizeMult = [1, 1.5, 2.5, 4][sizeIdx];

    var webPct = Math.round((webScore / 3) * 100);
    var maintPct = Math.round((maintScore / 3) * 100);
    var aiPct = Math.round((aiScore / 3) * 100);
    var totalPct = Math.round((webPct + maintPct + aiPct) / 3);

    var baseLoss = (300 - totalPct * 2.5) * sizeMult;
    var lossMin = Math.round(baseLoss * 0.8 / 10) * 10;
    var lossMax = Math.round(baseLoss * 1.2 / 10) * 10;

    document.getElementById('simResult').classList.remove('hidden');
    document.getElementById('simScore').textContent = totalPct;

    var labels = [
      [0, '改善余地・大。大きなポテンシャルが眠っています。', 'text-amber-300'],
      [30, '伸びしろ十分。仕組み化で大きく変われます。', 'text-amber-200'],
      [60, '基盤はあり。さらなる最適化で差がつきます。', 'text-teal-300'],
      [80, '優秀。ピンポイントの強化で更に上へ。', 'text-teal-200']
    ];
    var label = labels[0];
    for (var i = 0; i < labels.length; i++) {
      if (totalPct >= labels[i][0]) label = labels[i];
    }
    var labelEl = document.getElementById('simLabel');
    labelEl.textContent = label[1];
    labelEl.className = 'text-base lg:text-lg font-bold ' + label[2];

    setTimeout(function () {
      document.getElementById('simWebBar').style.width = webPct + '%';
      document.getElementById('simAutoBar').style.width = maintPct + '%';
      document.getElementById('simAIBar').style.width = aiPct + '%';
      document.getElementById('simWeb').textContent = webPct + '%';
      document.getElementById('simAuto').textContent = maintPct + '%';
      document.getElementById('simAI').textContent = aiPct + '%';

      // v1.18 観点 5: SVG レーダーチャート points 計算 + scale(0)→scale(1) アニメーション
      // 三角形の 3 頂点 (center=(100,100) / 最大半径 80)
      // WEB (12 o'clock): (cx, cy − r·webPct/100)
      // 保守 (4 o'clock = +120°): (cx + r·sin120°·maintPct/100, cy + r·cos60°·maintPct/100)
      //   = (cx + r·0.866·s, cy + r·0.5·s)  where s = maintPct/100
      // AI (8 o'clock = +240°): (cx − r·0.866·s, cy + r·0.5·s)  where s = aiPct/100
      var poly = document.getElementById('simRadarPoly');
      if (poly) {
        var R = 80, cx = 100, cy = 100;
        var s1 = webPct / 100, s2 = maintPct / 100, s3 = aiPct / 100;
        var v1 = cx + ',' + (cy - R * s1);
        var v2 = (cx + R * 0.866 * s2).toFixed(2) + ',' + (cy + R * 0.5 * s2).toFixed(2);
        var v3 = (cx - R * 0.866 * s3).toFixed(2) + ',' + (cy + R * 0.5 * s3).toFixed(2);
        poly.setAttribute('points', v1 + ' ' + v2 + ' ' + v3);
        // 反映タイミングを次フレームに分離 → CSS transition が起動
        // Reviewer A-CRITICAL 対応: simReset → showSimResult 連続呼出で
        // setAttribute と classList.remove が同 rendering frame に batch される問題を防止
        // 二重 rAF で初期 scale(0) 状態が確実に commit されてから enter class を解除
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            poly.classList.remove('sim-radar-poly--enter');
          });
        });
      }
    }, 200);

    // v1.20 P6-C-1 + Reviewer A-Important-1 / B-H-2: classList API で べき等性確保
    // (className.replace は重複追加 / 部分一致 / 失敗 silent のリスクあり)
    var lossEl = document.getElementById('simLoss');
    var lossNoteEl = document.getElementById('simLossNote');
    var DEFAULT_LOSS_NOTE = '※業界平均値に基づく概算（中小企業庁・経産省統計を参考）。実際の数値はヒアリングで個別算定します。';
    lossEl.classList.remove('text-amber-300', 'text-teal-300');
    if (totalPct < 80) {
      lossEl.classList.add('text-amber-300');
      lossEl.textContent = '約 ' + lossMin + ' 万 〜 ' + lossMax + ' 万円 / 年';
      if (lossNoteEl) lossNoteEl.textContent = DEFAULT_LOSS_NOTE;
    } else {
      lossEl.classList.add('text-teal-300');
      lossEl.textContent = '低リスク';
      if (lossNoteEl) lossNoteEl.textContent = '※現在の仕組みは高い水準です。さらなる最適化をご提案できます。';
    }

    // v1.20 Q9: 診断スコアを sessionStorage に保存 (contact ページで読み出し / プライバシー優先 = same-tab のみ)
    try {
      sessionStorage.setItem('hartonDiagScore', JSON.stringify({
        totalPct: totalPct, webPct: webPct, maintPct: maintPct, aiPct: aiPct,
        timestamp: Date.now()
      }));
    } catch (e) { /* private mode 等で sessionStorage 利用不可 → silent fallback */ }

    var advice = [];
    if (webScore < 2) {
      advice.push({ title: 'WEBサイト構築（Sクラス保証）', desc: '買い切り型 30〜80 万円。Lighthouse / WCAG 2.2 / OWASP / GEO の 5 評価軸を機械検証で保証し、24 時間働く営業チャネルへ。', href: '/services/web/', color: 'border-teal-400 text-teal-300' });
    }
    if (maintScore < 2) {
      advice.push({ title: '保守運用プラン', desc: '月額 ' + Math.round(11 * sizeMult) + ',000 円 〜。セキュリティ脆弱性対応・速度モニタリング・SEO/LLMO 継続最適化。年間 ' + Math.round(60 * sizeMult) + ' 時間以上の運用工数削減見込み。', href: '/services/maintenance/', color: 'border-teal-300 text-teal-200' });
    }
    if (aiScore < 2) {
      advice.push({ title: 'AI予測モデル開発', desc: '在庫・需要予測 / 売上・来客予測。3 段階導入(分析 30 万 → PoC 50 万 → 本番 100〜200 万)。勘と経験を統計でバックアップ。', href: '/services/ai-prediction/', color: 'border-amber-300 text-amber-200' });
    }
    if (advice.length === 0) {
      advice.push({ title: '更なる飛躍へ', desc: '高い水準を維持しながら、AI 予測精度の向上や UI 改善で競合との差を広げましょう。', href: '/contact/', color: 'border-teal-200 text-teal-100' });
    }

    var adviceContainer = document.getElementById('simAdvice');
    adviceContainer.textContent = '';
    advice.forEach(function (a) {
      var card = document.createElement('a');
      card.href = a.href;
      card.className = 'block bg-dark-700/50 rounded-xl p-4 border-l-4 ' + a.color + ' hover:bg-dark-700 transition-colors py-4';
      var title = document.createElement('p');
      title.className = 'font-bold text-white text-sm';
      title.textContent = a.title + ' →';
      var desc = document.createElement('p');
      desc.className = 'text-dark-300 text-xs mt-1 leading-relaxed';
      desc.textContent = a.desc;
      card.appendChild(title);
      card.appendChild(desc);
      adviceContainer.appendChild(card);
    });
  }
  function simReset() {
    for (var k in simScores) delete simScores[k];
    document.getElementById('simResult').classList.add('hidden');
    var steps = document.querySelectorAll('.sim-step');
    for (var i = 0; i < steps.length; i++) {
      if (i === 0) steps[i].classList.remove('hidden');
      else steps[i].classList.add('hidden');
    }
    document.getElementById('simBar').style.width = '0%';
    document.getElementById('simProgress').textContent = '質問 1 / 5';
    document.getElementById('simPercent').textContent = '0%';
    document.getElementById('simWebBar').style.width = '0%';
    document.getElementById('simAutoBar').style.width = '0%';
    document.getElementById('simAIBar').style.width = '0%';
    // v1.18: レーダー再 enter 状態へ (次回 showSimResult で再アニメーション)
    var rp = document.getElementById('simRadarPoly');
    if (rp) {
      rp.classList.add('sim-radar-poly--enter');
      rp.setAttribute('points', '100,100 100,100 100,100');
    }
  }
  // v1.18 観点 5: ゲーミフィケーション (ボタン押下時の弾力 pulse / 0.5s 後 自動解除)
  function celebrate(el) {
    el.classList.remove('sim-btn-celebrate');
    // reflow 強制 → 同 class 連続適用でも animation 再起動
    void el.offsetWidth;
    el.classList.add('sim-btn-celebrate');
    setTimeout(function () { el.classList.remove('sim-btn-celebrate'); }, 550);
  }
  document.querySelectorAll('.sim-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      celebrate(b);
      var q = parseInt(b.dataset.q, 10);
      var v = parseInt(b.dataset.v, 10);
      simAdvance(q, v);
    });
  });
  var simResetBtn = document.getElementById('simResetBtn');
  if (simResetBtn) simResetBtn.addEventListener('click', simReset);
})();
