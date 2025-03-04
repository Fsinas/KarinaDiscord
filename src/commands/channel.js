const { PermissionFlagsBits } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
    name: 'channel',
    description: 'Manage server channels',
    usage: '!channel <create/delete/edit> <type> <name> [options]',
    permissions: [PermissionFlagsBits.ManageChannels],
    async execute(message, args) {
        try {
            // Prevent duplicate responses
            if (message.author.bot) return;

            if (args.length < 3) {
                return message.reply('Usage:\n' +
                    '!channel create <text/voice> <name>\n' +
                    '!channel delete <#channel>\n' +
                    '!channel edit <#channel> <name/topic> <new value>');
            }

            const action = args[0].toLowerCase();
            let response;

            switch (action) {
                case 'create': {
                    const type = args[1].toLowerCase();
                    const name = args[2].toLowerCase().replace(/\s+/g, '-');

                    if (!['text', 'voice'].includes(type)) {
                        return message.reply('Channel type must be either "text" or "voice".');
                    }

                    const channel = await message.guild.channels.create({
                        name: name,
                        type: type === 'text' ? 0 : 2, // 0 for text, 2 for voice
                    });

                    response = await message.reply(`Created ${type} channel: ${channel}`);
                    if (response) {
                        logger.info(`Channel ${channel.name} created by ${message.author.tag}`);
                    }
                    break;
                }

                case 'delete': {
                    const channel = message.mentions.channels.first();
                    if (!channel) {
                        return message.reply('Please mention a channel to delete.');
                    }

                    const channelName = channel.name;
                    await channel.delete();

                    response = await message.reply(`Deleted channel: #${channelName}`);
                    if (response) {
                        logger.info(`Channel ${channelName} deleted by ${message.author.tag}`);
                    }
                    break;
                }

                case 'edit': {
                    const channel = message.mentions.channels.first();
                    if (!channel) {
                        return message.reply('Please mention a channel to edit.');
                    }

                    const property = args[2]?.toLowerCase();
                    const newValue = args.slice(3).join(' ');

                    if (!property || !newValue) {
                        return message.reply('Please specify what to edit (name/topic) and the new value.');
                    }

                    switch (property) {
                        case 'name':
                            await channel.setName(newValue);
                            break;
                        case 'topic':
                            if (channel.type !== 0) {
                                return message.reply('Topics can only be set for text channels.');
                            }
                            await channel.setTopic(newValue);
                            break;
                        default:
                            return message.reply('You can only edit channel name or topic.');
                    }

                    response = await message.reply(`Updated channel ${property}.`);
                    if (response) {
                        logger.info(`Channel ${channel.name} ${property} edited by ${message.author.tag}`);
                    }
                    break;
                }

                default:
                    return message.reply('Invalid action. Use create, delete, or edit.');
            }
        } catch (error) {
            logger.error('Error in channel command:', error);
            return message.reply('There was an error managing the channel.');
        }
    },
};