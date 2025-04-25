import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/webBackground.webp';

const ResetPassword = () => {
    const [username, setUsername] = useState('');
    const [previousPassword, setPreviousPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.fontFamily = 'Roboto, sans-serif';
    }, []);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage('');
        try {
            const res = await fetch('/api/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    previousPassword,
                    newPassword
                })
            });

            if (!res.ok) throw new Error('Error resetting password.');

            setMessage('Your password has been successfully reset.');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleBackToSignIn = () => navigate('/signin');

    return (
        <div style={styles.page}>
            <div style={styles.formWrapper}>
                <h1 style={styles.title}>iFINANCE</h1>
                <h2 style={styles.subtitle}>Reset Password</h2>

                {error && <div style={styles.error}>{error}</div>}
                {message && <div style={styles.success}>{message}</div>}

                <form onSubmit={handleResetPassword}>
                    <input
                        style={styles.input}
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <input
                        style={styles.input}
                        type="password"
                        placeholder="Previous Password"
                        value={previousPassword}
                        onChange={(e) => setPreviousPassword(e.target.value)}
                        required
                    />

                    <input
                        style={styles.input}
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />

                    <button type="submit" style={styles.primaryButton}>
                        Reset Password
                    </button>
                </form>

                <p style={styles.text}>Remember your password?</p>
                <button onClick={handleBackToSignIn} style={styles.secondaryButton}>
                    Back to Sign In
                </button>
            </div>
        </div>
    );
};

const styles = {
    page: {
        width: '100vw',
        height: '100vh',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    formWrapper: {
        backgroundColor: 'rgba(255,255,255,0.85)',
        borderRadius: '12px',
        padding: '3rem 2rem',
        width: '360px',
        boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
        textAlign: 'center',
    },
    title: {
        margin: '0 0 0.5rem',
        fontSize: '2rem',
        fontWeight: '700',
    },
    subtitle: {
        margin: '0 0 1.5rem',
        fontSize: '1.25rem',
        fontWeight: '500',
    },
    input: {
        width: '100%',
        padding: '0.75rem',
        marginBottom: '1.5rem',
        fontSize: '1rem',
        fontFamily: 'inherit',
        borderRadius: '6px',
        border: '1px solid #ccc',
        boxSizing: 'border-box',
    },
    primaryButton: {
        display: 'block',
        width: '60%',
        margin: '2rem auto 2.5rem',
        padding: '0.75rem',
        fontSize: '1rem',
        fontFamily: 'inherit',
        cursor: 'pointer',
        border: 'none',
        borderRadius: '6px',
        background: '#007bff',
        color: 'white',
    },
    text: {
        marginTop: '1.25rem',
        fontSize: '0.9rem',
    },
    secondaryButton: {
        display: 'block',
        width: '60%',
        margin: '0.75rem auto 0',
        padding: '0.75rem',
        fontSize: '1rem',
        fontFamily: 'inherit',
        cursor: 'pointer',
        border: '1px solid #007bff',
        borderRadius: '6px',
        background: 'white',
        color: '#007bff',
    },
    error: {
        color: '#d9534f',
        marginBottom: '1rem',
    },
    success: {
        color: '#5bc0de',
        marginBottom: '1rem',
    },
};

export default ResetPassword;
