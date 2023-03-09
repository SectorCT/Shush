from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.auth.hashers import make_password
import secrets

class ProfileManager(BaseUserManager):
    def create_user(self, token=None, password=None, **extra_fields):
        if token is None:
            token = secrets.token_hex(10);
        profile = self.model(token=token, **extra_fields)
        if password:
            profile.password = make_password(password)
        profile.save(using=self._db)
        return profile

class Profile(AbstractBaseUser):
    token = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=128)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = ProfileManager()

    USERNAME_FIELD = 'token'
    REQUIRED_FIELDS = ['password']

    def has_perm(self, perm, obj=None):
        return True
