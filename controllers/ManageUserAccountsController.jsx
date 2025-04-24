import NonAdminUser from '../models/NonAdminUser';
import Administrator from '../models/Administrator';
import UserPassword from '../models/UserPassword';

class ManageUserAccountsController {
    constructor() {
        this.registeredUsers = []; // This simulates a DB table of users
        this.passwords = [];       // Simulated DB table for user passwords
    }

    // Utility method to check if username is already used
    isUsernameTaken(userName) {
        return this.passwords.some(pw => pw.userName === userName);
    }

    // Basic encryption using built-in crypto API
    encryptPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        return crypto.subtle.digest('SHA-256', data).then(hashBuffer => {
            return Array.from(new Uint8Array(hashBuffer))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');
        });
    }

    // Main method to create and store a new user
    async registerUser({
        id,
        name,
        userName,
        password,
        role, // 'nonadmin' or 'admin'
        address,
        email,
        dateHired,
        dateFinished,
        passwordExpiryTime,
        userAccountExpiryDate
    }) {
        if (this.isUsernameTaken(userName)) {
            throw new Error('Username already exists');
        }

        const encryptedPassword = await this.encryptPassword(password);

        // Store UserPassword entity
        const userPassword = new UserPassword(
            id,
            userName,
            encryptedPassword,
            passwordExpiryTime,
            new Date(userAccountExpiryDate)
        );
        this.passwords.push(userPassword);

        // Create and store the correct type of user
        let newUser;
        if (role === 'admin') {
            newUser = new Administrator(id, name, dateHired, dateFinished);
        } else {
            newUser = new NonAdminUser(id, name, address, email);
        }

        this.registeredUsers.push(newUser);
        return newUser;
    }
}

export default ManageUserAccountsController;
