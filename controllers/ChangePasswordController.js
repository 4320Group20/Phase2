import bcrypt from 'bcrypt';
import UserPassword from '../models/UserPassword.js'; // Your Mongoose model

/**
 * ChangePasswordController Class
 * 
 * Handles the logic for changing a user's password. It validates the old password, checks if the
 * new passwords match, and updates the password in the database.
 * 
 * Methods:
 * - `changePassword`: Validates the old password, checks if the new passwords match, and updates the user's password in the database.
 * - `fetchUserPasswordFromDB`: Retrieves the user's password record from the database.
 * - `updatePasswordInDB`: Updates the user's password in the database with the new hashed password.
 * 
 * Returns appropriate success or failure messages based on validation and database operations.
 */

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
