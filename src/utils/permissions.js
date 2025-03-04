const logger = require('./logger');

function isAdmin(member) {
    return member.permissions.has('Administrator');
}

function checkPermissions(message, requiredPermissions) {
    try {
        // Check if user has admin permission
        if (!isAdmin(message.member)) {
            message.reply('You do not have permission to use this command.');
            return false;
        }
        
        // Check if bot has required permissions
        if (!message.guild.members.me.permissions.has(requiredPermissions)) {
            message.reply('I do not have the required permissions to perform this action.');
            return false;
        }
        
        return true;
    } catch (error) {
        logger.error('Error checking permissions:', error);
        message.reply('There was an error checking permissions.');
        return false;
    }
}

module.exports = {
    isAdmin,
    checkPermissions
};
