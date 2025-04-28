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
    createTransactionLine: (tid, creditedAmount, debitedAmount, comments) => {
        const result = db.prepare('INSERT INTO transactionline(transaction_id,credited_amount,debited_amount,comments)VALUES(?,?,?,?)')
            .run(tid, creditedAmount, debitedAmount, comments);
        return result;
    }
};
