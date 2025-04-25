import React, { useState, useEffect } from 'react';
import ChartOfAccountsView from '../views/ChartOfAccountsView';

const API = 'http://localhost:5000';

export default function ChartOfAccountsContainer({ onExit }) {
  const [groups, setGroups] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState('');

  // Load groups and accounts
  useEffect(() => {
    fetchGroups();
    fetchAccounts();
  }, []);

  const fetchGroups = () => {
    fetch(`${API}/groups`)
      .then(res => res.ok ? res.json() : Promise.reject('Failed to load groups'))
      .then(data => setGroups(data.groups || []))
      .catch(msg => setError(msg));
  };

  const fetchAccounts = () => {
    fetch(`${API}/masteraccounts`)
      .then(res => res.ok ? res.json() : Promise.reject('Failed to load accounts'))
      .then(data => setAccounts(data.accounts || []))
      .catch(msg => setError(msg));
  };

  // Handlers passed to view
  const handleAddAccount = ({ name, openingAmount, groupID }) => {
    setError('');
    fetch(`${API}/masteraccounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, opening_amount: openingAmount, parent_group_id: groupID })
    })
      .then(res => {
        if (!res.ok) {
          return res.text().then(t => Promise.reject(t));
        }
        return res.json();
      })
      .then(() => fetchAccounts())
      .catch(msg => setError(msg));
  };

  const handleUpdateAccount = (id, field, value) => {
    setError('');
    // Map field names
    const body = {};
    if (field === 'name') body.name = value;
    if (field === 'openingAmount') body.opening_amount = value;
    if (field === 'groupID') body.parent_group_id = value;

    fetch(`${API}/masteraccounts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(res => res.ok ? fetchAccounts() : res.text().then(t => Promise.reject(t)))
      .catch(msg => setError(msg));
  };

  const handleRemoveAccount = (id) => {
    setError('');
    fetch(`${API}/masteraccounts/${id}`, { method: 'DELETE' })
      .then(res => res.ok ? fetchAccounts() : res.text().then(t => Promise.reject(t)))
      .catch(msg => setError(msg));
  };

  return (
    <>
      {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
      <ChartOfAccountsView
        groups={groups.map(g => ({ id: g.group_id, name: g.name, categoryName: g.category_name, parentID: g.parent_group_id }))}
        accounts={accounts.map(a => ({ id: a.masteraccount_id, name: a.name, openingAmount: a.opening_amount, closingAmount: a.closing_amount, groupID: a.parent_group_id }))}
        onAddAccount={handleAddAccount}
        onUpdateAccount={handleUpdateAccount}
        onRemoveAccount={handleRemoveAccount}
        onExit={onExit}
      />
    </>
  );
}
