#!/usr/bin/env node
/**
 * gen-area-search.js — 検索ドロップダウン用 area-search.js を生成
 *
 * データソース:
 *   - src/data/prefectures.json … 47 都道府県 + 10 万以上都市
 *   - src/data/areas-cities-industries.json … scanner per-industry 集計
 *
 * 出力:
 *   - dist/scripts/area-search.js
 *
 * 動作:
 *   都道府県 → 市町村 → 業種（任意） のカスケード選択。
 *   送信時:
 *     - scanner データあり都市 + 業種 → /areas/{citySlug}/{industry}/
 *     - scanner データあり都市のみ → /areas/{citySlug}/
 *     - scanner データなし都市 → /areas/pref/{prefSlug}/（都道府県ハブ）
 *     - 都道府県のみ → /areas/pref/{prefSlug}/
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PREFS = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/prefectures.json'), 'utf-8')).prefectures;
const SCAN  = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/areas-cities-industries.json'), 'utf-8'));

// scanner data の citySlug を日本語都市名にマップ（既存ハブ ＆ 検索 routing 用）
const SCAN_CITIES = {
  numazu:    { name: '沼津市', pref: '静岡県' },
  mishima:   { name: '三島市', pref: '静岡県' },
  fuji:      { name: '富士市', pref: '静岡県' },
  shizuoka:  { name: '静岡市', pref: '静岡県' },
  hamamatsu: { name: '浜松市', pref: '静岡県' },
  shibuya:   { name: '渋谷区', pref: '東京都' },
  sapporo:   { name: '札幌市', pref: '北海道' }
};

// 業種スラグ → 日本語名
const IND_NAMES = {
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

// 都道府県名 → { prefSlug, cities: { citySlugOrName: { name, slug?, industries[] } } }
const DATA = {};
for (const p of PREFS) {
  const entry = { pref_slug: p.slug, cities: {} };
  // p.cities は日本語都市名（"沼津市" 等）の配列
  for (const cityName of p.cities) {
    // scanner data あり都市を逆引き
    let scanned = null;
    for (const [slug, meta] of Object.entries(SCAN_CITIES)) {
      if (meta.name === cityName && meta.pref === p.name) {
        scanned = slug;
        break;
      }
    }
    if (scanned && SCAN[scanned]) {
      // scanned: industries は per-industry 集計から（最新）
      const industries = Object.keys(SCAN[scanned].industries);
      // option value は scanned スラグ
      entry.cities[scanned] = {
        name: cityName,
        scanned: true,
        industries: industries
      };
    } else {
      // 非 scanner: 業種は全 13 業種を選択可能（routing は pref hub へ）
      entry.cities[cityName] = {
        name: cityName,
        scanned: false,
        industries: []
      };
    }
  }
  DATA[p.name] = entry;
}

// 生成
const out = `/**
 * area-search.js — トップページの「都道府県 → 市町村 → 業種」カスケード検索
 *
 * 自動生成: gen-area-search.js（手動編集禁止）
 * データソース: src/data/prefectures.json + src/data/areas-cities-industries.json
 *
 * CSP 適合（外部 src / inline なし）+ Trusted Types 安全（textContent / value のみ操作）
 *
 * 動作:
 *   scanned 都市 + 業種  → /areas/{citySlug}/{industry}/
 *   scanned 都市のみ     → /areas/{citySlug}/
 *   非 scanned 都市      → /areas/pref/{prefSlug}/（都道府県ハブ）
 *   都道府県のみ          → /areas/pref/{prefSlug}/
 */
(function() {
  'use strict';

  var IND_NAMES = ${JSON.stringify(IND_NAMES, null, 2).replace(/\n/g, '\n  ')};

  var DATA = ${JSON.stringify(DATA, null, 2).replace(/\n/g, '\n  ')};

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
      var cities = DATA[pref].cities;
      Object.keys(cities).forEach(function(slug) {
        var opt = document.createElement('option');
        opt.value = slug;
        opt.textContent = cities[slug].name + (cities[slug].scanned ? '' : '（業種データ準備中）');
        citySel.appendChild(opt);
      });
    });

    // 3. 市町村変更 → 業種絞り込み
    // 全 13 業種は常に選択可能（scanned 都市のみ実測ページへ遷移、非 scanned は都道府県ハブへ）
    var ALL_IND_SLUGS = Object.keys(IND_NAMES);
    citySel.addEventListener('change', function() {
      var pref = prefSel.value;
      var city = citySel.value;
      clearOptions(indSel, '業種を選択（任意）');
      indSel.disabled = !city;
      if (!city) return;
      var cityData = DATA[pref].cities[city];
      // scanned 都市は実測ありの業種を優先表示、それ以外も選択可
      var primary = (cityData && cityData.scanned) ? cityData.industries : [];
      var rest = ALL_IND_SLUGS.filter(function(s) { return primary.indexOf(s) === -1; });
      primary.forEach(function(slug) {
        var opt = document.createElement('option');
        opt.value = slug;
        opt.textContent = IND_NAMES[slug] + '（実測データあり）';
        indSel.appendChild(opt);
      });
      rest.forEach(function(slug) {
        var opt = document.createElement('option');
        opt.value = slug;
        opt.textContent = IND_NAMES[slug] || slug;
        indSel.appendChild(opt);
      });
    });

    // 4. 送信 → 該当 URL へ遷移
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var pref = prefSel.value;
      var city = citySel.value;
      var ind  = indSel.value;
      var url = '/areas/';
      if (pref && city) {
        var cityData = DATA[pref].cities[city];
        if (cityData && cityData.scanned) {
          // scanned: city は romanized slug
          if (ind) {
            url = '/areas/' + city + '/' + ind + '/';
          } else {
            url = '/areas/' + city + '/';
          }
        } else {
          // 非 scanned: 都道府県ハブへ
          url = '/areas/pref/' + DATA[pref].pref_slug + '/';
        }
      } else if (pref) {
        url = '/areas/pref/' + DATA[pref].pref_slug + '/';
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
`;

fs.writeFileSync(path.join(ROOT, 'dist/scripts/area-search.js'), out, 'utf-8');

// summary
let totalCities = 0;
let scannedCities = 0;
for (const pref of Object.keys(DATA)) {
  for (const c of Object.keys(DATA[pref].cities)) {
    totalCities++;
    if (DATA[pref].cities[c].scanned) scannedCities++;
  }
}
console.log(`area-search.js generated: ${Object.keys(DATA).length} 都道府県, ${totalCities} 都市 (うち scanner 実測 ${scannedCities} 都市)`);
