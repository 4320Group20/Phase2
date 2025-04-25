import bcrypt from 'bcrypt';
import UserPassword from '../models/UserPassword.js'; // Your Mongoose model

class ChangePasswordController {

    /**
     * Changes the user's password after validation.
     */
    static changePassword(userId, oldPassword, newPassword1, newPassword2) {
        if (newPassword1 !== newPassword2) {
            return { success: false, message: "New passwords do not match." };
        }

        const userRecord = this.fetchUserPasswordFromDB(userId);

        if (!userRecord) {
            return { success: false, message: "User not found." };
        }

        const isMatch = bcrypt.compare(oldPassword, userRecord.encryptedPassword);
        if (!isMatch) {
            return { success: false, message: "Old password is incorrect." };
        }

        const updateSuccess = this.updatePasswordInDB(userId, newPassword1);
        if (!updateSuccess) {
            return { success: false, message: "Failed to update password." };
        }

        return { success: true, message: "Password changed successfully." };
    }

    static fetchUserPasswordFromDB(userId) {
        return UserPassword.findOne({ ID: userId });
    }

    static updatePasswordInDB(userId, newPassword) {
        const salt = bcrypt.genSalt(10);
        const hashedPassword = bcrypt.hash(newPassword, salt);

        const result = UserPassword.updateOne(
            { ID: userId },
            { encryptedPassword: hashedPassword }
        );

        return result.modifiedCount > 0;
    }
}

export default ChangePasswordController;
