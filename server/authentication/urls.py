from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.urls import path, include
from . import views

urlpatterns = [
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('signup/', views.signup, name='signup'),
    path('login/', views.login_view, name='login'),
    path("logout/", views.logout_view, name="logout"),
    path('verify_session/',views.verify_session, name='verify_session'),
    path('get_friend_token/',views.get_friend_token, name='get_friend_token'),
    path('make_friends/',views.make_friends, name='make_friends'),
    path('list_friends/', views.list_friends, name='list_friends'),
    path('get_recent_messages/',views.get_recent_messages, name='get_recent_messages'),
]