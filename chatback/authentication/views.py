from django.views.decorators.csrf import csrf_exempt
from .models import Profile, Friend
from django.contrib.auth import authenticate, login , logout
from django.http import JsonResponse
from django.contrib.auth import get_user_model
import json
from django.middleware.csrf import get_token
from django.contrib.sessions.backends.db import SessionStore
import secrets
from room.models import Room, Message

User = get_user_model()


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
            request.session['token'] = user.token
            request.session['friend_token'] = user.token1
            request.session.save()

            # set the sessionid cookie to the session key
            response = JsonResponse({'success': True, 'message': 'Logged in successfully.', 'token':user.token})
            response.set_cookie('sessionid', request.session.session_key, max_age=86400, httponly=True)
            #send csrf token to client
            response.set_cookie('csrftoken', request.META['CSRF_COOKIE'], max_age=86400, httponly=True)
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
        if user:
            login(request, user_auth)
            # create a new session and save it to the database
            request.session = SessionStore()
            request.session['user_id'] = user.id
            request.session['token'] = user.token
            request.session['friend_token'] = user.token1
            request.session.save()

            # set the sessionid cookie to the session key
            response = JsonResponse({'success': True, 'message': 'Logged in successfully.', 'token':user.token})
            response.set_cookie('sessionid', request.session.session_key, max_age=86400, httponly=True)
            #send csrf token to client
            response.set_cookie('csrftoken', request.META['CSRF_COOKIE'], max_age=86400, httponly=True)
            return response
        else:
            return JsonResponse({'status': 'error', 'message': 'Could not create user'}, status=400)

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
    session_key = request.COOKIES.get('sessionid')
    if session_key:
        session = SessionStore(session_key=session_key)
        user = Profile.objects.get(token=session['token'])
        friends = Friend.objects.filter(user=user)
        friend_list = []
        for friend in friends:
            friend_list.append({'nickname': friend.nickname})
        return JsonResponse({'friends': friend_list})


def get_friend_token(request):
    if not request.session.session_key:
        return JsonResponse({'status': 'error', 'message': 'Not logged in.'}, status=401)
    session_key = request.COOKIES.get('sessionid')
    if session_key is None:
        return JsonResponse({'status': 'error', 'message': 'No session key provided.'}, status=400)
    session = SessionStore(session_key=session_key)
    user = Profile.objects.get(token=session['token'])
    return JsonResponse({'friendInviteCode': user.token1})
    

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
        friendT = Profile.objects.get(token1=friend_token)
        session_key = request.COOKIES.get('sessionid')
        if session_key is None:
            return JsonResponse({'status': 'error', 'message': 'No session key provided.'}, status=400)
        session = SessionStore(session_key=session_key)
        user = Profile.objects.get(token=session['token'])
        friend = Friend.objects.create(user=user, friend=friendT, nickname=secrets.token_hex(4))
        friend_friends = Friend.objects.create(user=friendT, friend=user, nickname=secrets.token_hex(4))
        room_name = ""
        namearray = [user.token,friendT.token]
        namearray.sort()
        for name in namearray:
            room_name += name
        room = Room.objects.create(name=room_name)
        room.users.add(user, friendT)
        room.save()
        # user.token1 = secrets.token_hex(4).upper()
        # friendT.token1 = secrets.token_hex(4).upper()
        # user.save()
        # friendT.save()
        if friend and friend_friends:
            return JsonResponse({'status': 'success', 'message': 'Friend added successfully.'})
        else:
            return JsonResponse({'status': 'error', 'message': 'Couldnt add friend'}, status=400)

from django.http import JsonResponse

@csrf_exempt
def get_recent_messages(request):
    if not request.session.session_key:
        return JsonResponse({'status': 'error', 'message': 'Not logged in.'}, status=401)
    if request.method == 'POST':
        jsonString = request.body.decode('utf-8')
        jsonBody = json.loads(jsonString)
        nickname = jsonBody["nickname"]
        session_key = request.COOKIES.get('sessionid')
        if session_key is None:
            return JsonResponse({'status': 'error', 'message': 'No session key provided.'}, status=400)
        session = SessionStore(session_key=session_key)
        user = Profile.objects.get(token=session['token'])
        user = Profile.objects.get(token=user.token)
        friend = Friend.objects.get(nickname=nickname, user=user)
        namearray = [user.token,friend.friend.token]
        namearray.sort()
        room_name = ""
        for name in namearray:
            room_name += name
    # Get the most recent 10 messages from the room
    messages = Message.objects.filter(room__name=room_name).order_by('-timestamp')[:10]

    # Serialize the messages to JSON format
    message_list = []
    for message in messages:
        message_list.append({
            'isOwn': message.user.token == request.session['token'],
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