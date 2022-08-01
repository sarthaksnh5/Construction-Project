from django.shortcuts import get_object_or_404, render
from django.contrib.auth import get_user_model
from projectsapi.models import ChatMessage, ChatRoom

User = get_user_model()

# Create your views here.
def index(request):
    return render(request, 'chat/index.html')

def room(request, room_name):
    return render(request, 'chat/room.html', {'room_name': room_name})

def get_last_10_messages(chatId):
    chat = ChatMessage.objects.filter(chatRoom_id=chatId) .order_by('date')
    count = len(chat)
    if count > 12:
        data = chat.all()[count - 12:]
    else:
        data = chat.all()
    return data


def get_user_contact(username):
    user = get_object_or_404(User, id=username)
    return user