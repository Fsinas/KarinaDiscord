const { checkPermissions } = require('../../utils/permissions');
const logger = require('../../utils/logger');

module.exports = {
    name: 'clear',
    description: 'Clear a specified number of messages (Admin only, max 100)',
    async execute(message, client, args) {
        try {
            // Check if user has admin permissions
            if (!checkPermissions(message, ['ManageMessages'])) {
                logger.warn(`User ${message.author.tag} attempted to use clear command without permissions`);
                return;
            }

            const amount = parseInt(args[0]);
            if (isNaN(amount)) {
                return message.reply('Please provide a valid number of messages to clear.')
                    .then(reply => setTimeout(() => reply.delete().catch(() => {}), 5000));
            }

            if (amount <= 0 || amount > 100) {
                return message.reply('Please provide a number between 1 and 100.')
                    .then(reply => setTimeout(() => reply.delete().catch(() => {}), 5000));
            }

            // Delete the command message first
            await message.delete().catch(() => {
                logger.warn(`Failed to delete command message in clear command`);
            });

            // Fetch and delete messages
            const messages = await message.channel.messages.fetch({ limit: amount });
            const deletable = messages.filter(msg => !msg.pinned && Date.now() - msg.createdTimestamp < 1209600000);

            if (deletable.size === 0) {
                return message.channel.send('No messages found that can be deleted (messages must be under 14 days old).')
                    .then(reply => setTimeout(() => reply.delete().catch(() => {}), 5000));
            }

            const deleted = await message.channel.bulkDelete(deletable, true)
                .catch(error => {
                    logger.error('Error bulk deleting messages:', error);
                    throw new Error('Failed to delete messages. Messages older than 14 days cannot be bulk deleted.');
                });

            // Send confirmation message that auto-deletes
            const confirmMsg = await message.channel.send(
                `Successfully cleared ${deleted.size} message${deleted.size === 1 ? '' : 's'}.`
            );

            setTimeout(() => confirmMsg.delete().catch(() => {
                logger.warn('Could not delete confirmation message');
            }), 5000);

            logger.info(`${message.author.tag} cleared ${deleted.size} messages in #${message.channel.name}`);

        } catch (error) {
            logger.error('Error in clear command:', error);
            const errorMsg = await message.channel.send(
                error.message || 'There was an error trying to clear messages.'
            );
            setTimeout(() => errorMsg.delete().catch(() => {}), 5000);
        }
    }
};