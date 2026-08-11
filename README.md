# Achievement Bingo

OBSのウィンドウキャプチャで取り込むことを想定した、クライアント完結のWebビンゴツールです。

## 主な機能

- 入力項目数に応じた自動盤面サイズ
- 中央優先のFree Space自動配置
- 最大3盤面の保存と切り替え
- 通常状態での項目マス開閉
- 並び替えモード中のみ項目マスのドラッグアンドドロップ
- リーチ、ビンゴラインの表示
- light/darkテーマ切り替え
- 盤面マス内フォントサイズ調整
- 日本語/英語UI
- LocalStorage自動保存

## 使い方

```bash
npm install
npm run dev
```

ブラウザで表示されたURLを開き、項目を入力します。通常状態では盤面マスをクリックして開閉できます。`挨拶をもらう x10` のように行末へ `x回数` を付けると、クリックでカウントが増え、指定回数に達したらマスが開きます。マス位置を手動で入れ替えたい場合だけ、項目入力エリア付近の並び替えモードをONにしてドラッグします。

OBSではそのブラウザウィンドウをウィンドウキャプチャで取り込みます。アドレスバー、ブラウザ枠、入力パネルなど不要な部分はOBS側でクロップしてください。

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

## OGP

SNSシェア用のOGP画像は `public/ogp.png` に配置しています。

```text
https://achievement-bingo.utage.games/ogp.png
```

## 検証

```bash
npm test
npm run build
```

## Google Analytics

GA4の測定IDを環境変数 `VITE_GA_MEASUREMENT_ID` に設定した場合だけ、Google Analyticsタグをビルド成果物へ埋め込みます。未設定の場合はGAタグを出力せず、外部通信も発生しません。

ローカルでは `.env` に設定できます。

```text
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

`.env.example` も同じキー名のサンプルとして用意しています。

Cloudflareでは、Variables and secretsに同じ名前の環境変数を設定してからビルドしてください。

## Cloudflare

静的ビルド成果物は `dist/` に出力されます。`wrangler.jsonc` はCloudflare Workers Static Assets向けに設定しています。

```bash
npm run build
npx wrangler deploy
```

## License

MIT
