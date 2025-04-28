const db = require('../db');

/**
 * Administrator Model
 * 
 * Provides functions for managing administrators in the database:
 * - `createAdministrator`: Inserts a new administrator into the database.
 * - `getAllAdministrators`: Retrieves all administrators from the database.
 * - `getAdministratorById`: Retrieves a specific administrator by ID.
 * - `updateAdministrator`: Updates the name, date hired, and date finished of an existing administrator.
 * - `deleteAdministrator`: Deletes an administrator by ID.
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
