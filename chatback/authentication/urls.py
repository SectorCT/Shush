from . import views
from django.urls import path


urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('login/', views.login_view, name='login'),
    path('gettoken/', views.gettoken, name='gettoken'),
]