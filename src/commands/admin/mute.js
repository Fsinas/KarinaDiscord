const { checkPermissions } = require('../../utils/permissions');
const logger = require('../../utils/logger');

module.exports = {
    name: 'mute',
    description: 'Mutes a user in the server (Admin only)',
    async execute(message, client, args) {
        try {
            // Check if user has admin permissions
            if (!checkPermissions(message, ['ManageRoles'])) {
                logger.warn(`User ${message.author.tag} attempted to use mute command without permissions`);
                return;
            }

            if (!args.length) {
                return message.reply('Please mention a user to mute.');
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
                logger.warn(`Failed to mute ${target.user.tag}: Target's role is higher than bot's role`);
                return message.reply('I cannot mute this user as their highest role is above or equal to mine.');
            }

            // Get or create muted role
            let mutedRole = message.guild.roles.cache.find(role => role.name === 'Muted');

            if (!mutedRole) {
                logger.info(`Creating Muted role in guild ${message.guild.name}`);
                try {
                    mutedRole = await message.guild.roles.create({
                        name: 'Muted',
                        color: '#808080',
                        permissions: [],
                        reason: 'Role created for muting users'
                    });
                    logger.info(`Successfully created Muted role in guild ${message.guild.name}`);

                    // Update channel permissions for the muted role
                    logger.info(`Updating channel permissions for Muted role in ${message.guild.channels.cache.size} channels`);
                    for (const channel of message.guild.channels.cache.values()) {
                        try {
                            await channel.permissionOverwrites.edit(mutedRole, {
                                SendMessages: false,
                                AddReactions: false,
                                Speak: false
                            });
                            logger.info(`Updated permissions for channel #${channel.name}`);
                        } catch (error) {
                            logger.error(`Failed to update permissions for channel #${channel.name}:`, error);
                        }
                    }
                } catch (error) {
                    logger.error(`Failed to create Muted role in guild ${message.guild.name}:`, error);
                    return message.reply('Failed to create the muted role. Please check my permissions and try again.');
                }
            }

            const reason = args.slice(1).join(' ') || 'No reason provided';

            // Check if user is already muted
            if (target.roles.cache.has(mutedRole.id)) {
                logger.warn(`Attempted to mute ${target.user.tag} who is already muted`);
                return message.reply('This user is already muted.');
            }

            // Add the muted role to the user
            await target.roles.add(mutedRole, reason);
            message.reply(`Successfully muted ${target.user.tag} for reason: ${reason}`);
            logger.info(`${target.user.tag} was muted by ${message.author.tag} in guild ${message.guild.name} for: ${reason}`);

        } catch (error) {
            logger.error(`Error in mute command for guild ${message.guild.name}:`, error);
            message.reply('There was an error trying to mute that user. Please check my permissions and try again.');
        }
    }
};