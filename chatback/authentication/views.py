from django.views.decorators.csrf import csrf_exempt
from .models import Profile
from django.http import JsonResponse
from .models import Profile
from django.contrib.auth import authenticate, login
from django.http import JsonResponse


@csrf_exempt
def signup(request):
    if request.method == 'POST':
        password = request.POST.get('password')
        user = Profile.objects.create_user(password)
        if user:
            return JsonResponse({'status': 'success'})
        else:
            return JsonResponse({'status': 'error', 'message': 'Could not create user'})
    
    return JsonResponse({'status': 'error', 'message': 'POST requests only'})


def user_login(request):
    if request.method == 'POST':
        password = request.POST.get('password')
        token = request.POST.get('token')

        user = authenticate(request, token=token, password=password)

        if user is not None:
            login(request, user)
            return JsonResponse({'status': 'success'})
        else:
            return JsonResponse({'status': 'error', 'message': 'Invalid credentials'})
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'})


