const { EmbedBuilder } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
    name: 'guildMemberUpdate',
    async execute(oldMember, newMember) {
        try {
            // Create a role change log embed
            const roleChanges = {
                added: newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id)),
                removed: oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id))
            };

            if (roleChanges.added.size === 0 && roleChanges.removed.size === 0) return;

            const embed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('Member Roles Updated')
                .addFields(
                    { name: 'Member', value: `${newMember.user.tag} (${newMember.id})` }
                )
                .setTimestamp();

            if (roleChanges.added.size > 0) {
                embed.addFields({ name: 'Roles Added', value: roleChanges.added.map(role => role.name).join(', ') });
            }
            if (roleChanges.removed.size > 0) {
                embed.addFields({ name: 'Roles Removed', value: roleChanges.removed.map(role => role.name).join(', ') });
            }

            // Find the logging channel (you would typically get this from a database)
            const loggingChannel = newMember.guild.channels.cache
                .find(channel => channel.type === 0 && channel.name === 'server-logs');

            if (loggingChannel) {
                await loggingChannel.send({ embeds: [embed] });
                logger.info(`Logged role changes for ${newMember.user.tag} in ${newMember.guild.name}`);
            }
        } catch (error) {
            logger.error('Error in guildMemberUpdate event:', error);
        }
    },
};
