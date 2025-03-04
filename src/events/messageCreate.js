const logger = require('../utils/logger');
const { handleCommand } = require('../handlers/commandHandler');

// In-memory XP storage (in a full implementation, this would be in a database)
const userXP = new Map();
const xpCooldowns = new Map();

const calculateLevel = (xp) => Math.floor(0.1 * Math.sqrt(xp));
const calculateXPForNextLevel = (level) => Math.pow((level + 1) * 10, 2);

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        try {
            // Ignore messages from bots
            if (message.author.bot) return;

            const prefix = process.env.PREFIX || '!';

            // Handle XP gain (only for non-command messages)
            if (!message.content.startsWith(prefix)) {
                const userId = message.author.id;
                const now = Date.now();
                const cooldownAmount = 60000; // 1 minute cooldown

                // Check if user is on cooldown
                if (!xpCooldowns.has(userId) || now > xpCooldowns.get(userId)) {
                    // Random XP between 15-25 per message
                    const earnedXP = Math.floor(Math.random() * 11) + 15;
                    const currentXP = userXP.get(userId) || 0;
                    const newXP = currentXP + earnedXP;

                    userXP.set(userId, newXP);
                    xpCooldowns.set(userId, now + cooldownAmount);

                    const oldLevel = calculateLevel(currentXP);
                    const newLevel = calculateLevel(newXP);

                    // Level up notification
                    if (newLevel > oldLevel) {
                        await message.reply(`🎉 Congratulations ${message.author}! You've reached level ${newLevel}!`);
                        logger.info(`User ${message.author.tag} leveled up to ${newLevel}`);
                    }

                    logger.info(`User ${message.author.tag} gained ${earnedXP} XP (Total: ${newXP})`);
                }
                return;
            }

            // Extract command name and arguments
            const args = message.content.slice(prefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();

            // Log new command attempt
            logger.info(`New command attempt: ${commandName} from ${message.author.tag} (Message ID: ${message.id})`);

            // Execute command through handler
            await handleCommand(message, client, commandName, args);
        } catch (error) {
            logger.error('Error in messageCreate event:', error);
        }
    },
    // Expose methods for other commands to access XP data
    getUserXP: (userId) => userXP.get(userId) || 0,
    getAllUsersXP: () => Array.from(userXP.entries()).map(([userId, xp]) => ({ userId, xp })),
};