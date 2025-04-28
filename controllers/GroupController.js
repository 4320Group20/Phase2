const Group = require('../models/Group');
const AccountCategory = require('../models/AccountCategory');
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
exports.getTreeViewData = (req, res) => {
    try {
        const categories = AccountCategory.find();
        const groups = Group.find();

        const tree = {};

        for (const category of categories) {
            tree[category.name] = groups
                .filter(group => group.categoryId.toString() === category._id.toString())
                .map(group => ({ id: group._id, name: group.name }));
        }

        res.json(tree);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addGroup = (req, res) => {
    const { name, categoryId } = req.body;

    try {
        const newGroup = new Group({ name, categoryId });
        newGroup.save();
        res.status(201).json(newGroup);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.editGroup = (req, res) => {
    const { groupId } = req.params;
    const { newName } = req.body;

    try {
        const group = Group.findById(groupId);
        if (!group) return res.status(404).json({ message: 'Group not found' });

        group.name = newName;
        group.save();

        res.json(group);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteGroup = (req, res) => {
    const { groupId } = req.params;

    try {
        const group = Group.findByIdAndDelete(groupId);
        if (!group) return res.status(404).json({ message: 'Group not found' });

        res.json({ message: 'Group deleted', group });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
