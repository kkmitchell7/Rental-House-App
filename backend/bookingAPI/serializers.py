from rest_framework import serializers
from authAPI.models import User

class BookingSerializer(serializers.Serializer):
    id = serializers.IntegerField(label="Enter booking id")
    app_user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    start_date = serializers.DateField(label="Enter start date")
    end_date = serializers.DateField(label="Enter end date")
    length = serializers.IntegerField(label="Enter length") #number of nights staying
    payment_bool = serializers.BooleanField(label="Enter payment bool")
    price_paid = serializers.FloatField(label="Enter price paid")
    stripe_checkout_id = serializers.CharField(label="Enter stripe checkout id")