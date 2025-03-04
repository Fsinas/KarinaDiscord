const { EmbedBuilder } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
    name: 'messageDelete',
    async execute(message) {
        try {
            if (!message.guild || message.author.bot) return;

            // Create a message deletion log embed
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('Message Deleted')
                .addFields(
                    { name: 'Author', value: `${message.author.tag} (${message.author.id})`, inline: true },
                    { name: 'Channel', value: `${message.channel} (${message.channel.id})`, inline: true },
                    { name: 'Content', value: message.content || 'No content (possibly an embed or attachment)' }
                )
                .setTimestamp();

            // Find the logging channel (you would typically get this from a database)
            const loggingChannel = message.guild.channels.cache
                .find(channel => channel.type === 0 && channel.name === 'server-logs');

            if (loggingChannel) {
                await loggingChannel.send({ embeds: [embed] });
                logger.info(`Logged deleted message from ${message.author.tag} in ${message.guild.name}`);
            }
        } catch (error) {
            logger.error('Error in messageDelete event:', error);
        }
    },
};
