
class GenerateReportController {


    constructor(transactions, accounts) {
        // Placeholder for MongoDB data
        this.transactions = transactions || [];
        this.accounts = accounts || [];
    }

    /**
     * Generates a report based on user's selected type and criteria
     * @param {string} reportType - Type of report: "summary", "byAccount", "byCategory"
     * @param {object} criteria - Contains filters: dateRange, accountType, category, etc.
     * @returns {object} reportData
     */

    generateReport(reportType, criteria) {

        const filtered = this.filterTransactions(criteria);


        switch (reportType) {
            case "summary":
                return this.generateSummaryReport(filtered);
            case "byAccount":
                return this.generateAccountReport(filtered, criteria.accountType);
            case "byCategory":
                return this.generateCategoryReport(filtered, criteria.category);
            default:
                throw new Error("Unsupported report type");
        }
    }

    /**
     * Filters transactions based on criteria
     */
    filterTransactions(criteria) {
        return this.transactions.filter(t => {

            const date = new Date(t.date);
            const start = criteria.startDate ? new Date(criteria.startDate) : null;
            const end = criteria.endDate ? new Date(criteria.endDate) : null;

            const withinDate = (!start || date >= start) && (!end || date <= end);


            return withinDate;
        });
    }

    /**
     * Generates a basic summary report: total debit and credit
     */
    generateSummaryReport(transactions) {

        let totalDebit = 0;
        let totalCredit = 0;

        for (const t of transactions) {

            for (const line of t.transactionLines) {
                totalDebit += line.debitedAmount || 0;
                totalCredit += line.creditedAmount || 0;
            }


        }

        return {
            reportType: "Summary",
            totalDebit,
            totalCredit,
            transactionsCount: transactions.length
        };
    }

    /**
     * Generates report grouped by account type (Assets, Liabilities, etc.)
     */
    generateAccountReport(transactions, accountType) {


        const accountTotals = {};

        for (const t of transactions) {

            for (const line of t.transactionLines) {

                const account = this.accounts.find(a => a.id === line.accountId);

                if (account && account.type === accountType) {
                    if (!accountTotals[account.name]) {
                        accountTotals[account.name] = { debit: 0, credit: 0 };
                    }

                    accountTotals[account.name].debit += line.debitedAmount || 0;
                    accountTotals[account.name].credit += line.creditedAmount || 0;
                }
            }
        }

        return {
            reportType: `By Account Type (${accountType})`,
            accountTotals
        };
    }

    /**
     * Generates a report by account category (Assets, Expenses, etc.)
     */
    generateCategoryReport(transactions, category) {
        const totals = { debit: 0, credit: 0 };

        for (const t of transactions) {
            for (const line of t.transactionLines) {
                const account = this.accounts.find(a => a.id === line.accountId);

                if (account && account.category === category) {
                    totals.debit += line.debitedAmount || 0;
                    totals.credit += line.creditedAmount || 0;
                }
            }
        }

        return {
            reportType: `By Category (${category})`,
            totals
        };
    }

    /**
     * Placeholder method to export report as PDF
     */
    exportToPDF(reportData) {
        // Would use a real PDF library here
        console.log("Exporting report to PDF...");
        console.log(JSON.stringify(reportData, null, 2));
    }

    /**
     * Placeholder method to display on screen
     */
    displayReport(reportData) {
        console.table(reportData);
    }
}

export default GenerateReportController;
