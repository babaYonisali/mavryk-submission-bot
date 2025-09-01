const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    xHandle: {
        type: String,
        required: true,
        index: true
    },
    hasKaitoYaps: {
        type: Boolean,
        default: false
    },
    joinTime: {
        type: Date,
        default: Date.now
    },
    telegramHandle: {
        type: String,
        required: true,
        index: true
    },
    xHandleReferral: {
        type: String,
        default: null
    }
}, {
    timestamps: false, // Disable timestamps since they're not in your existing schema
    collection: 'users'
});

// Static method to find user by telegram handle (case-insensitive)
userSchema.statics.findByTelegramHandle = function(telegramHandle) {
    return this.findOne({ 
        telegramHandle: { $regex: new RegExp(`^${telegramHandle}$`, 'i') }
    });
};

// Static method to find user by X handle (case-insensitive)
userSchema.statics.findByXHandle = function(xHandle) {
    return this.findOne({ 
        xHandle: { $regex: new RegExp(`^${xHandle}$`, 'i') }
    });
};

// Instance method to check if user is connected (has xHandle)
userSchema.methods.isUserConnected = function() {
    return this.xHandle && this.xHandle.trim() !== '';
};

module.exports = mongoose.model('User', userSchema);
