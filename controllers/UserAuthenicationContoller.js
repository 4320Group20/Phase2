
const UserModel = require('../models/User');

/**
 * Validates the iFINANCE username and corresponding password.
 * Determines if the user is allowed to access the iFINANCE services.
 */
exports.authenticate = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Fetch user from the database by username
        const userRecord = await UserModel.findOne({ username });

        // Check if user exists
        if (!userRecord) {
            return res.status(401).json({ success: false, message: "User not found." });
        }

        // Compare plain-text passwords for now (implement hashed password comparison in real apps)
        if (userRecord.password !== password) {
            return res.status(401).json({ success: false, message: "Incorrect password." });
        }

        // Authentication successful
        return res.status(200).json({
            success: true,
            message: "Login successful.",
            userId: userRecord._id
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error.", error });
    }
};
