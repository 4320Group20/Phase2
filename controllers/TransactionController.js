const Transaction = require('../models/Transaction');
const TransactionLine = require('../models/TransactionLine');

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

// Add a new transaction
exports.addTransaction = (req, res) => {
    try {
        const { date, description, userId, lines } = req.body;
        if (!date || !description || !userId || !Array.isArray(lines) || !lines.length) {
            return res.status(400).json({ message: 'Invalid payload.' });
        }

        // Validate balanced
        const sum = lines.reduce((a, l) => (a + (l.debitedAmount || 0) - (l.creditedAmount || 0)), 0);
        if (sum !== 0) {
            return res.status(400).json({ message: 'Unbalanced transaction.' });
        }

        // Insert transaction
        const t = Transaction.addTransaction(date, description, userId)
        const tid = t.lastInsertRowid;
        lines.forEach(l => TransactionLine.createTransactionLine(tid, l.creditedAmount || 0, l.debitedAmount || 0, l.comments || ''));
        console.log('Transaction successful for user', userId);
        res.status(201).json({ transactionId: tid });
    } catch (e) { 
        console.error(e); 
        res.status(500).json({ message: 'Server error.' });
    }
};

exports.getAllTransactions = (req, res) => {
    try {
        const userId = Number(req.query.userId);
        // Fetch all transaction+lines, then group by transaction
        const rows = Transaction.getAllInfosByUID(userId);

        const txMap = {};
        rows.forEach(r => {
            if (!txMap[r.id]) {
                txMap[r.id] = {
                    id: r.id,
                    date: r.date,
                    description: r.description,
                    lines: []
                };
            }
            txMap[r.id].lines.push({
                id: r.lineId,
                creditedAmount: r.credited_amount,
                debitedAmount: r.debited_amount,
                comments: r.comments
            });
        });

        return res.json({ transactions: Object.values(txMap) });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};
