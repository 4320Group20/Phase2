const MasterAccount = require('../models/MasterAccount');

const getAllMasterAccounts = async (req, res) => {
    try {
        const accounts = await MasterAccount.find();
        res.json(accounts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const addMasterAccount = async (req, res) => {
    const { name, openingAmount, closingAmount } = req.body;

    try {
        const newAccount = new MasterAccount({
            name,
            openingAmount,
            closingAmount
        });

        await newAccount.save();
        res.status(201).json(newAccount);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const editMasterAccount = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const updated = await MasterAccount.findByIdAndUpdate(id, updates, { new: true });
        if (!updated) return res.status(404).json({ message: "Account not found" });

        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteMasterAccount = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await MasterAccount.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Account not found" });

        res.json({ message: "Account deleted", account: deleted });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllMasterAccounts,
    addMasterAccount,
    editMasterAccount,
    deleteMasterAccount
};
