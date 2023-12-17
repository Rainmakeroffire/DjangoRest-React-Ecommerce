from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Product, Review, Brand, Category, Discount, Testimonial, FeedbackSubject
from order.models import Order, OrderItem, ShippingAddress
from user.models import Favorite, Comparison
from datetime import date


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    is_admin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', 'is_admin']

    def get_name(self, obj):
        name = obj.first_name
        if name == '':
            name = obj.email

        return name

    def get_is_admin(self, obj):
        return obj.is_staff


class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', 'is_admin', 'token']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)


class ReviewSerializer(serializers.ModelSerializer):

    class Meta:
        model = Review
        fields = '__all__'


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = '__all__'


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class DiscountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discount
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    reviews = serializers.SerializerMethodField(read_only=True)
    brand = BrandSerializer()
    category = CategorySerializer()
    discounts = DiscountSerializer(many=True)
    discounted_price = serializers.SerializerMethodField()
    applied_discount = serializers.SerializerMethodField()
    price = serializers.DecimalField(max_digits=7, decimal_places=2, coerce_to_string=False)

    class Meta:
        model = Product
        fields = '__all__'

    def get_reviews(self, obj):
        reviews = obj.review_set.all()
        serializer = ReviewSerializer(reviews, many=True)
        return serializer.data

    def get_discounted_price(self, obj):
        today = date.today()
        valid_discounts = [discount for discount in obj.discounts.all() if
                           discount.start_date <= today <= discount.end_date]

        if valid_discounts:
            max_ratio_discount = max(valid_discounts, key=lambda discount: discount.ratio)
            discounted_price = float(obj.price) * (1 - float(max_ratio_discount.ratio))
            return round(discounted_price, 2)
        return obj.price

    def get_applied_discount(self, obj):
        today = date.today()
        valid_discounts = [discount for discount in obj.discounts.all() if
                           discount.start_date <= today <= discount.end_date]

        if valid_discounts:
            max_ratio_discount = max(valid_discounts, key=lambda discount: discount.ratio)
            return DiscountSerializer(max_ratio_discount).data
        return None

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['price'] = float(data['price'])
        return data


class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = '__all__'


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    order_items = serializers.SerializerMethodField(read_only=True)
    shipping_address = serializers.SerializerMethodField(read_only=True)
    user = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Order
        fields = '__all__'

    def get_order_items(self, obj):
        items = obj.orderitem_set.all()
        serializer = OrderItemSerializer(items, many=True)
        return serializer.data

    def get_shipping_address(self, obj):
        try:
            address = ShippingAddressSerializer(obj.shippingaddress, many=False).data
        except:
            address = False
        return address

    def get_user(self, obj):
        user = obj.user
        serializer = UserSerializer(user, many=False)
        return serializer.data


class FavoriteSerializer(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = Favorite
        fields = '__all__'


class ComparisonSerializer(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = Comparison
        fields = '__all__'


class MyReviewsSerializer(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = Review
        fields = '__all__'


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = '__all__'


class FeedbackSubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedbackSubject
        fields = '__all__'
