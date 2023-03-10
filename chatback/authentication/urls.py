from . import views
from django.urls import path, include
from rest_framework import routers

router = routers.DefaultRouter()



urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('login/', views.login_view, name='login'),
    path('user_token/',views.UserTokenView.as_view(), name='gettoken'),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]