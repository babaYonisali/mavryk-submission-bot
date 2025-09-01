const Submission = require('../models/Submission');

class SubmissionService {
    async createSubmission(submissionData) {
        try {
            const submission = new Submission(submissionData);
            const result = await submission.save();
            return result;
        } catch (error) {
            console.error('Error creating submission:', error);
            throw error;
        }
    }

    async getSubmissionsByTelegramHandle(telegramHandle) {
        try {
            const submissions = await Submission.findByTelegramHandle(telegramHandle);
            return submissions;
        } catch (error) {
            console.error('Error getting submissions by telegram handle:', error);
            throw error;
        }
    }

    async getSubmissionById(submissionId) {
        try {
            const submission = await Submission.findById(submissionId);
            return submission;
        } catch (error) {
            console.error('Error getting submission by ID:', error);
            throw error;
        }
    }

    async checkDuplicateSubmission(telegramHandle, tweetUrl) {
        try {
            const existingSubmission = await Submission.findDuplicate(telegramHandle, tweetUrl);
            return existingSubmission;
        } catch (error) {
            console.error('Error checking duplicate submission:', error);
            throw error;
        }
    }

    async getAllSubmissions(limit = 50, skip = 0) {
        try {
            const submissions = await Submission.getAllSubmissions(limit, skip);
            return submissions;
        } catch (error) {
            console.error('Error getting all submissions:', error);
            throw error;
        }
    }

    async deleteSubmission(submissionId) {
        try {
            const result = await Submission.findByIdAndDelete(submissionId);
            return result;
        } catch (error) {
            console.error('Error deleting submission:', error);
            throw error;
        }
    }
}

module.exports = new SubmissionService();
