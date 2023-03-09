import secrets
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.http import JsonResponse

class ProfileManager(BaseUserManager):
    def create_user(self, token=None, password=None):
        if token is None:
            token = secrets.token_hex(20)
        if password is None:
            return JsonResponse({'status': 'error', 'message': 'Password is required'})
        user = self.model(token=token)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, token=None, password=None):
        user = self.create_user(token=token, password=password)
        user.is_admin = True
        user.is_staff = True
        is_superuser = True
        user.save(using=self._db)
        return user
    
    def __str__(self):
        return self.token + ' ' + self.password
    
    
class Profile(AbstractBaseUser):
    token = models.CharField(max_length=20, unique=True)
    password = models.CharField(max_length=128)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    
    USERNAME_FIELD = 'token'
    
    last_login = None

    objects = ProfileManager()
    def has_module_perms(self, app_label):
        if self.is_admin:
            return True
        # Check if the user has permissions to view the specified app_label
        # Implement your own logic here
        return False
    def has_perm(self, perm, obj=None):
        """
        Check if the user has a specific permission.
        """
        # Simplest implementation: always return True.
        # Override this method to implement your own permissions logic.
        return True
