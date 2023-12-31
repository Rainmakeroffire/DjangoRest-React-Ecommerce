# Generated by Django 4.2.5 on 2023-11-04 22:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0013_alter_rating_value'),
    ]

    operations = [
        migrations.CreateModel(
            name='Testimonial',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=50, null=True)),
                ('role', models.CharField(blank=True, max_length=50, null=True)),
                ('text', models.TextField(blank=True, max_length=450, null=True)),
                ('image', models.ImageField(blank=True, default='/user.jpg', null=True, upload_to='')),
            ],
        ),
    ]
