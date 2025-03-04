const { EmbedBuilder } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
    name: 'help',
    description: 'Lists all available commands',
    async execute(message, args, client) {
        try {
            // Prevent duplicate responses
            if (message.author.bot) return;

            const prefix = process.env.PREFIX || '!';
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Bot Commands')
                .setDescription('Here are all available commands:')
                .setTimestamp();

            // Separate admin and regular commands
            const adminCommands = [];
            const regularCommands = [];

            client.commands.forEach(command => {
                const commandInfo = {
                    name: `${prefix}${command.name}`,
                    value: command.description || 'No description available'
                };

                if (command.name.startsWith('help') || command.name.startsWith('ping')) {
                    regularCommands.push(commandInfo);
                } else {
                    adminCommands.push(commandInfo);
                }
            });

            if (regularCommands.length > 0) {
                embed.addFields({ name: '📌 Regular Commands', value: '\u200B' });
                regularCommands.forEach(cmd => embed.addFields(cmd));
            }

            // Only show admin commands to users with admin permissions
            if (message.member.permissions.has('Administrator') && adminCommands.length > 0) {
                embed.addFields({ name: '🛡️ Admin Commands', value: '\u200B' });
                adminCommands.forEach(cmd => embed.addFields(cmd));
            }

            const sent = await message.reply({ embeds: [embed] });
            if (sent) {
                logger.info(`Help command executed by ${message.author.tag}`);
            }
        } catch (error) {
            logger.error('Error in help command:', error);
            message.reply('There was an error executing the help command.');
        }
    }
};