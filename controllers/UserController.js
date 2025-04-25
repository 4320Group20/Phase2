const NonAdminUser = require('../models/NonAdminUser');
const Administrator = require('../models/Administrator');
const UserPassword = require('../models/UserPassword');
const crypto = require('crypto');

// In-memory storage (simulate DB tables)
const registeredUsers = [];
const passwords = [];

const isUsernameTaken = (userName) => {
    return passwords.some(pw => pw.userName === userName);
};

const encryptPassword = (password) => {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('sha256');
        hash.update(password);
        resolve(hash.digest('hex'));
    });
};

exports.registerUser = (req, res) => {
    const {
        id,
        name,
        userName,
        password,
        role,
        address,
        email,
        dateHired,
        dateFinished,
        passwordExpiryTime,
        userAccountExpiryDate
    } = req.body;

    if (isUsernameTaken(userName)) {
        return res.status(400).json({ message: 'Username already exists' });
    }

    try {
        const encryptedPassword = encryptPassword(password);

        const userPassword = new UserPassword(
            id,
            userName,
            encryptedPassword,
            passwordExpiryTime,
            new Date(userAccountExpiryDate)
        );
        passwords.push(userPassword);

        let newUser;
        if (role === 'admin') {
            newUser = new Administrator(id, name, dateHired, dateFinished);
        } else {
            newUser = new NonAdminUser(id, name, address, email);
        }

        registeredUsers.push(newUser);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
};

/**
 * Validates the iFINANCE username and corresponding password.
 * Determines if the user is allowed to access the iFINANCE services.
 */
exports.authenticate = (req, res) => {
    const { username, password } = req.body;

    try {
        // Fetch user from the database by username
        const userRecord = NonAdminUser.findOne({ username });

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
