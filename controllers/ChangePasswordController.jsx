// src/controllers/ChangePasswordController.js

class ChangePasswordController {

    /**
     * Accepts and validates the old password and two new password entries.
     * Updates the password if all validations pass.
     * 
     * @param {string} userId - ID of the user trying to change their password.
     * @param {string} oldPassword - The user's current password.
     * @param {string} newPassword1 - The new password entered by the user.
     * @param {string} newPassword2 - The confirmation of the new password.
     * @returns {Promise<{ success: boolean, message: string }>}
     */


    static async changePassword(userId, oldPassword, newPassword1, newPassword2) {
        // Check if the new passwords match
        if (newPassword1 !== newPassword2) {
            return { success: false, message: "New passwords do not match." };
        }

        // Fetch user data from the database
        const userRecord = await this.fetchUserPasswordFromDB(userId);

        if (!userRecord) {
            return { success: false, message: "User not found." };
        }

        // Check if the old password matches
        if (oldPassword !== userRecord.password) {
            return { success: false, message: "Old password is incorrect." };
        }

        // Update the password in the database
        const updateSuccess = await this.updatePasswordInDB(userId, newPassword1);

        if (!updateSuccess) {
            return { success: false, message: "Failed to update password." };
        }

        return { success: true, message: "Password changed successfully." };
    }

    // --- MOCK METHODS BELOW ---
    // UPDATE WITH RELATION TO DATABASE IN FUTURE

    static async fetchUserPasswordFromDB(userId) {
        // Simulate fetching user password record from DB
        return {
            password: "oldPassword123" // Replace with actual DB call
        };
    }

    static async updatePasswordInDB(userId, newPassword) {
        // Simulate DB update
        console.log(`Password for user ${userId} updated to: ${newPassword}`);
        return true;
    }
}

export default ChangePasswordController;
