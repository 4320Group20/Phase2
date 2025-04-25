const db = require('../db');

module.exports = {
    createUserPassword: ({ encryptedPassword, passwordExpiryTime, userAccountExpiryDate }) => {
        const q = db.prepare(`
            INSERT INTO userpasswords (encryptedPassword, passwordExpiryTime, userAccountExpiryDate)
            VALUES (?,?,?)
        `);
        q.run(encryptedPassword, passwordExpiryTime, userAccountExpiryDate);
        return;
    },


    getAllUserPasswords: () => {
        const query = db.prepare(`SELECT * FROM userpassword`);
        return query.all();
    },

    getUserPasswordById: (id) => {
        const query = db.prepare(`SELECT * FROM userpassword WHERE id = ?`);
        return query.get(id);
    },

    getByUserName: (userName) => {
        const query = db.prepare(`SELECT * FROM userpassword WHERE userName = ?`);
        return query.get(userName);
    },

    updateUserPassword: (id, newData) => {
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

    deleteUserPassword: (id) => {
        const query = db.prepare(`DELETE FROM userpassword WHERE id = ?`);
        const result = query.run(id);
        return { deleted: result.changes > 0 };
    }
};
