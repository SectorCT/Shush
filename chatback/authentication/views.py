from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from .models import Profile
from django.http import JsonResponse
from .models import Profile
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate, login
from .models import Profile
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
import json

User = get_user_model()

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        token = request.POST.get('token')
        password = request.POST.get('password')
        user = authenticate(request, token=token, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'success': True, 'message': 'Logged in successfully.'})
        else:
            return JsonResponse({'success': False, 'message': 'Invalid credentials.'})
    else:
        return JsonResponse({'success': False, 'message': 'Invalid request method.'})

@csrf_exempt
def signup(request):
    if request.method == 'POST':
        password = request.POST.get('password')
        user = Profile.objects.create_user(password=password)
        print(user)
        if user:
            return JsonResponse({'status': 'success'})
        else:
            return JsonResponse({'status': 'error', 'message': 'Could not create user'})

    return JsonResponse({'status': 'error', 'message': 'POST requests only'})


#@login_required
#def user_token(request):
#   return JsonResponse({'token': request.user.token1})

class UserTokenView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        user = request.user
        token1 = user.token1
        return Response({'token1': token1})

