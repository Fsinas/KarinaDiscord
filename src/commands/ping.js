const logger = require('../utils/logger');

module.exports = {
    name: 'ping',
    description: 'Replies with Pong and latency information',
    async execute(message) {
        try {
            // Prevent duplicate responses
            if (message.author.bot) return;

            const sent = await message.reply('Pinging...');
            const latency = sent.createdTimestamp - message.createdTimestamp;
            await sent.edit(`Pong! 🏓\nLatency: ${latency}ms\nAPI Latency: ${Math.round(message.client.ws.ping)}ms`);
        } catch (error) {
            logger.error('Error in ping command:', error);
            message.reply('There was an error executing the ping command.');
        }
    }
};