from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom user so we can extend it later without painful migrations."""

    phone = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return self.username
