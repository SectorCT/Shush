<<<<<<< HEAD
=======
from authentication.serializers import ProfileSerializer
from rest_framework import permissions
from rest_framework import viewsets
import json
from rest_framework.decorators import api_view
>>>>>>> fea8c7f19530dac01e211c434c5dd42fef941f39
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
<<<<<<< HEAD
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
import json
=======
<< << << < HEAD
== == == =
>>>>>> > 3946179ec98f7d66ce48790de790b48a017744b0
>>>>>>> fea8c7f19530dac01e211c434c5dd42fef941f39

User = get_user_model()


@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        jsonString = request.body.decode('utf-8')
        jsonBody = json.loads(jsonString)
        user = authenticate(
            request, token=jsonBody["token"], password=jsonBody["password"])
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
        jsonString = request.body.decode('utf-8')
        jsonBody = json.loads(jsonString)
        password = jsonBody["password"]
        user = Profile.objects.create_user(password=password)
        print(user)
        if user:
            return JsonResponse({'status': 'success'})
        else:
            return JsonResponse({'status': 'error', 'message': 'Could not create user'})

    return JsonResponse({'status': 'error', 'message': 'POST requests only'})


<<<<<<< HEAD
#@login_required
#def user_token(request):
#   return JsonResponse({'token': request.user.token1})

class UserTokenView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        user = request.user
        token1 = user.token1
        return Response({'token1': token1})

=======
@login_required
@api_view(['GET'])
def gettoken(request):
    user = request.user
    token = user.token1
    serialized_token1 = ProfileSerializer(user).data['token1']
    # Return the serialized token1 value
    return Response({'token1': serialized_token1}, status=status.HTTP_200_OK)
>>>>>>> fea8c7f19530dac01e211c434c5dd42fef941f39
