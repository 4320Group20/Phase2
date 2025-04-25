const mongoose = require('mongoose');

// Create a schema for the Transaction model
const transactionSchema = new mongoose.Schema({
    // The primary key of the transaction class. Should have at least one value in the transaction line class objects
    // Type String
    id: { type: String, required: true },

    // The date attribute stores the date and time of the transaction
    // Type Date
    date: { type: Date, required: true },

    // The description attribute stores the detailed comments about the transaction
    // Type String
    description: { type: String, required: true }
});

// Create the Mongoose model for Transaction
const transactionModel = mongoose.model('Transaction', transactionSchema, 'transactions');

module.exports = {
    // Method to create a new transaction
    createTransaction: async (transactionData) => {
        const transaction = new transactionModel(transactionData);
        return await transaction.save();
    },

    // Method to retrieve all transactions
    getAllTransactions: async () => {
        return await transactionModel.find();
    },

    // Method to retrieve a specific transaction by ID
    getTransactionById: async (id) => {
        return await transactionModel.findById(id);
    },

    // Method to update an existing transaction by ID
    updateTransaction: async (id, newData) => {
        return await transactionModel.findByIdAndUpdate(id, newData, { new: true });
    },

    // Method to delete a transaction by ID
    deleteTransaction: async (id) => {
        return await transactionModel.findByIdAndDelete(id);
    }
};
