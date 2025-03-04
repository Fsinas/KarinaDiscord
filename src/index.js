require('dotenv').config();
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const logger = require('./utils/logger');

// Create a new client instance with all required intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences
    ]
});

client.commands = new Collection();

// Load commands
function loadCommands(dir) {
    const commandsPath = path.join(__dirname, dir);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Log command loading
        logger.info(`Loading command: ${command.name}`);
        client.commands.set(command.name, command);
    }
}

// Load regular commands
loadCommands('commands');

// Load admin commands
const adminCommandsPath = path.join(__dirname, 'commands/admin');
if (fs.existsSync(adminCommandsPath)) {
    loadCommands('commands/admin');
}

// Load events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
        logger.info(`Registered once event: ${event.name}`);
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
        logger.info(`Registered event: ${event.name}`);
    }
}

// Error handling
process.on('unhandledRejection', error => {
    logger.error('Unhandled promise rejection:', error);
});

// Login to Discord
const token = process.env.DISCORD_TOKEN;
if (!token) {
    logger.error('No Discord token provided in environment variables!');
    process.exit(1);
}

client.login(token).catch(error => {
    logger.error('Error logging in to Discord:', error);
    process.exit(1);
});