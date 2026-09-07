import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Landing from './components/Landing';
import AdminLogin from './components/AdminLogin';
import OfficerLogin from './components/OfficerLogin';
import AdminDashboard from './components/AdminDashboard';
import Dashboard from './components/Dashboard';

function App() {
  const [currentOfficer, setCurrentOfficer] = useState(null);
  const [currentAdmin, setCurrentAdmin] = useState(null);

  useEffect(() => {
    const savedOfficer = localStorage.getItem('awash-current-officer');
    const savedAdmin = localStorage.getItem('awash-current-admin');
    if (savedOfficer) setCurrentOfficer(JSON.parse(savedOfficer));
    if (savedAdmin) setCurrentAdmin(JSON.parse(savedAdmin));
  }, []);

  const handleOfficerLogin = (officer) => {
    setCurrentOfficer(officer);
    localStorage.setItem('awash-current-officer', JSON.stringify(officer));
  };

  const handleOfficerLogout = () => {
    setCurrentOfficer(null);
    localStorage.removeItem('awash-current-officer');
  };

  const handleAdminLogin = (admin) => {
    setCurrentAdmin(admin);
    localStorage.setItem('awash-current-admin', JSON.stringify(admin));
  };

  const handleAdminLogout = () => {
    setCurrentAdmin(null);
    localStorage.removeItem('awash-current-admin');
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/admin-login" element={<AdminLogin onLogin={handleAdminLogin} />} />
        <Route path="/login" element={<OfficerLogin onLogin={handleOfficerLogin} />} />
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute isAdmin={true} currentAdmin={currentAdmin}>
              <AdminDashboard currentAdmin={currentAdmin} onLogout={handleAdminLogout} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute isAdmin={false} currentOfficer={currentOfficer}>
              <Dashboard currentOfficer={currentOfficer} onLogout={handleOfficerLogout} />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function ProtectedRoute({ isAdmin, currentAdmin, currentOfficer, children }) {
  const location = useLocation();
  
  if (isAdmin && !currentAdmin) {
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }
  
  if (!isAdmin && !currentOfficer) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
}

export default App;
