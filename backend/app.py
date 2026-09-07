from datetime import datetime
from flask import Flask, jsonify, request

app = Flask(__name__)

ADMIN_USERNAME = 'admin'
ADMIN_PASSWORD = 'Admin@123'

state = {
    'officers': [],
    'employees': [],
    'devices': [],
    'audit_log': [],
}


def json_response(payload, status=200):
    response = jsonify(payload)
    response.status_code = status
    return response


def add_audit_entry(action, details='', actor='system'):
    state['audit_log'].append({
        'timestamp': datetime.utcnow().isoformat(timespec='seconds') + 'Z',
        'action': action,
        'details': details,
        'actor': actor,
    })


def verify_admin(payload=None):
    payload = payload or request.get_json(silent=True) or {}
    username = (payload.get('adminUsername') or payload.get('username') or '').strip()
    password = payload.get('adminPassword') or payload.get('password') or ''
    return username == ADMIN_USERNAME and password == ADMIN_PASSWORD


@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response


@app.route('/api/<path:path>', methods=['OPTIONS'])
def handle_options(path):
    return json_response({}, 200)


@app.route('/api/health', methods=['GET'])
def health_check():
    return json_response({'status': 'ok', 'service': 'awash-security-backend'})


@app.route('/api/state', methods=['GET'])
def get_state():
    return json_response(state)


@app.route('/api/admin/login', methods=['POST'])
def login_admin():
    payload = request.get_json(silent=True) or {}
    username = (payload.get('username') or '').strip()
    password = payload.get('password') or ''

    if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
        add_audit_entry('admin_login', details='Administrator logged in', actor=username)
        return json_response({'username': ADMIN_USERNAME, 'role': 'administrator'}, 200)

    return json_response({'error': 'Invalid administrator credentials.'}, 401)


@app.route('/api/admin/officers/register', methods=['POST'])
def register_officer():
    payload = request.get_json(silent=True) or {}
    if not verify_admin(payload):
        return json_response({'error': 'Administrator access required.'}, 403)

    name = (payload.get('name') or '').strip()
    username = (payload.get('username') or '').strip()
    password = payload.get('password') or ''

    if not name or not username or not password:
        return json_response({'error': 'Please provide name, username, and password.'}, 400)

    if any(entry['username'].lower() == username.lower() for entry in state['officers']):
        return json_response({'error': 'That username already exists.'}, 409)

    officer = {
        'id': f"OFF-{len(state['officers']) + 1:03d}",
        'name': name,
        'username': username,
        'password': password,
    }
    state['officers'].append(officer)
    add_audit_entry('officer_created', details=f"Created security officer {username}", actor=ADMIN_USERNAME)
    return json_response(officer, 201)


@app.route('/api/admin/audit', methods=['GET'])
def get_admin_audit():
    if not verify_admin(request.args.to_dict()):
        return json_response({'error': 'Administrator access required.'}, 403)
    return json_response(state['audit_log'])


@app.route('/api/officers/login', methods=['POST'])
def login_officer():
    payload = request.get_json(silent=True) or {}
    username = (payload.get('username') or '').strip()
    password = payload.get('password') or ''

    officer = next(
        (entry for entry in state['officers'] if entry['username'].lower() == username.lower() and entry['password'] == password),
        None,
    )

    if not officer:
        return json_response({'error': 'Invalid username or password.'}, 401)

    add_audit_entry('officer_login', details=f"Security officer signed in as {username}", actor=username)
    return json_response(officer, 200)


@app.route('/api/employees', methods=['GET'])
def get_employees():
    return json_response(state['employees'])


@app.route('/api/employees', methods=['POST'])
def create_employee():
    payload = request.get_json(silent=True) or {}
    employee_id = (payload.get('employeeId') or '').strip()
    name = (payload.get('name') or '').strip()
    department = (payload.get('department') or '').strip()
    phone = (payload.get('phone') or '').strip()
    email = (payload.get('email') or '').strip()

    if not all([employee_id, name, department, phone, email]):
        return json_response({'error': 'Please complete all employee fields.'}, 400)

    if any(entry['employeeId'].lower() == employee_id.lower() for entry in state['employees']):
        return json_response({'error': 'This employee ID already exists.'}, 409)

    employee = {
        'employeeId': employee_id,
        'name': name,
        'department': department,
        'phone': phone,
        'email': email,
        'registeredAt': payload.get('registeredAt') or 'now',
    }
    state['employees'].append(employee)
    add_audit_entry('employee_created', details=f"Created employee {employee_id}", actor='security_officer')
    return json_response(employee, 201)


@app.route('/api/devices', methods=['GET'])
def get_devices():
    return json_response(state['devices'])


@app.route('/api/devices', methods=['POST'])
def create_device():
    payload = request.get_json(silent=True) or {}
    employee_id = (payload.get('employeeId') or '').strip()
    device_name = (payload.get('deviceName') or '').strip()
    device_type = (payload.get('deviceType') or '').strip()
    serial_number = (payload.get('serialNumber') or '').strip()
    notes = (payload.get('notes') or '').strip()

    if not all([employee_id, device_name, device_type, serial_number]):
        return json_response({'error': 'Please complete all device fields.'}, 400)

    device = {
        'deviceId': f"DEV-{len(state['devices']) + 1:03d}",
        'employeeId': employee_id,
        'employeeName': payload.get('employeeName') or 'Unknown',
        'deviceName': device_name,
        'deviceType': device_type,
        'serialNumber': serial_number,
        'notes': notes,
        'registeredAt': payload.get('registeredAt') or 'now',
    }
    state['devices'].append(device)
    add_audit_entry('device_registered', details=f"Registered device {device_name}", actor='security_officer')
    return json_response(device, 201)


@app.route('/api/verify/employee/<employee_id>', methods=['GET'])
def verify_employee(employee_id):
    employee = next((entry for entry in state['employees'] if entry['employeeId'].lower() == employee_id.lower()), None)
    if not employee:
        return json_response({'error': f'No employee found for {employee_id}.'}, 404)

    devices = [entry for entry in state['devices'] if entry['employeeId'].lower() == employee_id.lower()]
    return json_response({'employee': employee, 'devices': devices})


@app.route('/api/verify/device/<device_id>', methods=['GET'])
def verify_device(device_id):
    device = next((entry for entry in state['devices'] if entry['deviceId'].lower() == device_id.lower()), None)
    if not device:
        return json_response({'error': f'No device found for {device_id}.'}, 404)

    employee = next((entry for entry in state['employees'] if entry['employeeId'].lower() == device['employeeId'].lower()), None)
    return json_response({'device': device, 'employee': employee})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
