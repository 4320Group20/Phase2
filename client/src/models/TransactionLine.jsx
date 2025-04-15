
class TransactionLine {
    constructor(id, creditedAmount, debitedAmount, comments) {
        
        // This is the primary key of the TransactionLine class.
        // Type String
        this.id = id;
        
        // The creditedAmount attribute stores the credited amount of the transaction.
        // Type double
        this.creditedAmount = creditedAmount;
        
        // The debitedAmount attribute stores the debited amount of the transaction.
        // Type double
        this.debitedAmount = debitedAmount;
        
        // The comments attribute stores the detail comments about the transaction.
        // Type String
        this.comments = comments;
    }

    // Method to return transaction line details as a string
    toString() {
        return `ID: ${this.id}, Credited Amount: ${this.creditedAmount}, Debited Amount: ${this.debitedAmount}, Comments: ${this.comments}`;
    }
}

export default TransactionLine;
