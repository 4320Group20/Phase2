import React, { useState } from 'react';

/**
 * ChartOfAccountsView Component
 * 
 * Displays and manages a list of accounts and groups. Supports adding, updating, and removing accounts,
 * and displays the group structure. Allows users to add new master accounts, update account details,
 * and navigate back using the exit button.
 * 
 * Props:
 * - groups: List of account groups with id, name, and parent info.
 * - accounts: List of accounts with id, name, opening amount, closing amount, and group association.
 * - onAddAccount: Callback to add a new account.
 * - onUpdateAccount: Callback to update account details.
 * - onRemoveAccount: Callback to remove an account.
 * - onExit: Callback for exiting the view.
 * 
 * returns JSX for account and group management interface.
 */
const ChartOfAccountsView = ({
  groups = [],               // [{ id, name, categoryName, parentID? }]
  accounts = [],             // [{ id, name, openingAmount, closingAmount, groupID }]
  onAddAccount,              // ({ name, openingAmount, groupID }) => void
  onUpdateAccount,           // (id, field, value) => void
  onRemoveAccount,           // (id) => void
  onExit                     // () => void
}) => {
  // Local state for the Add New Master Account form
  const [acName, setAcName] = useState('');
  const [acOAmount, setAcOAmount] = useState('');
  const [acGroupID, setAcGroupID] = useState(groups.length ? groups[0].id : '');

  // Handle new-account form submit
  const handleAdd = e => {
    e.preventDefault();
    onAddAccount({
      name: acName.trim(),
      openingAmount: parseFloat(acOAmount),
      groupID: acGroupID
    });
    setAcName('');
    setAcOAmount('');
    setAcGroupID(groups.length ? groups[0].id : '');
  };

  // Build full group path
  const groupMap = groups.reduce((m, g) => ({ ...m, [g.id]: g }), {});
  const getFullGroupName = id => {
    const g = groupMap[id];
    if (!g) return '';
    return g.parentID
      ? `${getFullGroupName(g.parentID)}\\${g.name}`
      : `${g.categoryName}\\${g.name}`;
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.header}>Chart of Accounts Form</h1>

      {/* Table area */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}></th>
              <th style={styles.th}>Number</th>
              <th style={styles.th}>Account Name</th>
              <th style={styles.th}>Open Amount</th>
              <th style={styles.th}>Closing Amount</th>
              <th style={styles.th}>Group Name</th>
              <th style={styles.th}></th>
            </tr>
          </thead>
          <tbody>
            {accounts.map(acc => (
              <tr key={acc.id} style={styles.tr}>
                <td style={styles.td}></td>
                <td style={styles.td}>{acc.id}</td>
                <td style={styles.td}>
                  <input
                    type="text"
                    defaultValue={acc.name}
                    style={styles.cellInput}
                    onBlur={e => onUpdateAccount(acc.id, 'name', e.target.value)}
                  />
                </td>
                <td style={styles.td}>
                  <input
                    type="number"
                    step="0.01"
                    defaultValue={acc.openingAmount}
                    style={styles.cellInput}
                    onBlur={e => onUpdateAccount(acc.id, 'openingAmount', parseFloat(e.target.value))}
                  />
                </td>
                <td style={styles.td}>{acc.closingAmount.toFixed(2)}</td>
                <td style={styles.td}>
                  <select
                    defaultValue={acc.groupID}
                    style={styles.cellInput}
                    onBlur={e => onUpdateAccount(acc.id, 'groupID', e.target.value)}
                  >
                    {groups.map(g => (
                      <option key={g.id} value={g.id}>
                        {getFullGroupName(g.id)}
                      </option>
                    ))}
                  </select>
                </td>
                <td style={styles.td}>
                  <button
                    style={styles.removeButton}
                    onClick={() => onRemoveAccount(acc.id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add new master account form */}
      <fieldset style={styles.formWrapper}>
        <legend style={styles.legend}>Add New Master Account</legend>
        <form onSubmit={handleAdd} style={styles.form}>
          <label style={styles.label}>
            Account Name
            <input
              style={styles.input}
              type="text"
              value={acName}
              onChange={e => setAcName(e.target.value)}
              required
            />
          </label>

          <label style={styles.label}>
            Opening Amount
            <input
              style={styles.input}
              type="number"
              step="0.01"
              value={acOAmount}
              onChange={e => setAcOAmount(e.target.value)}
              required
            />
          </label>

          <label style={styles.label}>
            Group Name
            <select
              style={styles.input}
              value={acGroupID}
              onChange={e => setAcGroupID(e.target.value)}
            >
              {groups.map(g => (
                <option key={g.id} value={g.id}>
                  {getFullGroupName(g.id)}
                </option>
              ))}
            </select>
          </label>

          <button type="submit" style={styles.addButton}>Add</button>
        </form>
      </fieldset>

      {/* Exit button */}
      <button onClick={onExit} style={styles.exitButton}>Exit</button>
    </div>
  );
};

const styles = {
  page: {
    padding: '1rem',
    maxWidth: '900px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    textAlign: 'center',
    marginBottom: '1rem'
  },
  tableWrapper: {
    backgroundColor: '#ccc',
    padding: '0.5rem',
    borderRadius: '4px',
    marginBottom: '1.5rem',
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    background: '#fff',
    padding: '0.5rem',
    border: '1px solid #999'
  },
  tr: {
    background: '#eee'
  },
  td: {
    padding: '0.5rem',
    border: '1px solid #999'
  },
  cellInput: {
    width: '100%',
    padding: '0.25rem',
    fontSize: '0.9rem',
    boxSizing: 'border-box'
  },
  removeButton: {
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    padding: '0.25rem 0.5rem',
    cursor: 'pointer'
  },
  formWrapper: {
    backgroundColor: '#f7f7f7',
    padding: '1rem',
    border: '1px solid #999',
    borderRadius: '4px',
    marginBottom: '1.5rem'
  },
  legend: {
    fontWeight: 'bold',
    padding: '0 0.5rem'
  },
  form: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    alignItems: 'flex-end'
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 200px'
  },
  input: {
    padding: '0.5rem',
    border: '1px solid #999',
    borderRadius: '4px',
    fontSize: '1rem',
    marginTop: '0.25rem'
  },
  addButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    alignSelf: 'flex-start'
  },
  exitButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    float: 'right'
  }
};

export default ChartOfAccountsView;
