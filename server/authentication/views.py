from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from chat.models import Room, Message
from django.http import JsonResponse
from .models import Profile, Friend
import secrets
import json

def signup(request):
    if request.method == 'POST':
        jsonString = request.body.decode('utf-8')
        jsonBody = json.loads(jsonString)
        password = jsonBody["password"]
        if len(password) < 8:
            return JsonResponse({'status': 'error', 'message': 'Password must be at least 8 characters.'}, status=400)

        user = Profile.objects.create_user(password=password)
        user_auth = authenticate(request, username_token=user.username_token, password=password)
        if user_auth and user_auth.is_authenticated:
            # Create a JWT refresh token and access token for the new user
            refresh = RefreshToken.for_user(user_auth)
            return JsonResponse({
                'success': True,
                'message': 'Registration successful.',
                'token': user.username_token,
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh),
            })
        else:
            return JsonResponse({'status': 'error', 'message': 'Could not authenticate user.'}, status=401)

    return JsonResponse({'status': 'error', 'message': 'POST requests only'}, status=405)

def login(request):
    if request.method == 'POST':
        jsonString = request.body.decode('utf-8')
        jsonBody = json.loads(jsonString)
        user = authenticate(request, username_token=jsonBody["token"], password=jsonBody["password"])
        if user is not None:
            refresh = RefreshToken.for_user(user)
            return JsonResponse({
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh),
            })
        else:
            return JsonResponse({'success': False, 'message': 'Invalid credentials.'}, status=401)
    else:
        return JsonResponse({'success': False, 'message': 'Invalid request method.'}, status=405)

def logout_view(request):
    if request.method == 'POST':
        jsonString = request.body.decode('utf-8')
        jsonBody = json.loads(jsonString)
        refresh_token = jsonBody.get('refresh_token', None)
        if not refresh_token:
            return JsonResponse({'success': False, 'message': 'Refresh token required.'}, status=400)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return JsonResponse({'success': True, 'message': 'Logged out successfully.'})
        except TokenError:
            return JsonResponse({'success': False, 'message': 'Invalid or expired refresh token.'}, status=400)
    else:
        return JsonResponse({'success': False, 'message': 'Invalid request method.'}, status=405)

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def list_friends(request):
    user = request.user
    friends = Friend.objects.filter(user=user)
    friend_list = []
    for friend in friends:
        friend_list.append({'nickname': friend.nickname})
    return JsonResponse({'friends': friend_list})


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_friend_token(request):
    return JsonResponse({'friendInviteCode': request.user.friend_token})
  
@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def make_friends(request):
    if request.method == 'POST':
        jsonString = request.body.decode('utf-8')
        jsonBody = json.loads(jsonString)
        friend_token = jsonBody["friend_token"]
        if friend_token is None:
            return JsonResponse({'status': 'error', 'message': 'No friend token provided.'}, status=400)
        friendT = Profile.objects.get(friend_token=friend_token)
        user = request.user
        friend = Friend.objects.create(user=user, friend=friendT, nickname=secrets.token_hex(4))
        friend_friends = Friend.objects.create(user=friendT, friend=user, nickname=secrets.token_hex(4))
        room_name = ""
        namearray = [user.username_token,friendT.username_token]
        namearray.sort()
        for name in namearray:
            room_name += name
        room = Room.objects.create(name=room_name)
        room.users.add(user, friendT)
        room.save()
        user.friend_token = secrets.token_hex(4).upper()
        friendT.friend_token = secrets.token_hex(4).upper()
        user.save()
        friendT.save()
        if friend and friend_friends:
            return JsonResponse({'status': 'success', 'message': 'Friend added successfully.'})
        else:
            return JsonResponse({'status': 'error', 'message': 'Couldnt add friend'}, status=400)



@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_recent_messages(request):
    if not request.session.session_key:
        return JsonResponse({'status': 'error', 'message': 'Not logged in.'}, status=401)
    if request.method == 'POST':
        jsonString = request.body.decode('utf-8')
        jsonBody = json.loads(jsonString)
        nickname = jsonBody["nickname"]
        user = Profile.objects.get(username_token=request.session['username_token'])
        friend = Friend.objects.get(nickname=nickname, user=user)
        namearray = [request.session['username_token'],friend.friend.username_token]
        namearray.sort()
        room_name = ""
        for name in namearray:
            room_name += name
    # Get the most recent 10 messages from the room
    messages = Message.objects.filter(
        room__name=room_name).order_by('timestamp')[:10]

    # Serialize the messages to JSON format
    message_list = []
    for message in messages:
        message_list.append({
            'isOwn': message.author.username_token == request.session['username_token'],
            'content': message.content,
        })
    data = {'messages': message_list}
    return JsonResponse(data)

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def verify_session(request):
    return JsonResponse({'status': 'success', 'message': 'Session is valid.'})
