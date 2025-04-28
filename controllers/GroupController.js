const Group = require('../models/Group');
const AccountCategory = require('../models/Category');
/**
 * GroupController Class
 * 
 * Handles CRUD operations for groups and retrieves tree-view data for account categories:
 * - `getTreeViewData`: Retrieves and structures groups under their respective account categories.
 * - `addGroup`: Adds a new group to a specified category.
 * - `editGroup`: Updates the name of an existing group.
 * - `deleteGroup`: Deletes an existing group.
 * 
 * Each method handles errors and returns appropriate HTTP status codes and messages.
 */
exports.getGroups = (req, res) => {
    try {
        const gs = Group.getAllGroupsWithCategories();
        res.json({ groups: gs });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not fetch groups.' });
    }
};

exports.createGroup = (req, res) => {
    const { name, category_id, parent_group_id } = req.body;
    if (!name || !category_id) {
        return res.status(400).json({ message: 'Name and category_id are required.' });
    }
    try {
        const info = Group.createGroup(name, category_id, parent_group_id);
        const g = Group.getGroupByID(info.lastInsertRowid);
        res.status(201).json({ group: g });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not create group.' });
    }
};
