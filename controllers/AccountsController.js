const MasterAccount = require('../models/MasterAccount');

/**
 * MasterAccount Controller
 * 
 * Handles CRUD operations for MasterAccount:
 * - `getAllMasterAccounts`: Fetches and returns all master accounts.
 * - `addMasterAccount`: Adds a new master account.
 * - `editMasterAccount`: Updates an existing master account.
 * - `deleteMasterAccount`: Deletes a master account.
 * 
 * Each method handles potential errors and returns appropriate responses with HTTP status codes.
 */


exports.getAllMasterAccounts = (req, res) => {
    try {
        const rows = MasterAccount.getAll();
        return res.json({ accounts: rows });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Could not fetch accounts.' });
    }
};

exports.createMasterAccount = (req, res) => {
    const { name, opening_amount, parent_group_id } = req.body;
    if (!name || opening_amount == null) {
        return res.status(400).json({ message: 'name and opening_amount are required.' });
    }
    try {
        const info = MasterAccount.create(name, opening_amount, parent_group_id)
        const account = MasterAccount.getByID(info.lastInsertRowid);

        return res.status(201).json({ account });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Could not create account.' });
    }
};

exports.updateMasterAccount = (req, res) => {
    const id = Number(req.params.id);
    const { name, opening_amount, parent_group_id } = req.body;
    const sets = [];
    const vals = [];
    if (name !== undefined) { sets.push('name = ?'); vals.push(name); }
    if (opening_amount !== undefined) { sets.push('opening_amount = ?'); vals.push(opening_amount); }
    if (parent_group_id !== undefined) { sets.push('group_id = ?'); vals.push(parent_group_id); }

    if (!sets.length) {
        return res.status(400).json({ message: 'No fields provided to update.' });
    }
    vals.push(id);

    try {
        const info = MasterAccount.update(sets, vals);

        if (info.changes === 0) {
            return res.status(404).json({ message: 'Account not found.' });
        }
        return res.json({ message: 'Updated.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Could not update account.' });
    }
};

exports.deleteMasterAccount = (req, res) => {
    const id = Number(req.params.id);
    try {
        const info = MasterAccount.delete(id);

        if (info.changes === 0) {
            return res.status(404).json({ message: 'Account not found.' });
        }
        return res.json({ message: 'Deleted.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Could not delete account.' });
    }
};
