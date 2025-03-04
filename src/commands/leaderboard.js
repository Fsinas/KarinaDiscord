const { EmbedBuilder } = require('discord.js');
const logger = require('../utils/logger');
const { getAllUsersXP } = require('../events/messageCreate');

module.exports = {
    name: 'leaderboard',
    description: 'Show the server XP leaderboard',
    usage: '!leaderboard',
    async execute(message, args) {
        try {
            // Get all users' XP data and sort by XP
            const leaderboardData = getAllUsersXP()
                .map(({ userId, xp }) => ({
                    id: userId,
                    xp: xp,
                    level: Math.floor(0.1 * Math.sqrt(xp))
                }))
                .sort((a, b) => b.xp - a.xp)
                .slice(0, 10);

            // Format leaderboard entries
            const leaderboardEntries = await Promise.all(
                leaderboardData.map(async (entry, index) => {
                    const user = await message.client.users.fetch(entry.id);
                    return `${index + 1}. ${user.username} - Level ${entry.level} (${entry.xp} XP)`;
                })
            );

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('🏆 XP Leaderboard')
                .setDescription(leaderboardEntries.join('\n'))
                .setTimestamp();

            await message.reply({ embeds: [embed] });
            logger.info(`Leaderboard command used by ${message.author.tag}`);

        } catch (error) {
            logger.error('Error in leaderboard command:', error);
            return message.reply('There was an error fetching the leaderboard.');
        }
    },
};