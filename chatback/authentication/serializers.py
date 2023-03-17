from rest_framework import serializers
from .models import Profile, FrNick, Friend

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('token', 'token1')

class FriendSerializer(serializers.ModelSerializer):
    friend = ProfileSerializer(read_only=True)
    
    class Meta:
        model = Friend
        fields = ('user', 'friend')