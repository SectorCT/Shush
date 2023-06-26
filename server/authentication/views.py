from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework.permissions import IsAuthenticated, AllowAny
from .custom_jwt_authentication import CustomJWTAuthentication
from rest_framework_simplejwt.exceptions import TokenError
from .models import Profile, Friend, OneTimePreKey
from django.contrib.auth import authenticate
from datetime import datetime, timezone
from chat.models import Room, Message
from django.http import JsonResponse
from django.core.cache import cache
from rest_framework import status
from django.db.models import Max
import secrets
import random
import json

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
            'status': "success",
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
                'status': "success",
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh),
            })
        else:
            return JsonResponse({'status': "error", 'message': 'Invalid credentials.'}, status=401)

@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([CustomJWTAuthentication])
def logout(request):
    jsonString = request.body.decode('utf-8')
    jsonBody = json.loads(jsonString)
    refresh_token = jsonBody.get('refresh_token', None)

    if not refresh_token:
        return JsonResponse({'status': "error", 'message': 'Refresh token and access token required.'}, status=400)

    try:
        # Blacklist refresh token
        refresh = RefreshToken(refresh_token)
        refresh_expiration = refresh.payload.get('exp')
        refresh_remaining_ttl = refresh_expiration - int(datetime.now().timestamp())
        cache.set(f'blacklisted_{refresh_token}', 'true', refresh_remaining_ttl)

        return JsonResponse({"status": "success", 'message': 'Logged out successfully.'})
    except TokenError:
        return JsonResponse({"status": "error", 'message': 'Invalid or expired tokens.'}, status=400)

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
        "status": "success",
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
        return JsonResponse({"status": "error", 'message': 'identity_public_key required.'}, status=400)
    

    user = request.user
    user.identity_public_key = identity_public_key
    user.save()
    if request.user.identity_public_key == identity_public_key:
        return JsonResponse({"status": "success", 'message': 'Identity public key updated.'}, status=200)
    else:
        return JsonResponse({"status": "error", 'message': 'Identity public key not updated.'}, status=400)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([CustomJWTAuthentication])
def update_signed_public_key(request):
    jsonString = request.body.decode('utf-8')
    jsonBody = json.loads(jsonString)

    signed_prekey_public_key = jsonBody.get("signed_prekey_public_key", None)

    if not signed_prekey_public_key:
        return JsonResponse({"status": "error", 'message': 'signed_prekey_public_key required.'}, status=400)

    user = request.user
    user.signed_prekey_public_key = signed_prekey_public_key
    user.save()

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([CustomJWTAuthentication])
def remove_friend(request):
    # Parse the JSON request body
    jsonString = request.body.decode('utf-8')
    jsonBody = json.loads(jsonString)

    # Retrieve the friendship token from the request body
    friendship_token = jsonBody.get("friendship_token", None)

    # Check if the friendship token is provided
    if not friendship_token:
        return JsonResponse({"status": "error", 'message': 'friendship_token is required.'}, status=400)

    # Get the friend instance for the user
    friend_instance_ofUser = Friend.objects.get(friendship_token=friendship_token)

    # Generate the room name based on the username tokens
    namearray = [friend_instance_ofUser.user.username_token, friend_instance_ofUser.friend.username_token]
    namearray.sort()
    room_name = "".join(namearray)

    # Find the room and delete it
    room = Room.objects.get(name=room_name)
    room.delete()

    # Delete the friend instance for the user
    friend_instance_ofUser.delete()

    # Find the friend instance for the friend and delete it
    friend_instance_ofFriend = Friend.objects.get(user=friend_instance_ofUser.friend, friend=friend_instance_ofUser.user)
    friend_instance_ofFriend.delete()

    # Return a success message
    return JsonResponse({"status": "success", 'message': 'Friend removed.'}, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([CustomJWTAuthentication])
def change_nickname(request):
    jsonString = request.body.decode('utf-8')
    jsonBody = json.loads(jsonString)
    friendship_token = jsonBody.get("friendship_token", None)
    new_nickname = jsonBody.get("new_nickname", None)

    if not friendship_token or not new_nickname:
        return JsonResponse({"status": "error", 'message': 'Both friendship_token and new_nickname are required.'}, status=400)

    friend_instance = Friend.objects.get(friendship_token=friendship_token)
    friend_instance.nickname = new_nickname
    friend_instance.save()
    return JsonResponse({"status": "success", 'message': 'Nickname changed.'}, status=200)

@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token(request):
    # Parse the JSON request body
    jsonString = request.body.decode('utf-8')
    jsonBody = json.loads(jsonString)

    # Retrieve the refresh token from the request body
    refresh_token_str = jsonBody.get('refresh_token', None)

    # Check if the refresh token is provided
    if not refresh_token_str:
        return JsonResponse({"status": "error", 'message': 'Refresh token required.'}, status=400)

    try:
        # Create a RefreshToken instance and generate a new access token
        refresh_token = RefreshToken(refresh_token_str)
        new_access_token = str(refresh_token.access_token)

        # Return the new access token in the response
        return JsonResponse({'access_token': new_access_token}, status=status.HTTP_200_OK)

    except TokenError:
        # Handle invalid or expired refresh tokens
        return JsonResponse({"status": "error", 'message': 'Invalid or expired refresh token.'}, status=400)


@api_view(['GET'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def list_friends(request):
    user = request.user
    try:
        friends = Friend.objects.filter(user=user)
    except Friend.DoesNotExist:
        return JsonResponse({"status": "error", 'message': 'No friends found.'}, status=400)

    # Create a list to store friend data with their latest message timestamp
    friend_data = []

    for friend in friends:
        # Find the room associated with the current friend
        namearray = [user.username_token, friend.friend.username_token]
        namearray.sort()
        room_name = "".join(namearray)
        room = Room.objects.get(name=room_name)

        try:
            latest_message = Message.objects.filter(room=room).latest('timestamp')
            latest_message_timestamp = latest_message.timestamp
        except Message.DoesNotExist:
            latest_message = None
            latest_message_timestamp = None

        # Add friend data along with the latest message timestamp
        friend_data.append({
            'nickname': friend.nickname,
            'friendship_token': friend.friendship_token,
            'is_latest_message_from_me': latest_message and latest_message.author.username_token == user.username_token,
            'latest_message': latest_message.content if latest_message else None,
            'latest_timestamp': latest_message_timestamp
        })

    # Sort the friend_data list by the latest message timestamp in descending order
    min_datetime = datetime.min.replace(tzinfo=timezone.utc)
    friend_data.sort(key=lambda x: x['latest_timestamp'] or min_datetime, reverse=True)

    # Create the final friend_list with sorted friend data
    friend_list = [{'nickname': data['nickname'], 'friendship_token': data['friendship_token'], 'is_latest_message_from_me': data['is_latest_message_from_me'], 'latest_message': data['latest_message']} for data in friend_data]

    return JsonResponse({'friends': friend_list})
  
@api_view(['POST'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def make_friends(request):
    # Decode and parse the JSON request body
    jsonString = request.body.decode('utf-8')
    jsonBody = json.loads(jsonString)
    friend_token = jsonBody["friend_token"]

    # Check if friend_token is provided
    if friend_token is None:
        return JsonResponse({'status': 'error', 'message': 'No friend token provided.'}, status=400)

    # Get the friend's Profile instance using the provided friend_token
    friend_instance = Profile.objects.get(friend_token=friend_token)

    # Get the current user's Profile instance
    user = request.user

    # Create a unique room name based on the usernames
    namearray = [user.username_token, friend_instance.username_token]
    namearray.sort()
    room_name = "".join(namearray)

    # Create a Room instance and add both users to it
    room = Room.objects.create(name=room_name)
    room.users.add(user, friend_instance)
    room.save()

    # Create Friend instances for both the user and the friend
    user_friend_instance = Friend.objects.create(
        user=user,
        friend=friend_instance,
        nickname=secrets.token_hex(4),
        friendship_token=secrets.token_hex(4).upper(),
        room = room
    )
    friend_instance = Friend.objects.create(
        user=friend_instance,
        friend=user,
        nickname=secrets.token_hex(4),
        friendship_token=secrets.token_hex(4).upper(),
        room = room
    )

    # Generate new friend_tokens for both users and save the changes
    user.friend_token = secrets.token_hex(4).upper()
    friend_instance.friend_token = secrets.token_hex(4).upper()
    user.save()
    friend_instance.save()

    # Check if the Friend instances were created successfully
    if user_friend_instance and friend_instance:
        return JsonResponse({'status': "status", 'message': 'Friend added successfully.'})
    else:
        return JsonResponse({'status': 'error', 'message': 'Couldn\'t add friend'}, status=400)

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
    room_instance = Room.objects.get(name=room_name)
    messages = Message.objects.filter(room=room_instance).order_by('-timestamp')[:10]

    # Reverse the order of messages so they appear in ascending order of timestamp
    messages = reversed(messages)

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

# Need to be reworked. It's based on a theory that the front end will provide me his old password which is not required. 
# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# @authentication_classes([CustomJWTAuthentication])
# def change_password(request):
#     jsonString = request.body.decode('utf-8')
#     jsonBody = json.loads(jsonString)

#     user = request.user
#     old_password = jsonBody['old_password']
#     new_password = jsonBody['new_password']

#     if user.check_password(old_password):
#         user.set_password(new_password)
#         user.save()
#         return JsonResponse({"status": "success"}, status=200)
#     else:
#         return JsonResponse({"status": "error"}, status=400)

@api_view(['GET'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def get_friend_token(request):
    return JsonResponse({'friendInviteCode': request.user.friend_token})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([CustomJWTAuthentication])
def delete_account(request):
    request.user.delete()
    return JsonResponse({"status": "success"}, status=200)

@api_view(['GET'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def verify_session(request):
    return JsonResponse({'status': 'success', 'message': 'Session is valid.'})
