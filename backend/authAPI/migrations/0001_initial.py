# Generated by Django 5.0.6 on 2024-06-09 17:21

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(default='None', max_length=30)),
                ('last_name', models.CharField(default='None', max_length=30)),
                ('email', models.EmailField(default='None', max_length=100)),
                ('image', models.ImageField(default='https://storage.googleapis.com/ix-blog-app/download.png', upload_to='')),
                ('password', models.CharField(default='None', max_length=30)),
            ],
        ),
    ]
