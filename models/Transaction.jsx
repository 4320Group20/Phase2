

class Transaction {
    constructor(id, date, description) {
        
        // This is the primary key of the transaction header class. The value of this attribute should at least one value in the transaction line class objects.
        // Type String
        this.id = id;
        
        // The date attribute stores the date and time of the transaction.
        // Type Date
        this.date = date;
        
        // The description attribute stores the detail comments about the transaction.
        // Type String
        this.description = description;
    }

    // Method to return transaction details as a string
    toString() {
        return `ID: ${this.id}, Date: ${this.date}, Description: ${this.description}`;
    }
}

export default Transaction;
