const NonAdminUser = require('../models/NonAdminUser');
const Administrator = require('../models/Administrator');
const UserPassword = require('../models/UserPassword');
const crypto = require('crypto');//TODO: Fix this stuff... 
// import bcrypt from 'bcrypt'; 

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

const updatePasswordInDB = (userId, newPassword) => {
    const salt = bcrypt.genSalt(10);
    const hashedPassword = bcrypt.hash(newPassword, salt);

    const result = UserPassword.updateOne(
        { ID: userId },
        { encryptedPassword: hashedPassword }
    );

    return result.modifiedCount > 0;
};
    
/**
 * POST /api/auth/signup
 * Body: { name, userName, password, address, email }
 */
exports.registerUser = (req, res) => {
    const { name, username, password, address, email } = req.body;
    if (!name || !username || !password || !address || !email) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // ensure username unique
        const exists = NonAdminUser.getUserByUsername(username);
        if (exists) {
            return res.status(400).json({ message: 'Username already exists.' });
        }

        const hash = 'EpicHash'; // await bcrypt.hash(password, 10); TODO: FIX THIS!!!
        const password_obj = UserPassword.createUserPassword({
            encryptedPassword: hash,
            passwordExpiryTime: 90,                   // default days
            userAccountExpiryDate: new Date().toISOString()
        });
        const password_id = UserPassword.getByUserName(username);

        // insert into users table
        const user = NonAdminUser.createUser({ name: name, username: username, address: address, email: email, password_id: password_id});

        return res.status(201).json({
            message: 'User registered.',
            user: { name, username, address, email }
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal error.', error: err.message });
    }
};


exports.authenticate = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password required.' });
    }

    try {
        // 1) look up user row by username -> get { id, � }
        const user = await NonAdminUser.getUserByUsername(username);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // 2) look up their hashed password by user.id
        const pwRec = await UserPassword.getUserPasswordById(user.id);
        if (!pwRec) {
            return res.status(500).json({ message: 'Password record missing.' });
        }

        // 3) bcrypt compare
        const ok = await bcrypt.compare(password, pwRec.encryptedPassword);
        if (!ok) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // 4) success!
        return res.json({
            message: 'Login successful.',
            userId: user.id,
            name: user.name
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal error.', error: err.message });
    }
};

exports.changePassword = (userId, oldPassword, newPassword1, newPassword2) => {
    if (newPassword1 !== newPassword2) {
        return { success: false, message: "New passwords do not match." };
    }

    const userRecord = UserPassword.findOne({ ID: userId });

    if (!userRecord) {
        return { success: false, message: "User not found." };
    }

    const isMatch = bcrypt.compare(oldPassword, userRecord.encryptedPassword);
    if (!isMatch) {
        return { success: false, message: "Old password is incorrect." };
    }

    const updateSuccess = updatePasswordInDB(userId, newPassword1);
    if (!updateSuccess) {
        return { success: false, message: "Failed to update password." };
    }

    return { success: true, message: "Password changed successfully." };
};
