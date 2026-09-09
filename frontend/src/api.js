const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

export async function getHealth() {
  return requestJson(`${API_BASE}/health`);
}

export async function getState() {
  return requestJson(`${API_BASE}/state`);
}

export async function adminLogin(username, password) {
  return requestJson(`${API_BASE}/admin/login`, {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export async function adminRegisterOfficer(adminUsername, adminPassword, name, username, password) {
  return requestJson(`${API_BASE}/admin/officers/register`, {
    method: 'POST',
    body: JSON.stringify({
      name,
      username,
      password,
      adminUsername,
      adminPassword,
    }),
  });
}

export async function getAdminAudit(adminUsername, adminPassword) {
  return requestJson(`${API_BASE}/admin/audit?adminUsername=${encodeURIComponent(adminUsername)}&adminPassword=${encodeURIComponent(adminPassword)}`);
}

export async function officerLogin(username, password) {
  return requestJson(`${API_BASE}/officers/login`, {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export async function createEmployee(employeeId, name, department, phone, email) {
  return requestJson(`${API_BASE}/employees`, {
    method: 'POST',
    body: JSON.stringify({ employeeId, name, department, phone, email }),
  });
}

export async function createDevice(employeeId, employeeName, deviceName, deviceType, serialNumber, notes) {
  return requestJson(`${API_BASE}/devices`, {
    method: 'POST',
    body: JSON.stringify({
      employeeId,
      employeeName,
      deviceName,
      deviceType,
      serialNumber,
      notes,
    }),
  });
}

export async function verifyEmployee(employeeId) {
  return requestJson(`${API_BASE}/verify/employee/${encodeURIComponent(employeeId)}`);
}

export async function verifyDevice(deviceId) {
  return requestJson(`${API_BASE}/verify/device/${encodeURIComponent(deviceId)}`);
}
