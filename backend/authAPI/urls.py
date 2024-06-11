from django.urls import path
from . import views


urlpatterns = [
    path('auth/login', views.LoginApiView.as_view()),
    path('auth/register', views.RegisterApiView.as_view()),
    path('auth/user/<int:id>/', views.AuthApiView.as_view())
]