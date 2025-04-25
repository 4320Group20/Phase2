import React from 'react';

function TransactionLineInput({ line, index, onChange, onRemove }) {
    return (
        <div style={styles.container}>
            <div style={styles.row}>
                <input
                    type="text"
                    placeholder="Line ID"
                    value={line.id}
                    onChange={(e) => onChange(index, 'id', e.target.value)}
                    style={styles.input}
                />
                <input
                    type="number"
                    placeholder="Credited Amount"
                    value={line.creditedAmount}
                    onChange={(e) => onChange(index, 'creditedAmount', e.target.value)}
                    style={styles.input}
                />
            </div>
            <div style={styles.row}>
                <input
                    type="number"
                    placeholder="Debited Amount"
                    value={line.debitedAmount}
                    onChange={(e) => onChange(index, 'debitedAmount', e.target.value)}
                    style={styles.input}
                />
                <input
                    type="text"
                    placeholder="Comments"
                    value={line.comments}
                    onChange={(e) => onChange(index, 'comments', e.target.value)}
                    style={styles.input}
                />
            </div>
            <button onClick={() => onRemove(index)} style={styles.removeButton}>Remove</button>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        marginBottom: '1.2rem',
        padding: '1.2rem',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 3px 8px rgba(0, 0, 0, 0.1)',
    },
    row: {
        display: 'flex',
        gap: '1rem',  // Space between elements
        width: '100%',
    },
    input: {
        padding: '0.8rem',
        fontSize: '1rem',
        borderRadius: '6px',
        border: '1px solid #ccc',
        marginBottom: '0.8rem',
        flex: 1, // Make the inputs take up equal space in the row
    },
    removeButton: {
        backgroundColor: '#dc3545',
        color: '#fff',
        padding: '0.6rem 1.2rem',
        borderRadius: '6px',
        fontSize: '1rem',
        cursor: 'pointer',
        alignSelf: 'center',  // Centers the button horizontally
        border: 'none',
        marginTop: '1rem',
    }
};

export default TransactionLineInput;
