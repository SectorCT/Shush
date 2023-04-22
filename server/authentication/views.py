from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.permissions import IsAuthenticated, AllowAny
from .custom_jwt_authentication import CustomJWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from chat.models import Room, Message
from django.http import JsonResponse
from .models import Profile, Friend, OneTimePreKey
from django.core.cache import cache
from rest_framework import status
from datetime import datetime
import secrets
import random
import json

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([CustomJWTAuthentication])
def change_password(request):
    jsonString = request.body.decode('utf-8')
    jsonBody = json.loads(jsonString)

    user = request.user
    old_password = jsonBody['old_password']
    new_password = jsonBody['new_password']

    if user.check_password(old_password):
        user.set_password(new_password)
        user.save()
        return JsonResponse({'success': True}, status=200)
    else:
        return JsonResponse({'success': False}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([CustomJWTAuthentication])
def send_public_keys(request):
    user = request.user
    one_time_keys = OneTimePreKey.objects.filter(user=user)

    if one_time_keys:
        one_time_key = random.choice(one_time_keys)
        OneTimePreKey.objects.filter(public_key=one_time_key.public_key).delete()
        new_one_time_key = OneTimePreKey.objects.create(user=user)
    else:
        new_one_time_key = OneTimePreKey.objects.create(user=user)

    response_data = {
        'success': True,
        'identity_public_key': user.identity_public_key,
        'signed_prekey_public_key': user.signed_prekey_public_key,
        'one_time_key': new_one_time_key.public_key
    }

    return JsonResponse(response_data, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([CustomJWTAuthentication])
def update_identity_public_key(request):
    jsonString = request.body.decode('utf-8')
    jsonBody = json.loads(jsonString)

    identity_public_key = jsonBody.get("identity_public_key", None)

    if not identity_public_key:
        return JsonResponse({'success': False, 'message': 'identity_public_key required.'}, status=400)
    

    user = request.user
    user.identity_public_key = identity_public_key
    user.save()
    if request.user.identity_public_key == identity_public_key:
        return JsonResponse({'success': True, 'message': 'Identity public key updated.'}, status=200)
    else:
        return JsonResponse({'success': False, 'message': 'Identity public key not updated.'}, status=400)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([CustomJWTAuthentication])
def update_signed_public_key(request):
    jsonString = request.body.decode('utf-8')
    jsonBody = json.loads(jsonString)

    signed_prekey_public_key = jsonBody.get("signed_prekey_public_key", None)

    if not signed_prekey_public_key:
        return JsonResponse({'success': False, 'message': 'signed_prekey_public_key required.'}, status=400)

    user = request.user
    user.signed_prekey_public_key = signed_prekey_public_key
    user.save()

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([CustomJWTAuthentication])
def remove_friend(request):
    jsonString = request.body.decode('utf-8')
    jsonBody = json.loads(jsonString)
    friendship_token = jsonBody.get("friendship_token", None)

    if not friendship_token:
        return JsonResponse({'success': False, 'message': 'friendship_token is required.'}, status=400)

    friend_instance_ofUser = Friend.objects.get(friendship_token=friendship_token)
    friend_instance_ofUser.delete()

    friend_instance_ofFriend = Friend.objects.get(user=friend_instance_ofUser.friend, friend=friend_instance_ofUser.user)
    friend_instance_ofFriend.delete()
    return JsonResponse({'success': True, 'message': 'Friend removed.'}, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([CustomJWTAuthentication])
def change_nickname(request):
    jsonString = request.body.decode('utf-8')
    jsonBody = json.loads(jsonString)
    friendship_token = jsonBody.get("friendship_token", None)
    new_nickname = jsonBody.get("new_nickname", None)

    if not friendship_token or not new_nickname:
        return JsonResponse({'success': False, 'message': 'Both friendship_token and new_nickname are required.'}, status=400)

    friend_instance = Friend.objects.get(friendship_token=friendship_token)
    friend_instance.nickname = new_nickname
    friend_instance.save()
    return JsonResponse({'success': True, 'message': 'Nickname changed.'}, status=200)

@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token(request):
    jsonString = request.body.decode('utf-8')
    jsonBody = json.loads(jsonString)
    refresh_token_str = jsonBody.get('refresh_token', None)

    if not refresh_token_str:
        return JsonResponse({'success': False, 'message': 'Refresh token required.'}, status=400)

    try:
        refresh_token = RefreshToken(refresh_token_str)
        new_access_token = str(refresh_token.access_token)
        return JsonResponse({'access_token': new_access_token}, status=status.HTTP_200_OK)

    except TokenError:
        return JsonResponse({'success': False, 'message': 'Invalid or expired refresh token.'}, status=400)

@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
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

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
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

@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([CustomJWTAuthentication])
def logout(request):
    jsonString = request.body.decode('utf-8')
    jsonBody = json.loads(jsonString)
    refresh_token = jsonBody.get('refresh_token', None)
    if not refresh_token:
        return JsonResponse({'success': False, 'message': 'Refresh token required.'}, status=400)

    try:
        token = RefreshToken(refresh_token)
        expiration = token.payload.get('exp')
        remaining_ttl = expiration - int(datetime.now().timestamp())
        cache.set(f'blacklisted_{refresh_token}', 'true', remaining_ttl)
        return JsonResponse({'success': True, 'message': 'Logged out successfully.'})
    except TokenError:
        return JsonResponse({'success': False, 'message': 'Invalid or expired refresh token.'}, status=400)

@api_view(['GET'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def list_friends(request):
    user = request.user
    friends = Friend.objects.filter(user=user)
    friend_list = []    
    for friend in friends:
        friend_list.append({'nickname': friend.nickname, 'friendship_token': friend.friendship_token})
    return JsonResponse({'friends': friend_list})


@api_view(['GET'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def get_friend_token(request):
    return JsonResponse({'friendInviteCode': request.user.friend_token})
  
@api_view(['POST'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def make_friends(request):
    if request.method == 'POST':
        jsonString = request.body.decode('utf-8')
        jsonBody = json.loads(jsonString)
        friend_token = jsonBody["friend_token"]
        if friend_token is None:
            return JsonResponse({'status': 'error', 'message': 'No friend token provided.'}, status=400)
        friend_username_token = Profile.objects.get(friend_token=friend_token)
        user = request.user
        user_friend_instance = Friend.objects.create(user=user, friend=friend_username_token, nickname=secrets.token_hex(4), friendship_token=secrets.token_hex(4).upper())
        friend_instance = Friend.objects.create(user=friend_username_token, friend=user, nickname=secrets.token_hex(4), friendship_token=secrets.token_hex(4).upper())
        room_name = ""
        namearray = [user.username_token,friend_username_token.username_token]
        namearray.sort()
        for name in namearray:
            room_name += name
        room = Room.objects.create(name=room_name)
        room.users.add(user, friend_username_token)
        room.save()
        user.friend_token = secrets.token_hex(4).upper()
        friend_username_token.friend_token = secrets.token_hex(4).upper()
        user.save()
        friend_username_token.save()
        if user_friend_instance and friend_instance:
            return JsonResponse({'status': 'success', 'message': 'Friend added successfully.'})
        else:
            return JsonResponse({'status': 'error', 'message': 'Couldnt add friend'}, status=400)

@api_view(['POST'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def get_recent_messages(request):
    jsonString = request.body.decode('utf-8')
    jsonBody = json.loads(jsonString)
    friendship_token = jsonBody["friendship_token"]
    friend_instance = Friend.objects.get(friendship_token=friendship_token)
    namearray = [request.user.username_token,friend_instance.friend.username_token]
    namearray.sort()
    room_name = ""
    for name in namearray:
        room_name += name
    # Get the most recent 10 messages from the room
    messages = Message.objects.filter(
        room__name=room_name).order_by('timestamp')[:10]

    # Serialize the messages to JSON format
    message_list = []
    user = request.user
    for message in messages:
        message_data = {
            'isOwn': message.author.username_token == user.username_token,
            'content': message.content,
        }
        
        if message.image:
            message_data['imageUrl'] = request.build_absolute_uri(message.image.url)
        else:
            message_data['imageUrl'] = None

        message_list.append(message_data)

    data = {'messages': message_list}
    return JsonResponse(data)

@api_view(['GET'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def verify_session(request):
    return JsonResponse({'status': 'success', 'message': 'Session is valid.'})
