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

exports.registerUser = async (req, res) => {
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
        const encryptedPassword = await encryptPassword(password);

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
