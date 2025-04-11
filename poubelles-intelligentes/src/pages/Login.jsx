import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'admin@example.com' && password === 'password') {
      localStorage.setItem('authToken', 'your-auth-token');
      navigate('/');
    } else {
      alert('Invalid credentials. Use email: admin@example.com and password: password');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#f6f8fa',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          backgroundColor: '#fff',
          border: '1px solid #d0d7de',
          borderRadius: '6px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          padding: '2rem',
          width: '320px',
          textAlign: 'center',
        }}
      >
        <h1 style={{ marginBottom: '1.5rem', color: '#24292f', fontSize: '24px' }}>Administrateur</h1>
        <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#24292f', fontWeight: 'bold' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '6px',
              border: '1px solid #d0d7de',
              backgroundColor: '#f6f8fa',
              color: '#24292f',
              outline: 'none',
              fontSize: '14px',
            }}
            required
          />
        </div>
        <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#24292f', fontWeight: 'bold' }}>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '6px',
              border: '1px solid #d0d7de',
              backgroundColor: '#f6f8fa',
              color: '#24292f',
              outline: 'none',
              fontSize: '14px',
            }}
            required
          />
        </div>
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#2C3E50',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px',
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#22863a')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#2da44e')}
        >
          Se connecter
        </button>
      </form>
    </div>
  );
};

export default Login;
