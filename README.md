# 🤖 Karina - Discord Moderation Bot

A powerful Discord bot focused on server moderation and management, providing robust administrative tools and enhanced user control.

## ✨ Features

- **Advanced Command System**: Easy-to-use moderation commands
- **Server Management**: Efficient tools for server administration
- **Permission Control**: Secure permission-based command access
- **Real-time Monitoring**: Active server event tracking
- **Error Prevention**: Built-in cooldowns and error handling

## 🛠️ Commands

### Moderation
- `/ban` - Ban a user from the server
- `/kick` - Remove a user from the server
- `/mute` - Temporarily mute a user
- `/clear` - Bulk delete messages

### Utility
- `/help` - Display available commands
- `/ping` - Check bot's response time

## 🚀 Setup

1. Clone this repository
2. Create a `.env` file based on `.env.example`
3. Add your Discord bot token to `.env`
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start the bot:
   ```bash
   node src/index.js
   ```

## 📋 Requirements

- Node.js 16.x or higher
- Discord.js
- dotenv

## 🔐 Environment Variables

Create a `.env` file in the root directory with:

```env
DISCORD_TOKEN=your_bot_token_here
```

## 📝 License

MIT License - feel free to use and modify as needed!
