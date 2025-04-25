const db = require('../db');

module.exports = {
    createUser: async (userData) => {
        const query = db.prepare(`
            INSERT INTO nonadminuser (name, username, address, email)
            VALUES (?, ?, ?, ?)
          `);
        const result = query.run(userData.name, userData.address, userData.email);
        return { id: result.lastInsertRowid, ...userData };
    },

    getAllUsers: async () => {
        const query = db.prepare(`SELECT * FROM nonadminuser`);
        return query.all();
    },

    getUserById: async (id) => {
        const query = db.prepare(`SELECT * FROM nonadminuser WHERE id = ?`);
        return query.get(id);
    },

    updateUser: async (id, newData) => {
        const query = db.prepare(`
            UPDATE nonadminuser
            SET name = ?, address = ?, email = ?
            WHERE id = ?
          `);
          query.run(newData.name, newData.address, newData.email, id);
          return { id, ...newData };
    },

    deleteUser: async (id) => {
        const query = db.prepare(`DELETE FROM nonadminuser WHERE id = ?`);
        const result = query.run(id);
        return { deleted: result.changes > 0 };
    },

    // Look up the user record by username
    getUserByUsername: async (username) => {
        const q = db.prepare(`SELECT * FROM nonadminuser WHERE username = ?`);
        return q.get(username);
    },
};