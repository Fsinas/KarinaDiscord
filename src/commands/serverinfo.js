const { EmbedBuilder } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
    name: 'serverinfo',
    description: 'Display information about the server',
    usage: '!serverinfo',
    async execute(message) {
        try {
            // Prevent duplicate responses
            if (message.author.bot) return;

            const guild = message.guild;

            // Get various member counts
            const totalMembers = guild.memberCount;
            const botCount = guild.members.cache.filter(member => member.user.bot).size;
            const humanCount = totalMembers - botCount;

            // Get channel counts
            const channels = guild.channels.cache;
            const textChannels = channels.filter(c => c.type === 0).size;  // 0 is GUILD_TEXT
            const voiceChannels = channels.filter(c => c.type === 2).size; // 2 is GUILD_VOICE

            // Get role count (excluding @everyone)
            const roleCount = guild.roles.cache.size - 1;

            // Create timestamp for server creation
            const createdAt = Math.floor(guild.createdTimestamp / 1000);

            // Create an embed with server information
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`${guild.name} - Server Information`)
                .setThumbnail(guild.iconURL({ dynamic: true }))
                .addFields(
                    { name: '📊 Member Stats', value: 
                        `👥 Total: ${totalMembers}\n` +
                        `👤 Humans: ${humanCount}\n` +
                        `🤖 Bots: ${botCount}`,
                        inline: true
                    },
                    { name: '📜 Channel Stats', value:
                        `💬 Text: ${textChannels}\n` +
                        `🔊 Voice: ${voiceChannels}\n` +
                        `📚 Total: ${channels.size}`,
                        inline: true
                    },
                    { name: '👑 Owner', value: `<@${guild.ownerId}>`, inline: true },
                    { name: '📅 Created', value: `<t:${createdAt}:R>`, inline: true },
                    { name: '🎭 Roles', value: `${roleCount} roles`, inline: true },
                    { name: '🌍 Region', value: guild.preferredLocale, inline: true }
                )
                .setFooter({ text: `Server ID: ${guild.id}` })
                .setTimestamp();

            // Send the embed and ensure we only send it once
            const sent = await message.channel.send({ embeds: [embed] });
            if (sent) {
                logger.info(`Serverinfo command executed by ${message.author.tag}`);
            }
        } catch (error) {
            logger.error('Error in serverinfo command:', error);
            return message.reply('There was an error fetching server information.');
        }
    },
};