const { PermissionFlagsBits } = require('discord.js');
const logger = require('../utils/logger');
const ms = require('ms');

module.exports = {
    name: 'tempaddrole',
    description: 'Add a temporary role to a user',
    usage: '!tempaddrole <@user> <@role> <time>',
    permissions: [PermissionFlagsBits.ManageRoles],
    async execute(message, args) {
        try {
            if (args.length < 3) {
                return message.reply('Usage: !tempaddrole <@user> <@role> <time> (e.g., 1h, 30m, 1d)');
            }

            const user = message.mentions.users.first();
            const role = message.mentions.roles.first();
            const duration = args[2];

            if (!user || !role) {
                return message.reply('Please mention both a user and a role.');
            }

            const member = message.guild.members.cache.get(user.id);
            if (!member) {
                return message.reply('That user is not in this server.');
            }

            // Convert duration string to milliseconds
            const durationMs = ms(duration);
            if (!durationMs) {
                return message.reply('Please provide a valid duration (e.g., 1h, 30m, 1d)');
            }

            // Add the role
            await member.roles.add(role);
            logger.info(`Temporary role ${role.name} added to ${user.tag} for ${duration}`);

            // Send confirmation
            await message.reply(`Added ${role.name} to ${user.tag} for ${duration}`);

            // Schedule role removal
            setTimeout(async () => {
                try {
                    if (member.roles.cache.has(role.id)) {
                        await member.roles.remove(role);
                        logger.info(`Temporary role ${role.name} removed from ${user.tag} after ${duration}`);
                    }
                } catch (error) {
                    logger.error('Error removing temporary role:', error);
                }
            }, durationMs);

        } catch (error) {
            logger.error('Error in tempaddrole command:', error);
            return message.reply('There was an error adding the temporary role.');
        }
    },
};
