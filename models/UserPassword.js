const mongoose = require('mongoose');

// Create a schema for the UserPassword model
const userPasswordSchema = new mongoose.Schema({
    // This is the primary key of the UserPassword class, matching the iFinanceUser ID
    // Type String
    id: { type: String, required: true },

    // The userName attribute stores the user account name of the non-admin user
    // Type String
    userName: { type: String, required: true },

    // The encryptedPassword attribute stores the encrypted version of the non-admin user's password
    // A salted hash will be used to encrypt the password
    // Type String
    encryptedPassword: { type: String, required: true },

    // The passwordExpiryTime attribute stores the period of time before the user must change their password
    // Type Integer (can represent the number of days, for example)
    passwordExpiryTime: { type: Number, required: true },

    // The userAccountExpiryDate attribute stores the expiry date of the user account
    // Type Date
    userAccountExpiryDate: { type: Date, required: true }
});

// Create the Mongoose model for UserPassword
const userPasswordModel = mongoose.model('UserPassword', userPasswordSchema, 'userpasswords');

module.exports = {
    // Method to create a new user password record
    createUserPassword: async (userPasswordData) => {
        const userPassword = new userPasswordModel(userPasswordData);
        return await userPassword.save();
    },

    // Method to retrieve all user password records
    getAllUserPasswords: async () => {
        return await userPasswordModel.find();
    },

    // Method to retrieve a specific user password by user ID
    getUserPasswordById: async (id) => {
        return await userPasswordModel.findById(id);
    },

    // Method to update a user password by user ID
    updateUserPassword: async (id, newData) => {
        return await userPasswordModel.findByIdAndUpdate(id, newData, { new: true });
    },

    // Method to delete a user password record by user ID
    deleteUserPassword: async (id) => {
        return await userPasswordModel.findByIdAndDelete(id);
    }
};
