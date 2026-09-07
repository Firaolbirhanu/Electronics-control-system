import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { officerLogin } from '../api';

function OfficerLogin({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const officer = await officerLogin(username, password);
      onLogin(officer);
      navigate('/dashboard');
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    }
  };

  return (
    <div className="shell">
      <nav className="navbar">
        <div className="nav-content">
          <div className="nav-brand">
            <img src="/awash-logo.png" alt="Awash Bank Logo" className="nav-logo" />
            <span>Awash Bank</span>
          </div>
          <div className="nav-links">
            <a href="/">Back to Home</a>
          </div>
        </div>
      </nav>

      <header className="hero">
        <div>
          <p className="eyebrow">Awash International Bank</p>
          <h1>Security Officer Login</h1>
          <p className="subtitle">Enter your officer credentials to access the electronics control dashboard.</p>
        </div>
      </header>

      <section className="card">
        <form onSubmit={handleSubmit} className="form-panel">
          <h2>Login</h2>
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit">Login</button>
        </form>
        {message.text && (
          <div className={`message ${message.type}`} aria-live="polite">
            {message.text}
          </div>
        )}
      </section>
    </div>
  );
}

export default OfficerLogin;
