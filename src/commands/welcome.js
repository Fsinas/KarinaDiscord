const { PermissionFlagsBits } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
    name: 'welcome',
    description: 'Configure welcome message settings',
    usage: '!welcome <channel/message> <#channel/message text>',
    permissions: [PermissionFlagsBits.ManageGuild],
    async execute(message, args) {
        try {
            // Prevent duplicate responses
            if (message.author.bot) return;

            if (!args.length || !['channel', 'message'].includes(args[0])) {
                return message.reply('Usage: !welcome channel #welcome-channel\n       !welcome message Welcome {user} to the server!');
            }

            const action = args[0];
            let response;

            if (action === 'channel') {
                const channel = message.mentions.channels.first();
                if (!channel) {
                    return message.reply('Please mention a valid channel.');
                }

                // Here you would typically store the channel ID in a database
                response = await message.reply(`Welcome channel set to ${channel}`);
                if (response) {
                    logger.info(`Welcome channel set to ${channel.name} in ${message.guild.name}`);
                }
            } else if (action === 'message') {
                const newMessage = args.slice(1).join(' ');
                if (!newMessage) {
                    return message.reply('Please provide a welcome message.');
                }

                // Here you would typically store the message in a database
                response = await message.reply('Welcome message has been updated.');
                if (response) {
                    logger.info(`Welcome message updated in ${message.guild.name}`);
                }
            }

            if (response) {
                await message.react('✅');
            }
        } catch (error) {
            logger.error('Error in welcome command:', error);
            return message.reply('There was an error updating the welcome settings.');
        }
    },
};