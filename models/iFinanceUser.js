const mongoose = require('mongoose');

// Create a schema for the iFinanceUser model
const iFinanceUserSchema = new mongoose.Schema({
    // The ID attribute is the primary key for the iFINANCE user
    // Type String
    id: { type: String, required: true },

    // The name attribute stores the full name of the iFINANCE user
    // Type String
    name: { type: String, required: true }
});

// Create the Mongoose model for iFinanceUser
const iFinanceUserModel = mongoose.model('iFinanceUser', iFinanceUserSchema, 'ifinanceusers');

module.exports = {
    // Method to create a new iFinanceUser
    createUser: async (userData) => {
        const user = new iFinanceUserModel(userData);
        return await user.save();
    },

    // Method to retrieve all users
    getAllUsers: async () => {
        return await iFinanceUserModel.find();
    },

    // Method to retrieve a specific user by ID
    getUserById: async (id) => {
        return await iFinanceUserModel.findById(id);
    },

    // Method to update an existing user by ID
    updateUser: async (id, newData) => {
        return await iFinanceUserModel.findByIdAndUpdate(id, newData, { new: true });
    },

    // Method to delete a user by ID
    deleteUser: async (id) => {
        return await iFinanceUserModel.findByIdAndDelete(id);
    }
};
