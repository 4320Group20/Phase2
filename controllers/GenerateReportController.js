const generateReportController = (transactions, accounts) => {
    const filterTransactions = (criteria) => {
        return transactions.filter(t => {
            const date = new Date(t.date);
            const start = criteria.startDate ? new Date(criteria.startDate) : null;
            const end = criteria.endDate ? new Date(criteria.endDate) : null;

            return (!start || date >= start) && (!end || date <= end);
        });
    };

    const generateSummaryReport = (filtered) => {
        let totalDebit = 0;
        let totalCredit = 0;

        for (const t of filtered) {
            for (const line of t.transactionLines) {
                totalDebit += line.debitedAmount || 0;
                totalCredit += line.creditedAmount || 0;
            }
        }

        return {
            reportType: 'Summary',
            totalDebit,
            totalCredit,
            transactionsCount: filtered.length,
        };
    };

    const generateAccountReport = (filtered, accountType) => {
        const accountTotals = {};

        for (const t of filtered) {
            for (const line of t.transactionLines) {
                const account = accounts.find(a => a.id === line.accountId);
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
    };

    const generateCategoryReport = (filtered, category) => {
        const totals = { debit: 0, credit: 0 };

        for (const t of filtered) {
            for (const line of t.transactionLines) {
                const account = accounts.find(a => a.id === line.accountId);
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
    };

    const generate = (req, res) => {
        const { reportType, criteria } = req.body;

        const filtered = filterTransactions(criteria);

        try {
            let reportData;
            switch (reportType) {
                case 'summary':
                    reportData = generateSummaryReport(filtered);
                    break;
                case 'byAccount':
                    reportData = generateAccountReport(filtered, criteria.accountType);
                    break;
                case 'byCategory':
                    reportData = generateCategoryReport(filtered, criteria.category);
                    break;
                default:
                    return res.status(400).json({ message: 'Unsupported report type' });
            }

            res.json(reportData);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    return { generate };
};

module.exports = generateReportController;