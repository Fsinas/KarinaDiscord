const { PermissionFlagsBits } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
    name: 'warn',
    description: 'Warn a user for breaking rules',
    usage: '!warn <@user> <reason>',
    permissions: [PermissionFlagsBits.ModerateMembers],
    async execute(message, args) {
        try {
            // Prevent duplicate responses
            if (message.author.bot) return;

            // Check if a user was mentioned
            const user = message.mentions.users.first();
            if (!user) {
                return message.reply('Please mention a user to warn.');
            }

            // Get the reason
            const reason = args.slice(1).join(' ') || 'No reason provided';

            // Get the member from the user
            const member = message.guild.members.cache.get(user.id);
            if (!member) {
                return message.reply('That user is not in this server.');
            }

            // Check if the user can be warned (not an admin/mod)
            if (member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
                return message.reply('You cannot warn a moderator or administrator.');
            }

            // Log the warning
            logger.info(`Warning issued to ${user.tag} by ${message.author.tag} for: ${reason}`);

            // Send warning messages
            const channelMsg = await message.channel.send(`⚠️ **${user.tag}** has been warned for: ${reason}`);
            const userDM = await user.send(`You have been warned in **${message.guild.name}** for: ${reason}`)
                .catch(() => message.channel.send('Could not DM the user about their warning.'));

            if (channelMsg && userDM) {
                await message.react('✅');
            }
        } catch (error) {
            logger.error('Error in warn command:', error);
            return message.reply('There was an error trying to warn that user.');
        }
    },
};