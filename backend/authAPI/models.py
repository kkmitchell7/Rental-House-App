from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.auth.hashers import make_password, check_password
import uuid

class CustomUserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        try:
            user = User(email=email, first_name=first_name, last_name=last_name, **extra_fields)
            user.save()
            user.set_password(password)
            user.save()
            print("User created successfully:", user)
        except Exception as e:
            print("Error creating user:", e)
        return user

    def create_superuser(self, email, first_name, last_name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, first_name, last_name, password, **extra_fields)

class User(AbstractBaseUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.EmailField(max_length=100, unique=True)
    password = models.CharField(max_length=128)  # Use Django's hashed password storage

    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def set_password(self, raw_password):
        self.password = make_password(raw_password)
    
    def __str__(self):
        userString = str(self.email) +" "+ str(self.id)
        return userString
    
    def check_password(self, raw_password):
        return check_password(raw_password, self.password)