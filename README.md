# voiceLogForDisocrdSmaple
 the sample for bot of discord logging user join or left 

# ボイスチャンネル入退出ログ

## Setup

### ローカルで立ち上げる場合

 以下のライブラリをインストール

 ```
npm install @discordjs/voice
npm install discord.js
npm install dotenv

npm install eslint
 ```

実行
```
node .
```

discord関連の設定

1. config.json で設定する場合 

    ```
    // config.json
    {
        "token": "DISCORD_BOT_TOKEN",
        "channel_id" : "DISCORD_CHANNEL_ID"
    }
    ```

2. .env fileを使う場合
    ```
    // .env
    DISCORD_TOKEN="DISCORD_BOT_TOKEN"
    DISCORD_CHANNEL_ID="DISCORD_CHANNEL_ID"
    ```

    ```
    //.env

    // 以下をコメントアウト
    const { token, channel_id } = require('./config.json');

    // 以下のコメントアウトを削除
    // const dotenv = require('dotenv');
    // dotenv.config();
    // const token = process.env.DISCORD_TOKEN;
    // const channel_id = process.env.DISCORD_CHANNEL_ID;
    ```


### クラウドになげる場合

.env　を使うときと似た感じでできると思います

## Formatの例

### Sample1

User及びchannelのMention形式で表示かつtimeStampが有効。UserへのMention通知は実際にはされない。また、Mention形式ではUser及びchnnelの名前が変更されたとき自動で表示される名前が更新される。

![type1](https://raw.githubusercontent.com/tsukasa-u/voiceLogForDisocrdSmaple/main/images/sample1.png)

