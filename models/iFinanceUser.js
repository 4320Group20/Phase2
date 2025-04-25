const db = require('../db');

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
