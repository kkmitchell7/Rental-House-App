from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import redirect
from authAPI.models import User
from bookingAPI.models import Booking

import stripe
# This is your test secret API key.
stripe.api_key = settings.STRIPE_SECRET_KEY


class StripeCheckoutView(APIView):
    def post(self,request):
        data = request.data
        number_nights = data.get('numberNights', 1)
        start_date = data.get('startDate')
        end_date = data.get('endDate')
        app_user_id = data.get('appUserId')
        try:
            checkout_session = stripe.checkout.Session.create(
                line_items=[
                    {
                        # Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                        'price': 'price_1P46G0HXdx6cDJJLRI1yoHbc',
                        'quantity': number_nights,
                    },
                ],
                mode='payment',
                success_url=settings.SITE_URL + '/profile/?success=true&session_id={CHECKOUT_SESSION_ID}',
                cancel_url=settings.SITE_URL + '/profile/?canceled=true',
                metadata={
                    'start_date': start_date,
                    'end_date':end_date,
                    'app_user_id':app_user_id
                }
            )

            return redirect(checkout_session.url)
        except Exception as e:
            return Response({'message': 'Something went wrong when creating stripe checkout session'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

def stripe_webhook(request):
    payload = request.body
    sig_header = request.META['HTTP_STRIPE_SIGNATURE']
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

    try:
        event = stripe.Webhook.constructEvent(payload, sig_header, endpoint_secret)
    except ValueError as e:
        return Response(status=400)
    except stripe.error.SignatureVerificationError as e:
        return Response(status=400)

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        handle_checkout_session(session)

    return Response({'status': 'success'})

def handle_checkout_session(session):
    metadata = session.get('metadata', {})
    start_date = metadata.get('start_date')
    end_date = metadata.get('end_date')
    app_user_id = metadata.get('app_user_id')
    
    # Replace with logic to fetch app_user object if necessary
    app_user_instance = get_app_user(app_user_id)  # Implement get_app_user() according to your logic

    try:
        new_booking = Booking.objects.create(
            app_user=app_user_instance,
            start_date=start_date,
            end_date=end_date,
            length=calculate_length(start_date, end_date),  # Implement calculate_length() according to your logic
            payment_bool=True,
            price_paid=session['amount_total'] / 100,  # Amount in dollars
            stripe_checkout_id=session['id'],
        )
    except:
        return Response({'message':'Error creating booking'}, status=500)

def get_app_user(app_user_id):
    # Fetch app_user instance from your database
    try:
        return User.objects.get(id=app_user_id)
    except:
        return Response({'message':'Error getting user'}, status=500)

def calculate_length(start_date, end_date):
    # Calculate length based on start_date and end_date
    return (end_date - start_date).days