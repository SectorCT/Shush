from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.sessions.models import Session
import json
from django.contrib.sessions.backends.db import SessionStore
from .models import Room, Message
from urllib.parse import parse_qs
from authentication.models import Friend


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        print(self.scope['url_route'])
        # Extract nickname query parameter from scope
        self.nickname = self.scope['url_route']['kwargs']['nickname']
        
        # Set user attribute on consumer instance
        friends = Friend.objects.get(nickname=self.nickname)
        rooms = Room.objects.filter(users__in=[friends.user, friends.friend])
        self.room_group_name = 'chat_%s' % rooms.name

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Save message in database
        room = Room.objects.get(name=self.room_name)
        user = self.scope['user']
        Message.objects.create(user=user, room=room, content=message)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'author': user.username,
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']
        author = event['author']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'author': author,
        }))
    
    @classmethod
    def as_asgi(cls):
        return cls.as_asgi_class()()

    @classmethod
    def as_asgi_class(cls):
        return cls 