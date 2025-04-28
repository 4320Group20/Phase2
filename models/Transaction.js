const db = require('../db');
/**
 * Transaction Model
 * 
 * Provides functions for managing transactions in the iFINANCE system:
 * - `createTransaction`: Inserts a new transaction into the database.
 * - `getAllTransactions`: Retrieves all transactions from the database.
 * - `getTransactionById`: Retrieves a specific transaction by ID.
 * - `updateTransaction`: Updates the date and description of an existing transaction.
 * - `deleteTransaction`: Deletes a transaction by ID.
 * 
 * Each function interacts with the database and returns the result of the operation.
 */

module.exports = {
    createTransaction: (transactionData) => {
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

    getAllTransactions: () => {
        const query = db.prepare(`SELECT * FROM transactions`);
        return query.all();
    },

    getTransactionById: (id) => {
        const query = db.prepare(`SELECT * FROM transactions WHERE id = ?`);
        return query.get(id);
    },

    updateTransaction: (id, newData) => {
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

    deleteTransaction: (id) => {
        const query = db.prepare(`DELETE FROM transactions WHERE id = ?`);
        const result = query.run(id);
        return { deleted: result.changes > 0 };
    }
};
