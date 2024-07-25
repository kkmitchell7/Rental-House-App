from rest_framework import serializers
from .models import User
from bookingAPI.serializers import *

class UserSerializer(serializers.ModelSerializer):
    bookings = BookingSerializer(many=True, read_only=True)
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'email', 'password', 'bookings')
        extra_kwargs = {
            'password': {'write_only': True} # Ensures password isn't returned in response
        }

    def create(self, validated_data):
        # Custom create method to handle password hashing
        user = User.objects.create_user(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=validated_data['password'],
            id=validated_data.get('id')  # Ensure id is set correctly if needed
        )
        return user

    def update(self, instance, validated_data):
        # Custom update method if needed
        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.password = validated_data.get('password', instance.password)
        instance.save()
        return instance


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


