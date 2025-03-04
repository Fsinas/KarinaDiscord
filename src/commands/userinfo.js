const { EmbedBuilder } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
    name: 'userinfo',
    description: 'Display information about a user',
    usage: '!userinfo [@user]',
    async execute(message, args) {
        try {
            // Prevent duplicate responses
            if (message.author.bot) return;

            // Get the target user (mentioned user or message author)
            const target = message.mentions.users.first() || message.author;
            const member = message.guild.members.cache.get(target.id);

            // Create timestamp for account creation and server join dates
            const createdAt = Math.floor(target.createdTimestamp / 1000);
            const joinedAt = Math.floor(member.joinedTimestamp / 1000);

            // Create an embed with user information
            const embed = new EmbedBuilder()
                .setColor(member.displayHexColor || '#00ff00')
                .setTitle(`User Information - ${target.tag}`)
                .setThumbnail(target.displayAvatarURL({ dynamic: true }))
                .addFields(
                    { name: '🆔 ID', value: target.id, inline: true },
                    { name: '📛 Nickname', value: member.nickname || 'None', inline: true },
                    { name: '🤖 Bot', value: target.bot ? 'Yes' : 'No', inline: true },
                    { name: '📅 Account Created', value: `<t:${createdAt}:R>`, inline: true },
                    { name: '📥 Joined Server', value: `<t:${joinedAt}:R>`, inline: true },
                    { name: '🎭 Roles', value: member.roles.cache.size > 1 
                        ? member.roles.cache.filter(r => r.id !== message.guild.id).map(r => r.toString()).join(', ')
                        : 'No roles'
                    }
                )
                .setFooter({ text: `Requested by ${message.author.tag}` })
                .setTimestamp();

            const sent = await message.channel.send({ embeds: [embed] });
            if (sent) {
                logger.info(`Userinfo command executed for ${target.tag} by ${message.author.tag}`);
            }
        } catch (error) {
            logger.error('Error in userinfo command:', error);
            return message.reply('There was an error fetching user information.');
        }
    },
};