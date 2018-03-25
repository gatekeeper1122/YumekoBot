'use strict';

const utils = require('./utils.js'),
    fs = require('fs');

let players = {};

// Load players json if exist
try {
    players = JSON.parse(fs.readFileSync(__rootFolder + '/players.json'));
} catch (err) {
    console.log('Can\'t load ' + __rootFolder + 'players.json');
}

module.exports = {
    /**
     * Bot responds with "Pong!"
     * @param {Number} channelID ID of the channel where respond
     */
    ping: (channelID) => {
        return bot.sendMessage({
            to: channelID,
            message: 'Pong!'
        });
    },
    /**
     * Bot responds with help
     * @param {Number} channelID ID of the channel where respond
     * @param {Array} [args] Array of arguments
     */
    // TODO hacer que pueda recibir un parametro especifico
    help: (channelID, args) => {
        return bot.sendMessage({
            to: channelID,
            message: "Command list:\n" +
            "```" +
            "ping - Responde \"!pong\".\n" +
            "addPlayer <UserName> - Añade un jugador.\n" +
            "getPlayers [UserName] - Devuelve la lista de jugadores o un jugador especifico.\n" +
            "tirarDados [NumeroDeTiradas] [numeroDeCaras] - Lanza dados de 100 caras." +
            "```"
        });
    },
    /**
     * Add a player
     * @param {Number} channelID ID of the channel where respond
     * @param {Array} [args] Array of arguments
     */
    addPlayer: (channelID, args) => {
        // If there's no arguments responds with help
        if (!args[0]) {
            return bot.sendMessage({
                to: channelID,
                message: 'Use ' + BOT_CALLER + 'addPlayer <UserName>'
            });
        }
        else {
            // Match user ID
            if (args[0].match(/\<\@.+?\>/)) {
                args[0] = args[0].replace('<@', '').replace('>', '');
                args[0] = bot.users[args[0]].username;
            }
            // If username does not exist
            else if (!utils.getHumanUsernames().includes(args[0])) {
                return bot.sendMessage({
                    to: channelID,
                    message: args[0] + "...? Quien es ese?"
                });
            }

            players[args[0]] = {
                user: args[0],
                hp: 10,
                theon: 100,
                fatigue: 10
            };

            // Save changes
            fs.writeFile(__rootFolder + '/players.json', JSON.stringify(players), (err) => {
                if (err) {
                    console.error(err);
                    return bot.sendMessage({
                        to: channelID,
                        message: 'Error saving the player'
                    });
                }
                else {
                    // Respond with succes
                    return bot.sendMessage({
                        to: channelID,
                        message: 'Player added: ' + args[0]
                    });
                }
            });
        }
    },
    /**
     * Get the player list or an specified player data
     * @param {Number} channelID ID of the channel where respond
     * @param {Array} [args] Array of arguments
     */
    // TODO beutify response
    getPlayerList: (channelID, args) => {
        // if user is specificated
        if(args[0]){
            args[0] = args[0].replace('<@', '').replace('>', '');
            // If player exist
            if(players.hasOwnProperty(args[0])) {
                return bot.sendMessage({
                    to: channelID,
                    message: JSON.stringify(players[args[0]])
                });
            }
            // if player does not exist
            else {
                return bot.sendMessage({
                    to: channelID,
                    message: 'Player not found: '+ args[0]
                });
            }
        }
        else {
            return bot.sendMessage({
                to: channelID,
                message: JSON.stringify(players)
            });
        }
    },
    /**
     * Responds with a random number between 1 and 100.
     * If you pass an integer arg, will thrown the same dices as the arg number
     * @param {Number} channelID ID of the channel where respond
     * @param {Array} [args] Array of arguments
     */
    throwDices: (channelID, args) => {
        let throws = "",
            invalidArgComment = "";
        // Set dice faces
        args[1] = parseInt(!args[1] || isNaN(args[1]) || args[1] <= 0 ? 100 : args[1]) + 1;

        // Verify if ther argument is number
        if (!!args[0] && isNaN(args[0])) {
            invalidArgComment = i18n.__("next_time_pass_a_number");
            args[0] = 1;
        }
        // Limit number of throws to 10
        args[0] = args[0] > 10 ? 10 : args[0];

        // Throws dices
        for (let i = 0; i < (args[0] || 1); i++) {
            if (!!throws) throws += ", ";
            throws += parseInt(Math.random() * (args[1] - 1) + 1);
        }
        bot.sendMessage({
            to: channelID,
            message: throws + invalidArgComment
        });
    }
};