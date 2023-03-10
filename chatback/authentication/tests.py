from django.test import TestCase
from django.contrib.auth import get_user_model

User = get_user_model()

class LoginTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(token="admin", password="admin")

    def test_login(self):
        response = self.client.post('/api/token/', {'token': 'admin', 'password': 'admin'})
        self.assertEqual(response.status_code, 200)
        self.assertIn('access', response.json())
        self.assertIn('refresh', response.json())