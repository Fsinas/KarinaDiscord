const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
    name: 'setuproles',
    description: 'Setup reaction roles for users to self-assign',
    usage: '!setuproles <#channel> <messageText>',
    permissions: [PermissionFlagsBits.ManageRoles],
    async execute(message, args) {
        try {
            if (args.length < 2) {
                return message.reply('Usage: !setuproles <#channel> <messageText>');
            }

            // Get the target channel
            const channel = message.mentions.channels.first();
            if (!channel) {
                return message.reply('Please mention a valid channel.');
            }

            // Get the message text (everything after the channel mention)
            const messageText = args.slice(1).join(' ');

            // Create an embed for role selection
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Role Selection')
                .setDescription(messageText)
                .setFooter({ text: 'React to this message to get/remove roles' });

            // Send the embed and store it for reaction handling
            const roleMessage = await channel.send({ embeds: [embed] });
            
            // Add initial reaction (we'll use this in the reactionHandler)
            await roleMessage.react('✅');

            logger.info(`Setup roles message created in ${channel.name} by ${message.author.tag}`);
            return message.reply(`Role selection message has been set up in ${channel.name}!`);

        } catch (error) {
            logger.error('Error in setuproles command:', error);
            return message.reply('There was an error setting up reaction roles.');
        }
    },
};
