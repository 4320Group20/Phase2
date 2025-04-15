import React from 'react';

function TransactionLineInput({ line, index, onChange, onRemove }) {
    return (
        <div className="transaction-line">
            <input
                type="text"
                placeholder="Line ID"
                value={line.id}
                onChange={(e) => onChange(index, 'id', e.target.value)}
            />
            <input
                type="number"
                placeholder="Credited Amount"
                value={line.creditedAmount}
                onChange={(e) => onChange(index, 'creditedAmount', e.target.value)}
            />
            <input
                type="number"
                placeholder="Debited Amount"
                value={line.debitedAmount}
                onChange={(e) => onChange(index, 'debitedAmount', e.target.value)}
            />
            <input
                type="text"
                placeholder="Comments"
                value={line.comments}
                onChange={(e) => onChange(index, 'comments', e.target.value)}
            />
            <button onClick={() => onRemove(index)}>Remove</button>
        </div>
    );
}

export default TransactionLineInput;
