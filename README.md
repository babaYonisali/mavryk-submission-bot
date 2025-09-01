# 🤖 Mavryk Submission Bot

A Telegram bot for managing Mavryk tweet submissions with MongoDB integration and case-insensitive user handling.

## ✨ Features

- **Telegram Bot Integration** - Built with `node-telegram-bot-api`
- **MongoDB Database** - Mongoose ODM for data persistence
- **Case-Insensitive Search** - Handles telegram handles regardless of case
- **URL Validation** - Validates X/Twitter URLs before submission
- **Duplicate Prevention** - Prevents duplicate tweet submissions
- **User Status Checking** - Verifies user connection status
- **Comprehensive Logging** - Detailed console logging for debugging

## 🚀 Commands

- `/start` - Welcome message and setup instructions
- `/status` - Check your X account connection status
- `/SubmitMavryk <tweet_url>` - Submit a Mavryk tweet for review
- `/help` - Show help and usage instructions

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - Object Data Modeling
- **node-telegram-bot-api** - Telegram Bot API wrapper
- **dotenv** - Environment variable management

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- Telegram Bot Token
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd mavryk-submission-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Telegram Bot Configuration
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
   
   # MongoDB Configuration
   MONGODB_URI=your_mongodb_connection_string_here
   MONGODB_DB_NAME=mavryk_bot
   
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   ```

4. **Database Setup**
   - Ensure MongoDB is running
   - Create database and collections as needed
   - Users collection should have: `xHandle`, `telegramHandle`, `hasKaitoYaps`, `joinTime`, `xHandleReferral`

## 🚀 Running the Bot

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## 📁 Project Structure

```
mavryk-submission-bot/
├── bot/
│   └── telegramBot.js          # Main bot logic and command handlers
├── config/
│   └── database.js             # MongoDB connection configuration
├── models/
│   ├── User.js                 # User schema and methods
│   └── Submission.js           # Submission schema and methods
├── services/
│   ├── userService.js          # User business logic
│   └── submissionService.js    # Submission business logic
├── utils/
│   └── urlValidator.js         # URL validation utilities
├── server.js                   # Express server setup
├── package.json                # Dependencies and scripts
├── .env                        # Environment variables (not in git)
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `TELEGRAM_BOT_TOKEN` | Your Telegram bot token from @BotFather | ✅ |
| `MONGODB_URI` | MongoDB connection string | ✅ |
| `MONGODB_DB_NAME` | Database name | ✅ |
| `PORT` | Server port (default: 3000) | ❌ |
| `NODE_ENV` | Environment (development/production) | ❌ |

## 📊 Database Schema

### Users Collection
```javascript
{
  xHandle: String,           // X/Twitter handle
  hasKaitoYaps: Boolean,     // Kaito Yaps status
  joinTime: Date,            // User join date
  telegramHandle: String,    // Telegram username
  xHandleReferral: String    // Referral X handle
}
```

### Submissions Collection
```javascript
{
  xHandle: String,           // X handle of submitter
  telegramHandle: String,    // Telegram handle of submitter
  tweetId: String,           // Tweet ID
  tweetUrl: String,          // Full tweet URL
  submittedAt: Date          // Submission timestamp
}
```

## 🧪 Testing

Test the bot with these commands:
1. `/start` - Should show welcome message
2. `/status` - Should check user connection status
3. `/help` - Should show help information
4. `/SubmitMavryk <tweet_url>` - Should process submission

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Heroku** - Use Procfile and set environment variables
- **Railway** - Connect GitHub and set environment variables
- **DigitalOcean** - Deploy to Droplet with PM2

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:
1. Check the console logs for error messages
2. Verify your environment variables are set correctly
3. Ensure MongoDB is running and accessible
4. Check that your Telegram bot token is valid

## 🔄 Updates

To update the bot:
```bash
git pull origin main
npm install
npm start
```

---

**Built with ❤️ for the Mavryk community**
