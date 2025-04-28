const Group = require('../models/Group');
/**
 * GroupController Class
 * 
 * Handles CRUD operations for groups and retrieves tree-view data for account categories:
 * - `getGroups`: Retrieves and structures groups under their respective account categories.
 * - `createGroup`: Adds a new group to a specified category.
 * - `updateGroup`: Updates the name, category, and parent group ID of an existing group.
 * - `deleteGroup`: Deletes an existing group by ID.
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

exports.updateGroup = (req, res) => {
    const id = Number(req.params.id);
    const { name, category_id, parent_group_id } = req.body;
    const sets = [];
    const vals = [];
    if (name) { sets.push('name = ?'); vals.push(name); }
    if (category_id) { sets.push('category_id = ?'); vals.push(category_id); }
    if (parent_group_id !== undefined) {
        sets.push('parent_group_id = ?');
        vals.push(parent_group_id || null);
    }
    if (!sets.length) {
        return res.status(400).json({ message: 'Nothing to update.' });
    }
    vals.push(id);

    try {
        const info = Group.updateGroup(sets, vals);
        if (info.changes === 0) {
            return res.status(404).json({ message: 'Group not found.' });
        }
        res.json({ message: 'Group updated.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not update group.' });
    }
};

exports.deleteGroup = (req, res) => {
    const id = Number(req.params.id);
    try {
        const info = deleteGroup(id);
        if (info.changes === 0) {
            return res.status(404).json({ message: 'Group not found.' });
        }
        res.json({ message: 'Group deleted.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not delete group.' });
    }
};
