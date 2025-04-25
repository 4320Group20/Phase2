const mongoose = require('mongoose');

// Create a schema for the Group model
const groupSchema = new mongoose.Schema({
    // The ID attribute is the primary key that distinguishes one group from another
    // Type String
    id: { type: String, required: true },

    // The name attribute stores the name of the group or its subgroups
    // Type String
    name: { type: String, required: true }
});

// Create the Mongoose model for Group
const groupModel = mongoose.model('Group', groupSchema, 'groups');

module.exports = {
    // Method to create a new Group
    createGroup: async (groupData) => {
        const group = new groupModel(groupData);
        return await group.save();
    },

    // Method to retrieve all groups
    getAllGroups: async () => {
        return await groupModel.find();
    },

    // Method to retrieve a specific group by ID
    getGroupById: async (id) => {
