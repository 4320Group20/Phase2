const db = require('../db');
/**
 * Transaction Model
 * 
 * Provides functions for managing transactions in the iFINANCE system:
 * - `addTransaction`: Inserts a new transaction into the database with date, description, and user ID.
 * - `getAllInfosByUID`: Retrieves all transaction information (including transaction lines) for a specific user ID.
 * - `getAllTransactionsByDate`: Retrieves transactions for a specific user within a given date range, including transaction line details.
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
    },

    getAllTransactionsByDate: (userId, startDate, endDate) => {
        const rows = db.prepare(`
            SELECT
              t.transaction_id  AS id,
              t.date,
              t.description,
              tl.credited_amount AS credit,
              tl.debited_amount  AS debit,
              tl.comments        AS category_field
            FROM "transaction" t
            JOIN transactionline tl ON t.transaction_id = tl.transaction_id
            WHERE t.user_id = ?
              AND date(t.date) BETWEEN date(?) AND date(?)`
        ).all(userId, startDate, endDate);

        return rows;
    }
};
