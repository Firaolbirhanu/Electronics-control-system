import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminRegisterOfficer, getAdminAudit, getState } from '../api';

function AdminDashboard({ currentAdmin, onLogout }) {
  const [officerName, setOfficerName] = useState('');
  const [officerUsername, setOfficerUsername] = useState('');
  const [officerPassword, setOfficerPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [auditLog, setAuditLog] = useState([]);
  const [officers, setOfficers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentAdmin) {
      loadAuditLog();
      loadState();
    }
  }, [currentAdmin]);

  const loadAuditLog = async () => {
    try {
      const data = await getAdminAudit(currentAdmin.username, currentAdmin.password);
      setAuditLog(data || []);
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    }
  };

  const loadState = async () => {
    try {
      const data = await getState();
      setOfficers(data.officers || []);
    } catch (error) {
      console.error('Failed to load state:', error);
    }
  };

  const handleCreateOfficer = async (e) => {
    e.preventDefault();
    if (!officerName || !officerUsername || !officerPassword) {
      setMessage({ text: 'Please complete all officer account fields.', type: 'error' });
      return;
    }

    try {
      const officer = await adminRegisterOfficer(
        currentAdmin.username,
        currentAdmin.password,
        officerName,
        officerUsername,
        officerPassword
      );
      setOfficers([...officers, officer]);
      setOfficerName('');
      setOfficerUsername('');
      setOfficerPassword('');
      setMessage({ text: `Security officer ${officer.username} created successfully.`, type: 'success' });
      loadAuditLog();
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/admin-login');
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
            <button onClick={handleLogout} className="secondary">Logout</button>
          </div>
        </div>
      </nav>

      <section className="card">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">Administrator Portal</p>
            <h2>System Administration</h2>
          </div>
        </div>
      </section>

      <section className="card">
        <h3>Create Security Officer Account</h3>
        <form onSubmit={handleCreateOfficer} className="form-panel">
          <label>
            Full name
            <input
              type="text"
              value={officerName}
              onChange={(e) => setOfficerName(e.target.value)}
              required
            />
          </label>
          <label>
            Username
            <input
              type="text"
              value={officerUsername}
              onChange={(e) => setOfficerUsername(e.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={officerPassword}
              onChange={(e) => setOfficerPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit">Create security officer</button>
        </form>
        {message.text && (
          <div className={`message ${message.type}`} aria-live="polite">
            {message.text}
          </div>
        )}
      </section>

      <section className="card">
        <h3>System Audit Review</h3>
        {auditLog.length > 0 ? (
          <table className="records-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Action</th>
                <th>Actor</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {auditLog.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.timestamp}</td>
                  <td>{entry.action}</td>
                  <td>{entry.actor}</td>
                  <td>{entry.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No audit events yet.</p>
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;
