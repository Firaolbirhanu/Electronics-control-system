# Awash International Bank Electronics Control System

A modern web-based control system for the security department built with React.js.

## Features
- Administrator-only security officer account creation
- Login as a security officer
- Register employees
- Register electronics devices
- Generate a QR code for each registered device
- Verify employee devices by employee ID or by scanning the QR code
- Complete audit trail review for administrators

## Tech Stack
- **Frontend**: React.js, React Router, Vite
- **Backend**: Flask (Python)
- **Styling**: CSS with modern design patterns
- **QR Libraries**: html5-qrcode, qrcode

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Python 3.x
- pip

## Installation & Setup

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the Flask backend server:
   ```bash
   python app.py
   ```

   The backend will run on http://127.0.0.1:5000

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm run dev
   ```

   The frontend will run on http://localhost:3000

## Access the Application
- Open http://localhost:3000 in your browser
- The React development server proxies API calls to the Flask backend

## Default Credentials
- **Administrator**: 
  - Username: `admin`
  - Password: `Admin@123`

## Usage
1. **Administrator**: Login via admin portal to create security officer accounts and review audit logs
2. **Security Officer**: Login to manage employees, register devices, and perform verification

## Data Storage
The application stores all records in the backend server's memory. Data persists as long as the backend server is running.
