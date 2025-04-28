const Category = require("../models/Category");

exports.getAllCategories = (req, res) => {
    try {
        const cats = Category.getAllCategories();
        res.json({ categories: cats });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not fetch categories.' });
    }
};

exports.createCategory = (req, res) => {
    const { name, type } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required.' });
    try {
        const info = Category.createCategory(name, type);
        const cat = Category.getCategoryByID(info.lastInsertRowid);
        res.status(201).json({ category: cat });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not create category.' });
    }
};

exports.updateCategory = (req, res) => {
    const id = Number(req.params.id);
    const { name, type } = req.body;
    if (!name && type === undefined) {
        return res.status(400).json({ message: 'Nothing to update.' });
    }
    const sets = [];
    const vals = [];
    if (name) { sets.push('name = ?'); vals.push(name); }
    if (type !== undefined) { sets.push('type = ?'); vals.push(type); }
    vals.push(id);

    try {
        const info = Category.updateCategory(sets, vals);
        if (info.changes === 0) {
            return res.status(404).json({ message: 'Category not found.' });
        }
        res.json({ message: 'Category updated.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not update category.' });
    }
};

exports.deleteCategory = (req, res) => {
    const id = Number(req.params.id);
    try {
        const info = Category.deleteCategory(id);
        if (info.changes === 0) {
            return res.status(404).json({ message: 'Category not found.' });
        }
        res.json({ message: 'Category deleted.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not delete category.' });
    }
};
