const { EmbedBuilder } = require('discord.js');
const logger = require('../utils/logger');

const minecraftFacts = {
    general: [
        "Minecraft was first released in 2009 by Markus 'Notch' Persson.",
        "The game's original name was 'Cave Game'.",
        "A Minecraft day lasts exactly 20 minutes in real-time.",
        "Endermen were inspired by the Slenderman creepypasta.",
        "The Creeper was originally a failed pig model."
    ],
    blocks: [
        "Diamond ore only appears below layer 16.",
        "Obsidian takes 250 seconds to mine without a diamond pickaxe.",
        "Bedrock is the only truly indestructible block in survival mode.",
        "Netherrack was originally called 'Bloodstone'.",
        "Redstone was inspired by electrical engineering concepts."
    ],
    mobs: [
        "Sheep can regrow their wool by eating grass.",
        "Creepers are afraid of cats and ocelots.",
        "The Ender Dragon is female and her name is 'Jean'.",
        "Zombie Pigmen were renamed to 'Zombified Piglins' in 1.16.",
        "Pandas have different personalities based on their genes."
    ],
    history: [
        "The first version of Minecraft was developed in just six days.",
        "Microsoft bought Minecraft for $2.5 billion in 2014.",
        "The game has sold over 200 million copies worldwide.",
        "The first music disc added was 'Cat' by C418.",
        "The first hostile mob added was the Zombie."
    ]
};

module.exports = {
    name: 'mcinfo',
    description: 'Display interesting Minecraft facts',
    usage: '!mcinfo [category]',
    async execute(message, args) {
        try {
            const categories = Object.keys(minecraftFacts);
            const category = args[0]?.toLowerCase();

            // If no category specified or invalid category, show a random fact from any category
            if (!category || !categories.includes(category)) {
                const randomCategory = categories[Math.floor(Math.random() * categories.length)];
                const facts = minecraftFacts[randomCategory];
                const randomFact = facts[Math.floor(Math.random() * facts.length)];

                const embed = new EmbedBuilder()
                    .setColor('#45B53C')  // Minecraft green
                    .setTitle('⛏️ Random Minecraft Fact')
                    .setDescription(randomFact)
                    .setFooter({ text: `Category: ${randomCategory}` })
                    .addFields(
                        { name: 'Available Categories', value: categories.join(', ') }
                    );

                await message.reply({ embeds: [embed] });
                logger.info(`Minecraft fact displayed for ${message.author.tag} - Category: ${randomCategory}`);
                return;
            }

            // Show all facts from the specified category
            const facts = minecraftFacts[category];
            const embed = new EmbedBuilder()
                .setColor('#45B53C')
                .setTitle(`⛏️ Minecraft ${category.charAt(0).toUpperCase() + category.slice(1)} Facts`)
                .setDescription(facts.join('\n\n'))
                .setTimestamp();

            await message.reply({ embeds: [embed] });
            logger.info(`Minecraft facts displayed for ${message.author.tag} - Category: ${category}`);

        } catch (error) {
            logger.error('Error in mcinfo command:', error);
            return message.reply('There was an error fetching Minecraft facts.');
        }
    },
};
