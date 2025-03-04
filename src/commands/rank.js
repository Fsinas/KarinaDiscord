const { EmbedBuilder } = require('discord.js');
const logger = require('../utils/logger');
const { getUserXP } = require('../events/messageCreate');

module.exports = {
    name: 'rank',
    description: 'Check your current rank and XP',
    usage: '!rank [@user]',
    async execute(message, args) {
        try {
            // Get the target user (mentioned user or message author)
            const user = message.mentions.users.first() || message.author;
            const member = message.guild.members.cache.get(user.id);

            if (!member) {
                return message.reply('User not found in this server.');
            }

            // Get user's XP from the tracking system
            const xp = getUserXP(user.id);
            const level = Math.floor(0.1 * Math.sqrt(xp));
            const nextLevelXP = Math.pow((level + 1) * 10, 2);

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`${user.username}'s Rank`)
                .setThumbnail(user.displayAvatarURL())
                .addFields(
                    { name: 'Level', value: level.toString(), inline: true },
                    { name: 'XP', value: xp.toString(), inline: true },
                    { name: 'Next Level', value: `${nextLevelXP - xp} XP needed`, inline: true }
                )
                .setTimestamp();

            await message.reply({ embeds: [embed] });
            logger.info(`Rank command used by ${message.author.tag} for ${user.tag}`);

        } catch (error) {
            logger.error('Error in rank command:', error);
            return message.reply('There was an error fetching rank information.');
        }
    },
};