const MasterAccount = require('../models/MasterAccount');

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
