from django.shortcuts import render

from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import *
from rest_framework import status
from .serializers import *

class BookingApiView(APIView):
    serializer_class=BookingSerializer
    def get(self,request, id):
        if id:
            try:
                booking = Booking.objects.get(pk=id)
                serializer = BookingSerializer(booking)
                return Response({"Message":"Returned booking by id.", "Booking":serializer.data})
            except Booking.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            allBookings = Booking.objects.all().values()
            serializer = BookingSerializer(allBookings, many=True)
            return Response({"Message":"Returned all bookings.", "Bookings":serializer.data})
    def post(self,request):
        serializer = BookingSerializer(data=request.data)
        if (serializer.is_valid()):
            Booking.objects.create(id=serializer.data.get("id"),
                                app_user = serializer.data.get("app_user"),
                                    start_date = serializer.data.get("start_date"),
                                    end_date = serializer.data.get("end_date"),
                                    length = serializer.data.get("length"),
                                    payment_bool = serializer.data.get("payment_bool"),
                                    price_paid = serializer.data.get("price_paid"),
                                    stripe_checkout_id = serializer.data.get("stripe_checkout_id"))
            booking = Booking.objects.all().filter(id=request.data["id"]).values()
            return Response({"Message":"Created booking.","Booking":booking})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self,request, id):
        try:
            booking = Booking.objects.get(pk=id)
        except Booking.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = BookingSerializer(booking, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"Message":"Booking updated successfully by id", "Booking":serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self,request, id):
        try:
            booking = Booking.objects.get(pk=id)
        except Booking.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        booking.delete()
        return Response({"Message":"Booking deleted successfully by id"})
    
