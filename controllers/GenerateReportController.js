


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
                if (account && account.category === category)
