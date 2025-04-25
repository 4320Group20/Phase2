

import MasterAccount from '../models/MasterAccount';

class ChartOfAccountController {

    constructor() {

        // This will eventually be replaced with data from the database
        this.masterAccounts = [];

    }

    // Retrieve all master accounts
    getAllMasterAccounts() {
        return this.masterAccounts;
    }

    // Add a new master account
    addMasterAccount(id, name, openingAmount, closingAmount) {

        const newAccount = new MasterAccount(id, name, openingAmount, closingAmount);
        this.masterAccounts.push(newAccount);
    }

    // Edit an existing master account by ID
    editMasterAccount(id, updatedFields) {

        const accountIndex = this.masterAccounts.findIndex(account => account.id === id);

        if (accountIndex !== -1) {
            const account = this.masterAccounts[accountIndex];
            this.masterAccounts[accountIndex] = {
                ...account,
                ...updatedFields
            };
        } else {
            console.warn(`Account with ID ${id} not found.`);
        }

    }

    // Delete a master account by ID
    deleteMasterAccount(id) {
        this.masterAccounts = this.masterAccounts.filter(account => account.id !== id);
    }


}

export default ChartOfAccountController;
