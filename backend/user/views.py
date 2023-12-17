from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.contrib.auth.models import User
from base.serializers import (ProductSerializer, UserSerializer, UserSerializerWithToken, FavoriteSerializer,
                              ComparisonSerializer, ReviewSerializer, MyReviewsSerializer)
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.hashers import make_password
from rest_framework import status
from base.utils import paginate

from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.core.exceptions import ObjectDoesNotExist
from django.conf import settings

from base.models import Product, Review
from user.models import Favorite, Comparison


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user).data

        for k, v in serializer.items():
            data[k] = v

        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['POST'])
def register_user(request):
    data = request.data
    try:
        user = User.objects.create(
            first_name=data['name'],
            username=data['email'],
            email=data['email'],
            password=make_password(data['password'])
        )
        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)
    except Exception:
        message = {'detail': f'User with this email already exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    user = request.user
    serializer = UserSerializerWithToken(user, many=False)

    data = request.data

    current_password = data.get('currentPassword', '')
    if not user.check_password(current_password):
        return Response({'detail': 'Incorrect current password'}, status=status.HTTP_400_BAD_REQUEST)

    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']

    if data['password'] != '':
        user.password = make_password(data['password'])

    user.save()

    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_users(request):
    users = User.objects.all()

    return Response(paginate(request, users, 10, 5, UserSerializer, 'users'))


@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_user_by_id(request, pk):
    user = User.objects.get(id=pk)
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user(request, pk):
    user = User.objects.get(id=pk)

    data = request.data

    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']
    user.is_staff = data['isAdmin']

    user.save()

    serializer = UserSerializer(user, many=False)

    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_user(request, pk):
    user_to_delete = User.objects.get(id=pk)
    user_to_delete.delete()
    return Response('User deleted')


@api_view(['POST'])
def initiate_password_reset(request):
    if request.method == 'POST':
        email = request.data.get('email')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'detail': 'No user with this email address found'}, status=404)

        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        frontend_server_url = settings.FRONTEND_SERVER_URL
        password_reset_link = f"{frontend_server_url}reset/{uid}/{token}/"

        send_mail(
            'ProDigital: Password Reset',
            f'Click the following link to reset your password: {request.build_absolute_uri(password_reset_link)}',
            'rainmakeroffire@gmail.com',
            [email],
            fail_silently=False,
            html_message=f'Click the following link to reset your password:<br><a href="{request.build_absolute_uri(password_reset_link)}">{request.build_absolute_uri(password_reset_link)}</a><br><br>ProDigital Team'
        )

        return Response({'message': 'Check your email for the password reset link'})


@api_view(['POST'])
def confirm_password_reset(request, uidb64, token):
    if request.method == 'POST':
        password = request.data.get('password')

        try:
            user_id = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=user_id)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({'detail': 'Invalid user or token'}, status=400)

        if default_token_generator.check_token(user, token):
            user.password = make_password(password)
            user.save()
            return Response({'message': 'Your password has been updated successfully'})

    return Response({'detail': 'Password reset failed'}, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_favorites(request, pk):
    try:
        product = Product.objects.get(id=pk)
        user = request.user

        if Favorite.objects.filter(user=user, product=product).exists():
            return Response({'detail': 'Product is already in favorites'}, status=status.HTTP_400_BAD_REQUEST)

        favorite = Favorite(user=user, product=product)
        favorite.save()

        serializer = FavoriteSerializer(favorite)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Product.DoesNotExist:
        return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_favorites(request, pk):
    try:
        product = Product.objects.get(id=pk)
        user = request.user

        favorite = Favorite.objects.get(user=user, product=product)
        favorite.delete()

        return Response({'detail': 'Product removed from favorites'}, status=status.HTTP_200_OK)

    except (Product.DoesNotExist, Favorite.DoesNotExist):
        return Response({'detail': 'Product or favorite not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_comparisons(request, pk):
    try:
        product = Product.objects.get(id=pk)
        user = request.user

        if Comparison.objects.filter(user=user, product=product).exists():
            return Response({'detail': 'Product is already in comparisons'}, status=status.HTTP_400_BAD_REQUEST)

        if Comparison.objects.filter(user=user).count() >= 4:
            return Response({'detail': 'You cannot add more than 4 items for comparison.'},
                            status=status.HTTP_400_BAD_REQUEST)

        comparison = Comparison(user=user, product=product)
        comparison.save()

        serializer = ComparisonSerializer(comparison)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Product.DoesNotExist:
        return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_comparisons(request, pk):
    try:
        product = Product.objects.get(id=pk)
        user = request.user

        comparison = Comparison.objects.get(user=user, product=product)
        comparison.delete()

        return Response({'detail': 'Product removed from comparisons'}, status=status.HTTP_200_OK)

    except (Product.DoesNotExist, Comparison.DoesNotExist):
        return Response({'detail': 'Product or comparison not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_review(request, pk):
    try:
        product = Product.objects.get(id=pk)
        user = request.user

        review = Review.objects.get(user=user, product=product)
        review.delete()

        reviews = product.review_set.all()
        product.num_reviews = len(reviews)

        total = 0
        for i in reviews:
            total += i.rating

        product.rating = total / len(reviews) if len(reviews) != 0 else 0
        product.save()

        return Response({'detail': 'Review removed'}, status=status.HTTP_200_OK)

    except (Product.DoesNotExist, Comparison.DoesNotExist):
        return Response({'detail': 'Product or review not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_favorites(request):
    user = request.user
    favorites = user.favorite_set.all()
    serializer = FavoriteSerializer(favorites, many=True)

    return Response({'myfavorites': serializer.data})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_comparisons(request):
    user = request.user
    comparisons = user.comparison_set.all()
    serializer = ComparisonSerializer(comparisons, many=True)

    return Response({'mycomparisons': serializer.data})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_reviews(request):
    user = request.user
    reviews = user.review_set.all()
    serializer = MyReviewsSerializer(reviews, many=True)

    return Response({'myreviews': serializer.data})
