from django.db.models.signals import pre_save, post_save, pre_delete
from django.contrib.auth.models import User
from django.dispatch.dispatcher import receiver
from django.db.models import Q
from .models import Discount, Product


@receiver(pre_save, sender=User)
def update_user(sender, instance, **kwargs):
    user = instance
    if user.email != '':
        user.username = user.email


@receiver(post_save, sender=Discount)
def assign_discount(sender, instance, **kwargs):

    products_to_assign = Product.objects.filter(
        Q(brand__in=instance.brands.all()) |
        Q(category__in=instance.categories.all()) |
        Q(rating__in=instance.ratings.all()) |
        Q(id__in=instance.products.all())
    )

    for product in products_to_assign:
        product.discounts.add(instance)


@receiver(pre_delete, sender=Discount)
def remove_discount(sender, instance, **kwargs):
    discounted_products = instance.products.all()

    for product in discounted_products:
        product.discounts.remove(instance)

    instance.save()
