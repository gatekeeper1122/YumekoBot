'use strict';

// Set rootFolder as global
global.__rootFolder = __dirname;

const Discord = require('discord.io'),
    i18n = require('i18n'),
    auth = require('./config.json'),
    commands = require('./api/commands.js');

// Is defined on bot.on('ready')
let BOT_CALLER;

i18n.configure(require('./api/language/i18n.js'));
i18n.setLocale('es');

// Initialize Discord Bot
let bot = new Discord.Client({
    token: auth.token,
    autorun: true
});

// On ready
bot.on('ready', (evt) => {
    console.log('Connected');
    console.log('Logged in as: ');
    console.log(bot.username + ' - (' + bot.id + ')');

    // Define how to call the bot
    BOT_CALLER = new RegExp('\^\\<\\@' + bot.id + '\\>');

    // Set a default bot presence
    bot.setPresence({game: {name: i18n.__("presence_game_name_1")}});

    // Changes the bot presence every minute
    setInterval(() => {
        bot.setPresence({game: {name: i18n.__("presence_game_name_" + parseInt(Math.random() * (4 - 1) + 1))}});
    }, 60000);
});

// On disconnect
bot.on('disconnect', (errMsg, code) => {
    console.log(errMsg);
    console.log(code);
});

// Set i18n as global
global.i18n = i18n;
// Set bot as global
global.bot = bot;

// On any message
bot.on('message', (user, userID, channelID, message, evt) => {
    // if bot is invoked
    if (message.match(BOT_CALLER)) {
        // removes /<@\d{18}> /
        let args = message.substring(22).split(' '),
            cmd = args[0];

        // Removes the command from the arguments
        args.shift();
        switch (cmd) {
            case 'ping':
                commands.ping(channelID);
                break;

            case '':
            case 'help':
            case 'ayuda':
                commands.help(channelID, args);
                break;

            case 'addPlayer':
            case 'añadirPlayer':
            case 'añadirJugador':
                commands.addPlayer(channelID, args);
                break;

            case 'getPlayers':
            case 'listaPlayers':
            case 'listaJugadores':
            case 'getPlayer':
            case 'verJugador':
                commands.getPlayerList(channelID, args);
                break;

            case 'tirarDados':
            case 'lanzarDados':
            case 'throwDices':
                commands.throwDices(channelID, args);
                break;

            case 'canta':
            case 'sing':
                bot.sendMessage({
                    to: channelID,
                    message: "Hashire sori yo, Kaze no you ni, Tsukimihara wo, Padoru padoru!",
                    tts: true
                });
                break;
        }
        // Easter egg
        if (message.toLowerCase().includes('trampa')) {
            return bot.sendMessage({
                to: channelID,
                message: "https://i.ytimg.com/vi/KNHeVgPUdvw/maxresdefault.jpg"
            })
        }
    }
    // Easter egg
    else if (message.toLowerCase().includes('loli')) {
        return bot.sendMessage({
            to: channelID,
            message: "The FBI is comming for " + user + "! \nhttps://www.youtube.com/watch?v=YTK6AFknqkU"
        });
    }
});