from django.test import TestCase
from django.test.client import RequestFactory
from .views import signup

class SignupTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        
    def test_signup(self):
        # Create a fake POST request with the password data
        request = self.factory.post('/signup/', {'password': 'mysecretpassword'})
        
        # Call the signup function with the fake request
        response = signup(request)
        
        # Check that the response indicates success
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'status': 'success'})
