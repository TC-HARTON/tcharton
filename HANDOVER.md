# T.C.HARTON 次セクション申し送り

> **最終更新**: 2026-04-25
> **対象セッション**: ②tcharton 運用（次回継続作業）
> **基準法規**: SPEC v3.2 / GOOGLE-STANDARDS / GEO-STANDARDS
> **現サイト状態**: 🏆 S-RANK（PASS=1,461 / FAIL=0 / WARN=0）/ 本番デプロイ済（tcharton.com）

---

## 0. 現状サマリ

### 0.1 完了事項（前セクション）
- 18 ページ + 404 + thanks の本体サイト構築完了
- Cloudflare Pages 本番デプロイ（tcharton.com）
- Web3Forms 連携（access_key=`9fda1d98-e246-4730-a12c-2251a5ae35b0`）
- Cloudflare Email Routing（`info@tcharton.com` → `harton.info@gmail.com`）
- Google Search Console 認証ファイル設置（`googleb397dd5abf7c54e8.html`）
- GA4 統合（測定 ID: `G-HKXN8TV6HG` / DNT-aware）
- Cloudflare Web Analytics（CSP allowlist 済）
- note 公式ロゴ + 全 21 ページ統合（TOP / profile / 全フッター / llms.txt）

### 0.2 直近コミット
```
2eb85de refactor(top/note): make logo clickable, remove redundant CTA button
9a3e9a2 feat(note-logo): replace wordmark placeholder with official SVG
2cabbf5 feat(note): integrate note daily updates link in 3 strategic locations
9cd5903 fix(csp): allow Cloudflare Web Analytics + disclose in privacy policy
cf922b5 feat(analytics): integrate Google Analytics 4 (G-HKXN8TV6HG) — DNT-aware
```

---

## 1. 残タスク

### 1.1 即時対応推奨（着手可能）

| # | タスク | 担当 | 備考 |
|---|------|------|------|
| 1 | **本番フォーム送信テスト** | ユーザー | tcharton.com/contact から実送信 → harton.info@gmail.com 着信確認 |
| 2 | **GA4 データ保持期間 2ヶ月化** | ユーザー | GA4 管理画面 → データ設定 → データ保持。プライバシー強化のため最短値推奨 |
| 3 | **note プロフィール側に tcharton.com 相互リンク** | ユーザー | note.com/harton_official のプロフィール欄にサイト URL 記載 |

### 1.2 中期（1〜2 週間以内）

| # | タスク | 担当 | 備考 |
|---|------|------|------|
| 4 | **Bing Webmaster Tools 登録** | ユーザー | Google Search Console と同様の認証手続き。サイトマップ提出 |
| 5 | **note 連投開始** | ユーザー | session ③ note-content にて plan/weekly-schedule.md 参照。500〜800 字 4 ブロック構成 |

### 1.3 長期（稼働 1 ヶ月後）

| # | タスク | 担当 | 備考 |
|---|------|------|------|
| 6 | **HSTS Preload 登録** | セッション② | hstspreload.org にて 1 ヶ月以上の安定稼働ログ後に申請 |

### 1.4 セッション①（SPEC 編集）の責務

| # | タスク | 備考 |
|---|------|------|
| 7 | SPEC.md 内 `harton.info` 残存記述の更新 | ルート HARTON/SPEC.md → `node sync-spec.js` で配布 |

---

## 2. 主要新規プロジェクト：S クラス事例サイト構築

### 2.1 目的・背景

**現状の課題**:
- `cases/` ページは枠組みのみで、実際の納品サイトの**実物展示が不在**
- 「買い切り型 30〜80 万円・S クラス保証」の説得力を視覚的に証明する物件が必要

**ゴール**:
業種別の **本物の S クラスサイト** を構築し、`cases/` から**実物リンク**で展示する。
潜在顧客が「自分の業種だとこういうサイトになるのか」を体感できる事例集にする。

### 2.2 対象業種（2 種）

| # | 業種 | サンプル設定（仮） |
|---|------|---------------|
| **A** | **士業（仕業）** | 司法書士事務所 / 行政書士事務所 / 税理士事務所 のいずれか |
| **B** | **飲食** | 和食割烹 / イタリアン / カフェ・ベーカリー のいずれか |

業種選定の決定権はユーザー（着手時に確認）。

### 2.3 技術要件（必達）

- ✅ SPEC v3.2 完全準拠（spec-checker.js で S-RANK 達成）
- ✅ JSON-LD 5 種（業種に応じて `LegalService` / `Restaurant` を主役に）
- ✅ Lead Evidence Block 必須
- ✅ Body Theme Variants（marketing / reading）使い分け
- ✅ CSP / セキュリティヘッダ揃え
- ✅ Cloudflare Web Analytics + GA4（必要に応じて別測定 ID）
- ✅ レスポンシブ完全対応・WCAG 2.2 AA
- ✅ 各業種に最適化された **独自カラーパレット**（tcharton 本体の teal は使わない）
- ✅ 5〜8 ページ程度の小規模だが完結した構成
- ✅ サンプル屋号は架空（実在企業との混同防止のため明確に「サンプル」「デモ」表示）

### 2.4 推奨ページ構成

#### A. 士業サイト（例: 司法書士）
1. TOP（実績・専門領域・無料相談 CTA）
2. 業務案内（不動産登記・商業登記・相続・会社設立 など）
3. 料金（明朗会計型）
4. 事務所案内（代表挨拶・所在地）
5. お問い合わせ
6. プライバシーポリシー
7. 特定商取引法表記（必要に応じて）

#### B. 飲食サイト（例: 和食店）
1. TOP（料理写真・コンセプト・予約導線）
2. お品書き / メニュー（ランチ・ディナー）
3. 店内・空間紹介
4. 店主・職人紹介
5. アクセス・営業時間
6. ご予約（フォームまたは電話導線）
7. お知らせ・新着

### 2.5 推奨配置オプション

| 案 | 配置 | メリット | デメリット |
|---|------|---------|---------|
| **案 1** | `tcharton.com/cases/demo-shigyo/` `tcharton.com/cases/demo-inshoku/` | 単一リポジトリで管理、SPEC 検証統合 | URL 構造が tcharton.com 配下、独立性に劣る |
| **案 2** | `demo1.tcharton.com` `demo2.tcharton.com` | 独立性あり、本物感 | DNS 設定・別リポジトリ管理が必要 |
| **案 3** | 別ドメイン（架空・取得） | 完全独立 | 費用発生、運用負荷 |

**推奨**: **案 1** で着手 → 実用感が増したら案 2 へ移行検討。

### 2.6 ビルド順序（推奨）

1. **業種選定 + 設計仕様確定**（ユーザー合意）
2. **デザイントークン策定**（業種固有カラー・タイポ・写真トーン）
3. **A: 士業サイト**を先に構築（情報構造が単純で型化しやすい）
4. **A: spec-checker S-RANK 達成 → 本番展開**
5. **B: 飲食サイト**を構築（写真重視・体験訴求のため難度高め）
6. **B: spec-checker S-RANK 達成 → 本番展開**
7. **`cases/index.html` を実物リンク掲載に更新**
8. **TOP「導入事例」セクションも実物展示に変更**

### 2.7 spec-checker.js への影響

新サイト追加時に `STATIC_TARGETS` の更新が必要:

```js
// spec-checker.js
const STATIC_TARGETS = [
  // ... 既存 21 件
  // demo-shigyo (士業)
  './cases/demo-shigyo/index.html',
  './cases/demo-shigyo/services/index.html',
  // ...
  // demo-inshoku (飲食)
  './cases/demo-inshoku/index.html',
  './cases/demo-inshoku/menu/index.html',
  // ...
];
```

各デモサイトの `getVariant()` マッピングも追加。

### 2.8 事例として外部から見られた時の体裁

`cases/` ページからのリンクは以下の文言で:

> #### 事例 1: 司法書士事務所サイト（サンプル）
> Sクラス保証付き買い切り型 50万円相当の構築事例。
> [サンプルサイトを見る ↗](/cases/demo-shigyo/)

サンプルサイト内のフッター等で「これは T.C.HARTON が制作したデモサイトです」を明示し、実在事業者との混同を防ぐ。

### 2.9 工数見積（参考）

| 工程 | 想定時間 |
|------|---------|
| 業種 A: 設計 + 構築 + S-RANK 達成 | 6〜10 時間 |
| 業種 B: 設計 + 構築 + S-RANK 達成 | 6〜10 時間 |
| cases/ 統合・TOP 改修 | 1〜2 時間 |
| **合計** | **13〜22 時間** |

セッションを跨いだ段階的構築を推奨。

---

## 3. 着手時のチェックリスト（次回開始時）

- [ ] このファイルを読み、現状認識を合わせる
- [ ] `git status` で working tree clean 確認
- [ ] `node spec-checker.js` で本体サイトの S-RANK 維持確認
- [ ] 残タスク 1.1 の進捗をユーザーに確認
- [ ] §2 着手か § 1 残務処理かをユーザーと相談
- [ ] 業種選定（士業: 司法書士/行政書士/税理士、飲食: 和食/伊/カフェ）

---

## 4. 関連ファイル参照

| 種別 | パス |
|------|------|
| ルート運用ガイド | `../CLAUDE.md` |
| 3 法規正本 | `../SPEC.md` `../GOOGLE-STANDARDS.md` `../GEO-STANDARDS.md` |
| 本サイト検証 | `./spec-checker.js` (2,554 検証項目) |
| 統合検証 | `../verify-all.js` |
| 同期 | `../sync-spec.js` |
| デプロイ除外 | `./.assetsignore` |
| サイトマップ | `./sitemap.xml` (19 URL) |
| LLMO | `./llms.txt` |
| セキュリティ | `./.well-known/security.txt` |

---

## 5. 緊急時の連絡経路

- メール: `info@tcharton.com` → `harton.info@gmail.com` 転送
- Web3Forms: 同上に到達
- 電話: 080-1058-0538

---

**次セクション開始時、このファイルを最初に読むこと。** 状況・残タスク・優先順を把握してから作業着手。
