import importlib.util
import sys
import unittest
from pathlib import Path

APP_PATH = Path(__file__).resolve().parent / 'app.py'

spec = importlib.util.spec_from_file_location('awash_backend', APP_PATH)
backend = importlib.util.module_from_spec(spec)
sys.modules['awash_backend'] = backend
spec.loader.exec_module(backend)


class AdminFlowTests(unittest.TestCase):
    def setUp(self):
        backend.state['officers'] = []
        backend.state['employees'] = []
        backend.state['devices'] = []
        backend.state['audit_log'] = []
        self.client = backend.app.test_client()

    def test_admin_login_with_hardcoded_credentials(self):
        response = self.client.post('/api/admin/login', json={
            'username': 'admin',
            'password': 'Admin@123'
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json()['username'], 'admin')

    def test_admin_can_create_security_officer_account(self):
        response = self.client.post('/api/admin/officers/register', json={
            'name': 'Jane Officer',
            'username': 'jane',
            'password': 'safe123',
            'adminUsername': 'admin',
            'adminPassword': 'Admin@123'
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.get_json()['username'], 'jane')

    def test_admin_audit_endpoint_is_protected(self):
        response = self.client.get('/api/admin/audit')
        self.assertEqual(response.status_code, 403)


if __name__ == '__main__':
    unittest.main()
