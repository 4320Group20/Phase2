const db = require('../db');

module.exports = {
    createUserPassword: async ({ encryptedPassword, passwordExpiryTime, userAccountExpiryDate }) => {
        const q = db.prepare(`
            INSERT INTO userpassword (encryptedPassword, passwordExpiryTime, userAccountExpiryDate)
            VALUES (?,?,?)
        `);
        q.run(encryptedPassword, passwordExpiryTime, userAccountExpiryDate);
        return;
    },


    getAllUserPasswords: async () => {
        const query = db.prepare(`SELECT * FROM userpassword`);
        return query.all();
    },

    getUserPasswordById: async (id) => {
        const query = db.prepare(`SELECT * FROM userpassword WHERE id = ?`);
        return query.get(id);
    },

    getByUserName: async (userName) => {
        const query = db.prepare(`SELECT * FROM userpassword WHERE userName = ?`);
        return query.get(userName);
    },

    updateUserPassword: async (id, newData) => {
        const query = db.prepare(`
            UPDATE userpassword
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
        const query = db.prepare(`DELETE FROM userpassword WHERE id = ?`);
        const result = query.run(id);
        return { deleted: result.changes > 0 };
    }
};
