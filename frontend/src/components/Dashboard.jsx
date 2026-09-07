import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getState, createEmployee, createDevice, verifyEmployee, verifyDevice } from '../api';
import QRCode from 'qrcode';

function Dashboard({ currentOfficer, onLogout }) {
  const [state, setState] = useState({
    officers: [],
    employees: [],
    devices: [],
    auditLog: [],
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [verificationResult, setVerificationResult] = useState({ text: '', type: '' });
  
  // Employee form state
  const [employeeId, setEmployeeId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [employeeDepartment, setEmployeeDepartment] = useState('');
  const [employeePhone, setEmployeePhone] = useState('');
  const [employeeEmail, setEmployeeEmail] = useState('');
  
  // Device form state
  const [deviceEmployeeId, setDeviceEmployeeId] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [deviceSerial, setDeviceSerial] = useState('');
  const [deviceNotes, setDeviceNotes] = useState('');
  const [qrCodeData, setQrCodeData] = useState(null);
  
  // Verification state
  const [verifyEmployeeIdInput, setVerifyEmployeeIdInput] = useState('');
  const [scannerInstance, setScannerInstance] = useState(null);
  const readerRef = useRef(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (currentOfficer) {
      refreshFromServer();
      setMessage({ text: `Welcome back, ${currentOfficer.name}.`, type: 'success' });
    }
  }, [currentOfficer]);

  const refreshFromServer = async () => {
    try {
      const data = await getState();
      setState({
        officers: data.officers || [],
        employees: data.employees || [],
        devices: data.devices || [],
        auditLog: data.audit_log || [],
      });
    } catch (error) {
      setMessage({ text: `Unable to connect to the backend: ${error.message}`, type: 'error' });
    }
  };

  const handleEmployeeRegistration = async (e) => {
    e.preventDefault();
    if (!employeeId || !employeeName || !employeeDepartment || !employeePhone || !employeeEmail) {
      setMessage({ text: 'Please complete all employee fields.', type: 'error' });
      return;
    }

    try {
      await createEmployee(employeeId, employeeName, employeeDepartment, employeePhone, employeeEmail);
      await refreshFromServer();
      setEmployeeId('');
      setEmployeeName('');
      setEmployeeDepartment('');
      setEmployeePhone('');
      setEmployeeEmail('');
      setMessage({ text: `Employee ${employeeName} registered successfully.`, type: 'success' });
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    }
  };

  const handleDeviceRegistration = async (e) => {
    e.preventDefault();
    if (!deviceEmployeeId || !deviceName || !deviceType || !deviceSerial) {
      setMessage({ text: 'Please complete all device fields.', type: 'error' });
      return;
    }

    try {
      const employee = state.employees.find((emp) => emp.employeeId === deviceEmployeeId);
      const device = await createDevice(
        deviceEmployeeId,
        employee?.name || 'Unknown',
        deviceName,
        deviceType,
        deviceSerial,
        deviceNotes
      );
      await refreshFromServer();
      generateQRCode(device);
      setMessage({ text: `Device ${device.deviceName} registered and assigned to ${employee?.name || deviceEmployeeId}.`, type: 'success' });
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    }
  };

  const generateQRCode = async (device) => {
    try {
      const payload = `AWASH-DEVICE:${device.deviceId}`;
      const qrDataUrl = await QRCode.toDataURL(payload, { width: 220 });
      setQrCodeData(qrDataUrl);
    } catch (error) {
      console.error('QR code generation failed:', error);
    }
  };

  const verifyByEmployeeId = async (e) => {
    e.preventDefault();
    if (!verifyEmployeeIdInput) {
      setVerificationResult({ text: 'Please enter an employee ID first.', type: 'error' });
      return;
    }

    try {
      const data = await verifyEmployee(verifyEmployeeIdInput);
      const employee = data.employee;
      const employeeDevices = data.devices || [];

      const deviceRows = employeeDevices.length
        ? employeeDevices.map((device) => `
            <li>
              <strong>${device.deviceName}</strong> (${device.deviceType})<br />
              Device ID: ${device.deviceId}<br />
              Serial: ${device.serialNumber}<br />
              Notes: ${device.notes || 'No notes'}
            </li>
          `).join('')
        : '<li>No devices registered for this employee.</li>';

      setVerificationResult({
        text: `
          <strong>Employee:</strong> ${employee.name}<br />
          <strong>Employee ID:</strong> ${employee.employeeId}<br />
          <strong>Department:</strong> ${employee.department}<br />
          <strong>Phone:</strong> ${employee.phone}<br />
          <strong>Email:</strong> ${employee.email}<br />
          <strong>Devices:</strong><ul>${deviceRows}</ul>
        `,
        type: 'success'
      });
    } catch (error) {
      setVerificationResult({ text: error.message, type: 'error' });
    }
  };

  const startScanner = () => {
    if (!window.Html5QrcodeScanner) {
      setVerificationResult({ text: 'QR scanner library could not load. Please use the employee ID verification option.', type: 'error' });
      return;
    }

    if (readerRef.current) {
      readerRef.current.innerHTML = '';
    }

    const scanner = new window.Html5QrcodeScanner('reader', { fps: 10, qrbox: 220 }, false);
    setScannerInstance(scanner);

    scanner.render(
      (decodedText) => {
        setVerifyEmployeeIdInput(decodedText);
        verifyByQrPayload(decodedText);
        scanner.clear().catch(() => {});
      },
      (error) => {
        console.info('QR scan error', error);
      }
    );
  };

  const verifyByQrPayload = async (input) => {
    const value = input.trim();
    if (!value) {
      setVerificationResult({ text: 'No QR data detected.', type: 'error' });
      return;
    }

    const deviceId = value.includes(':') ? value.split(':').pop() : value;

    try {
      const data = await verifyDevice(deviceId);
      const device = data.device;
      const employee = data.employee;

      setVerificationResult({
        text: `
          <strong>Device:</strong> ${device.deviceName}<br />
          <strong>Device ID:</strong> ${device.deviceId}<br />
          <strong>Employee:</strong> ${employee?.name || 'Unknown'}<br />
          <strong>Employee ID:</strong> ${device.employeeId}<br />
          <strong>Serial:</strong> ${device.serialNumber}<br />
          <strong>Notes:</strong> ${device.notes || 'No notes'}
        `,
        type: 'success'
      });
    } catch (error) {
      setVerificationResult({ text: error.message, type: 'error' });
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const employeeOptions = state.employees.map((employee) => (
    <option key={employee.employeeId} value={employee.employeeId}>
      {employee.name} ({employee.employeeId})
    </option>
  ));

  const recordsRows = state.employees.map((employee) => {
    const devices = state.devices.filter((device) => device.employeeId === employee.employeeId);
    return (
      <tr key={employee.employeeId}>
        <td>{employee.employeeId}</td>
        <td>{employee.name}</td>
        <td>{employee.department}</td>
        <td>{devices.length}</td>
      </tr>
    );
  });

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
            <p className="eyebrow">Security Department</p>
            <h2>Operations Dashboard</h2>
          </div>
        </div>
      </section>

      <div className="stats">
        <div className="stat-box">
          <span>Security officers</span>
          <strong>{state.officers.length}</strong>
        </div>
        <div className="stat-box">
          <span>Employees</span>
          <strong>{state.employees.length}</strong>
        </div>
        <div className="stat-box">
          <span>Registered devices</span>
          <strong>{state.devices.length}</strong>
        </div>
      </div>

      <div className="content-grid">
        <section className="card">
          <h3>Register Employee</h3>
          <form onSubmit={handleEmployeeRegistration} className="stacked-form">
            <label>
              Employee ID
              <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="EMP-1001"
                required
              />
            </label>
            <label>
              Full name
              <input
                type="text"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                required
              />
            </label>
            <label>
              Department
              <input
                type="text"
                value={employeeDepartment}
                onChange={(e) => setEmployeeDepartment(e.target.value)}
                required
              />
            </label>
            <label>
              Phone number
              <input
                type="text"
                value={employeePhone}
                onChange={(e) => setEmployeePhone(e.target.value)}
                required
              />
            </label>
            <label>
              Email address
              <input
                type="email"
                value={employeeEmail}
                onChange={(e) => setEmployeeEmail(e.target.value)}
                required
              />
            </label>
            <button type="submit">Register employee</button>
          </form>
          {message.text && (
            <div className={`message ${message.type}`} aria-live="polite">
              {message.text}
            </div>
          )}
        </section>

        <section className="card">
          <h3>Register Electronics Device</h3>
          <form onSubmit={handleDeviceRegistration} className="stacked-form">
            <label>
              Select employee
              <select
                value={deviceEmployeeId}
                onChange={(e) => setDeviceEmployeeId(e.target.value)}
                required
              >
                <option value="">Choose an employee</option>
                {employeeOptions}
              </select>
            </label>
            <label>
              Device name
              <input
                type="text"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                required
              />
            </label>
            <label>
              Device type
              <input
                type="text"
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value)}
                placeholder="Laptop / Tablet / Scanner"
                required
              />
            </label>
            <label>
              Serial number
              <input
                type="text"
                value={deviceSerial}
                onChange={(e) => setDeviceSerial(e.target.value)}
                required
              />
            </label>
            <label>
              Notes
              <textarea
                value={deviceNotes}
                onChange={(e) => setDeviceNotes(e.target.value)}
                rows="3"
              />
            </label>
            <button type="submit">Register device</button>
          </form>
          {qrCodeData && (
            <div className="qr-box">
              <img src={qrCodeData} alt="QR Code" />
            </div>
          )}
        </section>

        <section className="card">
          <h3>Verify Employee Device</h3>
          <form onSubmit={verifyByEmployeeId} className="stacked-form">
            <label>
              Employee ID
              <input
                type="text"
                value={verifyEmployeeIdInput}
                onChange={(e) => setVerifyEmployeeIdInput(e.target.value)}
                placeholder="Enter employee ID"
              />
            </label>
            <button type="submit">Verify by employee ID</button>
          </form>

          <div className="scanner-panel">
            <button type="button" onClick={startScanner} className="secondary">Scan QR code</button>
            <div id="reader" ref={readerRef} className="reader-box"></div>
          </div>
          {verificationResult.text && (
            <div className={`result-box ${verificationResult.type}`} dangerouslySetInnerHTML={{ __html: verificationResult.text }} />
          )}
        </section>
      </div>

      <section className="card">
        <h3>Registered Records</h3>
        <table className="records-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Devices</th>
            </tr>
          </thead>
          <tbody>
            {recordsRows.length > 0 ? recordsRows : <tr><td colSpan="4">No employees registered yet.</td></tr>}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default Dashboard;
