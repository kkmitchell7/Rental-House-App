from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import *
from rest_framework import status
from .serializers import *
from authAPI.serializers import *
from authAPI.models import User
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from django.db.models import Q
from uuid import UUID

class BookingApiView(APIView):
    serializer_class=BookingSerializer
    def get(self,request, id=None):
        if id is not None:
            try:
                booking = Booking.objects.get(pk=id)
                serializer = BookingSerializer(booking)
                return Response({"Message":"Returned booking by id.", "Booking":serializer.data})
            except Booking.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            allBookings = Booking.objects.all()
            serializer = BookingSerializer(allBookings, many=True)
            return Response({"Message":"Returned all bookings.", "Bookings":serializer.data})
    def post(self,request):
        serializer = BookingSerializer(data=request.data)
        if (serializer.is_valid()):
            app_user_uuid = serializer.data.get('app_user')

            try:
                app_user = User.objects.get(id=app_user_uuid)
            except User.DoesNotExist:
                return Response({"message": "User not found"}, status=status.HTTP_400_BAD_REQUEST)

            new_booking = Booking.objects.create(app_user=app_user,
                                    start_date = serializer.data.get("start_date"),
                                    end_date = serializer.data.get("end_date"),
                                    length = serializer.data.get("length"),
                                    payment_bool = serializer.data.get("payment_bool"),
                                    price_paid = serializer.data.get("price_paid"),
                                    stripe_checkout_id = serializer.data.get("stripe_checkout_id"))
            return Response({"Message":"Created booking.","Booking":serializer.data})
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

#Returns all bookings within the next 12 months 
class AllBookedDaysApiView(APIView):
    serializer_class=BookingSerializer
    def get(self,request):
        current_date = datetime.now()
        
        start_date = current_date.replace(day=1)
        end_date = (start_date + relativedelta(months=12)).replace(day=1) - timedelta(days=1)
        
        # Filter bookings within the next 12 months
        allBookings = Booking.objects.filter(
            Q(start_date__gte=start_date, start_date__lte=end_date) |
            Q(end_date__gte=start_date, end_date__lte=end_date)
        ).distinct()
        
        booked_days = []
        for booking in allBookings:
            booked_days.extend(booking.get_all_dates())
        
        return Response({"Message": "Returned all bookings for the next 12 months.", "Bookings": booked_days})
    
class UserBookedDaysApiView(APIView):
    serializer_class=BookingSerializer
    def get(self,request, userId):
        try:
            app_user_id = UUID(str(userId), version=4)
        except (ValueError, AttributeError, TypeError):
            return Response({"error": f"'{userId}' is not a valid UUID."}, status=status.HTTP_400_BAD_REQUEST)

        if not app_user_id:
            return Response({"Message": "UserId parameter is missing"}, status=400)

        try:
            # Retrieve the user
            user = User.objects.get(pk=app_user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        # Filter bookings that belong to the user
        bookings = Booking.objects.filter(app_user=user)

        # Serialize the bookings
        serializer = BookingSerializer(bookings, many=True)

        if serializer.data:
            return Response({"Message": "Returned all user's bookings.", "data": serializer.data})
        else:
            return Response({"Message": "User has no bookings."})