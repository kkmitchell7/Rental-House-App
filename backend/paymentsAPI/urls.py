from django.urls import path
from .views import StripeCheckoutView
from .views import stripe_webhook

urlpatterns = [
    path('create-checkout-session',StripeCheckoutView.as_view()),
    path('webhook/', stripe_webhook, name='stripe-webhook')
]