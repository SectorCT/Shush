from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.urls import path, include
from . import views

urlpatterns = [
    path('api/refresh_token/', views.refresh_token, name='refresh_token'),
    path('get_recent_messages/', views.get_recent_messages, name='get_recent_messages'),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),
    path("logout/", views.logout, name="logout"),
    path('verify_session/', views.verify_session, name='verify_session'),
    path('get_friend_token/',views.get_friend_token, name='get_friend_token'),
    path('make_friends/', views.make_friends, name='make_friends'),
    path('list_friends/', views.list_friends, name='list_friends'),
    path('remove_friend/', views.remove_friend, name='remove_friend'),
    path('change_nickname/', views.change_nickname, name='change_nickname'),
    path('change_password/', views.change_password, name='change_password'),
    path('send_public_keys/', views.send_public_keys, name='send_public_keys'),
    path('update_identity_public_key/', views.update_identity_public_key, name='update_identity_public_key'),
    path('update_signed_public_key/', views.update_signed_public_key, name='update_signed_public_key'),
]