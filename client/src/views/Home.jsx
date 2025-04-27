import React from 'react';
import { Link } from 'react-router-dom';
import bgImage from '../assets/webBackground.webp';

const Home = () => {
    const name = localStorage.getItem('userName');
    const isSignedIn = name != undefined;

    const isAdmin = localStorage.getItem('admin') === 'true';
    return (
        <div style={styles.page}>
            <div style={styles.formWrapper}>
                {/* Sign In Button at the top left */}
                <div style={styles.signInButtonWrapper}>
                    <Link to="/signin" style={styles.primaryButton}>Sign In</Link>
                </div>

                {/* Main Content */}
                <h1 style={styles.title}>iFINANCE App</h1>
                <h2 style={styles.subtitle}>Welcome to the iFINANCE Management System</h2>
                <h3>
                    {isSignedIn
                        ? `Welcome, ${name}!`
                        : `Welcome!`}
                </h3>
                <nav>
                    {isSignedIn && (
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            {isAdmin && (
                                <li>
                                    <Link to="/manage-users" style={styles.linkButton}>Manage Users</Link>
                                </li>
                            )}
                            <li>
                                <Link to="/transactions/new" style={styles.linkButton}>Create Transaction</Link>
                            </li>
                            <li>
                                <Link to="/transactions/history" style={styles.linkButton}>View Transaction History</Link>
                            </li>
                            <li>
                                <Link to="/report" style={styles.linkButton}>View Financial Report</Link>
                            </li>
                            <li>
                                <Link to="/account-groups" style={styles.linkButton}>Go to Accounts Groups</Link>
                            </li>
                            <li>
                                <Link to="/chart-of-accounts" style={styles.linkButton}>Go to Chart of Accounts</Link>
                            </li>
                        </ul>
                    )}
                </nav>
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
        padding: '5rem 2rem',
        width: '360px',
        boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
        textAlign: 'center',
    },
    signInButtonWrapper: {
        position: 'absolute',
        top: '20px',
        left: '20px',
    },
    primaryButton: {
        display: 'block',
        padding: '0.75rem 1.5rem',
        backgroundColor: '#007bff',
        color: '#fff',
        textDecoration: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        cursor: 'pointer',
    },
    title: {
        fontSize: '3rem',
        color: '#2e3b4e',
        marginBottom: '1.5rem',
    },
    subtitle: {
        fontSize: '1.5rem',
        color: '#4a4a4a',
        marginBottom: '2rem',
    },
    linkButton: {
        display: 'block',
        padding: '0.75rem 1.5rem',
        backgroundColor: '#007bff',
        color: '#fff',
        textDecoration: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        marginBottom: '1rem',
    },
};

export default Home;
