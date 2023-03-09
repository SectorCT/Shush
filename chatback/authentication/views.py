from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password
from .models import Profile
from django.contrib.auth.hashers import check_password

@method_decorator(csrf_exempt, name='dispatch')
class SignUpView(APIView):
    def post(self, request):
        password = request.data.get('password')
        # generate a random token
        token = Profile.objects.make_random_token()
        # create a new user profile
        profile = Profile.objects.create(token=token, password=make_password(password))
        login(request, profile)
        return Response({'detail': 'Sign up successful'})


@method_decorator(csrf_exempt, name='dispatch')
class TokenAuthenticationView(APIView):
    def post(self, request):
        token = request.data.get('token')
        password = request.data.get('password')
        try:    
            profile = Profile.objects.get(token=token)
            if check_password(password, profile.password):
                login(request, profile)
                return Response({'detail': 'Logged in successfully'})
            else:
                return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        except Profile.DoesNotExist:
            return Response({'detail': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)

