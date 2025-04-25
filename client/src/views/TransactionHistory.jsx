import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function TransactionHistory() {
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const userId = Number(localStorage.getItem('userId'));
        fetch(`http://localhost:5000/transactions?userId=${userId}`)
            .then(res => {
                if (!res.ok) throw new Error(`Error fetching transactions: ${res.status}`);
                return res.json();
            })
            .then(data => setTransactions(data.transactions || []))
            .catch(err => setError(err.message));
    }, []);

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Transaction History</h1>
            <p><Link to="/">Back to Home</Link></p>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {transactions.length === 0 ? (
                <p>No transactions have been recorded yet.</p>
            ) : (
                transactions.map((txn) => (
                    <div key={txn.id} style={{
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        padding: '1rem',
                        marginBottom: '1rem'
                    }}>
                        <h3>Transaction ID: {txn.id}</h3>
                        <p><strong>Date:</strong> {new Date(txn.date).toLocaleString()}</p>
                        <p><strong>Description:</strong> {txn.description}</p>
                        <h4>Lines:</h4>
                        <ul>
                            {txn.lines.map((line) => (
                                <li key={line.id}>
                                    <strong>Line ID:</strong> {line.id},
                                    <strong> Credit:</strong> {line.creditedAmount},
                                    <strong> Debit:</strong> {line.debitedAmount},
                                    <strong> Comments:</strong> {line.comments}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            )}
        </div>
    );
}

export default TransactionHistory;
