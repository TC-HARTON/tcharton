#!/usr/bin/env node
/**
 * gen-industries.js — services/web/industries/{slug}/index.html を一斉生成（7 業種）
 *
 * 各業種データを INDUSTRIES テーブルに整理し、テンプレに代入して書き出す。
 *
 * 使い方: node gen-industries.js          全 7 業種生成
 *         node gen-industries.js <slug>   指定 slug のみ
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const INDUSTRIES = path.join(ROOT, 'services', 'web', 'industries');

const I = {
  manufacturing: {
    nameJa: '製造業', wpSlug: '製造業', region: 'Industry ／ BtoB 製造業',
    eyebrow: 'BtoB 製造業 ／ 引合い・技術カタログ・英語',
    titleSuffix: '製造業',
    descShort: 'BtoB 引合い・技術カタログ・英語サイト・構造化データの 4 点を最低基準に。',
    descLong: '製造業の WEB 制作はカタログ整理・英語対応・問合せフォーム最適化・構造化データの 4 点が成約に直結します。Patchstack 2025 / Web Almanac 2025 等の最新データに基づく実装ガイド。',
    summary: '製造業の WEB サイトは <strong class="text-dark-900">技術カタログの整理 + 引合いフォームの最適化</strong>が成約に直結する世界です。BtoB 取引では、初回接触から見積もり依頼まで顧客は技術仕様・認証取得状況・実績を細部まで確認します。HARTON は<strong class="text-dark-900">構造化データ + 多言語 + フォーム最適化</strong>を標準実装し、Tier 1 サプライヤーへの引合い獲得を支援します。',
    keyData: [
      { label: '製造業の事業所数', value: '約 33 万', note: '総務省 経済センサス 2021' },
      { label: '従業者 4 人以上の中小製造業', value: '約 16 万', note: '中小企業白書 2024' },
      { label: '海外取引のある中小企業', value: '約 24%', note: '中小企業庁 2024 年版' },
      { label: 'BtoB 引合い経路 上位', value: '検索 + 紹介', note: '日経 BP 2024 製造業 BtoB 調査' },
    ],
    pain1: '技術カタログが PDF まとめのみで、構造化データ（Product / Article）に乗せられていない。',
    pain2: '英語コンテンツがない・あっても自動翻訳の不自然な英文。海外引合いを取りこぼす。',
    pain3: '問合せフォームが「お問い合わせはこちら」のみで、引合い種別（見積 / 技術質問 / 訪問依頼）の振り分けが未実装。Baymard Institute 調査ではフォーム最適化で CV +35.26%。',
    must1: '<strong class="text-dark-900">Schema.org Product / Service</strong> での主要製品・サービスの構造化マークアップ（型番・素材・規格・認証）',
    must2: '<strong class="text-dark-900">英語ページ完備 + hreflang 設定</strong>。AI 翻訳のレビューを必ず人手で行う',
    must3: '<strong class="text-dark-900">フォーム最適化</strong>：引合い種別の振り分け / リアルタイムバリデーション / 完了画面の Thanks Page で次アクション提示',
    must4: '<strong class="text-dark-900">認証取得状況の表示</strong>：ISO 9001 / ISO 14001 / IATF 16949 等を About / 会社情報ページに明示',
    must5: '<strong class="text-dark-900">採用ページ</strong>：JobPosting JSON-LD で求人検索流入を獲得',
    legalFocus: '製造業特有の法令上の論点は、<strong class="text-dark-900">不正競争防止法 §2(1)14（営業誹謗）</strong>と<strong class="text-dark-900">景表法 §5 不当表示</strong>。「業界最高水準」「世界一の品質」等の自己評価表現は景表法違反リスクがあるため、第三者評価（ISO / 顧客賞 / 受賞歴）を引用する形に置き換えます。',
    faq1q: '海外取引のサイト制作経験はありますか？',
    faq1a: '英語サイトの制作実績があります。hreflang 設定、技術用語の英訳監修、英文 SEO のキーワード選定を含めて対応します。中国語・韓国語が必要な場合も翻訳パートナーと協業可能です。',
    faq2q: '構造化データを入れると本当に AI 検索に引用されますか？',
    faq2a: '構造化データは AI 引用を直接ブーストする「魔法の道具」ではなく、機械が内容を正確に理解する土台（インフラ）です。AI 引用は<strong>従来 SEO の上位 + AI 引用可能な文章設計 + earned media</strong>の組合せで効きます。詳細は <a href="/insights/llmo-explained/" class="text-teal-700 underline hover:text-teal-500">LLMO 解説記事</a>。',
    faq3q: '技術カタログ PDF をそのまま使いたいのですが対応可能ですか？',
    faq3a: 'PDF を残しつつ、HTML での Index ページを併設するハイブリッド方式が SEO 上は最適です。PDF 単体では検索エンジンの理解度が下がるため、製品の概要・型番・主要仕様を HTML で索引化します。',
  },

  clinic: {
    nameJa: '医療・クリニック', wpSlug: '医療機関', region: 'Industry ／ 医療・歯科・整骨',
    eyebrow: '医療・歯科・整骨 ／ 医療広告ガイドライン遵守',
    titleSuffix: '医療・クリニック',
    descShort: '医療広告ガイドライン + 薬機法 + WCAG 2.2 AA 準拠の必須 3 点で安心実装。',
    descLong: '医療・クリニックの WEB サイトは医療広告ガイドライン（厚労省）と薬機法を最優先に。誇大表現・体験談・効果の不当表示は重い行政指導の対象。安全な実装ガイドを一次出典付きで解説。',
    summary: '医療機関の WEB サイトは<strong class="text-dark-900">医療広告ガイドライン（厚労省）</strong>と<strong class="text-dark-900">薬機法</strong>の遵守が他業種より重要度が高い領域です。「治る」「効果絶大」等の表現は<strong class="text-dark-900">行政指導 → 業務停止</strong>の対象です。HARTON は<strong class="text-dark-900">表現の自動チェック + 予約フォーム最適化 + WCAG 2.2 AA 準拠</strong>を標準実装します。',
    keyData: [
      { label: '一般診療所の数', value: '約 10.5 万', note: '厚労省 医療施設動態調査 2024' },
      { label: '患者の事前 WEB 検索率', value: '約 7 割', note: '厚労省 受療行動調査 2023' },
      { label: '医療広告違反通知件数', value: '増加傾向', note: '厚労省 ネットパトロール事業 2023 報告' },
      { label: 'モバイル経由予約比率', value: '8 割超', note: '楽天モバイル 2024 医療予約レポート' },
    ],
    pain1: '医療広告ガイドラインを意識せず「世界最高峰の技術」「絶対治る」等の禁止表現を使っている。',
    pain2: '体験談・症例写真を Before/After で並べているが、改正医療広告ガイドラインでは<strong class="text-dark-900">原則禁止</strong>（限定解除要件付きで条件付き可）。',
    pain3: '予約フォームが平日昼間しか反応せず、夜間・休日のスマホ予約を取りこぼしている。',
    must1: '<strong class="text-dark-900">医療広告ガイドライン遵守</strong>：「治る」「効果」等の禁止表現の自動チェック / 比較優良広告の禁止 / 体験談原則不掲載',
    must2: '<strong class="text-dark-900">薬機法対応</strong>：未承認医療機器・医薬品の宣伝禁止 / 効果効能の根拠なき表示禁止',
    must3: '<strong class="text-dark-900">予約フォーム 24h 対応</strong>：スマホ最適化 + リアルタイム予約状況反映 + 自動メール返信',
    must4: '<strong class="text-dark-900">WCAG 2.2 AA 準拠</strong>：高齢者・視覚障害者の利用を想定したアクセシビリティ',
    must5: '<strong class="text-dark-900">医療法人 / クリニック情報の構造化</strong>：MedicalClinic / Physician Schema での施設情報マークアップ',
    legalFocus: '<strong class="text-dark-900">医療広告ガイドライン（厚労省告示）</strong>と<strong class="text-dark-900">薬機法（旧薬事法）</strong>の遵守が必須。患者の体験談は原則禁止（限定解除要件を満たす場合のみ条件付き可）、Before/After 写真も同様。違反は<strong class="text-dark-900">行政指導 → 業務停止</strong>のリスクがあります。',
    faq1q: '体験談（口コミ）を載せたいのですが可能ですか？',
    faq1a: '改正医療広告ガイドライン（2018-）では患者の体験談は原則禁止です。ただし「限定解除要件」（医療従事者の関与なし / 自由診療の費用・リスク等の情報を併記）を満たせば例外的に可。HARTON では要件を満たす形での実装と、毎年のガイドライン更新チェックを承ります。',
    faq2q: 'Before/After 写真を Web に載せたいのですが？',
    faq2a: '同じく原則禁止ですが、限定解除要件を満たせば条件付き可。撮影条件・治療内容・費用・主なリスク・副作用を <strong>同一ページ内に明記</strong>することが必須です。詳細は <a href="https://www.mhlw.go.jp/" rel="nofollow noopener noreferrer" target="_blank" class="text-teal-700 underline">厚労省サイト</a>でご確認の上、HARTON での実装をご相談ください。',
    faq3q: '夜間・休日も予約できる仕組みを作れますか？',
    faq3a: 'はい。24 時間オンライン予約システムとの連携、または独自の予約フォーム + 自動メール返信 + 翌営業日の電話確認の組合せで対応可能です。患者の 8 割超がモバイル予約で、夜間・休日の予約取りこぼしは機会損失が大きい領域です。',
  },

  construction: {
    nameJa: '建設・工務店', wpSlug: '建設業', region: 'Industry ／ 建設・工務店・リフォーム',
    eyebrow: '建設・工務店・リフォーム ／ 施工事例・職人',
    titleSuffix: '建設・工務店',
    descShort: '施工事例ギャラリー + 職人プロフィール + 構造化データで「地元で頼める会社」を可視化。',
    descLong: '建設・工務店の WEB サイトは施工事例の見せ方・職人プロフィール・採用ページが受注に直結します。建設業法・建築基準法を遵守した実装ガイドを一次出典付きで解説。',
    summary: '建設・工務店の WEB サイトは<strong class="text-dark-900">「誰がどう作ったか」</strong>が伝わる設計が受注に直結します。施主は施工事例の写真品質・職人の顔・施工エリア・対応工種を細部まで確認します。HARTON は<strong class="text-dark-900">画像最適化（WebP / AVIF）+ 職人プロフィール + 採用ページ + areaServed 構造化</strong>を標準実装します。',
    keyData: [
      { label: '建設業の許可業者数', value: '約 47 万', note: '国交省 建設業許可業者数調査 2024' },
      { label: '中小建設業（資本金 5 千万以下）の比率', value: '約 99%', note: '国交省 建設業統計 2024' },
      { label: '完成工事高の中小比率', value: '約 73%', note: '国交省 建設業動態統計 2023' },
      { label: '住宅リフォーム検索のモバイル比率', value: '約 8 割', note: 'Google ローカルレポート 2024' },
    ],
    pain1: '施工事例ページが Lightroom 未通しの大きな PNG/JPEG で、表示速度が著しく遅い。',
    pain2: '職人プロフィールが「代表挨拶」のみで、施主が依頼前に知りたい情報（保有資格・施工年数・得意工種）が欠落。',
    pain3: '採用ページが「現在募集していません」のままで、JobPosting JSON-LD 未実装。Indeed / Google しごと検索からの流入を取りこぼし。',
    must1: '<strong class="text-dark-900">画像最適化</strong>：施工事例を WebP / AVIF + picture 要素で最適化、遅延読み込み標準',
    must2: '<strong class="text-dark-900">職人プロフィール</strong>：保有資格 / 施工年数 / 得意工種 / 顔写真（任意）を Person Schema で構造化',
    must3: '<strong class="text-dark-900">採用ページ + JobPosting</strong>：求人 JSON-LD で Google しごと検索流入',
    must4: '<strong class="text-dark-900">施工エリアの areaServed 構造化</strong>：LocalBusiness 配下に対応市区町村を明示',
    must5: '<strong class="text-dark-900">建設業許可番号 / 一級建築士登録番号の明示</strong>：会社情報・フッターに掲載（信頼設計）',
    legalFocus: '<strong class="text-dark-900">建設業法</strong>に基づく許可番号の表示義務、<strong class="text-dark-900">建築基準法</strong>適合の表現、<strong class="text-dark-900">景表法</strong>に基づく「最安」「業界一」等の自己評価表現の禁止が論点。リフォーム業では<strong class="text-dark-900">特商法</strong>の表記義務も発生します。',
    faq1q: '施工事例の写真は素人撮影でも掲載できますか？',
    faq1a: 'スマホ撮影でも構いません。HARTON 側で画像最適化（WebP / AVIF + 適切なリサイズ + 遅延読み込み）と、撮影アングル・順序のアドバイスを提供します。プロカメラマンとの協業が必要な場合は地元のフォトグラファーをご紹介可能です。',
    faq2q: '職人の顔写真を載せたくない職人がいるのですが？',
    faq2a: '顔写真は任意です。代わりに作業中の手元写真、保有資格、施工年数、得意工種等の情報で職人 Persona を構築します。Person Schema は氏名 + 役職 + 専門分野で機械可読化できます。',
    faq3q: '採用ページの JobPosting JSON-LD は本当に効果がありますか？',
    faq3a: 'Google しごと検索（Google for Jobs）からの流入が増えます。建設業界では人手不足が深刻で、Indeed / 求人ボックスへの転載前に自社サイトで JobPosting を設置することで、求人サイトの広告費を削減しつつ自社流入を確保できます。',
  },

  legal: {
    nameJa: '士業', wpSlug: '士業', region: 'Industry ／ 税理士・社労士・行政書士・弁護士',
    eyebrow: '士業 ／ 信頼・資格・E-E-A-T',
    titleSuffix: '士業（税理士・社労士・行政書士・弁護士）',
    descShort: '個人情報保護法 + 各士業法 + E-E-A-T 強化で信頼設計を最大化。',
    descLong: '士業の WEB サイトは信頼設計と E-E-A-T 強化が CV に直結します。個人情報保護法 2022 改正・各士業法・解説記事の継続発信を含む実装ガイドを一次出典付きで解説。',
    summary: '士業の WEB サイトは<strong class="text-dark-900">「この人に頼める」</strong>と訪問者が感じるかが CV を決めます。Google が示す <strong class="text-dark-900">E-E-A-T（経験・専門性・権威性・信頼性）</strong>の評価軸が他業種より重く、解説記事・代表プロフィール・実績の三位一体が必要です。HARTON は<strong class="text-dark-900">個人情報保護法対応 + Person Schema + 解説記事の継続発信フロー</strong>を標準実装します。',
    keyData: [
      { label: '士業全体の登録者数', value: '約 35 万', note: '日本弁護士連合会・税理士連合会等の合算 2024' },
      { label: '初回相談予約のオンライン比率', value: '約 6 割', note: '日税連 2024 IT 化レポート' },
      { label: '士業サイトの検索流入の内訳', value: '指名 4 割 / 一般 6 割', note: 'SimilarWeb 業界平均 2024' },
      { label: '個人情報保護委員会への報告事案', value: '増加傾向', note: 'PPC 年次報告 2024' },
    ],
    pain1: '個人情報保護法 2022 改正に対応していない（漏洩時の本人通知 + PPC 報告義務未準備）。',
    pain2: '代表プロフィールが「資格 + 経歴」のみで、得意分野・解決した案件の具体性が不足。E-E-A-T が弱い。',
    pain3: '解説記事の継続発信がなく、検索流入が「事務所名」での指名検索のみ。一般検索（「沼津 相続」等）からの流入を取りこぼしている。',
    must1: '<strong class="text-dark-900">個人情報保護法 2022 対応</strong>：プライバシーポリシー更新 / 漏洩対応フロー策定 / 本人通知テンプレ',
    must2: '<strong class="text-dark-900">代表プロフィールの厚み</strong>：保有資格 / 取扱実績 / 講演履歴 / 出版物 / Person Schema 完備',
    must3: '<strong class="text-dark-900">解説記事の継続発信</strong>：相続・税務・労務等の専門解説で E-E-A-T 強化',
    must4: '<strong class="text-dark-900">相談予約フォーム</strong>：相談内容の振り分け / 個人情報の最小取得 / 暗号化送信',
    must5: '<strong class="text-dark-900">資格情報の構造化</strong>：occupationalCredentialAwarded で機械可読',
    legalFocus: '<strong class="text-dark-900">個人情報保護法 2022 改正</strong>により、漏洩時の<strong class="text-dark-900">本人通知 + 個人情報保護委員会への報告義務</strong>が発生。違反時は最大 1 億円の罰金リスク。各士業法（弁護士法・税理士法等）の<strong class="text-dark-900">広告規制</strong>もあり、「業界トップ」「最高の弁護士」等の表現は注意が必要です。',
    faq1q: '解説記事を継続発信したいが時間がありません。',
    faq1a: 'HARTON では Insights 記事制作の運用支援も承ります。先生の専門知識を 30 分のヒアリングで取材し、当方で記事化（5,000 字 + JSON-LD + 出典）してドラフトを納品。最終チェックは先生に行っていただく分業フローです。',
    faq2q: 'プライバシーポリシーは雛形をコピーして良いですか？',
    faq2a: '雛形のコピペは避けるべきです。実際の取得項目・利用目的・第三者提供の有無を正確に反映する必要があります。HARTON では事務所の業務内容に合わせたプライバシーポリシーを個別に作成し、年 1 回の見直しサイクルも併設します。',
    faq3q: '相談予約フォームから個人情報が漏洩したらどうなりますか？',
    faq3a: '個人情報保護法 2022 改正により、本人通知 + 個人情報保護委員会への報告義務が発生します。違反時は最大 1 億円の罰金リスク。HARTON では暗号化送信（HTTPS + フォーム送信時の追加暗号化）+ 漏洩対応フローの策定を含めて実装します。',
  },

  restaurant: {
    nameJa: '飲食店', wpSlug: '飲食店', region: 'Industry ／ レストラン・カフェ・パン屋',
    eyebrow: '飲食店 ／ Google マップ・予約・写真',
    titleSuffix: '飲食店（レストラン・カフェ・パン屋）',
    descShort: 'Google ビジネスプロフィール + 予約導線 + 多言語で来店誘導を最大化。',
    descLong: '飲食店の WEB サイトは Google ビジネスプロフィール連携・予約導線・多言語対応が来店誘導に直結します。食品衛生法・景表法を遵守した実装ガイドを一次出典付きで解説。',
    summary: '飲食店の WEB サイトは<strong class="text-dark-900">「食べたい」と感じる写真品質 + Google マップから 1 タップで予約</strong>が来店誘導の核です。観光地ではインバウンド需要を取り込む<strong class="text-dark-900">多言語対応</strong>も必須。HARTON は<strong class="text-dark-900">Google ビジネスプロフィール連携 + 予約導線 + 多言語 + 構造化データ（Restaurant / Menu）</strong>を標準実装します。',
    keyData: [
      { label: '日本の飲食店数', value: '約 45 万店', note: '総務省 経済センサス 2021' },
      { label: '飲食店検索のモバイル比率', value: '約 9 割', note: 'Google ローカルレポート 2024' },
      { label: 'Google マップ経由の来店誘導', value: '増加傾向', note: 'Google ローカル広告レポート 2024' },
      { label: 'インバウンド観光客の事前 WEB 検索率', value: '約 7 割', note: '観光庁 訪日外国人消費動向調査 2024' },
    ],
    pain1: 'Google ビジネスプロフィールが「自動生成のまま」で、写真・営業時間・メニュー・電話が更新されていない。',
    pain2: '予約フォームが「お電話のみ」で、夜間・休日のスマホ予約を取りこぼしている。',
    pain3: 'メニュー写真が暗い・小さい・古い。食欲を刺激しない品質で、Lindgaard の 50ms 第一印象テストで離脱される。',
    must1: '<strong class="text-dark-900">Google ビジネスプロフィール連携</strong>：写真 / 営業時間 / メニュー / 電話番号の正確な反映 + WEB サイトとの整合',
    must2: '<strong class="text-dark-900">予約システム連携</strong>：TableCheck / OpenTable / 自社フォームのいずれかで 24h 予約対応',
    must3: '<strong class="text-dark-900">写真の品質</strong>：プロカメラマン or スマホでも構図 + 光 + 編集を適切に。WebP / AVIF + 遅延読み込み',
    must4: '<strong class="text-dark-900">多言語対応</strong>：英語・中国語・韓国語の最低 3 言語（観光地・インバウンド需要のある立地）',
    must5: '<strong class="text-dark-900">Restaurant + Menu Schema</strong>：構造化データで Google リッチカード対応',
    legalFocus: '<strong class="text-dark-900">食品衛生法</strong>に基づくアレルギー表示の正確性、<strong class="text-dark-900">景表法</strong>に基づく「絶品」「最高」等の自己評価表現の禁止、産地・原材料表示の正確性が論点。テイクアウト・デリバリーは<strong class="text-dark-900">食品表示法</strong>の追加要件もあります。',
    faq1q: 'Google ビジネスプロフィールの最適化だけで効果はありますか？',
    faq1a: 'Google ビジネスプロフィールの正確な運用は、ローカル検索順位の最も基本的な要因です。ただし「Google マップだけ」では予約率・客単価の最適化に限界があります。自社サイトと連携し、メニュー詳細・予約フォーム・店舗ストーリーを併設することで CV が大きく伸びます。',
    faq2q: '英語メニューを作りたいのですが、翻訳はどうすれば？',
    faq2a: 'AI 翻訳のレビューを必ず人手で行うことを推奨します。料理名は文化背景まで伝える必要があり、機械翻訳のみでは誤解を招く危険があります。HARTON では翻訳パートナー（沼津・伊豆エリアの英文ライター）と連携可能です。',
    faq3q: 'Instagram の写真を WEB サイトに自動取り込みできますか？',
    faq3a: '可能ですが、Instagram の埋め込みウィジェットは表示速度を著しく落とすことがあります。代わりに、Instagram 投稿の写真を WebP に変換して自社サーバーから配信する方式を推奨します。',
  },

  beauty: {
    nameJa: '美容・サロン', wpSlug: '美容室', region: 'Industry ／ 美容・サロン・エステ',
    eyebrow: '美容・サロン ／ 施術前後・予約・口コミ',
    titleSuffix: '美容・サロン（美容室・エステ・ネイル）',
    descShort: '施術前後の見せ方 + 予約導線 + 美容師法・景表法遵守で安全集客。',
    descLong: '美容・サロンの WEB サイトは施術前後の見せ方・予約導線・口コミ運用が CV に直結します。美容師法・景表法・特商法を遵守した実装ガイドを一次出典付きで解説。',
    summary: '美容・サロンの WEB サイトは<strong class="text-dark-900">「行きたい」と感じる施術写真 + 1 タップ予約</strong>が CV の核です。同時に<strong class="text-dark-900">美容師法 / 景表法 / 特商法</strong>の規制が幅広く、無届け営業や不当表示は行政指導の対象。HARTON は<strong class="text-dark-900">施術写真の最適化 + 24h 予約 + 表現の自動チェック + Service Schema</strong>を標準実装します。',
    keyData: [
      { label: '美容室の事業所数', value: '約 27 万店', note: '厚労省 衛生行政報告例 2023' },
      { label: '美容関連の検索モバイル比率', value: '約 9 割', note: 'Google ローカルレポート 2024' },
      { label: '予約検索→予約確定までの離脱率', value: '高め', note: 'ホットペッパービューティー 2024 業界レポート' },
      { label: '初回顧客の WEB 経由比率', value: '約 6 割', note: 'Hot Pepper Beauty Academy 2024' },
    ],
    pain1: '施術写真が暗い・粗い。Before/After の対比が伝わらず、初回客が決断できない。',
    pain2: '予約導線が「電話のみ」または「LINE のみ」で、深夜・早朝の検討時間に予約できない。',
    pain3: '「絶対痩せる」「99% 効果」等の表現を使い、景表法 + 美容医療なら薬機法違反のリスクがある。',
    must1: '<strong class="text-dark-900">施術写真の品質</strong>：プロ撮影 or スマホでも構図・光・編集を適切に。WebP / AVIF + 遅延読み込み',
    must2: '<strong class="text-dark-900">予約システム連携</strong>：HOT PEPPER Beauty / 自社フォーム / LINE 予約のいずれかで 24h 対応',
    must3: '<strong class="text-dark-900">表現の自動チェック</strong>：「最安」「絶対」「100%」等の禁止語の検出',
    must4: '<strong class="text-dark-900">スタッフプロフィール</strong>：保有資格 / 施術年数 / 得意分野 / Person Schema',
    must5: '<strong class="text-dark-900">価格表記</strong>：税込総額表示（消費者契約法 + 特商法）',
    legalFocus: '<strong class="text-dark-900">美容師法</strong>に基づく管理美容師の表示義務、<strong class="text-dark-900">景表法</strong>「絶対」「最高」等の禁止、<strong class="text-dark-900">特商法</strong>の表記義務（事業者情報 / 価格 / 解約条件）。美容医療を提供する場合は<strong class="text-dark-900">医療広告ガイドライン</strong>と<strong class="text-dark-900">薬機法</strong>も適用されます。',
    faq1q: 'Before / After 写真は載せて良いですか？',
    faq1a: '美容室・エステ・ネイル等の非医療施術は基本的に掲載可ですが、「絶対痩せる」等の効果保証表現は景表法違反。撮影条件（光・角度・期間）の記載を併設することで誠実性を担保します。美容医療（医師の施術）の場合は医療広告ガイドラインで原則禁止 → 限定解除要件付きで条件付き可になります。',
    faq2q: 'HOT PEPPER Beauty に予約を集中させたいのですが、自社サイトは必要ですか？',
    faq2a: 'HOT PEPPER は集客力が高い一方、手数料率が高く、競合との価格競争に巻き込まれやすい構造です。自社サイト + Google ビジネスプロフィール経由の指名予約を増やすことで、長期的な収益性が改善します。HOT PEPPER との二刀流が現実的な戦略です。',
    faq3q: 'スタッフ全員の顔写真を載せるのは抵抗があります。',
    faq3a: '顔写真は任意です。代わりに後ろ姿・手元・施術中の構図、または保有資格・施術年数・得意分野の情報でスタッフ Persona を構築します。Person Schema は名前 + 役職 + 専門分野で機械可読化できます。',
  },

  'real-estate': {
    nameJa: '不動産', wpSlug: '不動産業', region: 'Industry ／ 不動産売買・賃貸・管理',
    eyebrow: '不動産 ／ 物件情報・宅建業法・透明性',
    titleSuffix: '不動産（売買・賃貸・管理）',
    descShort: '宅建業法 + 物件情報の正確性 + 取引態様の明示で信頼集客。',
    descLong: '不動産の WEB サイトは宅建業法・特商法に基づく取引態様の明示・物件情報の正確性が必須。一次出典付きの実装ガイドで安全に集客。',
    summary: '不動産の WEB サイトは<strong class="text-dark-900">物件情報の正確性 + 取引態様の明示</strong>が必須です。宅建業法は<strong class="text-dark-900">「おとり広告」「不当表示」を厳しく規制</strong>しており、違反は業務停止 + 免許取消のリスクがあります。HARTON は<strong class="text-dark-900">物件 Schema + 取引態様の自動表示 + 物件情報の更新フロー</strong>を標準実装します。',
    keyData: [
      { label: '宅建業者数', value: '約 13 万社', note: '国交省 不動産業ビジョン 2030' },
      { label: '不動産検索のモバイル比率', value: '約 9 割', note: 'Google ローカルレポート 2024' },
      { label: '初期検索→問合せまでの離脱率', value: '極めて高い', note: 'リクルート住まいカンパニー 2024 業界レポート' },
      { label: 'おとり広告に関する苦情件数', value: '増加傾向', note: '不動産公正取引協議会連合会 2024' },
    ],
    pain1: '物件情報が古い（成約済み物件が掲載され続けている）。「おとり広告」と認定されると行政処分のリスク。',
    pain2: '取引態様（売主・代理・媒介）が物件ページに明示されていない。宅建業法違反。',
    pain3: '物件写真が暗い / 一物件 1 〜 2 枚しかない。ユーザーが内見前の判断ができず離脱。',
    must1: '<strong class="text-dark-900">物件情報の鮮度管理</strong>：成約物件の即時非公開フロー / 週次更新',
    must2: '<strong class="text-dark-900">取引態様の明示</strong>：全物件ページに「売主」「代理」「媒介」「貸主」を明示',
    must3: '<strong class="text-dark-900">物件 Schema 構造化</strong>：RealEstateListing / Apartment / House Schema で機械可読',
    must4: '<strong class="text-dark-900">物件写真の品質</strong>：1 物件 8 枚以上、間取り図 + 周辺マップ標準',
    must5: '<strong class="text-dark-900">免許番号 / 宅建士登録番号の明示</strong>：会社情報・フッターに掲載',
    legalFocus: '<strong class="text-dark-900">宅建業法</strong>第 32 条（誇大広告等の禁止）+ 第 34 条（取引態様の明示義務）+ 第 47 条（重要事項の不告知禁止）が中核。「おとり広告」（実在しない物件の掲載 / 成約済み物件の放置）は<strong class="text-dark-900">業務停止 + 免許取消</strong>の対象です。<strong class="text-dark-900">不動産公正競争規約</strong>も実務上の必須参照です。',
    faq1q: '物件情報の手動更新が大変です。',
    faq1a: 'REINS / ATBB / 自社 DB との連携で自動更新を構築可能です。CSV / API 連携、または不動産業者向け CMS（楽待・健美家等）との併用も対応。HARTON では業務フローの整理から物件情報のデータ構造設計まで一貫して支援します。',
    faq2q: 'おとり広告と判断されないためには？',
    faq2a: '①成約物件の即時非公開フロー（業務 SLA で 24 時間以内）②全物件で取引態様を明示 ③価格・面積・所在地の正確性 — の 3 点を運用フローに組み込むことが基本です。HARTON ではフロー設計 + 自動チェックの仕組みも併設します。',
    faq3q: '物件写真は社員のスマホ撮影で良いですか？',
    faq3a: '撮影方法は問わずスマホでも可ですが、構図・光・編集の最低基準が必要です。HARTON では撮影マニュアル提供 + 画像の自動最適化（WebP / AVIF + 適切なリサイズ + 遅延読み込み）まで対応します。プロカメラマンとの協業が必要な場合は地元のフォトグラファーをご紹介可能です。',
  },
};

function tpl(slug, c) {
  const wpUrl = `https://ja.wikipedia.org/wiki/${encodeURI(c.wpSlug)}`;
  const dataCardsHtml = c.keyData.map(d => `
        <div class="bg-dark-50 border border-dark-200 rounded-xl p-5">
          <p class="text-xs text-dark-500 font-display font-bold tracking-widest uppercase">${d.label}</p>
          <p class="mt-2 font-display text-2xl font-bold text-dark-900">${d.value}</p>
          <p class="mt-1 text-xs text-dark-500">${d.note}</p>
        </div>`).join('');

  return `<!DOCTYPE html>
<html lang="ja" class="no-js">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="/dist/scripts/js-marker.js?v=202605120100"></script>
  <title>${c.titleSuffix}の WEB 制作｜業種別実装ガイド｜T.C.HARTON</title>
  <meta name="description" content="${c.descLong}">
  <meta name="author" content="大内 達也">

  <meta property="og:title" content="${c.titleSuffix}の WEB 制作｜業種別実装ガイド｜T.C.HARTON">
  <meta property="og:description" content="${c.descLong}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://tcharton.com/services/web/industries/${slug}/">
  <meta property="og:image" content="https://tcharton.com/services/web/industries/${slug}/ogp.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:alt" content="${c.titleSuffix}の WEB 制作 — T.C.HARTON Industries">
  <meta property="og:site_name" content="T.C.HARTON">
  <meta property="og:locale" content="ja_JP">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${c.titleSuffix}の WEB 制作｜業種別実装ガイド｜T.C.HARTON">
  <meta name="twitter:description" content="${c.descLong}">
  <meta name="twitter:image" content="https://tcharton.com/services/web/industries/${slug}/ogp.png">

  <meta name="theme-color" content="#FFFFFF">
  <meta name="color-scheme" content="light">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">

  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' https://www.googletagmanager.com https://static.cloudflareinsights.com; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://www.google-analytics.com https://www.googletagmanager.com; connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://cloudflareinsights.com; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self' https://api.web3forms.com; require-trusted-types-for 'script'; trusted-types default; upgrade-insecure-requests">

  <link rel="canonical" href="https://tcharton.com/services/web/industries/${slug}/">
  <link rel="sitemap" type="application/xml" href="/sitemap.xml">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">

  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
    {"@type":"ListItem","position":1,"name":"ホーム","item":"https://tcharton.com/"},
    {"@type":"ListItem","position":2,"name":"WEB 制作","item":"https://tcharton.com/services/web/"},
    {"@type":"ListItem","position":3,"name":"業種別 LP 対応","item":"https://tcharton.com/services/web/industries/"},
    {"@type":"ListItem","position":4,"name":"${c.titleSuffix}","item":"https://tcharton.com/services/web/industries/${slug}/"}
  ]}
  </script>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"Service","@id":"https://tcharton.com/services/web/industries/${slug}/#service","name":"${c.titleSuffix}の WEB 制作","description":${JSON.stringify(c.descLong)},"provider":{"@id":"https://tcharton.com/#organization"},"serviceType":"WEB 制作","audience":{"@type":"BusinessAudience","name":"${c.nameJa}事業者"},"areaServed":{"@type":"AdministrativeArea","name":"日本"}}
  </script>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"Article","@id":"https://tcharton.com/services/web/industries/${slug}/#article","headline":"${c.titleSuffix}の WEB 制作｜業種別実装ガイド","description":${JSON.stringify(c.descLong)},"author":{"@type":"Person","name":"大内 達也","url":"https://tcharton.com/profile/"},"publisher":{"@id":"https://tcharton.com/#organization"},"datePublished":"2026-05-15","dateModified":"2026-05-15","inLanguage":"ja","url":"https://tcharton.com/services/web/industries/${slug}/","mainEntityOfPage":"https://tcharton.com/services/web/industries/${slug}/","image":"https://tcharton.com/services/web/industries/${slug}/ogp.png","about":{"@type":"Thing","name":${JSON.stringify(c.nameJa)},"sameAs":"${wpUrl}"}}
  </script>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
    {"@type":"Question","name":${JSON.stringify(c.faq1q)},"acceptedAnswer":{"@type":"Answer","text":${JSON.stringify(c.faq1a.replace(/<[^>]+>/g, ''))}}},
    {"@type":"Question","name":${JSON.stringify(c.faq2q)},"acceptedAnswer":{"@type":"Answer","text":${JSON.stringify(c.faq2a.replace(/<[^>]+>/g, ''))}}},
    {"@type":"Question","name":${JSON.stringify(c.faq3q)},"acceptedAnswer":{"@type":"Answer","text":${JSON.stringify(c.faq3a.replace(/<[^>]+>/g, ''))}}}
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
        <li><a href="/services/web/" class="hover:text-teal-700 py-3 inline-block">WEB 制作</a></li>
        <li aria-hidden="true">/</li>
        <li><a href="/services/web/industries/" class="hover:text-teal-700 py-3 inline-block">業種別 LP</a></li>
        <li aria-hidden="true">/</li>
        <li><span aria-current="page" class="text-dark-700">${c.titleSuffix}</span></li>
      </ol>
    </nav>

    <article class="max-w-3xl mx-auto px-4 lg:px-8 py-12 lg:py-16 hero-content">
      <header>
        <p class="text-sm text-teal-700 font-display font-bold tracking-widest uppercase">${c.region}</p>
        <h1 class="mt-3 font-display text-4xl md:text-5xl font-extrabold text-dark-900 leading-tight tracking-tight">${c.titleSuffix}の WEB 制作</h1>
        <p class="mt-4 text-xs text-dark-500">
          <time datetime="2026-05-15">2026 年 5 月 15 日 公開</time>
          <span class="mx-2" aria-hidden="true">/</span>
          <time datetime="2026-05-15">最終更新 2026 年 5 月 15 日</time>
          <span class="mx-2" aria-hidden="true">/</span>
          <span>${c.eyebrow}</span>
        </p>
      </header>

      <div class="mt-8 bg-teal-50 border-l-4 border-teal-700 rounded-r-lg p-6">
        <p class="text-sm font-bold text-teal-800 mb-2">${c.titleSuffix}の要点</p>
        <p class="text-dark-800 leading-relaxed">${c.summary}</p>
      </div>

      <div class="mt-8 grid sm:grid-cols-2 gap-4">${dataCardsHtml}
      </div>

      <nav aria-label="目次" class="mt-8 bg-dark-50 border border-dark-200 rounded-xl p-5">
        <p class="font-display font-bold text-dark-900 text-sm">目次</p>
        <ol class="mt-3 space-y-2 text-sm text-teal-700">
          <li><a href="#section-1" class="hover:underline py-1 inline-block">1. ${c.nameJa}サイトでよくある悩み</a></li>
          <li><a href="#section-2" class="hover:underline py-1 inline-block">2. 必須実装項目（5 点）</a></li>
          <li><a href="#section-3" class="hover:underline py-1 inline-block">3. 法令上の論点</a></li>
          <li><a href="#section-4" class="hover:underline py-1 inline-block">4. HARTON の対応範囲</a></li>
          <li><a href="#faq" class="hover:underline py-1 inline-block">よくある質問</a></li>
        </ol>
      </nav>

      <section id="section-1" aria-label="${c.nameJa}サイトでよくある悩み" class="mt-12">
        <h2 class="font-display text-2xl lg:text-3xl font-bold text-dark-900">1. ${c.nameJa}サイトでよくある悩み</h2>
        <div class="mt-5 space-y-4 text-dark-700 leading-relaxed">
          <p>${c.pain1}</p>
          <p>${c.pain2}</p>
          <p>${c.pain3}</p>
        </div>
      </section>

      <section id="section-2" aria-label="必須実装項目" class="mt-12">
        <h2 class="font-display text-2xl lg:text-3xl font-bold text-dark-900">2. 必須実装項目（5 点）</h2>
        <ol class="mt-6 space-y-3">
          <li class="bg-dark-50 border border-dark-200 rounded-xl p-4 flex gap-3"><span class="flex-shrink-0 w-7 h-7 rounded-full bg-teal-700 text-white text-sm font-bold flex items-center justify-center" aria-hidden="true">1</span><p class="text-sm text-dark-700">${c.must1}</p></li>
          <li class="bg-dark-50 border border-dark-200 rounded-xl p-4 flex gap-3"><span class="flex-shrink-0 w-7 h-7 rounded-full bg-teal-700 text-white text-sm font-bold flex items-center justify-center" aria-hidden="true">2</span><p class="text-sm text-dark-700">${c.must2}</p></li>
          <li class="bg-dark-50 border border-dark-200 rounded-xl p-4 flex gap-3"><span class="flex-shrink-0 w-7 h-7 rounded-full bg-teal-700 text-white text-sm font-bold flex items-center justify-center" aria-hidden="true">3</span><p class="text-sm text-dark-700">${c.must3}</p></li>
          <li class="bg-dark-50 border border-dark-200 rounded-xl p-4 flex gap-3"><span class="flex-shrink-0 w-7 h-7 rounded-full bg-teal-700 text-white text-sm font-bold flex items-center justify-center" aria-hidden="true">4</span><p class="text-sm text-dark-700">${c.must4}</p></li>
          <li class="bg-dark-50 border border-dark-200 rounded-xl p-4 flex gap-3"><span class="flex-shrink-0 w-7 h-7 rounded-full bg-teal-700 text-white text-sm font-bold flex items-center justify-center" aria-hidden="true">5</span><p class="text-sm text-dark-700">${c.must5}</p></li>
        </ol>
      </section>

      <section id="section-3" aria-label="法令上の論点" class="mt-12">
        <h2 class="font-display text-2xl lg:text-3xl font-bold text-dark-900">3. 法令上の論点</h2>
        <div class="mt-5 space-y-4 text-dark-700 leading-relaxed">
          <p>${c.legalFocus}</p>
        </div>
      </section>

      <section id="section-4" aria-label="HARTON の対応範囲" class="mt-12">
        <h2 class="font-display text-2xl lg:text-3xl font-bold text-dark-900">4. HARTON の対応範囲</h2>
        <div class="mt-5 space-y-4 text-dark-700 leading-relaxed">
          <p>HARTON は ${c.nameJa}向けに、上記 5 点の実装を <strong class="text-dark-900">標準納品基準</strong>に組み込んでいます。法令遵守 + 機械検証ベースの品質担保 + 継続的な改善ループまで一貫して支援します。</p>
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

      <section aria-label="関連ページ" class="mt-12">
        <h2 class="font-display text-xl lg:text-2xl font-bold text-dark-900">関連ページ</h2>
        <ul class="mt-4 space-y-2 text-sm">
          <li><a href="/services/web/industries/" class="text-teal-700 underline hover:text-teal-500 py-2 inline-block">業種別 LP 対応 ハブ（50 業種一覧）</a></li>
          <li><a href="/services/web/" class="text-teal-700 underline hover:text-teal-500 py-2 inline-block">WEB 制作サービス トップ</a></li>
          <li><a href="/areas/" class="text-teal-700 underline hover:text-teal-500 py-2 inline-block">対応エリア（静岡県東部・中部 7 都市）</a></li>
          <li><a href="/pricing/" class="text-teal-700 underline hover:text-teal-500 py-2 inline-block">料金プラン</a></li>
          <li><a href="/methodology/" class="text-teal-700 underline hover:text-teal-500 py-2 inline-block">方法論・品質根拠</a></li>
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
          <li>Wikipedia「${c.nameJa}」 — <a href="${wpUrl}" rel="nofollow noopener noreferrer" target="_blank" class="text-teal-700 underline">${wpUrl.replace(/^https?:\/\//, '')}</a></li>
          <li>業種別 LP 対応 ハブ — <a href="/services/web/industries/" class="text-teal-700 underline">tcharton.com/services/web/industries</a></li>
          <li>各業種データの一次出典は本文・データカードに明記</li>
        </ul>
      </section>

      <section aria-label="お問い合わせ" class="mt-12 bg-teal-50 border-y border-teal-100 rounded-xl p-8 text-center">
        <p class="text-teal-700 font-display font-bold text-xs lg:text-sm tracking-widest uppercase">Free Diagnosis</p>
        <h2 class="mt-3 font-display text-xl lg:text-2xl font-bold text-dark-900">${c.titleSuffix}の WEB 制作・改善は、HARTON へ</h2>
        <p class="mt-3 text-dark-700 text-sm leading-relaxed">無料診断では、現状サイトの機械検証と${c.nameJa}特有の法令・実装要点を踏まえた改善余地をお見せします。診断だけで終わっても費用は一切かかりません。</p>
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
  const slugs = arg ? [arg] : Object.keys(I);
  for (const slug of slugs) {
    const c = I[slug];
    if (!c) { console.error(`Unknown slug: ${slug}`); continue; }
    const out = path.join(INDUSTRIES, slug, 'index.html');
    fs.writeFileSync(out, tpl(slug, c));
    console.log(`✅ ${slug}  ${c.titleSuffix}`);
  }
  console.log(`\n生成完了: ${slugs.length} 件`);
})();
