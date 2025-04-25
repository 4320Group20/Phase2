const db = require('../db');

module.exports = {
    createTransaction: async (transactionData) => {
        const query = db.prepare(`
            INSERT INTO transactions (
                id, date, description
            )
            VALUES (?, ?, ?)
        `);
        const result = query.run(
            transactionData.id,
            transactionData.date.toISOString(), // Store as ISO string
            transactionData.description
        );
        return { id: transactionData.id, ...transactionData };
    },

    getAllTransactions: async () => {
        const query = db.prepare(`SELECT * FROM transactions`);
        return query.all();
    },

    getTransactionById: async (id) => {
        const query = db.prepare(`SELECT * FROM transactions WHERE id = ?`);
        return query.get(id);
    },

    updateTransaction: async (id, newData) => {
        const query = db.prepare(`
            UPDATE transactions
            SET date = ?, description = ?
            WHERE id = ?
        `);
        query.run(
            newData.date.toISOString(),
            newData.description,
            id
        );
        return { id, ...newData };
    },

    deleteTransaction: async (id) => {
        const query = db.prepare(`DELETE FROM transactions WHERE id = ?`);
        const result = query.run(id);
        return { deleted: result.changes > 0 };
    }
};
