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
    addTransaction: (date, description, userId) => {
        const t = db.prepare('INSERT INTO "transaction"(date,description,user_id)VALUES(?,?,?)')
            .run(date, description, userId);
        return t;
    },

    getAllInfosByUID: (userId) => {
        const rows = db.prepare(`
            SELECT
              t.transaction_id AS id,
              t.date,
              t.description,
              tl.transactionline_id AS lineId,
              tl.credited_amount,
              tl.debited_amount,
              tl.comments
            FROM "transaction" t
            JOIN transactionline tl ON t.transaction_id = tl.transaction_id
            WHERE t.user_id = ?
        `).all(userId);

        return rows;
    }
};
