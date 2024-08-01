from django.urls import path
from . import views


urlpatterns = [
    path('login', views.LoginApiView.as_view()),
    path('register', views.RegisterApiView.as_view()),
    path('user/', views.AuthApiView.as_view()),
    path('user/<str:id>/', views.AuthApiView.as_view()),
]