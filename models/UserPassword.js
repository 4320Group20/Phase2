const db = require('../db');

module.exports = {
    createUserPassword: async (userPasswordData) => {
        const query = db.prepare(`
            INSERT INTO userpasswords (
                id, userName, encryptedPassword, passwordExpiryTime, userAccountExpiryDate
            )
            VALUES (?, ?, ?, ?, ?)
        `);
        const result = query.run(
            userPasswordData.id,
            userPasswordData.userName,
            userPasswordData.encryptedPassword,
            userPasswordData.passwordExpiryTime,
            userPasswordData.userAccountExpiryDate
        );
        return { id: userPasswordData.id, ...userPasswordData };
    },

    getAllUserPasswords: async () => {
        const query = db.prepare(`SELECT * FROM userpasswords`);
        return query.all();
    },

    getUserPasswordById: async (id) => {
        const query = db.prepare(`SELECT * FROM userpasswords WHERE id = ?`);
        return query.get(id);
    },

    updateUserPassword: async (id, newData) => {
        const query = db.prepare(`
            UPDATE userpasswords
            SET userName = ?, encryptedPassword = ?, passwordExpiryTime = ?, userAccountExpiryDate = ?
            WHERE id = ?
        `);
        query.run(
            newData.userName,
            newData.encryptedPassword,
            newData.passwordExpiryTime,
            newData.userAccountExpiryDate,
            id
        );
        return { id, ...newData };
    },

    deleteUserPassword: async (id) => {
        const query = db.prepare(`DELETE FROM userpasswords WHERE id = ?`);
        const result = query.run(id);
        return { deleted: result.changes > 0 };
    }
};
