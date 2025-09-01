const TelegramBot = require('node-telegram-bot-api');
const userService = require('../services/userService');
const submissionService = require('../services/submissionService');
const UrlValidator = require('../utils/urlValidator');
require('dotenv').config();

class TelegramBotHandler {
    constructor() {
        this.bot = null;
        this.isInitialized = false;
    }

    async init() {
        try {
            // Create bot instance
            this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
            
            // Set up command handlers
            this.setupCommandHandlers();
            
            // Set up error handling
            this.setupErrorHandling();
            
            this.isInitialized = true;
            console.log('Telegram bot initialized successfully');
        } catch (error) {
            console.error('Error initializing Telegram bot:', error);
            throw error;
        }
    }

    setupCommandHandlers() {
        // Handle /start command
        this.bot.onText(/^\/start$/, async (msg) => {
            try {
                this.logUserMessage(msg, '/start');
                const chatId = msg.chat.id;
                const welcomeMessage = `🤖 Welcome to the Mavryk Submission Bot!

Available commands:
• /status - Check your connection status
• /SubmitMavryk <tweet_url> - Submit a Mavryk tweet

To get started, you need to connect your X account first.
Visit: https://community.wengro.com`;
                
                await this.bot.sendMessage(chatId, welcomeMessage);
            } catch (error) {
                console.error('Error handling /start command:', error);
            }
        });

        // Handle /status command
        this.bot.onText(/^\/status$/, async (msg) => {
            try {
                this.logUserMessage(msg, '/status');
                await this.handleStatusCommand(msg);
            } catch (error) {
                console.error('Error handling /status command:', error);
                await this.sendErrorMessage(msg.chat.id, 'An error occurred while checking your status.');
            }
        });

        // Handle /SubmitMavryk command
        this.bot.onText(/^\/SubmitMavryk (.+)$/, async (msg, match) => {
            try {
                this.logUserMessage(msg, `/SubmitMavryk ${match[1]}`);
                const tweetUrl = match[1];
                await this.handleSubmitMavrykCommand(msg, tweetUrl);
            } catch (error) {
                console.error('Error handling /SubmitMavryk command:', error);
                await this.sendErrorMessage(msg.chat.id, 'An error occurred while processing your submission.');
            }
        });

        // Handle /help command
        this.bot.onText(/^\/help$/, async (msg) => {
            try {
                this.logUserMessage(msg, '/help');
                const chatId = msg.chat.id;
                const helpMessage = `📋 Mavryk Submission Bot Help

Commands:
• /status - Check if your X account is connected
• /SubmitMavryk <tweet_url> - Submit a Mavryk tweet for review
• /help - Show this help message

How to use:
1. First, connect your X account at: https://community.wengro.com
2. Use /status to verify your connection
3. Submit tweets using: /SubmitMavryk https://x.com/username/status/123456789

Example:
/SubmitMavryk https://x.com/mavryk/status/1234567890123456789`;
                
                await this.bot.sendMessage(chatId, helpMessage);
            } catch (error) {
                console.error('Error handling /help command:', error);
            }
        });

        // Handle any other message - ignore non-command messages
        this.bot.on('message', async (msg) => {
            // Only process text messages that start with /
            if (msg.text && msg.text.startsWith('/')) {
                // This is a command but not recognized by any handler
                console.log(`⚠️ Unrecognized command: ${msg.text}`);
                this.logUserMessage(msg, 'Unrecognized command');
                const chatId = msg.chat.id;
            }
            // For all other messages (URLs, text, etc.) - do nothing (ignore them)
        });
    }

    logUserMessage(msg, command) {
        const user = msg.from;
        const chat = msg.chat;
        
        console.log('\n=== USER MESSAGE RECEIVED ===');
        console.log(`📅 Time: ${new Date().toISOString()}`);
        console.log(`💬 Command: ${command}`);
        console.log(`📝 Full Message: ${msg.text}`);
        console.log('\n👤 USER INFO:');
        console.log(`   ID: ${user.id}`);
        console.log(`   Username: @${user.username || 'N/A'}`);
        console.log(`   First Name: ${user.first_name || 'N/A'}`);
        console.log(`   Last Name: ${user.last_name || 'N/A'}`);
        console.log(`   Language: ${user.language_code || 'N/A'}`);
        console.log('\n💬 CHAT INFO:');
        console.log(`   Chat ID: ${chat.id}`);
        console.log(`   Chat Type: ${chat.type}`);
        console.log(`   Chat Title: ${chat.title || 'N/A'}`);
        console.log('================================\n');
    }

    async handleStatusCommand(msg) {
        const chatId = msg.chat.id;
        const telegramHandle = msg.from.username ? msg.from.username.toLowerCase() : null;

        if (!telegramHandle) {
            console.log(`❌ User has no username`);
            await this.bot.sendMessage(chatId, 
                '❌ You need to have a Telegram username to use this bot. Please set a username in your Telegram settings and try again.'
            );
            return;
        }

        console.log(`🔍 Checking status for user: @${telegramHandle} (normalized to lowercase)`);

        try {
            // Check if user exists in database by telegram handle (case-insensitive search)
            console.log(`📊 Querying database for telegramHandle: @${telegramHandle}`);
            const user = await userService.getUserByTelegramHandle(telegramHandle);
            
            if (!user) {
                console.log(`❌ User not found in database: @${telegramHandle}`);
                // User doesn't exist in database - they need to sign up first
                const statusMessage = `❌ Status: Not Found

You are not registered in our system yet.

To get started, please visit:
🔗 https://community.wengro.com

Sign up there first, then come back to use the bot.`;
                await this.bot.sendMessage(chatId, statusMessage);
                return;
            }

            console.log(`✅ User found in database:`, {
                _id: user._id,
                xHandle: user.xHandle,
                telegramHandle: user.telegramHandle,
                hasKaitoYaps: user.hasKaitoYaps,
                joinTime: user.joinTime
            });

            // Check if user has an xHandle (which means they're connected)
            const isConnected = user.xHandle && user.xHandle.trim() !== '';
            console.log(`🔗 User connection status: ${isConnected ? 'Connected' : 'Not Connected'}`);
            
            if (isConnected) {
                const statusMessage = `✅ Status: Connected

Your X account is connected and ready for submissions!
• Telegram: @${telegramHandle}
• X Handle: @${user.xHandle}

You can now submit tweets using:
/SubmitMavryk <tweet_url>`;
                await this.bot.sendMessage(chatId, statusMessage);
            } else {
                const statusMessage = `❌ Status: Not Connected

Your X account is not connected yet.

To connect your account, please visit:
🔗 https://community.wengro.com

Once connected, you'll be able to submit Mavryk tweets.`;
                await this.bot.sendMessage(chatId, statusMessage);
            }
        } catch (error) {
            console.error('Error in handleStatusCommand:', error);
            await this.sendErrorMessage(chatId, 'An error occurred while checking your status.');
        }
    }

    async handleSubmitMavrykCommand(msg, tweetUrl) {
        const chatId = msg.chat.id;
        const telegramHandle = msg.from.username ? msg.from.username.toLowerCase() : null;

        if (!telegramHandle) {
            console.log(`❌ User has no username`);
            await this.bot.sendMessage(chatId, 
                '❌ You need to have a Telegram username to use this bot. Please set a username in your Telegram settings and try again.'
            );
            return;
        }

        console.log(`📤 Processing submission for user: @${telegramHandle} (normalized to lowercase)`);
        console.log(`🔗 Tweet URL: ${tweetUrl}`);

        try {
            // Validate URL
            if (!UrlValidator.isValidXUrl(tweetUrl)) {
                console.log(`❌ Invalid URL format: ${tweetUrl}`);
                await this.bot.sendMessage(chatId, 
                    '❌ Invalid tweet URL. Please provide a valid X/Twitter URL.\n\nExample: https://x.com/username/status/1234567890123456789'
                );
                return;
            }

            console.log(`✅ URL validation passed: ${tweetUrl}`);

            // Check if user exists and has xHandle
            console.log(`📊 Querying database for telegramHandle: @${telegramHandle}`);
            const user = await userService.getUserByTelegramHandle(telegramHandle);
            
            if (!user) {
                console.log(`❌ User not found in database: @${telegramHandle}`);
                const errorMessage = `❌ User Not Found

You are not registered in our system yet.

To get started, please visit:
🔗 https://community.wengro.com

Sign up there first, then come back to submit tweets.`;
                await this.bot.sendMessage(chatId, errorMessage);
                return;
            }

            console.log(`✅ User found in database:`, {
                _id: user._id,
                xHandle: user.xHandle,
                telegramHandle: user.telegramHandle
            });

            if (!user.xHandle || user.xHandle.trim() === '') {
                console.log(`❌ User has no X handle: @${telegramHandle}`);
                const errorMessage = `❌ X Account Not Connected

Your X account is not connected yet.

Please visit: 🔗 https://community.wengro.com

Connect your X account first, then try submitting again.`;
                await this.bot.sendMessage(chatId, errorMessage);
                return;
            }

            // Check for duplicate submission
            const normalizedUrl = UrlValidator.normalizeXUrl(tweetUrl);
            console.log(`🔍 Checking for duplicate submission: ${normalizedUrl}`);
            const existingSubmission = await submissionService.checkDuplicateSubmission(telegramHandle, normalizedUrl);
            
            if (existingSubmission) {
                console.log(`❌ Duplicate submission found for user: @${telegramHandle}`);
                await this.bot.sendMessage(chatId, 
                    '❌ This tweet has already been submitted. Please submit a different tweet.'
                );
                return;
            }

            console.log(`✅ No duplicate submission found, creating new submission`);

            // Create submission with simplified data
            const submissionData = {
                xHandle: user.xHandle,
                telegramHandle: telegramHandle,
                tweetUrl: normalizedUrl,
                tweetId: UrlValidator.extractTweetId(normalizedUrl),
                submittedAt: new Date()
            };

            console.log(`💾 Creating submission with data:`, submissionData);
            await submissionService.createSubmission(submissionData);
            console.log(`✅ Submission created successfully`);

            // Send success message
            const successMessage = `✅ Submission Successful!

Your Mavryk tweet has been submitted for review.

Details:
• Tweet URL: ${normalizedUrl}
• Your X Handle: @${user.xHandle}
• Submitted: ${new Date().toLocaleString()}

We'll review your submission and get back to you soon!`;
            await this.bot.sendMessage(chatId, successMessage);

        } catch (error) {
            console.error('Error in handleSubmitMavrykCommand:', error);
            await this.sendErrorMessage(chatId, 'An error occurred while processing your submission.');
        }
    }

    async sendErrorMessage(chatId, message) {
        try {
            await this.bot.sendMessage(chatId, `❌ ${message}`);
        } catch (error) {
            console.error('Error sending error message:', error);
        }
    }

    setupErrorHandling() {
        this.bot.on('error', (error) => {
            console.error('Telegram bot error:', error);
        });

        this.bot.on('polling_error', (error) => {
            console.error('Telegram bot polling error:', error);
        });
    }

    async stop() {
        if (this.bot) {
            await this.bot.stopPolling();
            console.log('Telegram bot stopped');
        }
    }
}

module.exports = new TelegramBotHandler();
