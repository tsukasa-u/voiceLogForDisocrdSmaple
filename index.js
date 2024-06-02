// author : "Hideyuki Oguri"

// about config.json
// https://discordjs.guide/creating-your-bot/#using-config-json

// token : "your bot token"
// channel_id : "channel id you want bot to send message to"

const { Client, Events, GatewayIntentBits, IntentsBitField } = require('discord.js');

// If you use .env File, you sould comment out the following code
const { token, channel_id } = require('./config.json');

// If you use .env File, you can use the following code
// const dotenv = require('dotenv');
// dotenv.config();
// const token = process.env.DISCORD_TOKEN;
// const channel_id = process.env.DISCORD_CHANNEL_ID;


// create the client with the intents
const myIntents = new IntentsBitField();
myIntents.add(
    IntentsBitField.Flags.GuildVoiceStates,
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages
);

const client = new Client({ intents: myIntents });

// the procedure of the bot when the bot is ready
client.once('ready', () => {
    console.log('Ready!');
});

// the procedure of the bot when a user join or leave a voice channel
client.on("voiceStateUpdate", async (oldState, newState) => {
    const newChannel = newState.channel;
    const oldChannel = oldState.channel;

    if (!newChannel) {
        // client.channels.cache.get('channel-id').send(`Message`);
        const username = oldState.member.displayName ? oldState.member.displayName : (oldState.member.nickname ? oldState.member.nickname : (oldState.member.username ? oldState.member.username : oldState.member.user.tag));
        client.channels.cache.get(channel_id).send(`User ${username} left a ${oldState.channel.name} voice channel`);
        
        return;
    }

    if (!oldChannel) {
        const username = newState.member.displayName ? newState.member.displayName : (newState.member.nickname ? newState.member.nickname : (newState.member.username ? newState.member.username : newState.member.user.tag));
        client.channels.cache.get(channel_id).send(`User ${username} joined a ${newState.channel.name} voice channel`);
        return;
    }

    if (oldChannel.id != newChannel.id) {
        const username = newState.member.displayName ? newState.member.displayName : (newState.member.nickname ? newState.member.nickname : (newState.member.username ? newState.member.username : newState.member.user.tag));
        client.channels.cache.get(channel_id).send(`User ${username} move to a ${newState.channel.name} voice channel`);
        return;
    }
    return;
});

//connect the bot to the server
client.login(token);
