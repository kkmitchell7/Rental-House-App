from django.db import models
import uuid

class User(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=30,default="None")
    last_name =  models.CharField(max_length=30,default="None")
    email = models.EmailField(max_length=100,default="None")
    image = models.ImageField(upload_to='static/profile-images', blank=True, null=True, default="https://storage.googleapis.com/ix-blog-app/download.png")
    password = models.CharField(max_length=30,default="None")
    #need to add a bookings field so can keep track of all of each user's bookings

    def check_password(self, given_password): #need to make more secure! do better hashing here
        return given_password == self.password