

class MasterAccount {
    constructor(id, name, openingAmount, closingAmount) {
        
        // This is the primary key of the master account class.
        // Type String
        this.id = id;
        
        // The name attribute stores the full name of the master account.
        // Type String
        this.name = name;
        
        // The openingAmount attribute stores the balance brought forward at the beginning of an accounting period.
        // Type double
        this.openingAmount = openingAmount;
        
        // The closingAmount attribute stores the amount remaining in an account within the chart of accounts, positive or negative, at the end of an accounting period or year-end.
        // Type double
        this.closingAmount = closingAmount;

    }

    // Method to return master account details as a string
    toString() {
        return `ID: ${this.id}, Name: ${this.name}, Opening Amount: ${this.openingAmount}, Closing Amount: ${this.closingAmount}`;
    }
}

export default MasterAccount;
