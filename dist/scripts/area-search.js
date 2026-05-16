/**
 * area-search.js — トップページの「都道府県 → 市町村 → 業種」カスケード検索
 *
 * CSP 適合（外部 src / inline なし）+ Trusted Types 安全（textContent / value のみ操作）
 *
 * 該当 city / industry が選択されたら /areas/{city}/{industry}/ にリダイレクト。
 * city のみ → /areas/{city}/、prefecture のみ → /areas/。
 */
(function() {
  'use strict';

  // データソース: scanner per-industry latest（dental は consolidated 補完）
  // 業種スラグ → 業種日本語名
  var IND_NAMES = {
    tax: '税理士・会計事務所',
    lawyer: '弁護士',
    shihoshoshi: '司法書士',
    gyoseishoshi: '行政書士',
    realestate: '不動産',
    restaurant: '飲食店',
    salon: '美容院',
    lodging: '宿泊施設',
    dental: '歯科医院',
    hospital: '病院',
    clinic: 'クリニック',
    cosmeticclinic: '美容クリニック',
    juku: '学習塾'
  };

  // 都道府県 → 市町村 → 業種スラグ配列
  // 業種スラグなし = scanner データなし（hub のみ存在）
  var DATA = {
    '静岡県': {
      'numazu':     { name: '沼津市',          industries: ['tax','lawyer','shihoshoshi','gyoseishoshi','realestate','restaurant','salon','lodging','dental','hospital','cosmeticclinic','juku'] },
      'mishima':    { name: '三島市',          industries: ['tax','lawyer','shihoshoshi','gyoseishoshi','realestate','restaurant','salon','lodging','clinic','cosmeticclinic','juku'] },
      'fuji':       { name: '富士市',          industries: ['tax','lawyer','shihoshoshi','gyoseishoshi','realestate','restaurant','salon','lodging','clinic','cosmeticclinic','juku'] },
      'fujinomiya': { name: '富士宮市',         industries: [] },
      'susono':     { name: '裾野市',          industries: [] },
      'nagaizumi':  { name: '長泉町',          industries: [] },
      'shimizu':    { name: '静岡市清水区',     industries: [] },
      'shizuoka':   { name: '静岡市',          industries: ['tax','lawyer','shihoshoshi','gyoseishoshi','realestate','restaurant','salon','lodging','clinic','cosmeticclinic','juku'] },
      'hamamatsu':  { name: '浜松市',          industries: ['tax','lawyer','shihoshoshi','gyoseishoshi','realestate','restaurant','salon','lodging','clinic','cosmeticclinic','juku'] }
    },
    '東京都': {
      'shibuya':    { name: '渋谷区',          industries: ['tax','lawyer','shihoshoshi','gyoseishoshi','realestate','restaurant','salon','lodging','clinic','cosmeticclinic','juku'] }
    },
    '北海道': {
      'sapporo':    { name: '札幌市',          industries: ['tax','lawyer','shihoshoshi','gyoseishoshi','realestate','restaurant','salon','lodging','clinic','cosmeticclinic','juku'] }
    }
  };

  function clearOptions(select, placeholderText) {
    while (select.firstChild) select.removeChild(select.firstChild);
    var opt = document.createElement('option');
    opt.value = '';
    opt.textContent = placeholderText;
    select.appendChild(opt);
  }

  function init() {
    var prefSel = document.getElementById('search-prefecture');
    var citySel = document.getElementById('search-city');
    var indSel  = document.getElementById('search-industry');
    var form    = document.getElementById('area-search-form');
    if (!prefSel || !citySel || !indSel || !form) return;

    // 1. 都道府県オプション初期化
    clearOptions(prefSel, '都道府県を選択');
    Object.keys(DATA).forEach(function(pref) {
      var opt = document.createElement('option');
      opt.value = pref;
      opt.textContent = pref;
      prefSel.appendChild(opt);
    });

    // 2. 都道府県変更 → 市町村絞り込み
    prefSel.addEventListener('change', function() {
      var pref = prefSel.value;
      clearOptions(citySel, '市町村を選択');
      clearOptions(indSel, '業種を選択（任意）');
      citySel.disabled = !pref;
      indSel.disabled = true;
      if (!pref) return;
      var cities = DATA[pref];
      Object.keys(cities).forEach(function(slug) {
        var opt = document.createElement('option');
        opt.value = slug;
        opt.textContent = cities[slug].name + (cities[slug].industries.length === 0 ? '（業種データ準備中）' : '');
        citySel.appendChild(opt);
      });
    });

    // 3. 市町村変更 → 業種絞り込み
    citySel.addEventListener('change', function() {
      var pref = prefSel.value;
      var city = citySel.value;
      clearOptions(indSel, '業種を選択（任意）');
      indSel.disabled = !city;
      if (!city) return;
      var industries = DATA[pref][city].industries;
      if (industries.length === 0) {
        var opt = document.createElement('option');
        opt.value = '';
        opt.textContent = '（業種データはこの都市で準備中）';
        opt.disabled = true;
        indSel.appendChild(opt);
        return;
      }
      industries.forEach(function(slug) {
        var opt = document.createElement('option');
        opt.value = slug;
        opt.textContent = IND_NAMES[slug] || slug;
        indSel.appendChild(opt);
      });
    });

    // 4. 送信 → 該当 URL へ遷移
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var city = citySel.value;
      var ind  = indSel.value;
      var url = '/areas/';
      if (city && ind) {
        url = '/areas/' + city + '/' + ind + '/';
      } else if (city) {
        url = '/areas/' + city + '/';
      }
      window.location.href = url;
    });

    // 初期状態：市町村 / 業種は disabled
    citySel.disabled = true;
    indSel.disabled = true;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
