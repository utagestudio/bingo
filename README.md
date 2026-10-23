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

開発・ビルドにはNode.js 26系（26.12.1以上）を使用します。検証用バージョンは `mise.toml` と `.node-version` で26.12.1に固定しています。

miseを使う場合は、リポジトリ内で次のコマンドを実行してください。

```bash
mise trust
mise install
mise exec -- node --version
mise exec -- npm ci
mise exec -- npm run dev
```

別のバージョン管理ツールを使う場合は、`.node-version` のバージョンを有効にしてから実行します。

```bash
npm ci
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

Cloudflare Workers Buildsでは、リポジトリルートの `.node-version` でNode.jsのバージョンを指定します。Settings > Build > Build Variables and Secretsに `NODE_VERSION` が設定されている場合は、削除してファイル指定に統一するか、同じ `26.12.1` に揃えてください。設定変更後はビルドログで実際のNode.jsバージョンを確認し、ビルドと公開画面を検証します。ビルドコマンドの先頭に `node --version &&` を付けると確認できます。

これはビルド環境の設定です。`wrangler.jsonc` の `compatibility_date` はNode.jsのバージョン指定には使用しません。

参考: [Cloudflare Workers Buildsのビルドイメージ](https://developers.cloudflare.com/workers/ci-cd/builds/build-image/)

Node.jsのセキュリティ更新時は、26系の修正版で検証し、`mise.toml`・`.node-version`・このREADMEの固定バージョンを同時に更新します。最低要件を引き上げる場合は `package.json` の `engines` と `package-lock.json` も同期してください。Cloudflare側で `NODE_VERSION` を使っている場合は併せて更新します。

```bash
npm run build
npx wrangler deploy
```

## お問い合わせ / Contact

不具合の報告、要望、質問は[お問い合わせフォーム](https://tally.so/r/kdVdDR?product=Achievement%20Bingo)へお送りください。[GitHub Issues](https://github.com/utagestudio/bingo/issues)でも受け付けています。

For bug reports, feature requests, and questions, use the [contact form](https://tally.so/r/KYqY78?product=Achievement%20Bingo) or [GitHub Issues](https://github.com/utagestudio/bingo/issues).

## License

MIT
