import React from 'react';
import { Link } from 'react-router-dom';

//#Signin will probably end up being the default view eventually. THIS IS FOR TESTING
const Home = () => {
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>iFINANCE App</h1>
            <h2 style={styles.subtitle}>Welcome to the iFINANCE Management System</h2>

            
            <nav>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    <li><Link to="/signin">Sign In / Create Account</Link></li>
                    <li><Link to="/transactions/new">Create Transaction</Link></li>
                    <li><Link to="/transactions/history">View Transaction History</Link></li>
                    <li><Link to="/report">View Financial Report</Link></li>
                </ul>
            </nav>

        </div>
    );
}

const styles = {
    container: {
        textAlign: 'center',
        marginTop: '50px',
    },
    title: {
        fontSize: '3rem',
        color: '#2e3b4e',
    },
    subtitle: {
        fontSize: '1.5rem',
        color: '#4a4a4a',
        marginBottom: '2rem',
    },
    linkButton: {
        padding: '0.75rem 1.5rem',
        backgroundColor: '#007bff',
        color: '#fff',
        textDecoration: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
    },
};

export default Home;
