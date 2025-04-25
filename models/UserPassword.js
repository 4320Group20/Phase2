const db = require('../db');

module.exports = {
    createUserPassword: ({ encryptedPassword, passwordExpiryTime, userAccountExpiryDate }) => {
        const q = db.prepare(`
            INSERT INTO userpassword (encrypted_Password, password_Expiry_Time, user_Account_Expiry_Date)
            VALUES (?,?,?)
        `);
        const result = q.run(encryptedPassword, passwordExpiryTime, userAccountExpiryDate);
        return result;
    },

    getAllUserPasswords: () => {
        const query = db.prepare(`SELECT * FROM userpassword`);
        return query.all();
    },

    getUserPasswordById: (id) => {
        const query = db.prepare(`SELECT * FROM userpassword WHERE id = ?`);
        return query.get(id);
    },

    getByUserName: (username) => {
        const query = db.prepare(`
            SELECT up.*
            FROM userpassword up
            JOIN nonadminuser u ON u.userpassword_id = up.userpassword_id
            WHERE u.username = ?
          `);
          const userPassword = query.get(username);
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
