# Achievement Bingo

OBSのウィンドウキャプチャで取り込むことを想定した、クライアント完結のWebビンゴツールです。

## 主な機能

- 入力項目数に応じた自動盤面サイズ
- 中央優先のFree Space自動配置
- 最大3盤面の保存と切り替え
- 編集モード中のみ項目セルのドラッグアンドドロップ
- 表示モード中のみ項目開け
- リーチ、ビンゴラインの表示
- light/darkテーマ切り替え
- 日本語/英語UI
- LocalStorage自動保存

## 使い方

```bash
npm install
npm run dev
```

ブラウザで表示されたURLを開き、編集モードで項目を入力します。配信時は表示モードへ切り替え、OBSではそのブラウザウィンドウをウィンドウキャプチャで取り込みます。

アドレスバーやブラウザ枠はOBS側でクロップしてください。

## OBS運用

推奨運用は通常ブラウザで開いた画面のウィンドウキャプチャです。

OBSブラウザソース向けに `?view=overlay` も利用できますが、OBSブラウザソースは通常ブラウザとLocalStorageを共有しない場合があります。その場合、通常ブラウザで作った盤面はOBSブラウザソース側に表示されません。

## URLオプション

```text
/?view=overlay
/?view=overlay&board=board-2
/?view=overlay&lang=en
/?view=overlay&transparent=1
```

## 検証

```bash
npm test
npm run build
```

## Cloudflare

静的ビルド成果物は `dist/` に出力されます。`wrangler.jsonc` はCloudflare Workers Static Assets向けに設定しています。

```bash
npm run build
npx wrangler deploy
```
