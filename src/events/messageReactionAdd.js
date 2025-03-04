const logger = require('../utils/logger');

module.exports = {
    name: 'messageReactionAdd',
    async execute(reaction, user) {
        try {
            // Don't process reactions from bots
            if (user.bot) return;

            // Fetch the message if it's not cached
            if (reaction.partial) {
                await reaction.fetch();
            }

            // Check if this is a role selection message (has the role selection embed)
            const message = reaction.message;
            if (!message.embeds.length || message.embeds[0].title !== 'Role Selection') return;

            // Get the guild member
            const member = reaction.message.guild.members.cache.get(user.id);
            if (!member) return;

            // For now, we'll use a simple test role - this would be expanded to handle multiple roles
            const roleName = 'Member'; // This would be configurable in a full implementation
            const role = reaction.message.guild.roles.cache.find(r => r.name === roleName);

            if (!role) {
                logger.error(`Role ${roleName} not found in guild ${reaction.message.guild.name}`);
                return;
            }

            // Add the role to the member
            await member.roles.add(role);
            logger.info(`Added role ${role.name} to ${member.user.tag} via reaction`);

            // Remove the user's reaction (optional, but helps keep things clean)
            await reaction.users.remove(user);

        } catch (error) {
            logger.error('Error in messageReactionAdd event:', error);
        }
    },
};
