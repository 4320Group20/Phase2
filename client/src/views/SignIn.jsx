import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/webBackground.webp';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.margin     = '0';
    document.body.style.padding    = '0';
    document.body.style.fontFamily = 'Roboto, sans-serif';
  }, []);

  const handleLogin = async (e) => {
      e.preventDefault();
      setError(null);

      try {
          console.log('About to POST /login with', { username, password });
          const res = await fetch('http://localhost:5000/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username, password })
          });

          console.log(' Response status:', res.status);
          console.log(' Response content-type:', res.headers.get('content-type'));

          // Grab raw text so we can inspect it
          const text = await res.text();
          console.log(' Raw response text:', text);

          // Now try to parse it
          let data;
          try {
              data = JSON.parse(text);
              console.log(' Parsed JSON:', data);
          } catch (err) {
              console.error(' JSON.parse failed:', err);
              throw new Error('Server didnt return valid JSON. See console for raw text.');
          }

          if (!res.ok) {
              throw new Error(data.message || 'Login failed');
          }

          // Store & redirect
          localStorage.setItem('userId', data.userId);
          if (data.admin) {
            localStorage.setItem('userName', 'Admin');
            localStorage.setItem('admin', 'true');
          }
          else {
            localStorage.setItem('userName', data.name);
            localStorage.setItem('admin', 'false');
          }
          navigate('/');
      } catch (err) {
          console.error('handleSignIn error:', err);
          setError(err.message);
      }
  };

    const handleCreateAccount = () => navigate('/signup');

    const handleResetPassword = () => navigate('/reset-password');

  return (
    <div style={styles.page}>
      <div style={styles.formWrapper}>
        <h1 style={styles.title}>Welcome to iFINANCE</h1>
        <h2 style={styles.subtitle}>Sign In</h2>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleLogin}>
          <input
            style={styles.input}
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <button type="submit" style={styles.primaryButton}>
            Log In
          </button>
        </form>

              <p style={styles.text}>Forgot your password?</p>
              <button
                  type="button"
                  onClick={handleResetPassword}
                  style={styles.resetPasswordButton}
              >
                  Reset Password
              </button>

        <p style={styles.text}>Don't have an account?</p>
        <button
          onClick={handleCreateAccount}
          style={styles.secondaryButton}
        >
          Create Account
        </button>
      </div>
    </div>
  );
};

const styles = {
  page: {
    width:             '100vw',
    height:            '100vh',
    backgroundImage:   `url(${bgImage})`,
    backgroundSize:    'cover',
    backgroundPosition:'center',
    display:           'flex',
    justifyContent:    'center',
    alignItems:        'center',
  },
  formWrapper: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius:    '12px',
    padding:         '3rem 2rem',
    width:           '360px',
    boxShadow:       '0 6px 18px rgba(0,0,0,0.2)',
    textAlign:       'center',
  },
  title: {
    margin:     '0 0 0.5rem',
    fontSize:   '2rem',
    fontWeight: '700',
  },
  subtitle: {
    margin:     '0 0 1.5rem',
    fontSize:   '1.25rem',
    fontWeight: '500',
  },
  input: {
    width:         '100%',
    padding:       '0.75rem',
    marginBottom:  '1.5rem',
    fontSize:      '1rem',
    fontFamily:    'inherit',
    borderRadius:  '6px',
    border:        '1px solid #ccc',
    boxSizing:     'border-box',
  },
  primaryButton: {
    display:      'block',
    width:        '60%',
    margin:       '2rem auto 2.5rem',
    padding:      '0.75rem',
    fontSize:     '1rem',
    fontFamily:   'inherit',
    cursor:       'pointer',
    border:       'none',
    borderRadius: '6px',
    background:   '#007bff',
    color:        'white',
  },
  text: {
    marginTop: '1.25rem',
    fontSize:  '0.9rem',
  },
  secondaryButton: {
    display:      'block',
    width:        '60%',
    margin:       '0.75rem auto 0',
    padding:      '0.75rem',
    fontSize:     '1rem',
    fontFamily:   'inherit',
    cursor:       'pointer',
    border:       '1px solid #007bff',
    borderRadius: '6px',
    background:   'white',
    color:        '#007bff',
  },
  error: {
    color:       '#d9534f',
    marginBottom:'1rem',
    },
    resetPasswordButton: {
        display: 'block',
        width: '60%',
        margin: '1rem auto 1.5rem',
        padding: '0.75rem',
        fontSize: '1rem',
        fontFamily: 'inherit',
        cursor: 'pointer',
        border: '1px solid #007bff',
        borderRadius: '6px',
        background: 'white',
        color: '#007bff',
    },
};

export default SignIn;
