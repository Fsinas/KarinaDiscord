const logger = require('../utils/logger');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        logger.info(`Logged in as ${client.user.username}#${client.user.discriminator}`);
        client.user.setActivity('!help for commands', { type: 'Playing' });
    },
};