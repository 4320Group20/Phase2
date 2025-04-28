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
        const accounts = MasterAccount.find();
        res.json(accounts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addMasterAccount = (req, res) => {
    const { name, openingAmount, closingAmount } = req.body;

    try {
        const newAccount = new MasterAccount({
            name,
            openingAmount,
            closingAmount
        });

        newAccount.save();
        res.status(201).json(newAccount);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.editMasterAccount = (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const updated = MasterAccount.findByIdAndUpdate(id, updates, { new: true });
        if (!updated) return res.status(404).json({ message: "Account not found" });

        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteMasterAccount = (req, res) => {
    const { id } = req.params;

    try {
        const deleted = MasterAccount.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Account not found" });

        res.json({ message: "Account deleted", account: deleted });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
