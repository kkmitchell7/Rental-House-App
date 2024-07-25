from django.urls import path
from . import views

urlpatterns = [
    path('booking/', views.BookingApiView.as_view()),
    path('booking/<str:id>/', views.BookingApiView.as_view()),
    path('booking/allbookeddays/<str:month>', views.AllBookedDaysApiView.as_view()),
    path('booking/userbookeddays/<uuid:userId>/', views.UserBookedDaysApiView.as_view())
]