const mongoose = require('mongoose');
const iFinanceUser = require('./iFinanceUser'); // Assuming this is another model file

// Create a schema for Administrator that extends iFinanceUser attributes
const administratorSchema = new mongoose.Schema({
    // Inherits from iFinanceUser
    id: { type: String, required: true },
    name: { type: String, required: true },

    // The date when the system administrator is hired by iFINANCE
    // Type Date
    dateHired: { type: Date, required: true },

    // The date when the system administrator left iFINANCE
    // Type Date
    dateFinished: { type: Date, required: true }
});

// Create the Mongoose model for Administrator
const administratorModel = mongoose.model('Administrator', administratorSchema, 'administrators');

module.exports = {
    // Method to create a new Administrator
    createAdministrator: async (adminData) => {
        const admin = new administratorModel(adminData);
        return await admin.save();
    },

    // Method to retrieve all Administrators
    getAllAdministrators: async () => {
        return await administratorModel.find();
    },

    // Method to retrieve a specific Administrator by ID
    getAdministratorById: async (id) => {
        return await administratorModel.findById(id);
    },

    // Method to update an existing Administrator by ID
    updateAdministrator: async (id, newData) => {
        return await administratorModel.findByIdAndUpdate(id, newData, { new: true });
    },

    // Method to delete an Administrator by ID
    deleteAdministrator: async (id) => {
        return await administratorModel.findByIdAndDelete(id);
    }
};
