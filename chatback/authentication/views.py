from django.views.decorators.csrf import csrf_exempt
from .models import Profile
from django.http import JsonResponse
from .models import Profile, Room, Message
from django.contrib.auth import authenticate, login , logout
from django.http import JsonResponse
from django.contrib.auth import get_user_model
from .models import Profile
import json
from django.middleware.csrf import get_token
from django.contrib.sessions.backends.db import SessionStore

User = get_user_model()


@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        jsonString = request.body.decode('utf-8')
        jsonBody = json.loads(jsonString)
        print(jsonBody["token"])
        print(jsonBody["password"])
        user = authenticate(request, token=jsonBody["token"], password=jsonBody["password"])
        print(user)
        if user is not None:
            login(request, user)
            print(user)

            # create a new session and save it to the database
            request.session = SessionStore()
            request.session['user_id'] = user.id
            request.session['username_token'] = user.token
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
        if user:
            # create a new session
            request.session = SessionStore()

            # set the session data
            request.session['user_id'] = user.id
            request.session['username_token'] = user.token
            request.session['friend_token'] = user.token1

            # save the session
            request.session.save()

            # create the response
            response_data = {'status': 'success', 'token': user.token}
            response = JsonResponse(response_data)
            response.set_cookie('sessionid', request.session.session_key, max_age=86400, httponly=True)
            response.set_cookie('csrftoken', get_token(request), max_age=86400, httponly=True)
            response['Access-Control-Allow-Credentials'] = 'true'
            return response
        else:
            return JsonResponse({'status': 'error', 'message': 'Could not create user'}, status=400)

    return JsonResponse({'status': 'error', 'message': 'POST requests only'}, status=405)

def logout_view(request):
    logout(request)
    response = JsonResponse({'success': True, 'message': 'Logged out successfully.'})
    response.delete_cookie('sessionid')
    response.delete_cookie('csrftoken')
    return response
#@login_required
#def user_token(request):
#   return JsonResponse({'token': request.user.token1})

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Friend

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


def user_token(request):
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
        friendT = Profile.objects.get(token1=friend_token)
        user = Profile.objects.get(token=request.session['username_token'])
        friend = Friend.objects.create(user=user, friend=friendT)
        friend_friends = Friend.objects.create(user=friendT, friend=user)
        room_name = ""
        namearray = [user.token,friendT.token]
        namearray.sort()
        for name in namearray:
            room_name += name

        Room.objects.create(name = room_name)
        if friend and friend_friends:
            return JsonResponse({'status': 'success', 'message': 'Friend added successfully.'})
        else:
            return JsonResponse({'status': 'error', 'message': 'Couldnt add friend'}, status=400)

from django.http import JsonResponse
from .models import Message

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
    messages = Message.objects.filter(room__name=room_name).order_by('-timestamp')[:10]

    # Serialize the messages to JSON format
    message_list = []
    for message in messages:
        message_list.append({
            'isOwn': message.user.token == request.session['username_token'],
            'content': message.content,
        })
    data = {'messages': message_list}

    return JsonResponse(data)
