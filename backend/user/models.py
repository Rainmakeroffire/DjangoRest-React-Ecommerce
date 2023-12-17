from django.db import models
from django.contrib.auth.models import User
from base.models import Product


class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return f"{self.user.username} account favorite item: {self.product.name}"


class Comparison(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return f"{self.user.username} account comparison item: {self.product.name}"
