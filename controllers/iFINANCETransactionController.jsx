


import Transaction from '../models/Transaction.jsx';
import TransactionLine from '../models/TransactionLine.jsx';

// A control class to add, edit, and delete transactions
class iFINANCETransactionController {

    constructor() {
        this.transactions = []; // Temporary storage; will later use MongoDB
    }

    /**
     * Adds a new transaction with debit and credit lines
     * @param {Object} transactionData - The transaction details
     * @param {Array} lines - The list of transaction lines (debit/credit)
     */
    addTransaction(transactionData, lines) {

        const totalDebit = this.calculateTotal(lines, 'debit');
        const totalCredit = this.calculateTotal(lines, 'credit');

        if (totalDebit !== totalCredit) {
            throw new Error('Transaction must be balanced: debit and credit must be equal.');
        }

        const newTransaction = new Transaction(
            transactionData.id,
            transactionData.date,
            transactionData.description,
            lines
        );


        this.transactions.push(newTransaction);
        console.log("Transaction added:", newTransaction);
        return newTransaction;

    }

    /**
     * Edits an existing transaction based on ID
     */
    editTransaction(transactionId, updatedData, updatedLines) {

        const index = this.transactions.findIndex(t => t.id === transactionId);

        if (index === -1) {
            throw new Error("Transaction not found.");
        }

        const totalDebit = this.calculateTotal(updatedLines, 'debit');
        const totalCredit = this.calculateTotal(updatedLines, 'credit');

        if (totalDebit !== totalCredit) {
            throw new Error("Edited transaction must remain balanced.");
        }

        const updatedTransaction = new Transaction(
            transactionId,
            updatedData.date,
            updatedData.description,
            updatedLines
        );

        this.transactions[index] = updatedTransaction;
        return updatedTransaction;
    }

    /**
     * Deletes a transaction by ID
     */
    deleteTransaction(transactionId) {

        const index = this.transactions.findIndex(t => t.id === transactionId);

        if (index === -1) {
            throw new Error("Transaction not found.");
        }

        const removed = this.transactions.splice(index, 1)[0];
        return removed;
    }

    /**
     * Calculates total debit or credit
     */
    calculateTotal(lines, type) {

        return lines.reduce((sum, line) => {
            if (type === 'debit') return sum + (line.debitedAmount || 0);
            if (type === 'credit') return sum + (line.creditedAmount || 0);
            return sum;
        }, 0);

    }

    /**
     * Determines the accounting effect based on entry
     */
    determineEffect(accountType, isDebit) {

        const effects = {
            Assets: isDebit ? 'Increase' : 'Decrease',
            Expenses: isDebit ? 'Increase' : 'Decrease',
            Liabilities: isDebit ? 'Decrease' : 'Increase',
            Income: isDebit ? 'Decrease' : 'Increase'
        };
        return effects[accountType] || 'Unknown';
    }



}

export default iFINANCETransactionController;
