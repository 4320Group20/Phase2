const db = require('../db');
/**
 * User Model
 * 
 * Provides functions for managing users in the iFINANCE system:
 * - `createUser`: Inserts a new user into the database.
 * - `getAllUsers`: Retrieves all users from the database.
 * - `getUserById`: Retrieves a specific user by ID.
 * - `updateUser`: Updates the name of an existing user.
 * - `deleteUser`: Deletes a user by ID.
 * 
 * Each function interacts with the database and returns the result of the operation.
 */

module.exports = {
    createUser: (userData) => {
        const query = db.prepare(`
            INSERT INTO ifinanceusers (id, name)
            VALUES (?, ?)
        `);
        const result = query.run(userData.id, userData.name);
        return { id: userData.id, ...userData };
    },

    getAllUsers: () => {
        const query = db.prepare(`SELECT * FROM ifinanceusers`);
        return query.all();
    },

    getUserById: (id) => {
        const query = db.prepare(`SELECT * FROM ifinanceusers WHERE id = ?`);
        return query.get(id);
    },

    updateUser: (id, newData) => {
        const query = db.prepare(`
            UPDATE ifinanceusers
            SET name = ?
            WHERE id = ?
        `);
        query.run(newData.name, id);
        return { id, ...newData };
    },

    deleteUser: (id) => {
        const query = db.prepare(`DELETE FROM ifinanceusers WHERE id = ?`);
        const result = query.run(id);
        return { deleted: result.changes > 0 };
    }
};
