const db = require('../db');
/**
 * UserPassword Model
 * 
 * Provides functions for managing user passwords in the iFINANCE system:
 * - `createUserPassword`: Inserts a new user password record into the database.
 * - `getAllUserPasswords`: Retrieves all user password records from the database.
 * - `getUserPasswordById`: Retrieves a specific user password by ID.
 * - `getByUserName`: Retrieves a user password by the associated username.
 * - `updateUserPassword`: Updates the password, expiry time, and account expiry date for a user.
 * - `deleteUserPassword`: Deletes a user password record by ID.
 * 
 * Each function interacts with the database and returns the result of the operation.
 */

module.exports = {
    // Create a new password
    createUserPassword: ({ hash, expiryTime, accountExpiryDate }) => {
        const result = db.prepare(
            `INSERT INTO userpassword (encrypted_password, password_expiry_time, user_account_expiry_date)
             VALUES (?, ?, ?)`
        ).run(hash, expiryTime, accountExpiryDate);
        return result;
    },

    // Get all passwords
    getAllUserPasswords: () => {
        const query = db.prepare(`SELECT * FROM userpassword`);
        return query.all();
    },

    // Get password by id
    getUserPasswordById: (id) => {
        const query = db.prepare(`SELECT * FROM userpassword WHERE id = ?`);
        return query.get(id);
    },

    // Get password by username
    getByUserName: (username) => {
        const query = db.prepare(`
            SELECT up.*
            FROM userpassword up
            JOIN nonadminuser u ON u.userpassword_id = up.userpassword_id
            WHERE u.username = ?
          `);
        return query.get(username);
    },

    // Update password by id
    updateUserPassword: (newHash, id) => {
        const result = db.prepare(`
            UPDATE userpassword
            SET encrypted_password    = ?,
                password_expiry_time   = 90,
                user_account_expiry_date = DATE('now','+90 days')
            WHERE userpassword_id = ?`
        ).run(newHash, id);
        return result;
    },

    // Delete password by id
    deleteUserPassword: (id) => {
        const query = db.prepare(`DELETE FROM userpassword WHERE id = ?`);
        const result = query.run(id);
        return { deleted: result.changes > 0 };
    }
};
