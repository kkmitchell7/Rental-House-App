from rest_framework import serializers


class UserSerializer(serializers.Serializer):
    id = serializers.UUIDField(read_only=True)
    first_name = serializers.CharField(label="Enter first name")
    last_name =  serializers.CharField(label="Enter last name")
    email = serializers.EmailField(label="Enter email")
    image = serializers.ImageField(label="Enter image", required=False)
    password = serializers.CharField(label="Enter password")

    def update(self, instance, validated_data):
        # Update the instance fields with validated data
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
