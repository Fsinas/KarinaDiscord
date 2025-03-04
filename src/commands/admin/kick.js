const { checkPermissions } = require('../../utils/permissions');
const logger = require('../../utils/logger');

module.exports = {
    name: 'kick',
    description: 'Kicks a user from the server (Admin only)',
    async execute(message, client, args) {
        try {
            // Check if user has admin permissions
            if (!checkPermissions(message, ['KickMembers'])) {
                logger.warn(`User ${message.author.tag} attempted to use kick command without permissions`);
                return;
            }

            if (!args.length) {
                return message.reply('Please mention a user to kick.');
            }

            const target = message.mentions.members.first() || 
                          message.guild.members.cache.get(args[0]);

            if (!target) {
                return message.reply('Could not find that user.');
            }

            // Check bot's role hierarchy
            const botRolePosition = message.guild.members.me.roles.highest.position;
            const targetRolePosition = target.roles.highest.position;

            if (targetRolePosition >= botRolePosition) {
                logger.warn(`Failed to kick ${target.user.tag}: Target's role is higher than bot's role`);
                return message.reply('I cannot kick this user as their highest role is above or equal to mine.');
            }

            const reason = args.slice(1).join(' ') || 'No reason provided';

            await target.kick(reason);
            message.reply(`Successfully kicked ${target.user.tag} for reason: ${reason}`);
            logger.info(`${target.user.tag} was kicked by ${message.author.tag} in guild ${message.guild.name} for: ${reason}`);

        } catch (error) {
            logger.error(`Error in kick command for guild ${message.guild.name}:`, error);
            message.reply('There was an error trying to kick that user. Please check my permissions and try again.');
        }
    }
};