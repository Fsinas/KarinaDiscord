const logger = require('../utils/logger');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        try {
            // Default welcome channel is the first text channel
            const welcomeChannel = member.guild.channels.cache
                .find(channel => channel.type === 0 && channel.permissionsFor(member.guild.members.me).has('SendMessages'));

            if (!welcomeChannel) {
                logger.warn(`No suitable welcome channel found in ${member.guild.name}`);
                return;
            }

            // Create a welcome message
            const welcomeMessage = `Welcome ${member} to **${member.guild.name}**! 🎉\n` +
                `We now have ${member.guild.memberCount} members!\n` +
                `Please read our rules and have a great time!`;

            await welcomeChannel.send(welcomeMessage);
            logger.info(`Sent welcome message for ${member.user.tag} in ${member.guild.name}`);
        } catch (error) {
            logger.error('Error in guildMemberAdd event:', error);
        }
    },
};
