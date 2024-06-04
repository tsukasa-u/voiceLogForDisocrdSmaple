// author : "Hideyuki Oguri"

// about config.json
// https://discordjs.guide/creating-your-bot/#using-config-json

// token : "your bot token"
// channel_id : "channel id you want bot to send message to"

const { Client, Events, IntentsBitField } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

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

    var getUserAvatarURL = function(member) {
        if (member.user.avatarURL() !== null && member.user.avatarURL() !== undefined) return member.user.avatarURL();
        return member.user.defaultAvatarURL;
    }

    var sendLog = async function(channel_id, message) {
        try {
            await client.channels.cache.get(channel_id).send(message);
        } catch (error) {
            console.log('can not send message to the channel');
            console.log('error:', error);
        }
    }

    const newChannel = newState.channel;
    const oldChannel = oldState.channel;
    const guildId = client.channels.cache.get(channel_id).guildId;
    
    if (!newChannel) {
        if (oldChannel.guildId === guildId) {
            const username = getUserName(oldState.member);
            // sendLog(channel_id, `User ${username} left a ${oldChannel.name} voice channel`);
            // sendLog(channel_id, `User ${username} left a <#${oldChannel.id}> voice channel`);
            sendLog(channel_id, { embeds: [new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle(`User ${username} left a <#${oldChannel.id}> voice channel`)
                // .setDescription(`User ${username} left a <#${oldChannel.id}> voice channel`)
                .setAuthor({ name: username, iconURL: getUserAvatarURL(newState.member) })
            ]});
            // sendLog(channel_id, { embeds: [new EmbedBuilder()
            //     .setColor(0xff0000)
            //     .setFooter({ text: `User ${username} left a ${oldChannel.name} voice channel`, iconURL: getUserAvatarURL(newState.member) })
            // ]});
        }
        return;
    }

    if (!oldChannel) {
        if (newChannel.guildId === guildId) {
            const username = getUserName(newState.member);
            // sendLog(channel_id, `User ${username} joined a ${newChannel.name} voice channel`);
            // sendLog(channel_id, `User ${username} joined a <#${newChannel.id}> voice channel`);
            sendLog(channel_id, { embeds: [new EmbedBuilder()
                .setColor(0x00ff00)
                .setTitle(`User ${username} joined a <#${newChannel.id}> voice channel`)
                // .setDescription(`User ${username} joined a ${newChannel.name} voice channel`)
                .setAuthor({ name: username, iconURL: getUserAvatarURL(newState.member) })
            ]});
            // sendLog(channel_id, { embeds: [new EmbedBuilder()
            //     .setColor(0x00ff00)
            //     .setFooter({ text: `User ${username} joined a ${newChannel.name} voice channel`, iconURL: getUserAvatarURL(newState.member) })
            // ]});
        }
        return;
    }

    if (oldChannel.id != newChannel.id) {
        if (newChannel.guildId === guildId && oldChannel.guildId === guildId) {
            const username = getUserName(newState.member);
            // sendLog(channel_id, `User ${username} move to a ${newChannel.name} voice channel`);
            // sendLog(channel_id, `User ${username} move to a <#${newChannel.id}> voice channel`);
            sendLog(channel_id, { embeds: [new EmbedBuilder()
                .setColor(0x0000ff)
                .setTitle(`User ${username} move to a <#${newChannel.id}> voice channel`)
                // .setDescription(`User ${username} move to a <#${newChannel.id}> voice channel`)
                .setAuthor({ name: username, iconURL: getUserAvatarURL(newState.member) })
            ]});
            // sendLog(channel_id, { embeds: [new EmbedBuilder()
            //     .setColor(0x0000ff)
            //     .setFooter({ text: `User ${username} move to a ${newChannel.name} voice channel`, iconURL: getUserAvatarURL(newState.member) })
            // ]});
        }
        return;
    }
    return;
});

client.on('unhandledRejection', error => {
    console.log('unhandledRejection occured. Please check the log.');
    console.log('error:', error);
});

//connect the bot to the server
client.login(token);


// TODO
// add code for UND_ERR_CONNECT_TIMEOUT Error
