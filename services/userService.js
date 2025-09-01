const User = require('../models/User');

class UserService {
    async getUserByTelegramId(telegramId) {
        try {
            console.log(`🔍 [UserService] Looking up user by telegramId: ${telegramId}`);
            const user = await User.findByTelegramId(telegramId);
            console.log(`📊 [UserService] Result for telegramId ${telegramId}:`, user ? 'Found' : 'Not found');
            return user;
        } catch (error) {
            console.error('Error getting user by telegram ID:', error);
            throw error;
        }
    }

    async getUserByTelegramHandle(telegramHandle) {
        try {
            // Remove @ if present for consistency
            const cleanHandle = telegramHandle.startsWith('@') ? telegramHandle.substring(1) : telegramHandle;
            const searchHandle = `@${cleanHandle}`;
            
            console.log(`🔍 [UserService] Looking up user by telegramHandle: ${searchHandle}`);
            const user = await User.findByTelegramHandle(searchHandle);
            
            if (user) {
                console.log(`✅ [UserService] User found:`, {
                    _id: user._id,
                    xHandle: user.xHandle,
                    telegramHandle: user.telegramHandle,
                    hasKaitoYaps: user.hasKaitoYaps,
                    joinTime: user.joinTime
                });
            } else {
                console.log(`❌ [UserService] User not found for telegramHandle: ${searchHandle}`);
            }
            
            return user;
        } catch (error) {
            console.error('Error getting user by telegram handle:', error);
            throw error;
        }
    }

    async getUserByXHandle(xHandle) {
        try {
            console.log(`🔍 [UserService] Looking up user by xHandle: ${xHandle}`);
            const user = await User.findByXHandle(xHandle);
            console.log(`📊 [UserService] Result for xHandle ${xHandle}:`, user ? 'Found' : 'Not found');
            return user;
        } catch (error) {
            console.error('Error getting user by X handle:', error);
            throw error;
        }
    }

    async updateUser(userId, updateData) {
        try {
            console.log(`🔄 [UserService] Updating user ${userId} with data:`, updateData);
            const result = await User.findByIdAndUpdate(
                userId,
                { $set: updateData },
                { new: true, runValidators: true }
            );
            console.log(`✅ [UserService] User updated successfully`);
            return result;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    async isUserConnected(telegramHandle) {
        try {
            console.log(`🔍 [UserService] Checking if user is connected: @${telegramHandle}`);
            const user = await this.getUserByTelegramHandle(telegramHandle);
            if (!user) {
                console.log(`❌ [UserService] User not found, not connected`);
                return false;
            }
            
            // Check if user has an xHandle (which means they're connected)
            const isConnected = user.xHandle && user.xHandle.trim() !== '';
            console.log(`🔗 [UserService] User connection status: ${isConnected ? 'Connected' : 'Not Connected'}`);
            return isConnected;
        } catch (error) {
            console.error('Error checking if user is connected:', error);
            return false;
        }
    }

    async getAllUsers(limit = 50, skip = 0) {
        try {
            console.log(`📊 [UserService] Getting all users (limit: ${limit}, skip: ${skip})`);
            const users = await User.find({})
                .sort({ joinTime: -1 })
                .skip(skip)
                .limit(limit);
            console.log(`✅ [UserService] Found ${users.length} users`);
            return users;
        } catch (error) {
            console.error('Error getting all users:', error);
            throw error;
        }
    }

    async deleteUser(userId) {
        try {
            console.log(`🗑️ [UserService] Deleting user: ${userId}`);
            const result = await User.findByIdAndDelete(userId);
            console.log(`✅ [UserService] User deleted successfully`);
            return result;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }
}

module.exports = new UserService();
