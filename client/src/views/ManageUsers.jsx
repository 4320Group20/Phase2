import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/webBackground.webp';

const ManageUsers = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({ name: '', username: '', address: '', email: '', password: '' });
    const [error, setError] = useState(null);

    // Fetch users on mount
    useEffect(() => {
        fetch('http://localhost:5000/admin/users')
            .then(res => {
                if (!res.ok) throw new Error(`Error fetching users: ${res.status}`);
                return res.json();
            })
            .then(data => {
                console.log('Fetched users:', data.users);
                setUsers(data.users || []);
            })
            .catch(err => setError(err.message));
    }, []);

    const handleInput = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleCreate = async e => {
        e.preventDefault();
        setError(null);
        try {
            const res = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            // Refresh users list
            const refreshed = await fetch('http://localhost:5000/admin/users').then(r => r.json());
            setUsers(refreshed.users || []);
            setForm({ name: '', username: '', address: '', email: '', password: '' });
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async id => {
        if (!window.confirm('Delete this user?')) return;
        try {
            const res = await fetch(`http://localhost:5000/users/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setUsers(users.filter(u => u.id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEdit = async u => {
        const name = prompt('Name:', u.name);
        const address = prompt('Address:', u.address);
        const email = prompt('Email:', u.email);
        if (name == null || address == null || email == null) return;
        try {
            const res = await fetch(`http://localhost:5000/users/${u.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, address, email })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setUsers(users.map(user => user.id === u.id ? { ...user, name, address, email } : user));
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.wrapper}>
                <h1 style={styles.title}>Manage Users</h1>
                {error && <div style={styles.error}>{error}</div>}

                {/* Create User Form */}
                <form onSubmit={handleCreate} style={styles.form}>
                    {['name', 'username', 'address', 'email', 'password'].map(field => (
                        <input
                            key={field}
                            name={field}
                            type={field === 'password' ? 'password' : 'text'}
                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                            value={form[field]}
                            onChange={handleInput}
                            required
                            style={styles.input}
                        />
                    ))}
                    <button type="submit" style={styles.button}>Create</button>
                </form>

                {/* Users Table */}
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Password Hash</th>
                            <th>Email</th>
                            <th>Admin</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td>{u.name}</td>
                                <td>{u.username}</td>
                                <td style={{ fontSize: '0.75rem', wordBreak: 'break-all' }}>{u.encrypted_password}</td>
                                <td>{u.email}</td>
                                <td>No</td>
                                <td>
                                    <button style={styles.smallButton} onClick={() => handleEdit(u)}>Edit</button>
                                    <button style={styles.smallButton} onClick={() => handleDelete(u.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button onClick={() => navigate('/')} style={styles.primaryButton}>Back</button>
            </div>
        </div>
    );
};

const styles = {
    page: {
        width: '100vw', height: '100vh',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        display: 'flex', justifyContent: 'center', alignItems: 'center'
    },
    wrapper: {
        backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '10px',
        padding: '2rem', width: '900px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    },
    title: { margin: '0 0 1rem', fontSize: '2rem', textAlign: 'center' },
    error: { color: '#d9534f', marginBottom: '1rem', textAlign: 'center' },
    form: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' },
    input: { flex: '1 1 150px', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' },
    button: { padding: '0.5rem 1rem', border: 'none', borderRadius: '5px', background: '#007bff', color: '#fff', cursor: 'pointer' },
    table: { width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' },
    smallButton: { marginRight: '0.5rem', padding: '0.25rem 0.5rem', border: 'none', borderRadius: '4px', background: '#007bff', color: '#fff', cursor: 'pointer' },
    primaryButton: { display: 'block', margin: '0 auto', padding: '0.6rem 1.2rem', background: '#007bff', color: '#fff', borderRadius: '5px', textDecoration: 'none', border: 'none', cursor: 'pointer' }
};

export default ManageUsers;