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

    var getUserName = function(member) {
        if (member.displayName !== null && member.displayName !== undefined) return member.displayName;
        if (member.nickname !== null && member.nickname !== undefined) return member.nickname;
        if (member.username !== null && member.username !== undefined) return member.username;
        return member.user.tag; 
    }

    const newChannel = newState.channel;
    const oldChannel = oldState.channel;
    const guildId = client.channels.cache.get(channel_id).guildId;
    
    if (!newChannel) {
        const username = getUserName(oldState.member);
        if (oldChannel.guildId === guildId) {
            client.channels.cache.get(channel_id).send(`User ${username} left a ${oldState.channel.name} voice channel`);
        }
        return;
    }

    if (!oldChannel) {
        const username = getUserName(newState.member);
        if (newChannel.guildId === guildId) {
            client.channels.cache.get(channel_id).send(`User ${username} joined a ${newState.channel.name} voice channel`);
        }
        return;
    }

    if (oldChannel.id != newChannel.id) {
        const username = getUserName(newState.member);
        if (newChannel.guildId === guildId) {
            client.channels.cache.get(channel_id).send(`User ${username} move to a ${newState.channel.name} voice channel`);
        }
        return;
    }
    return;
});

client.on('unhandledRejection', error => {
    client.channels.cache.get(channel_id).send(`unhandledRejection occured. Please check the log.`);
    console.log('error:', error);
});

//connect the bot to the server
client.login(token);
