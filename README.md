# FormCoder_BACK

プログラミング学習支援システム Form Coder のバックエンド（API）リポジトリです。

## FormCoder について

このアプリは、フォームの仕組みを用いて、初心者のプログラミング（コーディング）を支援してプログラミング能力の向上を目指した、プログラミング学習支援システムです。

## 関連リポジトリ

フロントエンドリポジトリ：https://github.com/KHashimoto3/FormCoder_FRONT  

## 実行方法

### 1. リポジトリの Clone

### 2. 環境変数の設定

`.env`ファイルを`formcoder-api`ディレクトリ内に作成し、以下の環境変数を設定します。値は開発者にお問い合わせください。

```
PROJECT_ID=****
PRIVATE_KEY=****
CLIENT_EMAIL=****
BUCKET_NAME=****
```

### 3. モジュールインストール

以下のコマンドでモジュールをインストールします。

```
cd formcoder-api
npm i
```

### 4. サーバ起動

以下のコマンドでサーバを起動します。

```
cd formcoder-api  //すでに移動している場合は省略可
npm run start
```

### 5. 起動確認

`localhost:3000/programm/hello`にcurlやPostman等からアクセスし、  
`{ message: 'hello programm api!' }`と帰ってくれば起動完了です。
