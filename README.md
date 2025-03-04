# 🤖 Karina - Discord Moderation Bot

A powerful Discord bot focused on server moderation and management, providing robust administrative tools and enhanced user control.

## ✨ Features

- **Advanced Command System**: Easy-to-use moderation commands with cooldowns and permission checks
- **Server Management**: Efficient tools for server administration and user management
- **Permission Control**: Secure permission-based command access with role hierarchy
- **Real-time Monitoring**: Active server event tracking and logging
- **Error Prevention**: Built-in cooldowns and comprehensive error handling
- **Fun Commands**: Includes meme fetching, Minecraft facts, and more

## 🛠️ Commands

### Moderation
- `/ban` - Ban a user from the server
- `/kick` - Remove a user from the server
- `/mute` - Temporarily mute a user
- `/clear` - Bulk delete messages
- `/warn` - Issue a warning to a user
- `/timeout` - Temporarily restrict user access

### Server Management
- `/welcome` - Configure welcome messages and channels
- `/logging` - Set up server action logging
- `/role` - Manage user roles
- `/setuproles` - Configure role management system

### Fun & Utility
- `/meme` - Get random memes from Reddit
- `/mcinfo` - Display Minecraft facts
- `/userinfo` - Show user information
- `/serverinfo` - Display server statistics
- `/rank` - Check user XP and rank
- `/ping` - Check bot's response time
- `/help` - Display available commands

## 🚀 GitHub Setup Instructions

### Option 1: Direct GitHub Upload

1. Create a new repository on GitHub
2. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/karina-discord-bot.git
   cd karina-discord-bot
   ```

### Option 2: Create Archive

1. Install dependencies and create the archive:
   ```bash
   npm install
   node scripts/create-archive.js
   ```
   This will create a `discord-bot.zip` file in the `dist` directory containing all necessary files while excluding:
   - Dependencies (node_modules)
   - Environment files (.env)
   - Temporary files and logs
   - Development environment files
   - Version control files

2. The generated archive can be:
   - Uploaded directly to GitHub as a release
   - Extracted and used as the base for a new repository
   - Shared with others who want to use your bot

## 📦 Optional: Add Archive Script

If you want to make archive creation easier, add this to your `package.json` scripts:
```json
{
  "scripts": {
    "create-archive": "node scripts/create-archive.js"
  }
}
```

Then you can create the archive with:
```bash
npm run create-archive
```

The archive includes all essential files:
```
src/                    # Source code directory
├── commands/          # Bot commands
├── events/           # Event handlers
├── handlers/         # Command handlers
├── utils/           # Utility functions
└── index.js         # Main bot file
.gitignore           # Git ignore rules
.gitattributes       # Git attributes
.eslintrc.json       # ESLint configuration
.env.example         # Environment variables template
LICENSE             # MIT License
README.md           # This file
CONTRIBUTING.md     # Contribution guidelines
package.json        # Project dependencies
```

## 📋 Requirements

- Node.js 16.x or higher
- Discord.js v14
- Environment variables configured in `.env`

## 🔐 Environment Variables

Create a `.env` file in the root directory with:

```env
# Required
DISCORD_TOKEN=your_discord_bot_token_here

# Optional Configuration
PREFIX=!
BOT_STATUS=online
ACTIVITY_TYPE=PLAYING
ACTIVITY_NAME=with commands
```

## 🚫 Files to Exclude

When uploading to GitHub, make sure to exclude:
- `node_modules/` directory
- `.env` file (contains sensitive data)
- `temp/` directory
- Any log files (*.log)
- `package-lock.json`
- IDE-specific files (.vscode/, .idea/)
- `replit.nix` and `.replit` files
- Any other Replit-specific configuration files

## 📦 Project Structure
```
karina-discord-bot/
├── src/
│   ├── commands/        # Bot commands
│   │   ├── admin/      # Admin-only commands
│   │   └── ...         # Regular commands
│   ├── events/         # Discord event handlers
│   ├── handlers/       # Command handlers
│   └── utils/          # Utility functions
├── .github/            # GitHub templates
│   └── ISSUE_TEMPLATE/ # Issue templates
├── docs/              # Documentation (optional)
└── [config files]     # Various configuration files
```

## 🔄 Setup Instructions

1. Clone the repository or extract the zip file
2. Create and configure your `.env` file:
   ```bash
   cp .env.example .env
   # Edit .env with your Discord bot token and settings
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the bot:
   ```bash
   node src/index.js
   ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contribution guidelines.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
