# tcharton - T.C.HARTON メインサイト

**ドメイン**: tcharton.com
**仕様**: SPEC v3.0 + GOOGLE-STANDARDS v2.0 + GEO-STANDARDS v2.0 に完全準拠
**ホスティング**: Cloudflare Pages

## 運用ルール

このフォルダは HARTON モノリポの一部である。
3 法規 (SPEC / GOOGLE / GEO) は **絶対にこのフォルダで編集しない**。
3 法規の編集はルート `HARTON/` で行い、`sync-spec.js` で配布される。

詳細はルートの `CLAUDE.md` を参照。

## 検証

```bash
node spec-checker.js
```

すべての項目が PASS することを確認してから push する。
