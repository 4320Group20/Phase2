import React, { useState } from 'react';
import TransactionLineInput from '../components/TransactionLineInput';
import { Link } from 'react-router-dom'; // Import for navigation using Link

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

        // TODO: POST TO BACKEND
    };

    const validate = () => {
        const newErrors = [];

        if (!transaction.id.trim()) newErrors.push('Transaction ID is required.');
        if (!transaction.date.trim()) newErrors.push('Transaction date is required.');
        if (!transaction.description.trim()) newErrors.push('Transaction description is required.');
        if (transaction.lines.length === 0) newErrors.push('At least one transaction line is required.');

        let totalDebited = 0;
        let totalCredited = 0;

        transaction.lines.forEach((line, index) => {
            if (!line.id.trim()) newErrors.push(`Line ${index + 1}: ID is required.`);
            const credit = parseFloat(line.creditedAmount || 0);
            const debit = parseFloat(line.debitedAmount || 0);
            if (isNaN(credit) || credit < 0) newErrors.push(`Line ${index + 1}: Credited amount must be a non-negative number.`);
            if (isNaN(debit) || debit < 0) newErrors.push(`Line ${index + 1}: Debited amount must be a non-negative number.`);
            if (credit === 0 && debit === 0) newErrors.push(`Line ${index + 1}: Either credited or debited amount must be greater than 0.`);

            totalDebited += debit;
            totalCredited += credit;
        });

        // Double-entry check: Total debited must equal total credited
        if (totalDebited !== totalCredited) {
            newErrors.push('Total debited amount must equal total credited amount for double-entry accounting.');
        }

        setErrors(newErrors);
        return newErrors.length === 0;
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Create New Transaction</h2>
            {errors.length > 0 && (
                <div style={styles.errorContainer}>
                    <h4>Please fix the following errors:</h4>
                    <ul>
                        {errors.map((err, idx) => <ul key={idx}>{err}</ul>)}
                    </ul>
                </div>
            )}
            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    placeholder="Transaction ID"
                    value={transaction.id}
                    onChange={(e) => handleChange('id', e.target.value)}
                    style={styles.input}
                />
                <input
                    type="datetime-local"
                    value={transaction.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    style={styles.input}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={transaction.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    style={styles.input}
                />

                <h3 style={styles.subTitle}>Transaction Lines</h3>
                {transaction.lines.map((line, index) => (
                    <TransactionLineInput
                        key={index}
                        index={index}
                        line={line}
                        onChange={handleLineChange}
                        onRemove={removeLine}
                    />
                ))}
                <button type="button" onClick={addLine} style={styles.addLineButton}>Add Transaction Line</button>
                <br /><br />
                <button type="submit" style={styles.submitButton}>Submit Transaction</button>
            </form>

            <Link to="/" style={styles.returnButton}>Return to Home Screen</Link>
        </div>
    );
}

const styles = {
    container: {
        padding: '2rem',
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        borderRadius: '12px',
        boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
    },
    title: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#2e3b4e',
        marginBottom: '2rem',
    },
    subTitle: {
        fontSize: '1.5rem',
        color: '#2e3b4e',
        marginTop: '1.5rem',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
    },
    input: {
        width: '100%',
        padding: '1rem',
        fontSize: '1rem',
        marginBottom: '1rem',
        borderRadius: '8px',
        border: '1px solid #ccc',
    },
    addLineButton: {
        backgroundColor: '#007bff',
        color: '#fff',
        padding: '0.75rem 1.5rem',
        borderRadius: '8px',
        fontSize: '1rem',
        cursor: 'pointer',
    },
    submitButton: {
        backgroundColor: '#28a745',
        color: '#fff',
        padding: '0.75rem 1.5rem',
        borderRadius: '8px',
        fontSize: '1.2rem',
        cursor: 'pointer',
    },
    errorContainer: {
        color: 'red',
        marginBottom: '1rem',
    },
    returnButton: {
        backgroundColor: '#f0ad4e',
        color: '#fff',
        padding: '0.75rem 1.5rem',
        borderRadius: '8px',
        border: '2px solid #000000',
        fontSize: '1rem',
        cursor: 'pointer',
        marginTop: '1rem',
        textDecoration: 'none', // Make sure the Link doesn't have underline
        display: 'inline-block',
    }
};

export default TransactionForm;
