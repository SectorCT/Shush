from django.contrib.sessions.backends.db import SessionStore
from django.contrib.auth import authenticate, login , logout
from django.views.decorators.csrf import csrf_exempt
from .models import Profile, Friend
from django.http import JsonResponse
from django.middleware.csrf import get_token
from chat.models import Room, Message
import secrets
import json

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        jsonString = request.body.decode('utf-8')
        jsonBody = json.loads(jsonString)
        user = authenticate(request, token=jsonBody["token"], password=jsonBody["password"])
        if user is not None:
            login(request, user)
            # create a new session and save it to the database
            request.session = SessionStore()
            request.session['user_id'] = user.id
            request.session['username_token'] = user.token
            request.session['friend_token'] = user.token1
            request.session.save()

            # set the sessionid cookie to the session key
            response = JsonResponse({'success': True, 'message': 'Logged in successfully.', 'token':user.token})
            response.set_cookie('sessionid', request.session.session_key, max_age=86400, httponly=True)
            # Send csrf token to client
            csrf_token = request.META.get('CSRF_COOKIE', get_token(request))
            response.set_cookie('csrftoken', csrf_token, max_age=86400, httponly=True)
            return response
        else:
            return JsonResponse({'success': False, 'message': 'Invalid credentials.'}, status=401)
    else:
        return JsonResponse({'success': False, 'message': 'Invalid request method.'}, status=405)


@csrf_exempt
def signup(request):
    if request.method == 'POST':
        jsonString = request.body.decode('utf-8')
        jsonBody = json.loads(jsonString)
        password = jsonBody["password"]
        user = Profile.objects.create_user(password=password)
        user_auth = authenticate(request, token=user.token, password=password)
        if user_auth and user_auth.is_authenticated:
            # create a new session and save it to the database
            request.session = SessionStore()
            request.session['user_id'] = user.id
            request.session['username_token'] = user.token
            request.session['friend_token'] = user.token1
            request.session.save()

            # set the sessionid cookie to the session key
            response = JsonResponse({'success': True, 'message': 'Logged in successfully.', 'token':user.token})
            response.set_cookie('sessionid', request.session.session_key, max_age=86400, httponly=True)
        # Send csrf token to client
            csrf_token = request.META.get('CSRF_COOKIE', get_token(request))
            response.set_cookie('csrftoken', csrf_token, max_age=86400, httponly=True)
            return response
        else:
            return JsonResponse({'status': 'error', 'message': 'Could not authenticate user.'}, status=401)

    return JsonResponse({'status': 'error', 'message': 'POST requests only'}, status=405)


def logout_view(request):
    logout(request)
    response = JsonResponse({'success': True, 'message': 'Logged out successfully.'})
    response.delete_cookie('sessionid')
    response.delete_cookie('csrftoken')
    request.session.flush()
    request.session.delete()
    return response

def list_friends(request):
    if not request.session.session_key:
        return JsonResponse({'status': 'error', 'message': 'Not logged in.'}, status=401)
    # Rest of the code
    user = Profile.objects.get(token=request.session['username_token'])
    friends = Friend.objects.filter(user=user)
    friend_list = []
    for friend in friends:
        friend_list.append({'nickname': friend.nickname})
    return JsonResponse({'friends': friend_list})




def get_friend_token(request):
    if not request.session.session_key:
        return JsonResponse({'status': 'error', 'message': 'Not logged in.'}, status=401)
    return JsonResponse({'friendInviteCode': request.session['friend_token']})
    
@csrf_exempt
def make_friends(request):
    if not request.session.session_key:
        return JsonResponse({'status': 'error', 'message': 'Not logged in.'}, status=401)
    if request.method == 'POST':
        jsonString = request.body.decode('utf-8')
        jsonBody = json.loads(jsonString)
        friend_token = jsonBody["friend_token"]
        if friend_token is None:
            return JsonResponse({'status': 'error', 'message': 'No friend token provided.'}, status=400)
        print(jsonBody['friend_token'])
        friendT = Profile.objects.get(token1=friend_token)
        user = Profile.objects.get(token=request.session['username_token'])
        friend = Friend.objects.create(user=user, friend=friendT, nickname=secrets.token_hex(4))
        friend_friends = Friend.objects.create(user=friendT, friend=user, nickname=secrets.token_hex(4))
        room_name = ""
        namearray = [user.token,friendT.token]
        namearray.sort()
        for name in namearray:
            room_name += name
        room = Room.objects.create(name = room_name)
        room.users.add(user, friendT)
        room.save()
        user.token1 = secrets.token_hex(4).upper()
        friendT.token1 = secrets.token_hex(4).upper()
        user.save()
        friendT.save()
        if friend and friend_friends:
            return JsonResponse({'status': 'success', 'message': 'Friend added successfully.'})
        else:
            return JsonResponse({'status': 'error', 'message': 'Couldnt add friend'}, status=400)


@csrf_exempt
def get_recent_messages(request):
    if not request.session.session_key:
        return JsonResponse({'status': 'error', 'message': 'Not logged in.'}, status=401)
    if request.method == 'POST':
        jsonString = request.body.decode('utf-8')
        jsonBody = json.loads(jsonString)
        nickname = jsonBody["nickname"]
        user = Profile.objects.get(token=request.session['username_token'])
        friend = Friend.objects.get(nickname=nickname, user=user)
        namearray = [request.session['username_token'],friend.friend.token]
        namearray.sort()
        room_name = ""
        for name in namearray:
            room_name += name
    # Get the most recent 10 messages from the room
    messages = Message.objects.filter(room__name=room_name).order_by('timestamp')[:10]

    # Serialize the messages to JSON format
    message_list = []
    for message in messages:
        message_list.append({
            'isOwn': message.author.token == request.session['username_token'],
            'content': message.content,
        })
    data = {'messages': message_list}
    return JsonResponse(data)

def verify_session(request):
    if request.method == "GET":
        
        if request.session.session_key:
            return JsonResponse({'status': 'success', 'message': 'Session is valid.'})
        else:
            return JsonResponse({'status': 'error', 'message': 'Session is invalid.'}, status=401)