#!/usr/bin/env node
/**
 * gen-areas.js — areas/{slug}/index.html を一斉生成（Numazu 以外の 6 エリア）
 *
 * Numazu は本社 LP として個別執筆済み。本スクリプトは他 6 都市を共通テンプレで生成。
 * 各都市データを CITIES テーブルに整理し、テンプレに代入して書き出す。
 *
 * 使い方: node gen-areas.js          全 6 都市生成（既存ファイルは上書き）
 *         node gen-areas.js <slug>   指定 slug のみ
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const AREAS = path.join(ROOT, 'areas');

const CITIES = {
  mishima: {
    cityJa: '三島市', cityKana: 'みしまし', wpSlug: '三島市_(静岡県)',
    region: '静岡県東部',
    eyebrow: '新幹線停車駅 ／ 商業・観光',
    population: '約 10.6 万人',
    distanceKm: '8 km', distanceTime: '車 15 分',
    industries: '商業・観光・教育・小売',
    industriesShort: '商業・観光',
    transport: 'JR 三島駅（新幹線停車） / 東名 沼津 IC・新東名 長泉沼津 IC',
    transportShort: '東京から新幹線で約 50 分',
    address: '三島市',
    cityAccent: '富士山の湧水と源兵衛川が象徴する水と歴史の街',
    overview1: '三島市は静岡県東部の <strong class="text-dark-900">商業・観光・教育の集積地</strong>で、人口 <strong class="text-dark-900">約 10.6 万人</strong>。新幹線停車駅 JR 三島駅を擁し、東京から約 50 分という首都圏アクセスの良さが特徴です。富士山の伏流水が街中を流れる<strong class="text-dark-900">水の都</strong>として観光ブランドが確立されています。',
    overview2: '商工会議所会員も多く、卸小売・飲食・観光が経済を牽引。一方で BtoB 製造業・教育機関・士業・専門サービスも厚く、WEB の品質要求が広いレンジで存在します。',
    overview3: '事業所数は約 4,500、首都圏との往来需要を取り込めるサイト設計（モバイル + 速度 + 多言語）が他エリアより重要度が高い傾向です。',
    web1: '三島の事業者は首都圏からの来訪・宿泊・通学・通勤需要を強く意識する必要があり、<strong class="text-dark-900">英語コンテンツや WCAG 2.2 準拠</strong>のニーズが県内市部でも高めです。',
    web2: '一方で SNS 偏重で公式サイトが弱い飲食店、Google ビジネスプロフィールの設定が不十分な小売店など、<strong class="text-dark-900">基礎の取りこぼし</strong>も多く見られます。',
    web3: 'HARTON は本社（沼津市大岡）から車 15 分の距離を活かし、月次の対面打合せを標準で組み込むなど近距離ならではの運用体制で対応します。',
    faq1q: '三島市の事業者の場合、訪問対応は受けられますか？',
    faq1a: 'はい。三島市は本社（沼津市大岡）から車で約 15 分の距離です。初回ヒアリング・要件定義・最終納品確認は対面、中間打合せは Zoom / Google Meet 併用で進行します。',
    faq2q: '観光業や宿泊業のサイト制作経験はありますか？',
    faq2a: '三島・沼津・伊豆エリアの観光・宿泊・飲食店向けの WEB 制作の実績があります。Google ビジネスプロフィール最適化、多言語対応、Core Web Vitals 改善を含めて対応します。',
    faq3q: '三島商工会議所と連携した補助金活用の相談は可能ですか？',
    faq3a: 'はい。IT 導入補助金・小規模事業者持続化補助金等を活用した WEB 制作・改修の相談を承ります。',
    sources: [
      { name: '三島市公式サイト', url: 'https://www.city.mishima.shizuoka.jp/' },
      { name: '静岡県統計年鑑', url: 'https://www.pref.shizuoka.jp/kensei/tokei/' },
      { name: '三島商工会議所', url: 'https://www.mishima-cci.or.jp/' },
    ]
  },

  fuji: {
    cityJa: '富士市', cityKana: 'ふじし', wpSlug: '富士市',
    region: '静岡県東部',
    eyebrow: '製紙・化学・物流',
    population: '約 24.1 万人',
    distanceKm: '25 km', distanceTime: '車 30 分',
    industries: '製紙・化学・物流・製造業',
    industriesShort: '製紙・化学・物流',
    transport: 'JR 富士駅 / 新富士駅（新幹線） / 東名 富士 IC',
    transportShort: '製紙のメッカ・東部最大の工業都市',
    address: '富士市',
    cityAccent: '製紙業が日本一の規模、東部最大級の工業集積地',
    overview1: '富士市は静岡県東部最大の<strong class="text-dark-900">工業都市</strong>で、人口 <strong class="text-dark-900">約 24.1 万人</strong>。製紙業の出荷額は全国 1 位クラスで、家庭紙・段ボール・特殊紙のメーカーが集積しています。化学・機械・物流も併存し、BtoB 取引の比率が高い経済構造です。',
    overview2: '事業所数は約 1.1 万、製造業の従業者比率が県内市部でも高水準。BtoB サイトの<strong class="text-dark-900">技術カタログ整理・引合い管理・問合せ導線</strong>へのニーズが特に強いエリアです。',
    overview3: 'JR 富士駅（在来線）と新富士駅（新幹線）の二つの駅を持ち、東名・新東名・国道 1 号の物流基盤も厚いため、首都圏 + 中京圏の二方向営業に対応する WEB 設計が求められます。',
    web1: '製紙・化学・機械の BtoB 製造業では、英語コンテンツ・技術仕様 PDF・問合せフォームの細部設計が成約率に直結します。Baymard Institute 調査ではフォーム最適化で CV +35.26%。',
    web2: 'また製造業特有の<strong class="text-dark-900">ロングテール検索</strong>（型番・素材名・規格名）対応として、構造化データ（Product / Article）の精緻な実装が他エリアより重要です。',
    web3: 'HARTON は富士市内の事業所まで沼津本社から車 30 分の距離を活かし、要件定義時の現場ヒアリングを重視した設計を提供します。',
    faq1q: '富士市の事業者の場合、訪問対応は受けられますか？',
    faq1a: 'はい。富士市は本社（沼津市大岡）から車で約 30 分の距離です。初回ヒアリング・要件定義・最終納品確認は対面、中間打合せは Zoom / Google Meet 併用で進行します。',
    faq2q: '製紙・化学・機械等の製造業サイトの制作経験はありますか？',
    faq2a: '富士・富士宮エリアの製造業サイトの制作実績があります。技術カタログ整理、英語コンテンツ、問合せフォーム最適化、構造化データ実装を含めて対応します。',
    faq3q: '富士商工会議所の会員ですが、補助金活用は可能ですか？',
    faq3a: 'はい。IT 導入補助金・小規模事業者持続化補助金・ものづくり補助金等を活用した WEB 制作・改修の相談を承ります。',
    sources: [
      { name: '富士市公式サイト', url: 'https://www.city.fuji.shizuoka.jp/' },
      { name: '静岡県統計年鑑', url: 'https://www.pref.shizuoka.jp/kensei/tokei/' },
      { name: '富士商工会議所', url: 'https://www.fuji-cci.or.jp/' },
    ]
  },

  fujinomiya: {
    cityJa: '富士宮市', cityKana: 'ふじのみやし', wpSlug: '富士宮市',
    region: '静岡県東部',
    eyebrow: '世界遺産の門前町 ／ 観光・食品',
    population: '約 12.8 万人',
    distanceKm: '35 km', distanceTime: '車 45 分',
    industries: '観光・食品（やきそば等）・農業・酪農',
    industriesShort: '観光・食品・農業',
    transport: 'JR 富士宮駅 / 西富士道路',
    transportShort: '富士山世界文化遺産・浅間大社の門前町',
    address: '富士宮市',
    cityAccent: '富士山世界文化遺産・浅間大社の門前町、富士宮やきそばで全国区',
    overview1: '富士宮市は富士山の南西麓に位置する<strong class="text-dark-900">観光・食品・農業</strong>の街で、人口 <strong class="text-dark-900">約 12.8 万人</strong>。富士山本宮浅間大社の門前町として、また<strong class="text-dark-900">富士山世界文化遺産</strong>の構成資産を多く擁する観光拠点です。',
    overview2: '富士宮やきそばは B-1 グランプリで全国に知られ、酪農（朝霧高原）・農業も盛ん。観光・飲食・農業生産者の WEB 露出が地域経済に直結する構造です。',
    overview3: '事業所数は約 5,500。観光客の事前検索・予約導線、ふるさと納税対応、Google ビジネスプロフィールの店舗運用が WEB 制作の核になりやすいエリアです。',
    web1: '観光業・飲食店では、<strong class="text-dark-900">多言語（英語・中国語・韓国語）対応</strong>と Google マップ連動が特に重要です。Google ローカル検索の 82% がモバイル経由（Google ローカルレポート）。',
    web2: 'また「富士宮やきそば」「朝霧高原」等の<strong class="text-dark-900">ローカル固有名詞での検索流入</strong>を取りこぼさないため、Wikidata Q コードや Schema.org LocalBusiness の精緻な実装が効きます。',
    web3: 'HARTON は本社（沼津市大岡）から車 45 分の距離。富士宮市内の事業者様にも訪問ヒアリングで対応します。',
    faq1q: '富士宮市の事業者の場合、訪問対応は受けられますか？',
    faq1a: 'はい。富士宮市は本社（沼津市大岡）から車で約 45 分の距離です。初回ヒアリング・要件定義・最終納品確認は対面、中間打合せは Zoom / Google Meet 併用で進行します。',
    faq2q: '観光業・飲食店のサイト制作経験はありますか？',
    faq2a: '富士宮・沼津・伊豆エリアの観光・宿泊・飲食店の WEB 制作実績があります。Google ビジネスプロフィール最適化、多言語対応、予約導線設計を含めて対応します。',
    faq3q: 'ふるさと納税の事業者ですが、専用ページ制作は可能ですか？',
    faq3a: 'はい。ふるさと納税ポータル外で独自に商品ページを持ちたい事業者様向けの WEB 制作・改修も承ります。',
    sources: [
      { name: '富士宮市公式サイト', url: 'https://www.city.fujinomiya.lg.jp/' },
      { name: '静岡県統計年鑑', url: 'https://www.pref.shizuoka.jp/kensei/tokei/' },
      { name: '富士宮商工会議所', url: 'https://www.fujinomiya.or.jp/' },
    ]
  },

  susono: {
    cityJa: '裾野市', cityKana: 'すそのし', wpSlug: '裾野市',
    region: '静岡県東部',
    eyebrow: 'トヨタ Woven City 隣接',
    population: '約 5.0 万人',
    distanceKm: '12 km', distanceTime: '車 20 分',
    industries: '製造業（自動車部品）・観光（御殿場 / 富士サファリパーク）',
    industriesShort: '自動車部品・観光',
    transport: 'JR 御殿場線 裾野駅 / 東名 裾野 IC',
    transportShort: 'トヨタ Woven City の建設地で全国注目',
    address: '裾野市',
    cityAccent: '富士山南東麓、自動車部品製造とトヨタ Woven City で全国注目',
    overview1: '裾野市は富士山南東麓に位置する<strong class="text-dark-900">製造業</strong>の街で、人口 <strong class="text-dark-900">約 5.0 万人</strong>。トヨタ自動車・矢崎総業など大手製造業の事業所が集積し、自動車部品の Tier 2-3 サプライヤーが地域経済を支えています。',
    overview2: '近年は<strong class="text-dark-900">トヨタ Woven City（コネクテッド・シティ実証実験）</strong>の建設地として全国注目を集め、首都圏・中京圏のテック企業からも視察が増えています。',
    overview3: '事業所数は約 1,800 と県内市部では小規模ですが、製造業の高付加価値型企業が多く、BtoB の WEB 露出と引合い管理の質が経営に直結する構造です。',
    web1: '裾野市の製造業は、<strong class="text-dark-900">大手 Tier 1 サプライヤーへの引合いを獲得する英語サイト</strong>と、技術仕様 PDF / 認証取得状況の構造化データが成約率に直結します。',
    web2: 'また Woven City 関連でテック・スタートアップとの接点が増える今、<strong class="text-dark-900">ピッチ用 LP・採用サイト</strong>の刷新ニーズが急増しています。',
    web3: 'HARTON は本社（沼津市大岡）から車 20 分の至近距離。短納期・頻回打合せが必要な案件にも対応可能です。',
    faq1q: '裾野市の事業者の場合、訪問対応は受けられますか？',
    faq1a: 'はい。裾野市は本社（沼津市大岡）から車で約 20 分の至近距離です。初回ヒアリング・要件定義・最終納品確認は対面で行います。',
    faq2q: '自動車部品メーカーの BtoB サイトの制作経験はありますか？',
    faq2a: '裾野・沼津・富士エリアの製造業 BtoB サイト制作実績があります。技術カタログ整理、英語コンテンツ、認証取得状況の表示、問合せフォーム最適化を含めて対応します。',
    faq3q: 'スタートアップ向けのピッチ用 LP は対応可能ですか？',
    faq3a: 'はい。Woven City 関連のテック・スタートアップ向け、また採用サイト・ピッチ LP の単発制作も承ります。',
    sources: [
      { name: '裾野市公式サイト', url: 'https://www.city.susono.shizuoka.jp/' },
      { name: '静岡県統計年鑑', url: 'https://www.pref.shizuoka.jp/kensei/tokei/' },
      { name: '裾野市商工会', url: 'https://susono-cci.or.jp/' },
    ]
  },

  nagaizumi: {
    cityJa: '長泉町', cityKana: 'ながいずみちょう', wpSlug: '長泉町',
    region: '静岡県東部 駿東郡',
    eyebrow: '医療・健康都市',
    population: '約 4.4 万人',
    distanceKm: '10 km', distanceTime: '車 15 分',
    industries: '医療（静岡がんセンター）・製造業・住宅',
    industriesShort: '医療・製造',
    transport: 'JR 御殿場線 長泉なめり駅 / 東名 沼津 IC',
    transportShort: '静岡がんセンター立地・健康と医療の街',
    address: '長泉町',
    cityAccent: '静岡がんセンター立地、医療・健康・住宅で人気急上昇',
    overview1: '長泉町は静岡県駿東郡に属する<strong class="text-dark-900">町</strong>で、人口 <strong class="text-dark-900">約 4.4 万人</strong>。<strong class="text-dark-900">静岡県立静岡がんセンター</strong>を擁し、医療・がん研究・健康ビジネスの集積地として全国から注目を集めています。',
    overview2: '住宅地としても人気が高く、近年は人口が県内町部でも増加傾向。子育て世代の流入により、医療・教育・小売・住宅関連の WEB ニーズが拡大しています。',
    overview3: '事業所数は約 1,300 と小規模ですが、医療・製薬関連の高付加価値企業と、住宅・教育の地域密着サービス業の二層構造です。WEB 制作では<strong class="text-dark-900">医療広告ガイドライン</strong>と<strong class="text-dark-900">薬機法</strong>遵守が必須となるエリアです。',
    web1: '医療・健康関連サイトでは、<strong class="text-dark-900">医療広告ガイドライン（厚労省）</strong>と<strong class="text-dark-900">薬機法</strong>違反リスクの理解が必須。誇大広告・体験談・治療効果の不当表示は重い行政指導の対象です。',
    web2: '一方で住宅・教育・小売の地域サービス業は、Google ビジネスプロフィール + ローカル SEO + 信頼設計（Lindgaard 50ms 第一印象）で底上げが効きます。',
    web3: 'HARTON は本社（沼津市大岡）から車 15 分の至近距離。医療系・住宅系の両ニーズに対応可能です。',
    faq1q: '長泉町の事業者の場合、訪問対応は受けられますか？',
    faq1a: 'はい。長泉町は本社（沼津市大岡）から車で約 15 分の至近距離です。初回ヒアリング・要件定義・最終納品確認は対面で行います。',
    faq2q: '医療・クリニック関連サイトの制作経験はありますか？',
    faq2a: '医療広告ガイドライン・薬機法の遵守を含めた医療系サイト制作の実績があります。誇大表現の自動チェック、症例写真の取り扱いルール、予約フォーム設計を含めて対応します。',
    faq3q: '住宅・不動産・教育関連のサイト制作も対応可能ですか？',
    faq3a: 'はい。長泉町の人口増加に伴い需要拡大中の住宅・不動産・教育関連サイトの制作実績があります。Google ビジネスプロフィール最適化、ローカル SEO を含めて対応します。',
    sources: [
      { name: '長泉町公式サイト', url: 'https://www.town.nagaizumi.lg.jp/' },
      { name: '静岡県統計年鑑', url: 'https://www.pref.shizuoka.jp/kensei/tokei/' },
      { name: '静岡県立静岡がんセンター', url: 'https://www.scchr.jp/' },
    ]
  },

  shimizu: {
    cityJa: '静岡市清水区', cityKana: 'しずおかしし みずく', wpSlug: '清水区',
    region: '静岡県中部 静岡市',
    eyebrow: '国際港湾物流の街',
    population: '約 22.4 万人',
    distanceKm: '50 km', distanceTime: '車 60 分',
    industries: '港湾物流・水産・観光・サッカー',
    industriesShort: '港湾物流・水産・観光',
    transport: 'JR 清水駅 / 東名 清水 IC・新東名 新清水 IC',
    transportShort: '清水港・国際物流のハブ',
    address: '静岡市清水区',
    cityAccent: '清水港を擁する国際物流・水産・観光の街、サッカー文化の聖地',
    overview1: '清水区は<strong class="text-dark-900">静岡市の行政区</strong>（旧清水市、2003 年に静岡市と合併）で、人口 <strong class="text-dark-900">約 22.4 万人</strong>。清水港は国際拠点港湾に指定されており、コンテナ・自動車・水産の三本柱の<strong class="text-dark-900">国際物流ハブ</strong>として機能しています。',
    overview2: 'マグロ水揚げ高で全国上位の水産業、清水エスパルスを核とする<strong class="text-dark-900">サッカー文化</strong>、三保松原を含む観光資源と、産業の幅が極めて広いエリアです。',
    overview3: '事業所数は約 8,000。BtoB（物流・商社・水産加工）と BtoC（観光・飲食・小売）の両軸が必要で、WEB サイトの設計テーマも多様です。',
    web1: '清水区は<strong class="text-dark-900">静岡市の一行政区</strong>で、Google ローカル検索や WEB マップ表記では「静岡市」と「清水区」が混在しがち。<strong class="text-dark-900">構造化データの addressLocality / addressRegion の精緻な使い分け</strong>が必須です。',
    web2: '国際物流・商社系の BtoB では英語サイトと貿易関連の専門用語整理、観光・飲食 BtoC では多言語対応 + Google ビジネスプロフィール強化が要点です。',
    web3: 'HARTON は本社（沼津市大岡）から車 60 分。清水区内の事業者様にも訪問対応可能（要件定義・納品確認時）。',
    faq1q: '清水区の事業者の場合、訪問対応は受けられますか？',
    faq1a: 'はい。清水区は本社（沼津市大岡）から車で約 60 分の距離です。初回ヒアリング・要件定義・最終納品確認は対面、中間打合せは Zoom / Google Meet 併用で進行します。',
    faq2q: '港湾物流・水産加工等の BtoB サイト制作経験はありますか？',
    faq2a: '清水・沼津エリアの BtoB（物流・水産・商社）サイト制作の実績があります。英語コンテンツ、技術仕様、問合せフォーム最適化を含めて対応します。',
    faq3q: '住所表記が「静岡市清水区」と「清水区」で迷っています。SEO 上どちらが良いですか？',
    faq3a: '構造化データでは addressLocality に「静岡市」、addressRegion に「静岡県」を入れ、PostalAddress 内で住所階層を明示するのが SEO 上は最適です。表示文言は地域慣習に合わせて統一します。',
    sources: [
      { name: '静岡市公式サイト', url: 'https://www.city.shizuoka.lg.jp/' },
      { name: '静岡県統計年鑑', url: 'https://www.pref.shizuoka.jp/kensei/tokei/' },
      { name: '静岡商工会議所', url: 'https://www.shizuoka-cci.or.jp/' },
    ]
  },
};

function tpl(slug, c) {
  const wpUrl = `https://ja.wikipedia.org/wiki/${encodeURI(c.wpSlug)}`;
  const sourcesHtml = c.sources.map(s =>
    `          <li>${s.name} — <a href="${s.url}" rel="nofollow noopener noreferrer" target="_blank" class="text-teal-700 underline">${s.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}</a></li>`
  ).join('\n');

  return `<!DOCTYPE html>
<html lang="ja" class="no-js">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="/dist/scripts/js-marker.js?v=202605120100"></script>
  <title>${c.cityJa}の WEB 制作｜${c.industriesShort}に強い地元密着｜T.C.HARTON</title>
  <meta name="description" content="${c.cityJa}（${c.population}）の事業者向け WEB 制作。${c.industriesShort}を中心に、機械検証ベースの納品基準で対応。本社から${c.distanceTime}の地元密着体制。">
  <meta name="author" content="大内 達也">

  <meta property="og:title" content="${c.cityJa}の WEB 制作｜${c.industriesShort}に強い地元密着｜T.C.HARTON">
  <meta property="og:description" content="${c.cityJa}（${c.population}）の事業者向け WEB 制作。${c.industriesShort}を中心に、機械検証ベースの納品基準で対応。本社から${c.distanceTime}の地元密着体制。">
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://tcharton.com/areas/${slug}/">
  <meta property="og:image" content="https://tcharton.com/areas/${slug}/ogp.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:alt" content="${c.cityJa}の WEB 制作 — T.C.HARTON Areas">
  <meta property="og:site_name" content="T.C.HARTON">
  <meta property="og:locale" content="ja_JP">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${c.cityJa}の WEB 制作｜${c.industriesShort}に強い地元密着｜T.C.HARTON">
  <meta name="twitter:description" content="${c.cityJa}（${c.population}）の事業者向け WEB 制作。${c.industriesShort}を中心に、機械検証ベースの納品基準で対応。本社から${c.distanceTime}の地元密着体制。">
  <meta name="twitter:image" content="https://tcharton.com/areas/${slug}/ogp.png">

  <meta name="theme-color" content="#FFFFFF">
  <meta name="color-scheme" content="light">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">

  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' https://www.googletagmanager.com https://static.cloudflareinsights.com; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://www.google-analytics.com https://www.googletagmanager.com; connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://cloudflareinsights.com; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self' https://api.web3forms.com; require-trusted-types-for 'script'; trusted-types default; upgrade-insecure-requests">

  <link rel="canonical" href="https://tcharton.com/areas/${slug}/">
  <link rel="sitemap" type="application/xml" href="/sitemap.xml">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">

  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
    {"@type":"ListItem","position":1,"name":"ホーム","item":"https://tcharton.com/"},
    {"@type":"ListItem","position":2,"name":"対応エリア","item":"https://tcharton.com/areas/"},
    {"@type":"ListItem","position":3,"name":"${c.cityJa}","item":"https://tcharton.com/areas/${slug}/"}
  ]}
  </script>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"LocalBusiness","@id":"https://tcharton.com/areas/${slug}/#localbusiness","name":"T.C.HARTON","alternateName":"ティーシーハートン","url":"https://tcharton.com/","telephone":"+81-80-1058-0538","email":"info@tcharton.com","address":{"@type":"PostalAddress","streetAddress":"大岡2690","addressLocality":"沼津市","addressRegion":"静岡県","postalCode":"410-0022","addressCountry":"JP"},"areaServed":[{"@type":"City","name":"${c.cityJa}","sameAs":"${wpUrl}"}],"founder":{"@type":"Person","name":"大内 達也","url":"https://tcharton.com/profile/"},"description":"${c.cityJa}の WEB 制作・AI 予測・S クラス品質基準のコンサルティング","priceRange":"¥¥¥","sameAs":["https://note.com/harton_official"]}
  </script>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"Article","@id":"https://tcharton.com/areas/${slug}/#article","headline":"${c.cityJa}の WEB 制作｜${c.industriesShort}に強い地元密着","description":"${c.cityJa}（${c.population}）の事業者向け WEB 制作。${c.industriesShort}を中心に、機械検証ベースの納品基準で対応。本社から${c.distanceTime}の地元密着体制。","author":{"@type":"Person","name":"大内 達也","url":"https://tcharton.com/profile/"},"publisher":{"@id":"https://tcharton.com/#organization"},"datePublished":"2026-05-15","dateModified":"2026-05-15","inLanguage":"ja","url":"https://tcharton.com/areas/${slug}/","mainEntityOfPage":"https://tcharton.com/areas/${slug}/","image":"https://tcharton.com/areas/${slug}/ogp.png","about":{"@type":"City","name":"${c.cityJa}","sameAs":"${wpUrl}"}}
  </script>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
    {"@type":"Question","name":${JSON.stringify(c.faq1q)},"acceptedAnswer":{"@type":"Answer","text":${JSON.stringify(c.faq1a)}}},
    {"@type":"Question","name":${JSON.stringify(c.faq2q)},"acceptedAnswer":{"@type":"Answer","text":${JSON.stringify(c.faq2a)}}},
    {"@type":"Question","name":${JSON.stringify(c.faq3q)},"acceptedAnswer":{"@type":"Answer","text":${JSON.stringify(c.faq3a)}}}
  ]}
  </script>

  <link rel="stylesheet" href="/dist/output.css?v=202605141500">
  <link rel="dns-prefetch" href="https://www.googletagmanager.com">
  <link rel="dns-prefetch" href="https://www.google-analytics.com">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@300;400;500;700;900&display=swap" as="style">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@300;400;500;700;900&display=swap" rel="stylesheet">

  <script src="/dist/scripts/ga4.js?v=202605120100" defer></script>
  <script src="/dist/scripts/trusted-types.js?v=202605120100"></script>
</head>
<body class="bg-white text-dark-700 font-sans antialiased">
  <a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-teal-700 focus:text-white focus:px-4 focus:py-3 focus:rounded">メインコンテンツへスキップ</a>

  <header class="fixed top-0 left-0 right-0 z-40 bg-white/90 nav-blur border-b border-dark-100">
    <nav aria-label="メインナビゲーション" class="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
      <a href="/" class="flex items-center gap-2 text-dark-900 font-display font-bold text-xl py-3" aria-label="T.C.HARTON ホームへ">
        <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
          <rect width="28" height="28" rx="6" fill="#1B4965"/>
          <text x="14" y="20" text-anchor="middle" font-family="Inter, sans-serif" font-weight="800" font-size="14" fill="#fff">T</text>
        </svg>
        <span>T.C.HARTON</span>
      </a>
      <div class="hidden lg:flex items-center gap-7 text-sm" data-nosnippet>
        <a href="/services/web/" class="text-dark-700 hover:text-teal-700 py-3">WEB 制作</a>
        <a href="/services/ai-prediction/" class="text-dark-700 hover:text-teal-700 py-3">AI 予測</a>
        <a href="/pricing/" class="text-dark-700 hover:text-teal-700 py-3">料金</a>
        <a href="/cases/" class="text-dark-700 hover:text-teal-700 py-3">事例</a>
        <a href="/stella/" class="text-dark-700 hover:text-teal-700 py-3">Stella</a>
        <a href="/profile/" class="text-dark-700 hover:text-teal-700 py-3">プロフィール</a>
        <a href="/contact/" class="bg-teal-700 hover:bg-teal-600 text-white px-5 py-3 rounded-md font-medium">無料相談</a>
      </div>
      <button id="menuToggle" type="button" class="lg:hidden p-3 -mr-3 text-dark-700" aria-label="メニューを開く" aria-expanded="false" aria-controls="mobile-menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M3 6h18M3 12h18M3 18h18"/>
        </svg>
      </button>
    </nav>
  </header>

  <nav id="mobile-menu" class="mobile-menu fixed inset-0 z-50 bg-white" aria-label="モバイルナビゲーション" role="dialog" aria-modal="true">
    <div class="flex flex-col p-6 gap-2 overflow-y-auto h-full">
      <button id="menuClose" type="button" class="self-end p-3 -mt-2 -mr-2 text-dark-700 hover:text-teal-700" aria-label="メニューを閉じる">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M6 18L18 6"/></svg>
      </button>
      <a href="/services/web/" class="block py-4 px-2 text-lg text-dark-800 hover:text-teal-700 border-b border-dark-100">WEB 制作</a>
      <a href="/services/ai-prediction/" class="block py-4 px-2 text-lg text-dark-800 hover:text-teal-700 border-b border-dark-100">AI 予測</a>
      <a href="/pricing/" class="block py-4 px-2 text-lg text-dark-800 hover:text-teal-700 border-b border-dark-100">料金</a>
      <a href="/cases/" class="block py-4 px-2 text-lg text-dark-800 hover:text-teal-700 border-b border-dark-100">導入事例</a>
      <a href="/vision/" class="block py-4 px-2 text-lg text-dark-800 hover:text-teal-700 border-b border-dark-100">私たちの想い</a>
      <a href="/stella/" class="block py-4 px-2 text-lg text-dark-800 hover:text-teal-700 border-b border-dark-100">Stella（品質評価）</a>
      <a href="/faq/" class="block py-4 px-2 text-lg text-dark-800 hover:text-teal-700 border-b border-dark-100">FAQ</a>
      <a href="/methodology/" class="block py-4 px-2 text-lg text-dark-800 hover:text-teal-700 border-b border-dark-100">方法論・品質根拠</a>
      <a href="/profile/" class="block py-4 px-2 text-lg text-dark-800 hover:text-teal-700 border-b border-dark-100">代表プロフィール</a>
      <a href="/about/" class="block py-4 px-2 text-lg text-dark-800 hover:text-teal-700 border-b border-dark-100">会社情報</a>
      <a href="/news/" class="block py-4 px-2 text-lg text-dark-800 hover:text-teal-700 border-b border-dark-100">お知らせ</a>
      <a href="/contact/" class="mt-4 block bg-teal-700 hover:bg-teal-600 text-white text-center px-5 py-4 rounded-md font-medium text-lg">無料相談</a>
    </div>
  </nav>

  <main id="main" class="pt-16">
    <nav aria-label="パンくずリスト" class="max-w-3xl mx-auto px-4 lg:px-8 pt-20 pb-2 text-sm text-dark-500">
      <ol class="flex items-center gap-2 flex-wrap">
        <li><a href="/" class="hover:text-teal-700 py-3 inline-block">ホーム</a></li>
        <li aria-hidden="true">/</li>
        <li><a href="/areas/" class="hover:text-teal-700 py-3 inline-block">対応エリア</a></li>
        <li aria-hidden="true">/</li>
        <li><span aria-current="page" class="text-dark-700">${c.cityJa}</span></li>
      </ol>
    </nav>

    <article class="max-w-3xl mx-auto px-4 lg:px-8 py-12 lg:py-16 hero-content">
      <header>
        <p class="text-sm text-teal-700 font-display font-bold tracking-widest uppercase">Areas ／ ${c.region}</p>
        <h1 class="mt-3 font-display text-4xl md:text-5xl font-extrabold text-dark-900 leading-tight tracking-tight">${c.cityJa}の WEB 制作</h1>
        <p class="mt-4 text-xs text-dark-500">
          <time datetime="2026-05-15">2026 年 5 月 15 日 公開</time>
          <span class="mx-2" aria-hidden="true">/</span>
          <time datetime="2026-05-15">最終更新 2026 年 5 月 15 日</time>
          <span class="mx-2" aria-hidden="true">/</span>
          <span>${c.eyebrow}</span>
        </p>
      </header>

      <div class="mt-8 bg-teal-50 border-l-4 border-teal-700 rounded-r-lg p-6">
        <p class="text-sm font-bold text-teal-800 mb-2">${c.cityJa}の概要</p>
        <p class="text-dark-800 leading-relaxed">${c.cityJa}は${c.cityAccent}。HARTON は本社（沼津市大岡）から<strong class="text-dark-900">${c.distanceKm}・${c.distanceTime}</strong>の至近距離に位置し、${c.cityJa}内の事業者様に対して訪問対応で WEB 制作・改善を支援します。</p>
      </div>

      <div class="mt-8 grid sm:grid-cols-2 gap-4">
        <div class="bg-dark-50 border border-dark-200 rounded-xl p-5">
          <p class="text-xs text-dark-500 font-display font-bold tracking-widest uppercase">人口</p>
          <p class="mt-2 font-display text-2xl font-bold text-dark-900">${c.population}</p>
          <p class="mt-1 text-xs text-dark-500">2024 年 推計人口（静岡県統計）</p>
        </div>
        <div class="bg-dark-50 border border-dark-200 rounded-xl p-5">
          <p class="text-xs text-dark-500 font-display font-bold tracking-widest uppercase">本社からの距離</p>
          <p class="mt-2 font-display text-2xl font-bold text-dark-900">${c.distanceKm}</p>
          <p class="mt-1 text-xs text-dark-500">${c.distanceTime}（沼津市大岡から）</p>
        </div>
        <div class="bg-dark-50 border border-dark-200 rounded-xl p-5">
          <p class="text-xs text-dark-500 font-display font-bold tracking-widest uppercase">主要産業</p>
          <p class="mt-2 font-display text-base font-bold text-dark-900">${c.industries}</p>
          <p class="mt-1 text-xs text-dark-500">${c.transportShort}</p>
        </div>
        <div class="bg-dark-50 border border-dark-200 rounded-xl p-5">
          <p class="text-xs text-dark-500 font-display font-bold tracking-widest uppercase">交通拠点</p>
          <p class="mt-2 font-display text-base font-bold text-dark-900">${c.transport}</p>
          <p class="mt-1 text-xs text-dark-500">主要アクセス</p>
        </div>
      </div>

      <nav aria-label="目次" class="mt-8 bg-dark-50 border border-dark-200 rounded-xl p-5">
        <p class="font-display font-bold text-dark-900 text-sm">目次</p>
        <ol class="mt-3 space-y-2 text-sm text-teal-700">
          <li><a href="#section-1" class="hover:underline py-1 inline-block">1. ${c.cityJa}の経済構造と WEB の現状</a></li>
          <li><a href="#section-2" class="hover:underline py-1 inline-block">2. ${c.cityJa}の事業者によくある WEB の悩み</a></li>
          <li><a href="#section-3" class="hover:underline py-1 inline-block">3. HARTON の対応範囲（${c.cityJa}）</a></li>
          <li><a href="#section-4" class="hover:underline py-1 inline-block">4. 関連 Insights ／ Problem LP</a></li>
          <li><a href="#faq" class="hover:underline py-1 inline-block">よくある質問</a></li>
        </ol>
      </nav>

      <section id="section-1" aria-label="${c.cityJa}の経済構造と WEB の現状" class="mt-12">
        <h2 class="font-display text-2xl lg:text-3xl font-bold text-dark-900">1. ${c.cityJa}の経済構造と WEB の現状</h2>
        <div class="mt-5 space-y-4 text-dark-700 leading-relaxed">
          <p>${c.overview1}</p>
          <p>${c.overview2}</p>
          <p>${c.overview3}</p>
        </div>
      </section>

      <section id="section-2" aria-label="${c.cityJa}の事業者によくある WEB の悩み" class="mt-12">
        <h2 class="font-display text-2xl lg:text-3xl font-bold text-dark-900">2. ${c.cityJa}の事業者によくある WEB の悩み</h2>
        <div class="mt-5 space-y-4 text-dark-700 leading-relaxed">
          <p>${c.web1}</p>
          <p>${c.web2}</p>
          <p>${c.web3}</p>
        </div>
        <div class="mt-6 grid sm:grid-cols-2 gap-4">
          <a href="/problems/site-speed/" class="block bg-white border border-dark-200 hover:border-teal-700 rounded-xl p-5 transition-all hover:shadow-md">
            <p class="text-xs text-teal-700 font-display font-bold tracking-widest uppercase">Problem</p>
            <h3 class="mt-2 font-display text-lg font-bold text-dark-900">表示速度が遅い</h3>
            <p class="mt-2 text-sm text-dark-700">Core Web Vitals で離脱されるサイトを改善。</p>
          </a>
          <a href="/problems/no-inquiry/" class="block bg-white border border-dark-200 hover:border-teal-700 rounded-xl p-5 transition-all hover:shadow-md">
            <p class="text-xs text-teal-700 font-display font-bold tracking-widest uppercase">Problem</p>
            <h3 class="mt-2 font-display text-lg font-bold text-dark-900">問い合わせが来ない</h3>
            <p class="mt-2 text-sm text-dark-700">フォーム最適化と信頼設計で底上げ。</p>
          </a>
          <a href="/problems/ai-search-invisible/" class="block bg-white border border-dark-200 hover:border-teal-700 rounded-xl p-5 transition-all hover:shadow-md">
            <p class="text-xs text-teal-700 font-display font-bold tracking-widest uppercase">Problem</p>
            <h3 class="mt-2 font-display text-lg font-bold text-dark-900">AI 検索に出てこない</h3>
            <p class="mt-2 text-sm text-dark-700">『${c.cityJa.replace(/市$/, '').replace(/区$/, '').replace(/町$/, '')} 〇〇』の AI 引用に入る対策。</p>
          </a>
          <a href="/problems/no-mobile/" class="block bg-white border border-dark-200 hover:border-teal-700 rounded-xl p-5 transition-all hover:shadow-md">
            <p class="text-xs text-teal-700 font-display font-bold tracking-widest uppercase">Problem</p>
            <h3 class="mt-2 font-display text-lg font-bold text-dark-900">スマホで見づらい</h3>
            <p class="mt-2 text-sm text-dark-700">モバイル比率 65% 時代の必須実装。</p>
          </a>
        </div>
      </section>

      <section id="section-3" aria-label="HARTON の対応範囲" class="mt-12">
        <h2 class="font-display text-2xl lg:text-3xl font-bold text-dark-900">3. HARTON の対応範囲（${c.cityJa}）</h2>
        <div class="mt-5 space-y-4 text-dark-700 leading-relaxed">
          <p>HARTON は本社（沼津市大岡）から<strong class="text-dark-900">${c.distanceKm}・${c.distanceTime}</strong>の距離に位置し、${c.cityJa}内の事業者様に対して訪問対応で WEB 制作・改善を支援します。初回ヒアリング・要件定義・最終納品確認は対面、中間打合せは Zoom / Google Meet 併用で進行します。</p>
          <p>対応範囲は以下：</p>
          <div class="space-y-2 text-dark-700">
            <p>・<strong class="text-dark-900">設計</strong> — IA / ワイヤーフレーム / コンテンツ設計 / 機械検証要件定義</p>
            <p>・<strong class="text-dark-900">実装</strong> — 静的 HTML / WordPress / Headless CMS の選定〜実装</p>
            <p>・<strong class="text-dark-900">運用</strong> — Core Web Vitals / セキュリティ / 構造化データの継続改善</p>
            <p>・<strong class="text-dark-900">機械検証</strong> — Stella サブセクションの 4 軸スキャナで定期診断</p>
          </div>
        </div>
        <div class="mt-6 callout-highlight rounded-r-lg p-5">
          <p class="text-sm text-dark-700 leading-relaxed"><strong class="text-dark-900">補助金活用も対応。</strong>IT 導入補助金・小規模事業者持続化補助金等を活用した WEB 制作・改修の相談を承ります。</p>
        </div>
      </section>

      <section id="section-4" aria-label="関連 Insights" class="mt-12">
        <h2 class="font-display text-2xl lg:text-3xl font-bold text-dark-900">4. 関連 Insights ／ Problem LP</h2>
        <ul class="mt-4 space-y-2 text-sm">
          <li><a href="/insights/local-seo-guide/" class="text-teal-700 underline hover:text-teal-500 py-2 inline-block">ローカル SEO 実装ガイド — 地方中小企業向け</a></li>
          <li><a href="/insights/google-business-profile/" class="text-teal-700 underline hover:text-teal-500 py-2 inline-block">Google ビジネスプロフィール — 地方事業者の必須設定</a></li>
          <li><a href="/insights/longtail-seo/" class="text-teal-700 underline hover:text-teal-500 py-2 inline-block">ロングテール SEO — 地域 × 業種で勝つ戦略</a></li>
          <li><a href="/services/web/industries/" class="text-teal-700 underline hover:text-teal-500 py-2 inline-block">業種別 WEB 制作ガイド</a></li>
        </ul>
      </section>

      <section id="faq" aria-label="よくある質問" class="mt-12">
        <h2 class="font-display text-2xl lg:text-3xl font-bold text-dark-900">よくある質問</h2>
        <dl class="mt-6 space-y-4">
          <div class="bg-dark-50 border border-dark-200 rounded-xl p-5">
            <dt class="font-display font-bold text-dark-900">${c.faq1q}</dt>
            <dd class="mt-2 text-sm text-dark-700 leading-relaxed">${c.faq1a}</dd>
          </div>
          <div class="bg-dark-50 border border-dark-200 rounded-xl p-5">
            <dt class="font-display font-bold text-dark-900">${c.faq2q}</dt>
            <dd class="mt-2 text-sm text-dark-700 leading-relaxed">${c.faq2a}</dd>
          </div>
          <div class="bg-dark-50 border border-dark-200 rounded-xl p-5">
            <dt class="font-display font-bold text-dark-900">${c.faq3q}</dt>
            <dd class="mt-2 text-sm text-dark-700 leading-relaxed">${c.faq3a}</dd>
          </div>
        </dl>
      </section>

      <section aria-label="出典" class="mt-12 border-t border-dark-200 pt-8">
        <h2 class="font-display text-lg font-bold text-dark-900">出典・参考</h2>
        <ul class="mt-4 space-y-2 text-xs text-dark-500 break-words">
${sourcesHtml}
          <li>Wikipedia「${c.cityJa}」 — <a href="${wpUrl}" rel="nofollow noopener noreferrer" target="_blank" class="text-teal-700 underline">${wpUrl.replace(/^https?:\/\//, '')}</a></li>
        </ul>
      </section>

      <section aria-label="お問い合わせ" class="mt-12 bg-teal-50 border-y border-teal-100 rounded-xl p-8 text-center">
        <p class="text-teal-700 font-display font-bold text-xs lg:text-sm tracking-widest uppercase">Free Diagnosis</p>
        <h2 class="mt-3 font-display text-xl lg:text-2xl font-bold text-dark-900">${c.cityJa}の WEB 制作・改善は、地元 HARTON へ</h2>
        <p class="mt-3 text-dark-700 text-sm leading-relaxed">無料診断では、現状サイトの機械検証と${c.cityJa}の地域特性を踏まえた改善余地をお見せします。診断だけで終わっても費用は一切かかりません。</p>
        <a href="/contact/" class="mt-6 inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-600 text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg">
          <span>1 分で無料診断を申し込む</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
        </a>
      </section>
    </article>
  </main>

  <footer class="bg-dark-900 text-dark-300 border-t border-dark-700">
    <div class="max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-16">
      <nav aria-label="フッターナビゲーション" class="grid grid-cols-2 md:grid-cols-4 gap-8" data-nosnippet>
        <div>
          <h3 class="font-display text-sm font-bold text-white uppercase tracking-wider">サービス</h3>
          <ul class="mt-4 space-y-2 text-sm">
            <li><a href="/services/web/" class="hover:text-white py-3 inline-block">WEB 制作</a></li>
            <li><a href="/services/ai-prediction/" class="hover:text-white py-3 inline-block">AI 予測</a></li>
            <li><a href="/pricing/" class="hover:text-white py-3 inline-block">料金</a></li>
          </ul>
        </div>
        <div>
          <h3 class="font-display text-sm font-bold text-white uppercase tracking-wider">信頼形成</h3>
          <ul class="mt-4 space-y-2 text-sm">
            <li><a href="/cases/" class="hover:text-white py-3 inline-block">導入事例</a></li>
            <li><a href="/faq/" class="hover:text-white py-3 inline-block">FAQ</a></li>
            <li><a href="/methodology/" class="hover:text-white py-3 inline-block">方法論・品質根拠</a></li>
            <li><a href="/profile/" class="hover:text-white py-3 inline-block">代表プロフィール</a></li>
            <li><a href="/vision/" class="hover:text-white py-3 inline-block">私たちの想い</a></li>
          </ul>
        </div>
        <div>
          <h3 class="font-display text-sm font-bold text-white uppercase tracking-wider">Stella</h3>
          <ul class="mt-4 space-y-2 text-sm">
            <li><a href="/stella/" class="hover:text-white py-3 inline-block">Stella ハブ</a></li>
            <li><a href="/stella/methodology/" class="hover:text-white py-3 inline-block">評価方法論</a></li>
            <li><a href="/stella/industries/" class="hover:text-white py-3 inline-block">業種別</a></li>
            <li><a href="/stella/regions/" class="hover:text-white py-3 inline-block">地域別</a></li>
          </ul>
        </div>
        <div>
          <h3 class="font-display text-sm font-bold text-white uppercase tracking-wider">事業者情報</h3>
          <ul class="mt-4 space-y-2 text-sm">
            <li><a href="/about/" class="hover:text-white py-3 inline-block">会社情報</a></li>
            <li><a href="/contact/" class="hover:text-white py-3 inline-block">お問い合わせ</a></li>
            <li><a href="/news/" class="hover:text-white py-3 inline-block">お知らせ</a></li>
            <li><a href="/legal/" class="hover:text-white py-3 inline-block">特定商取引法表記</a></li>
            <li><a href="/privacy/" class="hover:text-white py-3 inline-block">プライバシーポリシー</a></li>
          </ul>
        </div>
      </nav>
      <div class="mt-12 pt-8 border-t border-dark-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-sm">
        <p data-nosnippet class="flex items-center gap-3 flex-wrap"><span>© 2026 T.C.HARTON. All rights reserved.</span><span aria-hidden="true" class="text-dark-600">·</span><a href="https://note.com/harton_official" target="_blank" rel="noopener noreferrer" class="hover:text-white py-3 inline-block">note で日々の発信 <span aria-hidden="true">↗</span></a></p>
        <p class="text-dark-500" data-nosnippet>静岡県沼津市大岡2690 / 代表 大内 達也</p>
      </div>
    </div>
  </footer>
  <script src="/dist/scripts/menu.js?v=202605141500" defer></script>
</body>
</html>
`;
}

(async () => {
  const arg = process.argv[2];
  const slugs = arg ? [arg] : Object.keys(CITIES);
  for (const slug of slugs) {
    const c = CITIES[slug];
    if (!c) { console.error(`Unknown slug: ${slug}`); continue; }
    const out = path.join(AREAS, slug, 'index.html');
    fs.writeFileSync(out, tpl(slug, c));
    console.log(`✅ ${slug}  ${c.cityJa}`);
  }
  console.log(`\n生成完了: ${slugs.length} 件`);
})();
