from django.db import models
from authentication.models import Profile

class Room(models.Model):
    users = models.ManyToManyField(Profile, related_name='room_users')
    name = models.CharField(max_length=255, unique=True, default='room')

    def user_allowed(self, user):
        return self.users.filter(id=user.id).exists()

class Message(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='messages')
    author = models.ForeignKey(Profile, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    encrypted_content = models.BinaryField()
    is_seen = models.BooleanField(default=False)