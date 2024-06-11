from django.urls import path
from . import views

urlpatterns = [
    path('booking/', views.BookingApiView.as_view()),
    path('booking/<int:id>/', views.BookingApiView.as_view())
]