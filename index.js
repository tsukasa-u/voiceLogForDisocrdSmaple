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
        const avatarURL = member.user.avatarURL();
        if (avatarURL !== null && avatarURL !== undefined) return avatarURL;
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

            // sample1
            // sendLog(channel_id, {content : `<@${oldState.member.user.id}> left <#${oldChannel.id}> at <t:${Math.floor(Date.now()/1000)}:R>`, allowedMentions: { parse: [] }});
            
            // sample2
            sendLog(channel_id, `${username} left ${oldChannel.name}`);
            
            // sample3
            // sendLog(channel_id, { embeds: [new EmbedBuilder()
            //     .setColor(0xff0000)
            //     .setTitle(`left <#${oldChannel.id}> at <t:${Math.floor(Date.now()/1000)}:R>`)
            //     // .setDescription(`${username} left a <#${oldChannel.id}> voice channel`)
            //     .setAuthor({ name: username, iconURL: getUserAvatarURL(oldState.member) })
            // ]});
            
            // sample4
            // sendLog(channel_id, { embeds: [new EmbedBuilder()
            //     .setColor(0xff0000)
            //     // .setFooter({ text: `${username} left ${oldChannel.name}`, iconURL: getUserAvatarURL(oldState.member) })
            //     .setAuthor({ name: `${username} left ${oldChannel.name}`, iconURL: getUserAvatarURL(oldState.member) })
            // ]});
        }
        return;
    }

    if (!oldChannel) {
        if (newChannel.guildId === guildId) {
            const username = getUserName(newState.member);

            // sample1
            // sendLog(channel_id, {content : `<@${newState.member.user.id}> joined <#${newChannel.id}> at <t:${Math.floor(Date.now()/1000)}:R>`, allowedMentions: { parse: [] }});
            
            // sample2
            sendLog(channel_id, `${username} joined ${newChannel.name}`);

            // sample3
            // sendLog(channel_id, { embeds: [new EmbedBuilder()
            //     .setColor(0x00ff00)
            //     .setTitle(`joined <#${newChannel.id}> at <t:${Math.floor(Date.now()/1000)}:R>`)
            //     // .setDescription(`${username} joined a ${newChannel.name}`)
            //     .setAuthor({ name: username, iconURL: getUserAvatarURL(newState.member) })
            // ]});
            
            // sample4
            // sendLog(channel_id, { embeds: [new EmbedBuilder()
            //     .setColor(0x00ff00)
            //     // .setFooter({ text: `${username} joined ${newChannel.name}`, iconURL: getUserAvatarURL(newState.member) })
            //     .setAuthor({ name: `${username} joined ${newChannel.name}`, iconURL: getUserAvatarURL(newState.member) })
            // ]});
        }
        return;
    }

    if (oldChannel.id != newChannel.id) {
        if (newChannel.guildId === guildId && oldChannel.guildId === guildId) {
            const username = getUserName(newState.member);

            // sample1
            // sendLog(channel_id, {content : `<@${newState.member.user.id}> move to <#${newChannel.id}> at <t:${Math.floor(Date.now()/1000)}:R>`, allowedMentions: { parse: [] }});
            
            // sample2
            sendLog(channel_id, `${username} move to ${newChannel.name}`);
            
            // sample3
            // sendLog(channel_id, { embeds: [new EmbedBuilder()
            //     .setColor(0xffff00)
            //     .setTitle(`move to <#${newChannel.id}> at <t:${Math.floor(Date.now()/1000)}:R>`)
            //     // .setDescription(`${username} move to a <#${newChannel.id}>`)
            //     .setAuthor({ name: username, iconURL: getUserAvatarURL(newState.member) })
            // ]});

            // sample4
            // sendLog(channel_id, { embeds: [new EmbedBuilder()
            //     .setColor(0xffff00)
            //     // .setFooter({ text: `${username} move to ${newChannel.name}`, iconURL: getUserAvatarURL(newState.member) })
            //     .setAuthor({ name: `${username} move to ${newChannel.name}`, iconURL: getUserAvatarURL(newState.member) })
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
