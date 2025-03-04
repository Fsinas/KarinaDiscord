const { checkPermissions } = require('../../utils/permissions');
const logger = require('../../utils/logger');

module.exports = {
    name: 'ban',
    description: 'Bans a user from the server (Admin only)',
    async execute(message, client, args) {
        try {
            // Check if user has admin permissions
            if (!checkPermissions(message, ['BanMembers'])) {
                logger.warn(`User ${message.author.tag} attempted to use ban command without permissions`);
                return;
            }

            if (!args.length) {
                return message.reply('Please mention a user to ban.');
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
                logger.warn(`Failed to ban ${target.user.tag}: Target's role is higher than bot's role`);
                return message.reply('I cannot ban this user as their highest role is above or equal to mine.');
            }

            const reason = args.slice(1).join(' ') || 'No reason provided';

            await target.ban({ reason });
            message.reply(`Successfully banned ${target.user.tag} for reason: ${reason}`);
            logger.info(`${target.user.tag} was banned by ${message.author.tag} in guild ${message.guild.name} for: ${reason}`);

        } catch (error) {
            logger.error(`Error in ban command for guild ${message.guild.name}:`, error);
            message.reply('There was an error trying to ban that user. Please check my permissions and try again.');
        }
    }
};