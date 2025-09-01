const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    xHandle: {
        type: String,
        required: true,
        index: true
    },
    telegramHandle: {
        type: String,
        required: true,
        index: true
    },
    tweetId: {
        type: String,
        required: true,
        index: true
    },
    tweetUrl: {
        type: String,
        required: true,
        index: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: false, // Disable timestamps since we only want submittedAt
    collection: 'submissions' // Use original collection name
});

// Static method to find submissions by telegram handle (case-insensitive)
submissionSchema.statics.findByTelegramHandle = function(telegramHandle) {
    return this.find({ 
        telegramHandle: { $regex: new RegExp(`^${telegramHandle}$`, 'i') }
    }).sort({ submittedAt: -1 });
};

// Static method to find submission by ID
submissionSchema.statics.findById = function(submissionId) {
    return this.findOne({ _id: submissionId });
};

// Static method to check for duplicate submission (case-insensitive telegram handle)
submissionSchema.statics.findDuplicate = function(telegramHandle, tweetUrl) {
    return this.findOne({
        telegramHandle: { $regex: new RegExp(`^${telegramHandle}$`, 'i') },
        tweetUrl: tweetUrl
    });
};

// Static method to get all submissions with pagination
submissionSchema.statics.getAllSubmissions = function(limit = 50, skip = 0) {
    return this.find({})
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(limit);
};

module.exports = mongoose.model('Submission', submissionSchema);
