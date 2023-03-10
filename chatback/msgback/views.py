from django.shortcuts import render, redirect
from django.contrib import messages
from django.urls import reverse
from django.utils import timezone
from .models import FriendRequest
from authentication.models import Profile
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required


@login_required
def index(request):\

    return HttpResponse("Hello, world. You're at the polls index.")

@login_required
def add_friend(request):
    if request.method == 'POST':
        try:
            token = request.user.token
        except :
            return JsonResponse({'error': 'Your not logged in'})

        friend_token = request.POST.get('friend_token')
        try:
            friend = Profile.objects.get(token=friend_token)
        except Profile.DoesNotExist:
            return JsonResponse({'error': 'Friend not found.'}, status=404)

        friend_request, created = FriendRequest.objects.get_or_create(from_user=token, to_user=friend)

        if created:
            return JsonResponse({'success': 'Friend request sent.'})
        else:
            return JsonResponse({'error': 'Friend request already exists.'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method.'}, status=405)

@login_required
def friend_requests(request):
    friend_requests = FriendRequest.objects.filter(to_user=request.user.token, accepted=False)

    # You can customize this list comprehension to return any additional data you want
    # to display for each friend request, such as the sender's name or profile picture.
    friend_requests_list = [
        {
            'id': request.id,
            'from_user': request.from_user,
        }
        for request in friend_requests
    ]

    return JsonResponse({'friend_requests': friend_requests_list})
    
def room(request, room_name):
    return render(request, 'msgback/room.html', {
        'room_name': room_name
    })