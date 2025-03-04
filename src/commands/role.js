const { PermissionFlagsBits } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
    name: 'role',
    description: 'Add or remove roles from users',
    usage: '!role <add/remove> <@user> <@role>',
    permissions: [PermissionFlagsBits.ManageRoles],
    async execute(message, args) {
        try {
            // Prevent duplicate responses
            if (message.author.bot) return;

            // Check for proper argument count
            if (args.length < 3) {
                return message.reply('Usage: !role <add/remove> <@user> <@role>');
            }

            const action = args[0].toLowerCase();
            if (!['add', 'remove'].includes(action)) {
                return message.reply('Please specify either "add" or "remove".');
            }

            // Get the mentioned user and role
            const user = message.mentions.users.first();
            const role = message.mentions.roles.first();

            if (!user) {
                return message.reply('Please mention a user.');
            }
            if (!role) {
                return message.reply('Please mention a role.');
            }

            // Get the member from the user
            const member = message.guild.members.cache.get(user.id);
            if (!member) {
                return message.reply('That user is not in this server.');
            }

            // Check if the bot has permission to manage this role
            const botMember = message.guild.members.cache.get(message.client.user.id);
            if (role.position >= botMember.roles.highest.position) {
                return message.reply('I do not have permission to manage this role.');
            }

            // Add or remove the role
            let response;
            if (action === 'add') {
                if (member.roles.cache.has(role.id)) {
                    return message.reply(`${user.tag} already has the ${role.name} role.`);
                }
                await member.roles.add(role);
                response = await message.reply(`Added the ${role.name} role to ${user.tag}.`);
                if (response) {
                    logger.info(`Role ${role.name} added to ${user.tag} by ${message.author.tag}`);
                }
            } else {
                if (!member.roles.cache.has(role.id)) {
                    return message.reply(`${user.tag} doesn't have the ${role.name} role.`);
                }
                await member.roles.remove(role);
                response = await message.reply(`Removed the ${role.name} role from ${user.tag}.`);
                if (response) {
                    logger.info(`Role ${role.name} removed from ${user.tag} by ${message.author.tag}`);
                }
            }
        } catch (error) {
            logger.error('Error in role command:', error);
            return message.reply('There was an error trying to manage roles.');
        }
    },
};