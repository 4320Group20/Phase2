const db = require('../db');
/**
 * TransactionLine Model
 * 
 * Provides functions for managing transaction lines in the iFINANCE system:
 * - `createTransactionLine`: Inserts a new transaction line into the database.
 * - `getAllTransactionLines`: Retrieves all transaction lines from the database.
 * - `getTransactionLineById`: Retrieves a specific transaction line by ID.
 * - `updateTransactionLine`: Updates the credited amount, debited amount, and comments of an existing transaction line.
 * - `deleteTransactionLine`: Deletes a transaction line by ID.
 * 
 * Each function interacts with the database and returns the result of the operation.
 */

module.exports = {
    createTransactionLine: (transactionLineData) => {
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

    getAllTransactionLines: () => {
        const query = db.prepare(`SELECT * FROM transactionlines`);
        return query.all();
    },

    getTransactionLineById: (id) => {
        const query = db.prepare(`SELECT * FROM transactionlines WHERE id = ?`);
        return query.get(id);
    },

    updateTransactionLine: (id, newData) => {
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

    deleteTransactionLine: (id) => {
        const query = db.prepare(`DELETE FROM transactionlines WHERE id = ?`);
        const result = query.run(id);
        return { deleted: result.changes > 0 };
    }
};
