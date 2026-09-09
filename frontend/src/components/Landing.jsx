import React from 'react';
import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div className="shell">
      <nav className="navbar">
        <div className="nav-content">
          <div className="nav-brand">
            <img src="/image/awash-logo.png" alt="Awash Bank Logo" className="nav-logo" />
            <p> Awash International Bank </p>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <Link to="/admin-login" className="nav-cta">Access Portal</Link>
          </div>
        </div>
      </nav>

      <header className="hero">
        <div className="hero-content">
          <p className="eyebrow">Awash International Bank</p>
          <h1>Electronics Control System</h1>
          <p className="subtitle">
            Securely register officers, employees, and electronics devices. Verify employee devices with advanced QR scanning technology for complete asset management.
          </p>
          <div className="hero-stats">
            <div className="hero-stat">
              <i className="fas fa-user-shield"></i>
              <span>Secure Access</span>
            </div>
            <div className="hero-stat">
              <i className="fas fa-qrcode"></i>
              <span>QR Verification</span>
            </div>
            <div className="hero-stat">
              <i className="fas fa-clipboard-list"></i>
              <span>Audit Trail</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-icon-large">
            <i className="fas fa-laptop-code"></i>
          </div>
        </div>
      </header>

      <section className="card access-section" id="access">
        <h2 className="section-title">System Access</h2>
        <p className="section-subtitle">Choose your access level to enter the system</p>
        <div className="action-grid">
          <Link to="/admin-login" className="action-card">
            <div className="action-icon">
              <i className="fas fa-user-cog"></i>
            </div>
            <h2>Administrator Login</h2>
            <p>Create security officer accounts and review the system audit trail.</p>
            <span className="action-link">Access Admin Portal <i className="fas fa-arrow-right"></i></span>
          </Link>
          <Link to="/login" className="action-card">
            <div className="action-icon">
              <i className="fas fa-user-shield"></i>
            </div>
            <h2>Security Officer Login</h2>
            <p>Sign in to manage employee and device records.</p>
            <span className="action-link">Access Officer Portal <i className="fas fa-arrow-right"></i></span>
          </Link>
        </div>
      </section>

      <section className="features-section" id="features">
        <h2 className="section-title">System Features</h2>
        <p className="section-subtitle">Comprehensive tools for electronics device management</p>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-user-plus"></i>
            </div>
            <h3>Officer Management</h3>
            <p>Create and manage security officer accounts with secure authentication protocols.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-users"></i>
            </div>
            <h3>Employee Registration</h3>
            <p>Register employees with comprehensive details including department and contact information.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-microchip"></i>
            </div>
            <h3>Device Registration</h3>
            <p>Register electronics devices with serial numbers, types, and assign them to employees.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-qrcode"></i>
            </div>
            <h3>QR Code Generation</h3>
            <p>Generate unique QR codes for each device for quick and accurate verification.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-search"></i>
            </div>
            <h3>Device Verification</h3>
            <p>Verify devices by employee ID or scan QR codes for instant authentication.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-history"></i>
            </div>
            <h3>Audit Trail</h3>
            <p>Complete audit log of all system activities for security and compliance.</p>
          </div>
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="about-content">
          <div className="about-text">
            <h2 className="section-title">About the System</h2>
            <p className="about-description">
              The Awash International Bank Electronics Control System is a comprehensive security solution designed to manage and track electronic devices within the organization. Our system provides real-time visibility into device assignments, ensuring accountability and security across all departments.
            </p>
            <p className="about-description">
              Built with security as a priority, the system features role-based access control, comprehensive audit trails, and QR-based verification to streamline device management while maintaining the highest security standards.
            </p>
            <div className="about-highlights">
              <div className="highlight-item">
                <i className="fas fa-check-circle"></i>
                <span>Role-based security</span>
              </div>
              <div className="highlight-item">
                <i className="fas fa-check-circle"></i>
                <span>Real-time tracking</span>
              </div>
              <div className="highlight-item">
                <i className="fas fa-check-circle"></i>
                <span>QR-based verification</span>
              </div>
              <div className="highlight-item">
                <i className="fas fa-check-circle"></i>
                <span>Complete audit logs</span>
              </div>
            </div>
          </div>
          <div className="about-visual">
            <div className="about-card">
              <div className="about-card-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Enterprise Security</h3>
              <p>Bank-grade security protocols protect all data and system access.</p>
            </div>
            <div className="about-card">
              <div className="about-card-icon">
                <i className="fas fa-tachometer-alt"></i>
              </div>
              <h3>Efficient Management</h3>
              <p>Streamlined workflows for quick device registration and verification.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <i className="fas fa-shield-alt"></i>
              <span>Awash Bank</span>
            </div>
            <p>Electronics Control System</p>
            <p className="footer-copyright">© 2024 FIRAOL BIRHANU. All rights reserved.</p>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <a href="#access">System Access</a>
            <a href="#features">Features</a>
            <a href="#about">About</a>
          </div>
          <div className="footer-contact">
            <h4>Security Department</h4>
            <p><i className="fas fa-envelope"></i> security@awashbank.com</p>
            <p><i className="fas fa-phone"></i> +251 11 555 0000</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
