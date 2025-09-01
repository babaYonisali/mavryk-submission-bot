const express = require('express');
const cors = require('cors');
const database = require('./config/database');
const telegramBot = require('./bot/telegramBot');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'Mavryk Submission Bot'
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Mavryk Submission Bot API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            status: '/api/status',
            submissions: '/api/submissions'
        }
    });
});

// Webhook endpoint for Telegram bot
app.post('/webhook', async (req, res) => {
    try {
        console.log('Received webhook request:', JSON.stringify(req.body, null, 2));
        
        // Handle the webhook update
        await telegramBot.handleWebhookUpdate(req.body);
        
        // Always respond with 200 OK to Telegram
        res.status(200).json({ status: 'OK' });
    } catch (error) {
        console.error('Error handling webhook:', error);
        // Still respond with 200 to avoid Telegram retrying
        res.status(200).json({ status: 'Error but OK' });
    }
});

// API Routes
app.get('/api/status', async (req, res) => {
    try {
        res.json({
            status: 'OK',
            bot: telegramBot.isInitialized ? 'Running' : 'Not initialized',
            database: 'Connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error in status endpoint:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Express error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully...');
    await telegramBot.stop();
    await database.disconnect();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully...');
    await telegramBot.stop();
    await database.disconnect();
    process.exit(0);
});

// Initialize and start server
async function startServer() {
    try {
        // Connect to database
        await database.connect();
        
        // Initialize Telegram bot
        await telegramBot.init();
        
        // Start Express server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📊 Health check: http://localhost:${PORT}/health`);
            console.log(`🤖 Telegram bot is running`);
        });
        
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Start the server
startServer();
