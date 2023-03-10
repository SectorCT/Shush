from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('add_friend/', views.add_friend, name='add_friend'),
    path('friend_requests/', views.friend_requests, name='friend_requests'),
    path('chat/<str:room_name>/', views.room, name='room'),
]
