from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization    
from cryptography.hazmat.backends import default_backend
from django.http import JsonResponse
from django.db import models
import secrets


class ProfileManager(BaseUserManager):
    def create_user(self, password=None, username_token=None, friend_token=None, public_key=None):

        while not username_token or Profile.objects.filter(username_token=username_token).exists():
            username_token = secrets.token_hex(10)

        while not friend_token or Profile.objects.filter(friend_token=friend_token).exists():
            friend_token = secrets.token_hex(4).upper()

        if password is None:
            return JsonResponse({'status': 'error', 'message': 'Password is required'})
        
        if len(password) < 8:
            return JsonResponse({'status': 'error', 'message': 'Password must be at least 8 characters'})
        
         # Generate the public/private key pair
        private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=2048,
            backend=default_backend()
        )
        public_key = private_key.public_key()
        
        # Serialize the public key to PEM format
        pem_public_key = public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        )

        # Convert the PEM public key to string
        str_public_key = pem_public_key.decode('utf-8')

        user = self.model(username_token=username_token, friend_token=friend_token, public_key=str_public_key)
        user.set_password(password)
        user.save(using=self._db)

        # Save the private key in the user's local storage or client-side

        return user

    def create_superuser(self, password=None, username_token=None, friend_token=None, public_key=None):
        user = self.create_user(password=password, username_token=username_token, friend_token=friend_token, public_key=public_key)
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

    def __str__(self):
        return self.username_token + ' ' + self.password

class Profile(AbstractBaseUser):
    username_token = models.CharField(max_length=10, unique=True)
    friend_token = models.CharField(max_length=4, unique=True)
    password = models.CharField(max_length=128)
    public_key = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)

    USERNAME_FIELD = 'username_token'

    last_login = None

    objects = ProfileManager()

class Friend(models.Model):
    user = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='friends_as_user')
    friend = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='frnick_as_friend')
    nickname = models.CharField(max_length=8)
    friendship_token = models.CharField(max_length=10, unique=True, default=secrets.token_hex(5))

    class Meta:
        unique_together = ('user', 'nickname')