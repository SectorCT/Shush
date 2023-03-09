from . import views
from django.urls import path, include


urlpatterns = [
    path('signup/', views.signup, name='signup'),  
]