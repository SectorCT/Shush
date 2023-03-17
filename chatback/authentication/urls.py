from . import views
from django.urls import path, include
from rest_framework import routers

router = routers.DefaultRouter()

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('login/', views.login_view, name='login'),
    path("logout/", views.logout_view, name="logout"),
    path('list_friends/', views.list_friends, name='list_friends'),
    path('user_token/',views.user_token, name='gettoken'),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('make_friends/',views.make_friends, name='make_friends'),
    path('get_recent_messages/',views.get_recent_messages, name='get_recent_messages'),
]