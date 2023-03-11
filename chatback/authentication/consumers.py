from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.sessions.models import Session
from asgiref.sync import sync_to_async, async_to_sync
import json
from django.contrib.sessions.backends.db import SessionStore
from .models import Room, Message

class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
    # Get the session object
        session_key = self.scope['cookies']['sessionid']
        self.session = await database_sync_to_async(Session.objects.get)(session_key=session_key)

        # Get the room name from the session cookie
        room_name = self.session.get('room_name')

        # Join the room group
        self.room_group_name = f'chat_{room_name}'
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
        author = self.scope['user']
        Message.objects.create(author=author, room=room, content=message)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'author': author.username,
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
