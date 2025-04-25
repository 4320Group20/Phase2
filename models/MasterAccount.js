const db = require('../db');

module.exports = {
    createMasterAccount: async (accountData) => {
        const query = db.prepare(`
            INSERT INTO masteraccounts (
                id, name, openingAmount, closingAmount
            )
            VALUES (?, ?, ?, ?)
        `);
        const result = query.run(
            accountData.id,
            accountData.name,
            accountData.openingAmount,
            accountData.closingAmount
        );
        return { id: accountData.id, ...accountData };
    },

    getAllMasterAccounts: async () => {
        const query = db.prepare(`SELECT * FROM masteraccounts`);
        return query.all();
    },

    getMasterAccountById: async (id) => {
        const query = db.prepare(`SELECT * FROM masteraccounts WHERE id = ?`);
        return query.get(id);
    },

    updateMasterAccount: async (id, newData) => {
        const query = db.prepare(`
            UPDATE masteraccounts
            SET name = ?, openingAmount = ?, closingAmount = ?
            WHERE id = ?
        `);
        query.run(
            newData.name,
            newData.openingAmount,
            newData.closingAmount,
            id
        );
        return { id, ...newData };
    },

    deleteMasterAccount: async (id) => {
        const query = db.prepare(`DELETE FROM masteraccounts WHERE id = ?`);
        const result = query.run(id);
        return { deleted: result.changes > 0 };
    }
};
