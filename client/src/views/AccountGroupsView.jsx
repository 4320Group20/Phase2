import React, { useState, useEffect } from 'react';
import bgImage from '../assets/webBackground.webp';

const AccountGroupsControl = () => {
    const API = 'http://localhost:5000';
    const [categories, setCategories] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedCat, setSelectedCat] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('');
    const [catName, setCatName] = useState('');
    const [grpName, setGrpName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        reloadCategories();
        reloadGroups();
    }, []);

    const reloadCategories = () => {
        fetch(`${API}/account-categories`)
            .then(res => res.ok ? res.json() : Promise.reject('Could not load categories'))
            .then(json => setCategories(json.categories || []))
            .catch(msg => setError(msg));
    };

    const reloadGroups = () => {
        fetch(`${API}/groups`)
            .then(res => res.ok ? res.json() : Promise.reject('Could not load groups'))
            .then(json => setGroups(json.groups || []))
            .catch(msg => setError(msg));
    };

    // Category CRUD
    const addCategory = () => {
        if (!catName.trim()) return setError('Category name required');
        fetch(`${API}/account-categories`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: catName })
        })
            .then(res => res.ok ? reloadCategories() : res.text().then(t => Promise.reject(t)))
            .then(() => setCatName(''))
            .catch(msg => setError(msg));
    };

    const renameCategory = () => {
        if (!selectedCat) return setError('Select a category');
        const newName = prompt('New category name');
        if (!newName) return;
        fetch(`${API}/account-categories/${selectedCat}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName })
        })
            .then(res => res.ok ? reloadCategories() : res.text().then(t => Promise.reject(t)))
            .catch(msg => setError(msg));
    };

    const deleteCategory = () => {
        if (!selectedCat) return setError('Select a category');
        fetch(`${API}/account-categories/${selectedCat}`, { method: 'DELETE' })
            .then(res => res.ok ? reloadCategories() : res.text().then(t => Promise.reject(t)))
            .catch(msg => setError(msg));
    };

    // Group CRUD
    const addGroup = () => {
        if (!grpName.trim()) return setError('Group name required');
        if (!selectedCat) return setError('Select a category first');
        fetch(`${API}/groups`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: grpName, category_id: Number(selectedCat), parent_masteraccount_id: null, parent_group_id: null })
        })
            .then(res => res.ok ? reloadGroups() : res.text().then(t => Promise.reject(t)))
            .then(() => setGrpName(''))
            .catch(msg => setError(msg));
    };

    const renameGroup = () => {
        if (!selectedGroup) return setError('Select a group');
        const newName = prompt('New group name');
        if (!newName) return;
        fetch(`${API}/groups/${selectedGroup}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName })
        })
            .then(res => res.ok ? reloadGroups() : res.text().then(t => Promise.reject(t)))
            .catch(msg => setError(msg));
    };

    const deleteGroup = () => {
        if (!selectedGroup) return setError('Select a group');
        fetch(`${API}/groups/${selectedGroup}`, { method: 'DELETE' })
            .then(res => res.ok ? reloadGroups() : res.text().then(t => Promise.reject(t)))
            .catch(msg => setError(msg));
    };

    const filteredGroups = groups.filter(g => g.category_id === Number(selectedCat));

    return (
        <div style={{ ...styles.container, backgroundImage: `url(${bgImage})` }}>
            <h2 style={styles.title}>Manage Categories & Groups</h2>
            {error && <div style={styles.error}>{error}</div>}

            <section style={styles.section}>
                <h3>Categories</h3>
                <select value={selectedCat} onChange={e => { setSelectedCat(e.target.value); setError(''); }} style={styles.select}>
                    <option value="">-- Select Category --</option>
                    {categories.map(c => (
                        <option key={c.accountcategory_id} value={c.accountcategory_id}>{c.name}</option>
                    ))}
                </select>
                <input
                    placeholder="Category Name"
                    value={catName}
                    onChange={e => setCatName(e.target.value)}
                    style={styles.input}
                />
                <div style={styles.buttons}>
                    <button onClick={addCategory}>Add</button>
                    <button onClick={renameCategory} disabled={!selectedCat}>Rename</button>
                    <button onClick={deleteCategory} disabled={!selectedCat}>Delete</button>
                </div>
            </section>

            <section style={styles.section}>
                <h3>Groups</h3>
                <select value={selectedGroup} onChange={e => { setSelectedGroup(e.target.value); setError(''); }} style={styles.select} disabled={!selectedCat}>
                    <option value="">-- Select Group --</option>
                    {filteredGroups.map(g => (
                        <option key={g.group_id} value={g.group_id}>{g.name}</option>
                    ))}
                </select>
                <input
                    placeholder="Group Name"
                    value={grpName}
                    onChange={e => setGrpName(e.target.value)}
                    style={styles.input}
                    disabled={!selectedCat}
                />
                <div style={styles.buttons}>
                    <button onClick={addGroup} disabled={!selectedCat}>Add</button>
                    <button onClick={renameGroup} disabled={!selectedGroup}>Rename</button>
                    <button onClick={deleteGroup} disabled={!selectedGroup}>Delete</button>
                </div>
            </section>
        </div>
    );
};

const styles = {
    container: { padding: '2rem', maxWidth: '600px', margin: 'auto', backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '8px' },
    title: { textAlign: 'center', marginBottom: '1rem' },
    error: { color: 'red', textAlign: 'center', marginBottom: '1rem' },
    section: { marginBottom: '2rem' },
    select: { width: '100%', padding: '0.5rem', marginBottom: '0.5rem' },
    input: { width: '100%', padding: '0.5rem', marginBottom: '0.5rem' },
    buttons: { display: 'flex', gap: '0.5rem' }
};

export default AccountGroupsControl;
