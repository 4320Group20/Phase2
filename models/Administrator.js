const db = require('../db');

/**
 * Administrator Model
 * 
 * Provides a function for managing administrators in the database:
 * - `getAdministratorByUsername`: Retrieves an administrator by their username, including their ID and encrypted password.
 * 
 * Each function interacts with the database and returns the result of the operation.
 */


module.exports = {
    getAdministratorByUsername: (username) => {
        const adminRow = db
            .prepare('SELECT administrator_id, encrypted_password FROM administrator WHERE username = ?')
            .get(username);
        return adminRow
    }
};
