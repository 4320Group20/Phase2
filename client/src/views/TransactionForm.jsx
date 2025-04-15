import React, { useState } from 'react';
import TransactionLineInput from '../components/TransactionLineInput';

function TransactionForm() {
    const [transaction, setTransaction] = useState({
        id: '',
        date: '',
        description: '',
        lines: [],
    });

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
        //TODO: POST TO BACKEND
    };

    return (
        <div>
            <h2>Create New Transaction</h2>
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
