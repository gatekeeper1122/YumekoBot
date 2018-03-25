'use strict';

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
    }
}
