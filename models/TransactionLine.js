const db = require('../db');
/**
 * TransactionLine Model
 * 
 * Provides a function for managing transaction lines in the iFINANCE system:
 * - `createTransactionLine`: Inserts a new transaction line into the database with the transaction ID, credited amount, debited amount, and comments.
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
