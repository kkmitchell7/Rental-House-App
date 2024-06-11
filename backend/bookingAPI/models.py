import django
from django.db import models
from datetime import timedelta
from authAPI.models import User
from django.dispatch import receiver
from django.db.models.signals import post_save

class Booking(models.Model):
    id = models.IntegerField(primary_key=True)
    app_user = models.ForeignKey(User, on_delete=models.CASCADE)
    start_date = models.DateField(default=django.utils.timezone.now)
    end_date = models.DateField(default=django.utils.timezone.now)
    length = models.IntegerField() #number of nights staying
    payment_bool = models.BooleanField(default=False)
    price_paid = models.FloatField(default=0)
    stripe_checkout_id = models.CharField(max_length=500)

    def get_all_dates(self):
        # Generate a list of dates between start_date and end_date (inclusive)
        all_dates = [str(self.start_date + timedelta(days=i)) for i in range((self.end_date - self.start_date).days + 1)]
        return all_dates
    
    @receiver(post_save,sender=User)
    def create_user_payment(sender, instance, created, **kwargs):
        if created:
            Booking.objects.create(app_user=instance)
