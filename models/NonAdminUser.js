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
    createUser: (name, username, address, email, userpassword_id) => {
        const userInfo = db.prepare(
            `INSERT INTO nonadminuser (name, username, address, email, userpassword_id)
             VALUES (?, ?, ?, ?, ?)`
        ).run(name, username, address, email, userpassword_id);
        return userInfo;
    },

    getAllUsers: () => {
        const query = db.prepare(
            `SELECT nu.nonadminuser_id AS id,
              nu.name,
              nu.username,
              nu.address,
              nu.email,
              up.encrypted_password
            FROM nonadminuser nu
            JOIN userpassword up ON nu.userpassword_id = up.userpassword_id`
        );
        return query.all();
    },

    getAllUserInfos: () => {
        const users = db.prepare(
            `SELECT nonadminuser_id AS id, name, username, address, email
                FROM nonadminuser`
        ).all();
        return users;
    },

    getUserPasswordById: (id) => {
        const info = db.prepare('SELECT userpassword_id FROM nonadminuser WHERE nonadminuser_id = ?').get(id);
        return info;
    },

    updateUser: (name, address, email, id) => {
        const info = db.prepare(
            `UPDATE nonadminuser SET name = ?, address = ?, email = ? WHERE nonadminuser_id = ?`
        ).run(name, address, email, id);
        return info;
    },

    deleteUser: (id) => {
        const query = db.prepare(`DELETE FROM nonadminuser WHERE id = ?`);
        const result = query.run(id);
        return { deleted: result.changes > 0 };
    },

    // Look up the user record by username
    getUserByUsername: (username) => {
        const q = db.prepare(`SELECT 1 FROM nonadminuser WHERE username = ?`);
        return q.get(username);
    },

    getUserInfoByUsername: (username) => {
        const row = db.prepare(
            `SELECT nu.nonadminuser_id AS id, nu.name, up.encrypted_password
                FROM nonadminuser nu
                JOIN userpassword up ON nu.userpassword_id = up.userpassword_id
                WHERE nu.username = ?`
        ).get(username);
        return row;
    },

    getUserInfoJoined: (username) => {
        const row = db.prepare(`
            SELECT nu.nonadminuser_id AS userId,
                   up.userpassword_id  AS pwdId,
                   up.encrypted_password
            FROM nonadminuser nu
            JOIN userpassword up
              ON nu.userpassword_id = up.userpassword_id
            WHERE nu.username = ?`
        ).get(username);

        return row;
    }
};