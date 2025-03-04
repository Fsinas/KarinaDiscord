const { PermissionFlagsBits } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
    name: 'timeout',
    description: 'Timeout a user for a specified duration',
    usage: '!timeout <@user> <duration> <reason>',
    permissions: [PermissionFlagsBits.ModerateMembers],
    async execute(message, args) {
        try {
            // Prevent duplicate responses
            if (message.author.bot) return;

            // Check if a user was mentioned
            const user = message.mentions.users.first();
            if (!user) {
                return message.reply('Please mention a user to timeout.');
            }

            // Get the duration (in minutes)
            const duration = parseInt(args[1]);
            if (!duration || isNaN(duration) || duration <= 0) {
                return message.reply('Please specify a valid duration in minutes.');
            }

            // Get the reason
            const reason = args.slice(2).join(' ') || 'No reason provided';

            // Get the member from the user
            const member = message.guild.members.cache.get(user.id);
            if (!member) {
                return message.reply('That user is not in this server.');
            }

            // Check if the user can be timed out
            if (member.permissions.has(PermissionFlagsBits.Administrator)) {
                return message.reply('You cannot timeout an administrator.');
            }

            // Apply timeout
            await member.timeout(duration * 60 * 1000, reason);

            // Log the timeout
            logger.info(`Timeout issued to ${user.tag} by ${message.author.tag} for ${duration} minutes. Reason: ${reason}`);

            // Send confirmation messages
            const channelMsg = await message.channel.send(`🔇 **${user.tag}** has been timed out for ${duration} minutes.\nReason: ${reason}`);
            const userDM = await user.send(`You have been timed out in **${message.guild.name}** for ${duration} minutes.\nReason: ${reason}`)
                .catch(() => message.channel.send('Could not DM the user about their timeout.'));

            if (channelMsg && userDM) {
                return message.react('✅');
            }
        } catch (error) {
            logger.error('Error in timeout command:', error);
            return message.reply('There was an error trying to timeout that user.');
        }
    },
};