import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/webBackground.webp';

const SignUp = () => {
  const [name, setName]               = useState('');
  const [address, setAddress]         = useState('');
  const [email, setEmail]             = useState('');
  const [username, setUsername]       = useState('');
  const [password, setPassword]       = useState('');
  const [confirmPassword, setConfirm] = useState('');
  const [error, setError]             = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.margin     = '0';
    document.body.style.padding    = '0';
    document.body.style.fontFamily = 'Roboto, sans-serif';
  }, []);

  // New Signup submission
  const handleSignUp = async (e) => {
    
    // Create new user
    const res = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, address, email, password })
    });

    // Display results
    const text = await res.text();
    console.log(' /register raw response text:', text);
    let data;
    try {
        data = JSON.parse(text);
    } catch (e) {
        console.error(' /register didn’t return JSON:', e);
        throw new Error('Invalid JSON from server—see console.');
    }
    console.log(' /register parsed JSON:', data);

  };

  const handleBack = () => navigate('/signin');

  return (
    <div style={styles.page}>
      <div style={styles.formWrapper}>
        <h1 style={styles.title}>Create Your iFINANCE Account</h1>
        <h2 style={styles.subtitle}>Sign Up</h2>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSignUp}>
          {[ 
            { placeholder: 'Full Name',         state: name,    setter: setName },
            { placeholder: 'Address',           state: address, setter: setAddress },
            { placeholder: 'Email',             state: email,   setter: setEmail,   type: 'email' },
            { placeholder: 'Username',          state: username,setter: setUsername },
            { placeholder: 'Password',          state: password, setter: setPassword,  type: 'password' },
            { placeholder: 'Confirm Password',  state: confirmPassword, setter: setConfirm, type: 'password' },
          ].map(({ placeholder, state, setter, type = 'text' }) => (
            <input
              key={placeholder}
              style={styles.input}
              type={type}
              placeholder={placeholder}
              value={state}
              onChange={e => setter(e.target.value)}
              required
            />
          ))}

          <button type="submit" style={styles.primaryButton}>
            Create Account
          </button>
        </form>

        <p style={styles.text}>Already have an account?</p>
        <button onClick={handleBack} style={styles.secondaryButton}>
          Sign In
        </button>
      </div>
    </div>
  );
};

const styles = {
  page: {
    width:              '100vw',
    height:             '100vh',
    backgroundImage:    `url(${bgImage})`,
    backgroundSize:     'cover',
    backgroundPosition: 'center',
    display:            'flex',
    justifyContent:     'center',
    alignItems:         'center',
  },
  formWrapper: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius:    '10px',
    padding:         '2rem 1.5rem',
    width:           '320px', 
    boxShadow:       '0 4px 12px rgba(0,0,0,0.15)',
    textAlign:       'center',
  },
  title: {
    margin:     '0 0 0.4rem',
    fontSize:   '1.75rem',
    fontWeight: '700',
  },
  subtitle: {
    margin:     '0 0 1rem',
    fontSize:   '1.1rem',
    fontWeight: '500',
  },
  input: {
    width:         '100%',
    padding:       '0.6rem',
    marginBottom:  '1rem',
    fontSize:      '0.95rem',
    borderRadius:  '5px',
    border:        '1px solid #ccc',
    boxSizing:     'border-box',
  },
  primaryButton: {
    display:      'block',
    width:        '70%',
    margin:       '1.5rem auto 1.5rem',
    padding:      '0.65rem',
    fontSize:     '1rem',
    border:       'none',
    borderRadius: '5px',
    background:   '#007bff',
    color:        'white',
    cursor:       'pointer',
  },
  text: {
    marginTop: '1rem',
    fontSize:  '0.9rem',
  },
  secondaryButton: {
    display:      'block',
    width:        '70%',
    margin:       '0.75rem auto 0',
    padding:      '0.6rem',
    fontSize:     '0.95rem',
    border:       '1px solid #007bff',
    borderRadius: '5px',
    background:   'white',
    color:        '#007bff',
    cursor:       'pointer',
  },
  error: {
    color:       '#d9534f',
    marginBottom:'1rem',
    fontSize:    '0.9rem',
  },
};

export default SignUp;
