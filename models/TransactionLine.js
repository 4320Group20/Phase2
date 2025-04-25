const db = require('../db');

module.exports = {
    createTransactionLine: async (transactionLineData) => {
        const query = db.prepare(`
            INSERT INTO transactionlines (
                id, creditedAmount, debitedAmount, comments
            )
            VALUES (?, ?, ?, ?)
        `);
        const result = query.run(
            transactionLineData.id,
            transactionLineData.creditedAmount,
            transactionLineData.debitedAmount,
            transactionLineData.comments
        );
        return { id: transactionLineData.id, ...transactionLineData };
    },

    getAllTransactionLines: async () => {
        const query = db.prepare(`SELECT * FROM transactionlines`);
        return query.all();
    },

    getTransactionLineById: async (id) => {
        const query = db.prepare(`SELECT * FROM transactionlines WHERE id = ?`);
        return query.get(id);
    },

    updateTransactionLine: async (id, newData) => {
        const query = db.prepare(`
            UPDATE transactionlines
            SET creditedAmount = ?, debitedAmount = ?, comments = ?
            WHERE id = ?
        `);
        query.run(
            newData.creditedAmount,
            newData.debitedAmount,
            newData.comments,
            id
        );
        return { id, ...newData };
    },

    deleteTransactionLine: async (id) => {
        const query = db.prepare(`DELETE FROM transactionlines WHERE id = ?`);
        const result = query.run(id);
        return { deleted: result.changes > 0 };
    }
};
