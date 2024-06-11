from rest_framework import serializers


class UserSerializer(serializers.Serializer):
    id = serializers.IntegerField(label="Enter user id")
    first_name = serializers.CharField(label="Enter first name")
    last_name =  serializers.CharField(label="Enter last name")
    email = serializers.EmailField(label="Enter email")
    image = serializers.ImageField(label="Enter image")
    password = serializers.CharField(label="Enter password")

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
