const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const logger = require('../utils/logger');

const triviaQuestions = {
    gaming: [
        {
            question: "Which game features a character named 'Master Chief'?",
            options: ["Halo", "Call of Duty", "Destiny", "Doom"],
            correct: 0
        },
        {
            question: "What is the best-selling video game of all time?",
            options: ["Tetris", "Minecraft", "GTA V", "Wii Sports"],
            correct: 1
        }
    ],
    minecraft: [
        {
            question: "How many blocks of obsidian are needed for a Nether portal?",
            options: ["8", "10", "12", "14"],
            correct: 2
        },
        {
            question: "What mob was accidentally created from a pig model?",
            options: ["Zombie", "Skeleton", "Creeper", "Spider"],
            correct: 2
        }
    ],
    science: [
        {
            question: "What is the closest planet to the Sun?",
            options: ["Venus", "Mercury", "Mars", "Earth"],
            correct: 1
        },
        {
            question: "What is the hardest natural substance on Earth?",
            options: ["Gold", "Iron", "Diamond", "Platinum"],
            correct: 2
        }
    ]
};

module.exports = {
    name: 'trivia',
    description: 'Start a trivia game',
    usage: '!trivia [category]',
    async execute(message, args) {
        try {
            const categories = Object.keys(triviaQuestions);
            const category = args[0]?.toLowerCase();

            if (!category || !categories.includes(category)) {
                return message.reply(`Please specify a valid category: ${categories.join(', ')}`);
            }

            const questions = triviaQuestions[category];
            const questionIndex = Math.floor(Math.random() * questions.length);
            const question = questions[questionIndex];

            // Create buttons for options
            const buttons = question.options.map((option, index) => 
                new ButtonBuilder()
                    .setCustomId(`option_${index}`)
                    .setLabel(option)
                    .setStyle(ButtonStyle.Primary)
            );

            const row = new ActionRowBuilder().addComponents(buttons);

            const embed = new EmbedBuilder()
                .setColor('#FFD700')
                .setTitle('🎯 Trivia Time!')
                .setDescription(question.question)
                .addFields(
                    { name: 'Category', value: category },
                    { name: 'Time', value: '30 seconds' }
                )
                .setTimestamp();

            const trivia = await message.reply({
                embeds: [embed],
                components: [row]
            });

            // Create collector for button interactions
            const collector = trivia.createMessageComponentCollector({
                componentType: ComponentType.Button,
                time: 30000 // 30 seconds
            });

            collector.on('collect', async interaction => {
                if (interaction.user.id !== message.author.id) {
                    await interaction.reply({
                        content: 'This trivia question is not for you!',
                        ephemeral: true
                    });
                    return;
                }

                const selectedOption = parseInt(interaction.customId.split('_')[1]);
                const isCorrect = selectedOption === question.correct;

                // Disable all buttons
                row.components.forEach(button => button.setDisabled(true));
                row.components[selectedOption].setStyle(isCorrect ? ButtonStyle.Success : ButtonStyle.Danger);
                if (!isCorrect) {
                    row.components[question.correct].setStyle(ButtonStyle.Success);
                }

                // Update embed with result
                embed.setDescription(`${question.question}\n\n${isCorrect ? '✅ Correct!' : '❌ Wrong!'} The answer was: ${question.options[question.correct]}`);

                await interaction.update({
                    embeds: [embed],
                    components: [row]
                });

                collector.stop();
                logger.info(`Trivia answered by ${message.author.tag} - Category: ${category}, Result: ${isCorrect ? 'Correct' : 'Incorrect'}`);
            });

            collector.on('end', (collected, reason) => {
                if (reason === 'time') {
                    row.components.forEach(button => button.setDisabled(true));
                    row.components[question.correct].setStyle(ButtonStyle.Success);
                    embed.setDescription(`${question.question}\n\n⏰ Time's up! The correct answer was: ${question.options[question.correct]}`);
                    trivia.edit({
                        embeds: [embed],
                        components: [row]
                    });
                    logger.info(`Trivia timed out for ${message.author.tag} - Category: ${category}`);
                }
            });

        } catch (error) {
            logger.error('Error in trivia command:', error);
            return message.reply('There was an error starting the trivia game.');
        }
    },
};
