from django.db import models
from authentication.models import Profile

class FriendRequest(models.Model):
    from_user = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='sent_friend_requests')
    to_user_token = models.CharField(max_length=255)
    accepted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
class Message(models.Model):
    sender = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='sent_messages')
    recipient = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='received_messages')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

class room(models.Model):
    room_name = models.CharField(max_length=255)
    messages = models.ManyToManyField(Message)
    timestamp = models.DateTimeField(auto_now_add=True)