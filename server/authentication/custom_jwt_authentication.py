from django.core.cache import cache
from rest_framework_simplejwt.authentication import JWTAuthentication

class CustomJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        header = self.get_header(request)
        if header is None:
            return None

        raw_token = self.get_raw_token(header)
        if raw_token is None:
            return None

        if cache.get(f'blacklisted_{raw_token}'):
            return None

        validated_token = self.get_validated_token(raw_token)

        return self.get_user(validated_token), validated_token
