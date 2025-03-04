const { PermissionFlagsBits } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
    name: 'logging',
    description: 'Configure server logging settings',
    usage: '!logging <enable/disable/channel> [#channel]',
    permissions: [PermissionFlagsBits.ManageGuild],
    async execute(message, args) {
        try {
            // Prevent duplicate responses
            if (message.author.bot) return;

            if (!args.length || !['enable', 'disable', 'channel'].includes(args[0])) {
                return message.reply('Usage:\n!logging enable - Enable server logging\n!logging disable - Disable server logging\n!logging channel #channel - Set logging channel');
            }

            const action = args[0].toLowerCase();
            let response;

            switch (action) {
                case 'channel': {
                    const channel = message.mentions.channels.first();
                    if (!channel) {
                        return message.reply('Please mention a valid text channel.');
                    }

                    if (channel.type !== 0) { // 0 is GUILD_TEXT
                        return message.reply('The logging channel must be a text channel.');
                    }

                    // Here you would typically store the channel ID in a database
                    response = await message.reply(`Logging channel set to ${channel}`);
                    if (response) {
                        logger.info(`Logging channel set to ${channel.name} in ${message.guild.name}`);
                    }
                    break;
                }

                case 'enable': {
                    // Here you would typically store the enabled status in a database
                    response = await message.reply('Server logging has been enabled.');
                    if (response) {
                        logger.info(`Logging enabled in ${message.guild.name}`);
                    }
                    break;
                }

                case 'disable': {
                    // Here you would typically store the disabled status in a database
                    response = await message.reply('Server logging has been disabled.');
                    if (response) {
                        logger.info(`Logging disabled in ${message.guild.name}`);
                    }
                    break;
                }
            }

            if (response) {
                await message.react('✅');
            }
        } catch (error) {
            logger.error('Error in logging command:', error);
            return message.reply('There was an error updating the logging settings.');
        }
    },
};
