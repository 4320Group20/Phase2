import React, { useState } from 'react';
import TransactionLineInput from '../components/TransactionLineInput';

function TransactionForm() {
    const [transaction, setTransaction] = useState({
        id: '',
        date: '',
        description: '',
        lines: [],
    });

    const [errors, setErrors] = useState([]);

    const handleChange = (field, value) => {
        setTransaction({ ...transaction, [field]: value });
    };

    const handleLineChange = (index, field, value) => {
        const updatedLines = [...transaction.lines];
        updatedLines[index][field] = value;
        setTransaction({ ...transaction, lines: updatedLines });
    };

    const addLine = () => {
        setTransaction({
            ...transaction,
            lines: [...transaction.lines, { id: '', creditedAmount: '', debitedAmount: '', comments: '' }],
        });
    };

    const removeLine = (index) => {
        const updatedLines = transaction.lines.filter((_, i) => i !== index);
        setTransaction({ ...transaction, lines: updatedLines });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting Transaction:', transaction);

        if (!validate()) return;

        //TODO: POST TO BACKEND
    };

    const validate = () => {
        const newErrors = [];

        if (!transaction.id.trim()) newErrors.push('Transaction ID is required.');
        if (!transaction.date.trim()) newErrors.push('Transaction date is required.');
        if (!transaction.description.trim()) newErrors.push('Transaction description is required.');
        if (transaction.lines.length === 0) newErrors.push('At least one transaction line is required.');

        transaction.lines.forEach((line, index) => {
            if (!line.id.trim()) newErrors.push(`Line ${index + 1}: ID is required.`);
            const credit = parseFloat(line.creditedAmount || 0);
            const debit = parseFloat(line.debitedAmount || 0);
            if (isNaN(credit) || credit < 0) newErrors.push(`Line ${index + 1}: Credited amount must be a non-negative number.`);
            if (isNaN(debit) || debit < 0) newErrors.push(`Line ${index + 1}: Debited amount must be a non-negative number.`);
            if (credit === 0 && debit === 0) newErrors.push(`Line ${index + 1}: Either credited or debited amount must be greater than 0.`);
        });

        setErrors(newErrors);
        return newErrors.length === 0;
    };

    return (
        <div>
            <h2>Create New Transaction</h2>
            {errors.length > 0 && (
                <div style={{ color: 'red' }}>
                    <h4>Please fix the following errors:</h4>
                    <ul>
                        {errors.map((err, idx) => <li key={idx}>{err}</li>)}
                    </ul>
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Transaction ID"
                    value={transaction.id}
                    onChange={(e) => handleChange('id', e.target.value)}
                />
                <input
                    type="datetime-local"
                    value={transaction.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={transaction.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                />

                <h3>Transaction Lines</h3>
                {transaction.lines.map((line, index) => (
                    <TransactionLineInput
                        key={index}
                        index={index}
                        line={line}
                        onChange={handleLineChange}
                        onRemove={removeLine}
                    />
                ))}
                <button type="button" onClick={addLine}>Add Transaction Line</button>
                <br /><br />
                <button type="submit">Submit Transaction</button>
            </form>
        </div>
    );
}

export default TransactionForm;
