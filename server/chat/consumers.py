from channels.generic.websocket import AsyncWebsocketConsumer
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from asgiref.sync import sync_to_async
from django.apps import apps
import base64
import uuid
import json


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.friendship_token = self.scope['url_route']['kwargs']['friendship_token']
        friends = await self.get_friends(self.friendship_token)
        self.room = await self.get_rooms(friends)
        self.room_group_name = 'chat_%s' % self.room.name
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        friendship_token = text_data_json['friendship_token']
        message = text_data_json['message']
        image_data = text_data_json.get('image', None)

        friends_instance = await self.get_friends(friendship_token)
        room = await self.get_rooms(friends_instance)

        if image_data:
            image = await self.save_image(image_data)
            await self.save_message(friends_instance, room, message, image=image)
        else:
            await self.save_message(friends_instance, room, message)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': "chat_message",
                'message': message,
                'exclude': self.channel_name,
            }
        )

    async def chat_message(self, event):
        message = event['message']
        exclude = event.get('exclude', None)

        if exclude != self.channel_name:
            await self.send(text_data=json.dumps({'message': message}))

    @sync_to_async
    def get_friends(self, friendship_token):
        Friend = apps.get_model('authentication', 'Friend')
        return Friend.objects.get(friendship_token=friendship_token)

    @sync_to_async
    def get_rooms(self, friends):
        return friends.room
        # Room = apps.get_model('chat', 'Room')
        # return Room.objects.filter(users__in=[friends.user, friends.friend]).first()

    @sync_to_async
    def save_message(self, friends, room, content, image=None):
        user = friends.user
        Message = apps.get_model('chat', 'Message')
        return Message.objects.create(author=user, room=room, content=content, image=image)

    @sync_to_async
    def save_image(self, image_data):
        image_data = base64.b64decode(image_data)
        image_file = ContentFile(image_data)
        file_name = default_storage.save(f'chat_images/{uuid.uuid4()}.jpg', image_file)
        return default_storage.open(file_name)
