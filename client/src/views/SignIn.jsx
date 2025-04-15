import React, { useState } from 'react';

const SignIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // TODO: Send credentials to backend for authentication
        console.log('Attempting login:', { username, password });
    };

    const handleCreateAccount = () => {
        // Navigate to account creation page
        console.log('Redirecting to account creation...');
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Welcome to iFINANCE</h1>
            <div style={styles.formContainer}>
                <h2>Sign In</h2>
                <form onSubmit={handleLogin}>
                    <div style={styles.inputGroup}>
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" style={styles.button}>Log In</button>
                </form>

                <p style={{ marginTop: '1rem' }}>Don't have an account?</p>
                <button onClick={handleCreateAccount} style={styles.secondaryButton}>
                    Create Account
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem',
        fontFamily: 'Arial, sans-serif',
    },
    title: {
        fontSize: '2.5rem',
        marginBottom: '1.5rem',
    },
    formContainer: {
        border: '1px solid #ccc',
        borderRadius: '10px',
        padding: '2rem',
        width: '300px',
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: '1rem',
        textAlign: 'left',
    },
    button: {
        width: '100%',
        padding: '0.5rem',
        fontSize: '1rem',
        marginTop: '1rem',
    },
    secondaryButton: {
        marginTop: '0.5rem',
        padding: '0.5rem',
        width: '100%',
        backgroundColor: '#eee',
        border: '1px solid #aaa',
    },
};

export default SignIn;
