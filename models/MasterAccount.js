const mongoose = require('mongoose');

// Create a schema for the MasterAccount model
const masterAccountSchema = new mongoose.Schema({
    // The primary key of the master account class
    // Type String
    id: { type: String, required: true },

    // The name attribute stores the full name of the master account
    // Type String
    name: { type: String, required: true },

    // The openingAmount stores the balance brought forward at the start of an accounting period
    // Type Number (to handle decimal values)
    openingAmount: { type: Number, required: true },

    // The closingAmount stores the remaining balance at the end of the accounting period
    // Type Number (to handle decimal values)
    closingAmount: { type: Number, required: true }
});

// Create the Mongoose model for MasterAccount
const masterAccountModel = mongoose.model('MasterAccount', masterAccountSchema, 'masteraccounts');

module.exports = {
    // Method to create a new MasterAccount
    createMasterAccount: async (accountData) => {
        const account = new masterAccountModel(accountData);
        return await account.save();
    },

    // Method to retrieve all master accounts
    getAllMasterAccounts: async () => {
        return await masterAccountModel.find();
    },

    // Method to retrieve a specific master account by ID
    getMasterAccountById: async (id) => {
        return await masterAccountModel.findById(id);
    },

    // Method to update an existing master account by ID
    updateMasterAccount: async (id, newData) => {
        return await masterAccountModel.findByIdAndUpdate(id, newData, { new: true });
    },

    // Method to delete a master account by ID
    deleteMasterAccount: async (id) => {
        return await masterAccountModel.findByIdAndDelete(id);
    }
};
