

class UserAuthenticationController {

    /**
     * Validates the iFINANCE username and corresponding password.
     * Determines if the user is allowed to access the iFINANCE services.
     * 
     * @param {string} username - The username input from the login form.
     * @param {string} password - The password input from the login form.
     * @returns {Promise<{ success: boolean, message: string, userId?: string }>}
     */

    static async authenticate(username, password) {

        // Fetch user from the database by username
        const userRecord = await this.fetchUserByUsername(username);

        // Check if user exists
        if (!userRecord) {
            return { success: false, message: "User not found." };
        }

        // Validate password
        if (userRecord.password !== password) {
            return { success: false, message: "Incorrect password." };
        }

        // All good – user is authenticated
        return {
            success: true,
            message: "Login successful.",
            userId: userRecord.id
        };
    }

    // --- MOCK METHOD ---

    static async fetchUserByUsername(username) {

        //Search database for username here:


        return mockDatabase.find(user => user.username === username) || null;
    }
}

export default UserAuthenticationController;
