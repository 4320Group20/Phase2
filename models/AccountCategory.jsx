

class AccountCategory {
    constructor(id, name, type) {
        
        // This is the primary key of the AccountCategory class. The value of this
        // attribute distinguishes one category from the other.
        // Type String
        this.id = id;
        
        // The name attribute stores the iFINANCE pre-defined account category
        // name. Example, Assets, Liabilities, Income, and Expenses.
        // Type String
        this.name = name;
        
        // The type attribute stores the type of account category, this could be Debit or Credit.
        // Type String
        this.type = type;
    }

    // Method to return account category details as a string
    toString() {
        return `ID: ${this.id}, Name: ${this.name}, Type: ${this.type}`;
    }
}

export default AccountCategory;
