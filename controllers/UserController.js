const { v4: uuidv4 } = require('uuid');
const NonAdminUser = require('../models/NonAdminUser');
const Administrator = require('../models/Administrator');
const UserPassword = require('../models/UserPassword');
const crypto = require('crypto');

// In-memory storage (simulate DB tables)
const registeredUsers = [];
const passwords = [];

// Check username uniqueness
const isUsernameTaken = (userName) =>
    passwords.some(pw => pw.userName === userName);

// SHA-256 hash -> hex
const encryptPassword = (password) =>
    new Promise((resolve, reject) => {
        const hash = crypto.createHash('sha256');
        hash.update(password);
        resolve(hash.digest('hex'));
    });

/**
 * POST /api/auth/signup
 * Body: { name, userName, password, address, email }
 */
exports.registerUser = (req, res) => {
    const { name, userName, password, address, email } = req.body;

    if (!name || !userName || !password || !address || !email) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    if (isUsernameTaken(userName)) {
        return res.status(400).json({ message: 'Username already exists.' });
    }

    try {
        // 1) generate new user ID
        const id = uuidv4();

        // 2) hash password
        const encryptedPassword = encryptPassword(password);

        // 3) store UserPassword record
        const userPwRecord = new UserPassword(
            id,
            userName,
            encryptedPassword,
      /* passwordExpiryTime */ 90,                // default expiry (days)
      /* userAccountExpiryDate */ new Date()      // default: now
        );
        passwords.push(userPwRecord);

        // 4) create NonAdminUser (default role)
        const newUser = new NonAdminUser(id, name, address, email);
        registeredUsers.push(newUser);

        return res.status(201).json({
            message: 'User registered successfully.',
            user: { id, name, userName, address, email }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error.', error: err.message });
    }
};

/**
 * POST /api/auth/login
 * Body: { userName, password }
 */
exports.authenticate = (req, res) => {
    const { userName, password } = req.body;

    if (!userName || !password) {
        return res.status(400).json({ message: 'Username and password required.' });
    }

    try {
        // 1) find password record by userName
        const pwRecord = passwords.find(pw => pw.userName === userName);
        if (!pwRecord) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        // 2) hash incoming password and compare
        const hashedAttempt = encryptPassword(password);
        if (hashedAttempt !== pwRecord.encryptedPassword) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        // 3) find the corresponding user (NonAdminUser only for now)
        const user = registeredUsers.find(u => u.id === pwRecord.id);
        if (!user) {
            return res.status(500).json({ message: 'User record missing.' });
        }

        return res.json({
            message: 'Login successful.',
            userId: user.id,
            name: user.name
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error.', error: err.message });
    }
};
