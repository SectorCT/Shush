from channels.generic.websocket import AsyncWebsocketConsumer
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization
from asgiref.sync import sync_to_async
from django.apps import apps
import uuid
import json


class ChatConsumer(AsyncWebsocketConsumer):

    @sync_to_async
    def get_friends(self, friendship_token):
        Friend = apps.get_model('authentication', 'Friend')
        return Friend.objects.get(friendship_token=friendship_token)
    
    @sync_to_async
    def save_image(self, image_data):
        import base64
        from django.core.files.base import ContentFile
        from django.core.files.storage import default_storage

        # Decode the base64 image data
        image_data = base64.b64decode(image_data)
        image_file = ContentFile(image_data)
        # Save the image file using Django's default storage backend
        file_name = default_storage.save('chat_images/{}.jpg'.format(uuid.uuid4()), image_file)
        return default_storage.open(file_name)

    @sync_to_async
    def get_rooms(self, friends):
        Room = apps.get_model('chat', 'Room')
        Rooms = Room.objects.filter(users__in=[friends.user, friends.friend])
        room_name = Rooms[0]
        return room_name

    @sync_to_async
    def save_message(self, friends, room, content, image=None):
        user = friends.user
        Message = apps.get_model('chat', 'Message')
        return Message.objects.create(author=user, room=room, content=content, image=image)

    async def connect(self):
        # Extract friendship_token query parameter from scope
        self.friendship_token = self.scope['url_route']['kwargs']['friendship_token']

        # Set user attribute on consumer instance
        friends = await self.get_friends(self.friendship_token)
        self.room = await self.get_rooms(friends)
        self.room_group_name = 'chat_%s' % self.room.name

        # # Checks if the user is allowed to access the room
        # user_allowed = await sync_to_async(self.room.user_allowed)(friends.user)
        # if not user_allowed:
        #     # Reject the connection
        #     await self.close()
        #     return
        
        # Join room group
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


    @sync_to_async
    def get_public_key(self, user):
        UserProfile = apps.get_model('authentication', 'UserProfile')
        profile = UserProfile.objects.get(user=user)
        public_key_pem = profile.public_key
        public_key = serialization.load_pem_public_key(
            public_key_pem.encode(),
            backend=default_backend()
        )
        return public_key

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        friendship_token = text_data_json['friendship_token']
        encrypted_content = text_data_json['encrypted_content']

        room = self.room
        friends = await self.get_friends(friendship_token)

        await self.save_message(friends, room, encrypted_content)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': encrypted_content,
                'exclude': self.channel_name,
            }
        )


    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']
        exclude = event.get('exclude', None)

        # Do not send the message back to the sender
        if exclude != self.channel_name:
            # Send message to WebSocket
            await self.send(text_data=json.dumps({
            'encrypted_content': message,
        }))
