const mongoose = require('mongoose');

const accountCategorySchema = new mongoose.Schema({
    // The primary key of the AccountCategory class
    // Type String
    id: { type: String, required: true },

    // Stores the iFINANCE pre-defined account category name (e.g., Assets, Liabilities, Income, Expenses)
    // Type String
    name: { type: String, required: true },

    // The type of account category, could be Debit or Credit
    // Type String
    type: { type: String, required: true }
});

// Create the Mongoose model for AccountCategory
const accountCategoryModel = mongoose.model('AccountCategory', accountCategorySchema, 'accountcategories');

module.exports = {
    // Method to create a new AccountCategory
    createAccountCategory: async (categoryData) => {
        const category = new accountCategoryModel(categoryData);
        return await category.save();
    },

    // Method to retrieve all AccountCategories
    getAllCategories: async () => {
        return await accountCategoryModel.find();
    },

    // Method to retrieve a specific AccountCategory by ID
    getCategoryById: async (id) => {
        return await accountCategoryModel.findById(id);
    },

    // Method to update an existing AccountCategory by ID
    updateCategory: async (id, newData) => {
        return await accountCategoryModel.findByIdAndUpdate(id, newData, { new: true });
    },

    // Method to delete an AccountCategory by ID
    deleteCategory: async (id) => {
        return await accountCategoryModel.findByIdAndDelete(id);
    }
};
