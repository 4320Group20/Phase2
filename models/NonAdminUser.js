const db = require('../db');
/**
 * NonAdminUser Model
 * 
 * Provides functions for managing non-admin users in the iFINANCE system:
 * - `createUser`: Inserts a new non-admin user into the database.
 * - `getAllUsers`: Retrieves all non-admin users from the database.
 * - `getUserById`: Retrieves a specific non-admin user by ID.
 * - `updateUser`: Updates the name, address, and email of an existing non-admin user.
 * - `deleteUser`: Deletes a non-admin user by ID.
 * - `getUserByUsername`: Retrieves a specific non-admin user by username.
 * 
 * Each function interacts with the database and returns the result of the operation.
 */

module.exports = {
    createUser: (userData) => {
        const query = db.prepare(`
            INSERT INTO nonadminuser (name, username, address, email, userpassword_id)
            VALUES (?, ?, ?, ?, ?)
          `);
        const result = query.run(userData.name, userData.username, userData.address, userData.email, userData.password_id);
        return { id: result.lastInsertRowid, ...userData };
    },

    getAllUsers: () => {
        const query = db.prepare(`SELECT * FROM nonadminuser`);
        return query.all();
    },

    getUserById: (id) => {
        const query = db.prepare(`SELECT * FROM nonadminuser WHERE id = ?`);
        return query.get(id);
    },

    updateUser: (id, newData) => {
        const query = db.prepare(`
            UPDATE nonadminuser
            SET name = ?, address = ?, email = ?
            WHERE id = ?
          `);
          query.run(newData.name, newData.address, newData.email, id);
          return { id, ...newData };
    },

    deleteUser: (id) => {
        const query = db.prepare(`DELETE FROM nonadminuser WHERE id = ?`);
        const result = query.run(id);
        return { deleted: result.changes > 0 };
    },

    // Look up the user record by username
    getUserByUsername: (username) => {
        const q = db.prepare(`SELECT * FROM nonadminuser WHERE username = ?`);
        return q.get(username);
    },
};