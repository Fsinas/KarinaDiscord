# Karina Discord Bot

[![Discord.js](https://img.shields.io/badge/discord.js-v14-blue.svg)](https://discord.js.org)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-16.x-green.svg)](https://nodejs.org)

<img src="generated-icon.png" align="right" width="200" height="200">

Karina is a feature-rich Discord bot designed to make server management effortless and engaging. Built with modern Discord.js, it combines powerful moderation tools with fun community features, helping you create a safe and active server environment.

### ✨ Why Choose Karina?

- 🛡️ **Advanced Moderation Suite**: Comprehensive tools for managing users, messages, and server activity
- 🎮 **Interactive Commands**: Keep your community engaged with memes, Minecraft facts, and user rankings
- 🔒 **Smart Protection**: Built-in cooldowns and permission checks to prevent abuse
- 📊 **Detailed Logging**: Track all important server events and user activities
- ⚡ **High Performance**: Optimized code for quick response times and reliability
- 🎯 **Easy to Use**: Intuitive commands and clear documentation for all skill levels

### Quick Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/karina-discord-bot
cd karina-discord-bot

# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Start the bot
node src/index.js
```

## Features

### Moderation
- Advanced user management
- Automated moderation tools
- Customizable auto-mod rules
- Detailed logging system

### Server Management
- Role management
- Welcome messages
- Server statistics
- Custom commands

### Entertainment
- Reddit meme integration
- Minecraft server status
- User rankings
- Trivia games

## Command List

### Admin Commands
| Command | Description |
|---------|-------------|
| !ban | Ban a user |
| !kick | Kick a user |
| !mute | Temporarily mute a user |
| !clear | Bulk delete messages |
| `/ban` - Ban a user from the server
| `/kick` - Remove a user from the server
| `/mute` - Temporarily mute a user
| `/clear` - Bulk delete messages
| `/warn` - Issue a warning to a user
| `/timeout` - Temporarily restrict user access

### General Commands
| Command | Description |
|---------|-------------|
| !help | Show command list |
| !rank | Show user rank |
| !meme | Get random memes |
| !mcinfo | Show Minecraft info |
| `/welcome` - Configure welcome messages and channels
| `/logging` - Set up server action logging
| `/role` - Manage user roles
| `/setuproles` - Configure role management system
| `/meme` - Get random memes from Reddit
| `/mcinfo` - Display Minecraft facts
| `/userinfo` - Show user information
| `/serverinfo` - Display server statistics
| `/rank` - Check user XP and rank
| `/ping` - Check bot's response time
| `/help` - Display available commands


## Requirements

- Node.js 16.x or higher
- Discord.js v14
- A Discord Bot token
- Discord server with administrator permissions

## Development

Want to contribute? Great! Please check our [Contributing Guidelines](CONTRIBUTING.md) first.

### Development Setup

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Test your changes
5. Submit a pull request

### Running Tests

```bash
npm test
```
## Credits
Karina is built using:
- [Discord.js](https://discord.js.org)
- [Node.js](https://nodejs.org)
- Various NPM packages (see package.json)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Security

For security issues, please email security@yourdomain.com instead of using the issue tracker.

## FAQ

**Q: How do I get a Discord Bot token?**
A: Visit the [Discord Developer Portal](https://discord.com/developers/applications), create a new application, and navigate to the Bot section.

**Q: What permissions does the bot need?**
A: The bot requires Administrator permissions for full functionality. See our [Permissions Guide](docs/permissions.md) for a detailed breakdown.



---

Made with ❤️ by the Fsinas Development
