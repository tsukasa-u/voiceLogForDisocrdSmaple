# voiceLogForDisocrdSmaple
 the sample for bot of discord logging user join or left 

# ボイスチャンネル入退出ログ

### Setup

 ローカルで立ち上げる場合

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


##### クラウドになげる場合

.env　を使うときと似た感じでできると思います
