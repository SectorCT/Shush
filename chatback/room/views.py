from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from . import models
from django.contrib.sessions.middleware import SessionMiddleware
from .models import Room
from django.http import JsonResponse

# Create your views here.
# @login_required
# def list_myrooms(request):
#     middleware = SessionMiddleware()
#     middleware.process_request(request)
#     rooms = Room.objects.filter(user=request.session['username_token'])
#     friend_list = []
#     for friend in rooms:
#         friend_list.append({'nickname': friend.nickname})
#     return JsonResponse({'friends': friend_list})