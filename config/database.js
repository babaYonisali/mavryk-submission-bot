const mongoose = require('mongoose');
require('dotenv').config();

class Database {
    constructor() {
        this.isConnected = false;
    }

    async connect() {
        try {
            await mongoose.connect(process.env.MONGODB_URI, {
                dbName: process.env.MONGODB_DB_NAME,
            });

            this.isConnected = true;
            console.log('Connected to MongoDB successfully with Mongoose');
            
            // Set up connection event handlers
            this.setupEventHandlers();
            
            return mongoose.connection;
        } catch (error) {
            console.error('MongoDB connection error:', error);
            throw error;
        }
    }

    setupEventHandlers() {
        mongoose.connection.on('error', (error) => {
            console.error('MongoDB connection error:', error);
            this.isConnected = false;
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
            this.isConnected = false;
        });

        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnected');
            this.isConnected = true;
        });
    }

    async disconnect() {
        if (this.isConnected) {
            await mongoose.disconnect();
            console.log('Disconnected from MongoDB');
            this.isConnected = false;
        }
    }

    getConnection() {
        if (!this.isConnected) {
            throw new Error('Database not connected');
        }
        return mongoose.connection;
    }

    isConnected() {
        return this.isConnected;
    }
}

module.exports = new Database();
