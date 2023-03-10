from django.shortcuts import redirect
from django.urls import reverse
from django.contrib.auth import get_user
from django.http import JsonResponse

class AuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        user = get_user(request)
        # check if user is authenticated
        if not user.is_authenticated:
            # redirect to login page
            return JsonResponse({'error': 'You are not logged in.'}, status=401)
        
        # call the next middleware or view
        response = self.get_response(request)
        return response 
