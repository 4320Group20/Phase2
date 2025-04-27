const NonAdminUser = require('../models/NonAdminUser');
const UserPassword = require('../models/UserPassword');
const bcrypt = require('bcrypt');

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

        const hash = bcrypt.hashSync(password, 10);
        const password_obj = UserPassword.createUserPassword({
            encryptedPassword: hash,
            passwordExpiryTime: 90,                   // default days
            userAccountExpiryDate: new Date().toISOString()
        });
        const password_id = password_obj.lastInsertRowid;

        // Call model to insert into DB
        const user = NonAdminUser.createUser({ name: name, username: username, address: address, email: email, password_id: password_id});

        return res.status(201).json({
            message: 'User registered.',
            user: user
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal error.', error: err.message });
    }
};


exports.authenticate = (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password required.' });
    }

    try {
        // look up user row by username -> get { id }
        const user = NonAdminUser.getUserByUsername(username);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // look up their hashed password by user.id
        const pwRec = UserPassword.getUserPasswordById(user.id);
        if (!pwRec) {
            return res.status(500).json({ message: 'Password record missing.' });
        }

        // bcrypt compare
        const ok = bcrypt.compare(password, pwRec.encryptedPassword);
        if (!ok) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

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
