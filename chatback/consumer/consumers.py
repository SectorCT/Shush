import json
from channels.generic.websocket import AsyncWebsocketConsumer
from msgback.models import Message, Profile, Room

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name
        self.user_profile = self.scope['user'].profile
        
        # Get the other user's profile
        room = Room.objects.get(name=self.room_name)
        if room.user1 == self.user_profile:
            self.other_user_profile = room.user2
        else:
            self.other_user_profile = room.user1

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

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Create a new message object and save it to the database
        new_message = Message(
            sender=self.user_profile,
            recipient=self.other_user_profile,
            content=message,
        )
        new_message.save()

        # Add the message to the room's list of messages
        room = Room.objects.get(name=self.room_name)
        room.messages.add(new_message)

        # Send the message to the room's channel group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender': self.scope['user'].username,
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']
        sender = event['sender']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'sender': sender
        }))
