const { EmbedBuilder } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
    name: 'messageUpdate',
    async execute(oldMessage, newMessage) {
        try {
            if (!oldMessage.guild || oldMessage.author.bot) return;
            if (oldMessage.content === newMessage.content) return;

            // Create a message edit log embed
            const embed = new EmbedBuilder()
                .setColor('#ffa500')
                .setTitle('Message Edited')
                .addFields(
                    { name: 'Author', value: `${oldMessage.author.tag} (${oldMessage.author.id})`, inline: true },
                    { name: 'Channel', value: `${oldMessage.channel} (${oldMessage.channel.id})`, inline: true },
                    { name: 'Before', value: oldMessage.content || 'No content' },
                    { name: 'After', value: newMessage.content || 'No content' }
                )
                .setTimestamp();

            // Find the logging channel (you would typically get this from a database)
            const loggingChannel = oldMessage.guild.channels.cache
                .find(channel => channel.type === 0 && channel.name === 'server-logs');

            if (loggingChannel) {
                await loggingChannel.send({ embeds: [embed] });
                logger.info(`Logged edited message from ${oldMessage.author.tag} in ${oldMessage.guild.name}`);
            }
        } catch (error) {
            logger.error('Error in messageUpdate event:', error);
        }
    },
};
