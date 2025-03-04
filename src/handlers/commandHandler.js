const logger = require('../utils/logger');

// Command cooldowns map
const cooldowns = new Map();
// Track executed commands to prevent duplicates
const executedCommands = new Set();

async function handleCommand(message, client, commandName, args) {
    const command = client.commands.get(commandName);
    if (!command) return;

    // Generate a unique command execution ID
    const executionId = `${message.id}-${commandName}`;

    // Check if this exact command instance was already executed
    if (executedCommands.has(executionId)) {
        logger.debug(`Prevented duplicate execution of command ${commandName} (Message ID: ${message.id})`);
        return;
    }

    // Check if command is on cooldown
    if (cooldowns.has(`${message.author.id}-${commandName}`)) {
        const cooldownEnd = cooldowns.get(`${message.author.id}-${commandName}`);
        if (Date.now() < cooldownEnd) {
            const timeLeft = (cooldownEnd - Date.now()) / 1000;
            message.reply(`Please wait ${timeLeft.toFixed(1)} seconds before using this command again.`);
            return;
        }
    }

    try {
        logger.info(`Executing command ${commandName} (Message ID: ${message.id})`);

        // Mark this command instance as executed
        executedCommands.add(executionId);

        // Clean up old execution IDs after 5 seconds
        setTimeout(() => executedCommands.delete(executionId), 5000);

        // Set cooldown (3 seconds)
        cooldowns.set(`${message.author.id}-${commandName}`, Date.now() + 3000);
        setTimeout(() => cooldowns.delete(`${message.author.id}-${commandName}`), 3000);

        // Pass the client object to the command's execute method
        await command.execute(message, args, client);
    } catch (error) {
        logger.error(`Error executing command ${commandName}:`, error);
        message.reply('There was an error trying to execute that command!').catch(console.error);
    }
}

module.exports = { handleCommand };