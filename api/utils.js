'use strict';

/**
 * Get a player object and returns a beauty string
 * @param {Object} player Player to beautify
 * @returns {string}
 * @private
 */
function _beutifyPlayer(player) {
    let beautyPlayer = '' +
        '**__' + player.user + '__**' + '\n' +
        '\t**' + i18n.__('life') + '**: ' + player.hp + '\n' +
        '\t**' + i18n.__('fatigue') + '**: ' + player.fatigue + '\n' +
        '\t**' + i18n.__('zeon') + '**: ' + player.zeon + '\n' +
        '\t**' + i18n.__('coins') + '**: ' + '\n' +
        '\t\t· **' + i18n.__('copper') + '**: ' + player.money.copper + '\n' +
        '\t\t· **' + i18n.__('silver') + '**: ' + player.money.silver + '\n' +
        '\t\t· **' + i18n.__('gold') + '**: ' + player.money.gold + '\n' +
        '\t**' + i18n.__('inventory') + '**: ' + '\n' +
        '';
    for(let i in player.inventory) {
        beautyPlayer += '\t\t· [' + i + '] \t ' + player.inventory[i] + '\n';
    }
    return beautyPlayer;
}

module.exports = {
    /**
     * Get the all the user names of the server
     * @returns {Array}
     */
    getHumanUsernames: () => {
        let humans = [];
        Object.keys(bot.users).forEach((i) => {
            if (!bot.users[i].bot) humans.push(bot.users[i].username);
        });
        return humans;
    },
    beutifyPlayer: _beutifyPlayer,
    /**
     * Beautify the player list
     * @param {Object} players
     * @returns {string}
     */
    beutyfyPlayerList: (players) => {
        let beautyPlayerList = '';
        Object.keys(players).forEach((i) => {
            if (!!beautyPlayerList) beautyPlayerList += '= = = = = = = = =\n';
            beautyPlayerList += _beutifyPlayer(players[i]);
        });
        return beautyPlayerList;
    }
};