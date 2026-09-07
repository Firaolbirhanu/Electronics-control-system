import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../api';

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin@123');
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const admin = await adminLogin(username, password);
      onLogin({ username: admin.username, password });
      navigate('/admin-dashboard');
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
          <h1>Administrator Login</h1>
          <p className="subtitle">Use the administrator credentials to create security officer accounts and review audit logs.</p>
        </div>
      </header>

      <section className="card">
        <form onSubmit={handleSubmit} className="form-panel">
          <h2>Admin Portal</h2>
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
          <button type="submit">Login as administrator</button>
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

export default AdminLogin;
