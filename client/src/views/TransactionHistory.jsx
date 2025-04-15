import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function TransactionHistory() {
    // This will eventually come from your backend
    const [transactions, setTransactions] = useState([]);

    // Placeholder for future fetch
    useEffect(() => {
        setTransactions([]); // Right now, it's just empty
    }, []);

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Transaction History</h1>
            <p>
                <Link to="/">Back to Home</Link>
            </p>

            {transactions.length === 0 ? (
                <p>No transactions have been recorded yet.</p>
            ) : (
                <div>
                    {transactions.map((txn, index) => (
                        <div key={index} style={{
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            padding: '1rem',
                            marginBottom: '1rem'
                        }}>
                            <h3>Transaction ID: {txn.id}</h3>
                            <p><strong>Date:</strong> {txn.date}</p>
                            <p><strong>Description:</strong> {txn.description}</p>
                            <h4>Lines:</h4>
                            <ul>
                                {txn.lines.map((line, idx) => (
                                    <li key={idx}>
                                        <strong>Line ID:</strong> {line.id},
                                        <strong> Credit:</strong> {line.creditedAmount},
                                        <strong> Debit:</strong> {line.debitedAmount},
                                        <strong> Comments:</strong> {line.comments}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default TransactionHistory;
