from channels.generic.websocket import AsyncWebsocketConsumer
import json
from django.apps import apps
from asgiref.sync import sync_to_async


class ChatConsumer(AsyncWebsocketConsumer):

    @sync_to_async
    def get_friends(self, nickname):
        Friend = apps.get_model('authentication', 'Friend')
        return Friend.objects.get(nickname=nickname)

    @sync_to_async
    def get_rooms(self, friends):
        Room = apps.get_model('chat', 'Room')
        index = Room.objects.filter(users__in=[friends.user, friends.friend])
        index = index[0]
        return index

    @sync_to_async
    def save_message(self, friends, room, content):
        user = friends.user
        Message = apps.get_model('chat', 'Message')
        return Message.objects.create(author=user, room=room, content=content)

    async def connect(self):
        # Extract nickname query parameter from scope
        self.friend_nickname = self.scope['url_route']['kwargs']['nickname']

        # Set user attribute on consumer instance
        friends = await self.get_friends(self.friend_nickname)
        self.room = await self.get_rooms(friends)
        self.room_group_name = 'chat_%s' % self.room.name

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        print(self.channel_name)
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
        nickname = text_data_json['nickname']
        message = text_data_json['message']
        room = self.room
        friends = await self.get_friends(nickname)


        # Save message to database
        await self.save_message(friends, room, message)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
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
                'message': message,
            }))