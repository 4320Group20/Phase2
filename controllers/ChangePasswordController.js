import bcrypt from 'bcrypt';
import UserPassword from '../models/UserPassword.js'; // Your Mongoose model

class ChangePasswordController {

    /**
     * Changes the user's password after validation.
     */
    static async changePassword(userId, oldPassword, newPassword1, newPassword2) {
        if (newPassword1 !== newPassword2) {
            return { success: false, message: "New passwords do not match." };
        }

        const userRecord = await this.fetchUserPasswordFromDB(userId);

        if (!userRecord) {
            return { success: false, message: "User not found." };
        }

        const isMatch = await bcrypt.compare(oldPassword, userRecord.encryptedPassword);
        if (!isMatch) {
            return { success: false, message: "Old password is incorrect." };
        }

        const updateSuccess = await this.updatePasswordInDB(userId, newPassword1);
        if (!updateSuccess) {
            return { success: false, message: "Failed to update password." };
        }

        return { success: true, message: "Password changed successfully." };
    }

    static async fetchUserPasswordFromDB(userId) {
        return await UserPassword.findOne({ ID: userId });
    }

    static async updatePasswordInDB(userId, newPassword) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const result = await UserPassword.updateOne(
            { ID: userId },
            { encryptedPassword: hashedPassword }
        );

        return result.modifiedCount > 0;
    }
}

export default ChangePasswordController;
