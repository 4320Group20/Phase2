const mongoose = require('mongoose');

// Create a schema for the TransactionLine model
const transactionLineSchema = new mongoose.Schema({
    // The primary key of the TransactionLine class
    // Type String
    id: { type: String, required: true },

    // The creditedAmount attribute stores the credited amount of the transaction
    // Type double
    creditedAmount: { type: Number, required: true },

    // The debitedAmount attribute stores the debited amount of the transaction
    // Type double
    debitedAmount: { type: Number, required: true },

    // The comments attribute stores the detailed comments about the transaction
    // Type String
    comments: { type: String, required: true }
});

// Create the Mongoose model for TransactionLine
const transactionLineModel = mongoose.model('TransactionLine', transactionLineSchema, 'transactionlines');

module.exports = {
    // Method to create a new transaction line
    createTransactionLine: async (transactionLineData) => {
        const transactionLine = new transactionLineModel(transactionLineData);
        return await transactionLine.save();
    },

    // Method to retrieve all transaction lines
    getAllTransactionLines: async () => {
        return await transactionLineModel.find();
    },

    // Method to retrieve a specific transaction line by ID
    getTransactionLineById: async (id) => {
        return await transactionLineModel.findById(id);
    },

    // Method to update an existing transaction line by ID
    updateTransactionLine: async (id, newData) => {
        return await transactionLineModel.findByIdAndUpdate(id, newData, { new: true });
    },

    // Method to delete a transaction line by ID
    deleteTransactionLine: async (id) => {
        return await transactionLineModel.findByIdAndDelete(id);
    }
};
