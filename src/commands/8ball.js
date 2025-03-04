const { EmbedBuilder } = require('discord.js');
const logger = require('../utils/logger');

const responses = [
    // Positive responses
    "It is certain.", "It is decidedly so.", "Without a doubt.", "Yes definitely.",
    "You may rely on it.", "As I see it, yes.", "Most likely.", "Outlook good.",
    // Neutral responses
    "Reply hazy, try again.", "Ask again later.", "Better not tell you now.",
    "Cannot predict now.", "Concentrate and ask again.",
    // Negative responses
    "Don't count on it.", "My reply is no.", "My sources say no.",
    "Outlook not so good.", "Very doubtful."
];

module.exports = {
    name: '8ball',
    description: 'Ask the Magic 8-Ball a question',
    usage: '!8ball <question>',
    async execute(message, args) {
        try {
            if (args.length === 0) {
                return message.reply('Please ask a question! Usage: !8ball <question>');
            }

            const question = args.join(' ');
            const response = responses[Math.floor(Math.random() * responses.length)];

            const embed = new EmbedBuilder()
                .setColor('#800080')  // Purple color
                .setTitle('🎱 Magic 8-Ball')
                .addFields(
                    { name: 'Question', value: question },
                    { name: 'Answer', value: response }
                )
                .setTimestamp();

            await message.reply({ embeds: [embed] });
            logger.info(`8-Ball command used by ${message.author.tag} - Q: "${question}" A: "${response}"`);

        } catch (error) {
            logger.error('Error in 8ball command:', error);
            return message.reply('There was an error shaking the Magic 8-Ball.');
        }
    },
};
