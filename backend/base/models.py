from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
import uuid


class Rating(models.Model):
    value = models.DecimalField(
        max_digits=3,
        decimal_places=1,
        validators=[MinValueValidator(1.0), MaxValueValidator(5.0)]
    )

    def __str__(self):
        return str(self.value)


class Brand(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name


class Discount(models.Model):
    name = models.CharField(max_length=100)
    ratio = models.DecimalField(max_digits=5, decimal_places=2)
    start_date = models.DateField()
    end_date = models.DateField()
    products = models.ManyToManyField('Product', blank=True)
    brands = models.ManyToManyField(Brand, blank=True)
    categories = models.ManyToManyField(Category, blank=True)
    ratings = models.ManyToManyField(Rating, blank=True)

    def __str__(self):
        return f'{self.name}: {int(self.ratio * 100)}%'


class Product(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    image = models.ImageField(null=True, blank=True, default='/placeholder.jpg')
    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    rating = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    num_reviews = models.IntegerField(null=True, blank=True, default=0)
    price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    count_in_stock = models.IntegerField(null=True, blank=True, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    characteristics = models.TextField(null=True, blank=True, default='{}')
    discounts = models.ManyToManyField(Discount, blank=True)

    def __str__(self):
        return self.name


class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    rating = models.IntegerField(null=True, blank=True, default=0)
    comment = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user} on {self.product}: {self.rating}'


class Testimonial(models.Model):
    name = models.CharField(max_length=50, null=True, blank=True)
    role = models.CharField(max_length=50, null=True, blank=True)
    text = models.TextField(max_length=450, null=True, blank=True)
    image = models.ImageField(null=True, blank=True, default='/customer.jpg')

    def __str__(self):
        return f'{self.name}, {self.role}'


class FeedbackSubject(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Subscriber(models.Model):
    email = models.EmailField(unique=True)
    confirmation_token = models.UUIDField(default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(default=timezone.now)
    subscribed = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.email}, created on {self.created_at}, {"subscribed" if self.subscribed else "not confirmed"}'
