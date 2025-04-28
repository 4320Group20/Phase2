const Transaction = require('../models/Transaction');

/**
 * TransactionController Class
 * 
 * Handles CRUD operations for transactions:
 * - `addTransaction`: Adds a new transaction, ensuring it is balanced (debit and credit are equal).
 * - `editTransaction`: Edits an existing transaction, ensuring the edited transaction remains balanced.
 * - `deleteTransaction`: Deletes a specified transaction.
 * 
 * Utility:
 * - `calculateTotal`: Calculates the total debit or credit amount from transaction lines.
 * 
 * Each method handles potential errors, ensuring transactions remain balanced before adding or updating them.
 */


const transactions = []; // In-memory transactions list



const calculateTotal = (lines, type) => {
    return lines.reduce((sum, line) => {
        if (type === 'debit') return sum + (line.debitedAmount || 0);
        if (type === 'credit') return sum + (line.creditedAmount || 0);
        return sum;
    }, 0);
};

// Add a new transaction
exports.addTransaction = (req, res) => {
    const { transactionData, lines } = req.body;

    // Calculates total debit and credit amounts from transaction lines
    const totalDebit = calculateTotal(lines, 'debit');
    const totalCredit = calculateTotal(lines, 'credit');

    // If unbalanced, error 
    if (totalDebit !== totalCredit) {
        return res.status(400).json({ message: 'Transaction must be balanced: debit and credit must be equal.' });
    }

    // Create a new transaction
    const newTransaction = new Transaction(
        transactionData.id,
        transactionData.date,
        transactionData.description,
        lines
    );

    // Reply completed transaction to client
    transactions.push(newTransaction);
    res.status(201).json(newTransaction);
};

exports.editTransaction = (req, res) => {
    const { transactionId } = req.params;
    const { updatedData, updatedLines } = req.body;

    const index = transactions.findIndex(t => t.id === transactionId);

    if (index === -1) {
        return res.status(404).json({ message: 'Transaction not found.' });
    }

    const totalDebit = calculateTotal(updatedLines, 'debit');
    const totalCredit = calculateTotal(updatedLines, 'credit');

    if (totalDebit !== totalCredit) {
        return res.status(400).json({ message: 'Edited transaction must remain balanced.' });
    }

    const updatedTransaction = new Transaction(
        transactionId,
        updatedData.date,
        updatedData.description,
        updatedLines
    );

    transactions[index] = updatedTransaction;
    res.json(updatedTransaction);
};

exports.deleteTransaction = (req, res) => {
    const { transactionId } = req.params;

    const index = transactions.findIndex(t => t.id === transactionId);

    if (index === -1) {
        return res.status(404).json({ message: 'Transaction not found.' });
    }

    const removed = transactions.splice(index, 1)[0];
    res.json(removed);
};
