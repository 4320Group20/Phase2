
/**
 * ReportController Class
 * 
 * Handles the generation of different types of reports based on transaction data:
 * - `generateSummaryReport`: Generates a summary report with total debit and credit amounts.
 * - `generateAccountReport`: Generates a report for transactions filtered by account type.
 * - `generateCategoryReport`: Generates a report for transactions filtered by category.
 * 
 * Methods:
 * - `generate`: Processes the report request, filters transactions, and generates the specified report type.
 * - `filterTransactions`: Filters transactions based on date range criteria.
 * 
 * Each report is generated based on the provided criteria and returned as a structured JSON response.
 */

const Transaction = require("../models/Transaction");

exports.generate = (req, res) => {
    try {
        const { reportType, startDate, endDate, accountType, category, userId } = req.body;
        if (!reportType || !startDate || !endDate) {
            return res.status(400).json({ message: 'reportType, startDate, and endDate are required.' });
        }

        // Pull all lines in the date range
        const rows = Transaction.getAllTransactionsByDate(userId, startDate, endDate);

        // Summary report
        if (reportType === 'summary') {
            const totalDebit = rows.reduce((sum, r) => sum + r.debit, 0);
            const totalCredit = rows.reduce((sum, r) => sum + r.credit, 0);
            return res.json({ reportType, startDate, endDate, totalDebit, totalCredit });
        }

        // Grouped report
        const data = {};
        rows.forEach(r => {
            let key;
            if (reportType === 'byAccount') {
                key = r.category_field === accountType ? accountType : 'Other';
            } else { // byCategory
                if (category && r.category_field !== category) return;
                key = r.category_field;
            }
            if (!data[key]) data[key] = { totalDebit: 0, totalCredit: 0 };
            data[key].totalDebit += r.debit;
            data[key].totalCredit += r.credit;
        });

        return res.json({ reportType, startDate, endDate, data });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error.' });
    }
};
