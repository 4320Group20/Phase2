const Group = require('../models/Group'); // Mongoose model
const AccountCategory = require('../models/AccountCategory'); // Mongoose model

const getTreeViewData = async (req, res) => {
    try {
        const categories = await AccountCategory.find();
        const groups = await Group.find();

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

const addGroup = async (req, res) => {
    const { name, categoryId } = req.body;

    try {
        const newGroup = new Group({ name, categoryId });
        await newGroup.save();
        res.status(201).json(newGroup);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const editGroup = async (req, res) => {
    const { groupId } = req.params;
    const { newName } = req.body;

    try {
        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: 'Group not found' });

        group.name = newName;
        await group.save();

        res.json(group);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteGroup = async (req, res) => {
    const { groupId } = req.params;

    try {
        const group = await Group.findByIdAndDelete(groupId);
        if (!group) return res.status(404).json({ message: 'Group not found' });

        res.json({ message: 'Group deleted', group });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getTreeViewData,
    addGroup,
    editGroup,
    deleteGroup,
};
