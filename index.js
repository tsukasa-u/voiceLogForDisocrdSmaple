const { Client, Events, GatewayIntentBits, IntentsBitField } = require('discord.js');
const { token, channel_id } = require('./config.json');

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
        client.channels.cache.get(channel_id).send(`User ${oldState.member.user.tag} left a ${oldState.channel.name} voice channel`);
        console.log(`User ${oldState.member.user.tag} finish a call ${oldState.channel.name}`);
        return;
    }

    if (!oldChannel) {
        client.channels.cache.get(channel_id).send(`User ${newState.member.user.tag} join a ${newState.channel.name} voice channel`);
        console.log(`User ${newState.member.user.tag} start a call ${ newState.channel.name}`);
        return;
    }

});

//connect the bot to the server
client.login(token);
