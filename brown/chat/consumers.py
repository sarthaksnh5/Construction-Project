import json
from channels.generic.websocket import WebsocketConsumer
from brown.settings import APP_BASE_URL
from chat.views import get_last_10_messages, get_user_contact
from asgiref.sync import async_to_sync
from projectsapi.models import ChatMessage, Project

class ChatConsumer(WebsocketConsumer):
    def fetch_messages(self, data):        
        messages = get_last_10_messages(data['chatId'])
        content = {
            'command': 'messages',
            'messages': self.messages_to_json(messages)
        }
        self.send_message(content)    

    def messages_to_json(self, messages):        
        result = []
        for message in messages:
            result.append(self.message_to_json(message))
        return result

    def message_to_json(self, message):
        temp = {
            'id': message.id,
            'user': message.sender.name,
            'photo': APP_BASE_URL + str(message.photo),
            'message': message.message,
            'date': message.date.strftime('%Y-%m-%dT%H:%M:%S'),
            'user_id': message.sender.id,
        }        
        return temp 

    def new_message(self, data):
        print('new MEssage')
        user = get_user_contact(data['from'])
        project = Project.objects.get(id=data['chatId'])
        message = ChatMessage.objects.create(
            sender = user,
            message = data['message'],
            chatRoom = project,
        )
        content = {
            'command': 'new_message',
            'message': self.message_to_json(message)
        }
        return self.send_chat_message(content)

    commands = {
        'fetch_messages': fetch_messages,     
        'new_message': new_message   
    }

    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )
    
    def receive(self, text_data):
        data = json.loads(text_data)
        self.commands[data['command']](self, data)

    def send_chat_message(self, message):
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    def send_message(self, message):
        self.send(text_data=json.dumps(message))

    def chat_message(self, event):
        message = event['message']
        self.send(text_data=json.dumps(message))
        