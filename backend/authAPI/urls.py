from django.urls import path
from . import views


urlpatterns = [
    path('auth/login', views.LoginApiView.as_view()),
    path('auth/register', views.RegisterApiView.as_view()),
    path('auth/user/', views.AuthApiView.as_view()),
    path('auth/user/<str:id>/', views.AuthApiView.as_view()),
]