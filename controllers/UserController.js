const Administrator = require('../models/Administrator');
const NonAdminUser = require('../models/NonAdminUser');
const UserPassword = require('../models/UserPassword');
const bcrypt = require('bcrypt');

/**
 * UserController Class
 * 
 * Handles user registration, authentication, password change operations, and user management in the iFINANCE system:
 * 
 * Methods:
 * - `getAllUsers`: Fetches all non-admin users.
 * - `updateUser`: Updates the name, address, and email of an existing non-admin user.
 * - `deleteUser`: Deletes a specified non-admin user and their associated password record.
 * - `registerUser`: Registers a new user with their details and hashed password.
 * - `login`: Authenticates a user by verifying their username and password, distinguishing between admin and non-admin users.
 * - `resetPassword`: Resets the user's password after verifying the old password and ensuring the new password is hashed and updated.
 * 
 * Each method ensures proper validation, error handling, and secure password management using bcrypt. Responses are appropriately formatted with success or error messages.
 */



exports.getAllUsers = (req, res) => {
    try {
        const users = NonAdminUser.getAllUsers();
        return res.json({ users });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

exports.updateUser = (req, res) => {
    try {
        const { id } = req.params;
        const { name, address, email } = req.body;
        if (!name || !address || !email) {
            return res.status(400).json({ message: 'Name, address, email required.' });
        }
        const info = NonAdminUser.updateUser(name, address, email, id);
        if (info.changes === 0) return res.status(404).json({ message: 'User not found.' });
        return res.json({ message: 'User updated.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

exports.deleteUser = (req,res) => {
    try {
        const id = Number(req.params.id);
        // fetch userpassword_id
        const row = NonAdminUser.getUserPasswordById(id);
        if (!row) return res.status(404).json({ message: 'User not found.' });

        // delete user record first
        NonAdminUser.deleteUser(id);
        UserPassword.deleteUserPassword(row.userpassword_id);

        return res.json({ success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

exports.registerUser = (req, res) => {
    try {
        const { name, username, address, email, password } = req.body;
        if (!name || !username || !address || !email || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Check username uniqueness
        const exists = NonAdminUser.getUserByUsername(username);
        if (exists) {
            return res.status(409).json({ message: 'Username already taken.' });
        }

        // Hash the password
        const hash = bcrypt.hashSync(password, 10);
        const now = Math.floor(Date.now() / 1000);
        const expiryTime = now + 60 * 60 * 24 * 90; // 90 days in seconds
        const accountExpiryDate = new Date(
            Date.now() + 365 * 24 * 60 * 60 * 1000
        )
            .toISOString()
            .split('T')[0];

        // Insert into userpassword
        const upInfo = UserPassword.createUserPassword(hash, expiryTime, accountExpiryDate);
        const userpassword_id = upInfo.lastInsertRowid;

        // Insert into nonadminuser
        const userInfo = NonAdminUser.createUser(name, username, address, email, userpassword_id);

        console.log('User registered with id', userInfo.lastInsertRowid);
        return res
            .status(201)
            .json({ userId: userInfo.lastInsertRowid, message: 'Registered successfully.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

exports.login = (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password required.' });
        }

        // Check for admin credentials first
        const adminRow = Administrator.getAdministratorByUsername(username);
        if (adminRow) {
            const isAdmin = bcrypt.compareSync(password, adminRow.encrypted_password);
            if (!isAdmin) {
                return res.status(401).json({ message: 'Invalid credentials.' });
            }
            // Return full list of non-admin users for admin
            const users = NonAdminUser.getAllUserInfos();
            return res.json({ admin: true, users });
        }

        // Non-admin login
        const row = NonAdminUser.getUserInfoByUsername(username);

        if (!row) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const match = bcrypt.compareSync(password, row.encrypted_password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        console.log('Login successful for user', row.id);
        return res.json({
            userId: row.id,
            name: row.name,
            admin: false,
            message: 'Login successful.'
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

exports.resetPassword = (req, res) => {
    const { username, previousPassword, newPassword } = req.body;
    if (!username || !previousPassword || !newPassword) {
        return res.status(400).json({ message: 'username, previousPassword and newPassword are all required.' });
    }

    try {
        // Look up the non‐admin user (join into userpassword)
        const row = NonAdminUser.getUserInfoJoined(username);

        if (!row) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Verify their old password
        const ok = bcrypt.compareSync(previousPassword, row.encrypted_password);
        if (!ok) {
            return res.status(401).json({ message: 'Previous password is incorrect.' });
        }

        // Hash the new password & update
        const newHash = bcrypt.hashSync(newPassword, 10);
        UserPassword.updateUserPassword(newHash, row.pwdId);

        // Done
        return res.json({ message: 'Password has been successfully reset.' });
    } catch (err) {
        console.error('Reset‐password error:', err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}