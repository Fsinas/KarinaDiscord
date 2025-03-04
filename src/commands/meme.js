const { EmbedBuilder } = require('discord.js');
const logger = require('../utils/logger');

// Using import() for node-fetch
let fetch;
(async () => {
    fetch = (await import('node-fetch')).default;
})();

// Rate limiting
const rateLimiter = new Map();
const RATE_LIMIT = 2000; // 2 seconds between requests

module.exports = {
    name: 'meme',
    description: 'Get a random meme from Reddit',
    usage: '!meme',
    async execute(message, args) {
        try {
            // Check rate limit
            const now = Date.now();
            const lastRequest = rateLimiter.get(message.author.id) || 0;
            if (now - lastRequest < RATE_LIMIT) {
                return message.reply('Please wait a few seconds before requesting another meme.');
            }
            rateLimiter.set(message.author.id, now);

            if (!fetch) {
                fetch = (await import('node-fetch')).default;
            }

            // List of subreddits to try
            const subreddits = ['memes', 'dankmemes', 'wholesomememes'];
            let success = false;
            let data;

            // Custom User-Agent with bot name and version
            const userAgent = 'DiscordBot:Karina:v1.0.0 (by /u/KarinaBot)';

            for (const subreddit of subreddits) {
                try {
                    const response = await fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=50`, {
                        headers: {
                            'User-Agent': userAgent,
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        logger.error(`Failed to fetch from r/${subreddit}: ${response.status} - ${errorText}`);
                        continue;
                    }

                    data = await response.json();
                    success = true;
                    break;
                } catch (error) {
                    logger.error(`Error fetching from r/${subreddit}:`, error.message);
                    continue;
                }
            }

            if (!success || !data) {
                return message.reply('Sorry, I could not fetch any memes at the moment. Please try again later.');
            }

            // Filter posts for appropriate content
            const posts = data.data.children.filter(post => 
                !post.data.over_18 && 
                !post.data.spoiler &&
                post.data.url && 
                post.data.url.match(/\.(jpg|jpeg|png|gif)$/i)
            );

            if (posts.length === 0) {
                return message.reply('Could not find a suitable meme. Please try again!');
            }

            const post = posts[Math.floor(Math.random() * posts.length)].data;

            const embed = new EmbedBuilder()
                .setColor('#FF4500')  // Reddit's orange color
                .setTitle(post.title)
                .setURL(`https://reddit.com${post.permalink}`)
                .setImage(post.url)
                .setFooter({ text: `👍 ${post.ups} | 💬 ${post.num_comments} | From r/${post.subreddit}` })
                .setTimestamp();

            await message.reply({ embeds: [embed] });
            logger.info(`Meme command used by ${message.author.tag} - Fetched from r/${post.subreddit}`);

        } catch (error) {
            logger.error('Error in meme command:', error);
            return message.reply('There was an error fetching the meme. Please try again later.');
        }
    },
};