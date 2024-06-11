from django.db import models

class User(models.Model):
    id = models.IntegerField(primary_key=True)
    first_name = models.CharField(max_length=30,default="None")
    last_name =  models.CharField(max_length=30,default="None")
    email = models.EmailField(max_length=100,default="None")
    image = models.ImageField(default="https://storage.googleapis.com/ix-blog-app/download.png")
    password = models.CharField(max_length=30,default="None")