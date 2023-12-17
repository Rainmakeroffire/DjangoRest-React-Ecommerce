from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from .utils import paginate
from .models import Product, Review, Category, Brand, Discount, Testimonial, FeedbackSubject, Subscriber
from .serializers import (ProductSerializer, BrandSerializer, CategorySerializer, DiscountSerializer,
                          TestimonialSerializer, FeedbackSubjectSerializer)
from user.models import Favorite, Comparison
from django.core.mail import send_mail
from backend.settings import DEFAULT_FROM_EMAIL, FRONTEND_SERVER_URL
from django.db.models import Q
from datetime import date
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from profanity import profanity


@api_view(['GET'])
def get_products(request):
    query = request.query_params.get('keyword')

    if query is None:
        query = ''

    products = Product.objects.filter(name__icontains=query)

    return Response(paginate(request, products, 8, 5, ProductSerializer, 'products'))


@api_view(['GET'])
def get_top_products(request):
    products = Product.objects.filter(rating__gte=4).order_by('-rating')[0:5]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_latest_products(request):
    products = Product.objects.order_by('-created_at')[0:8]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_product(request, pk):
    product = Product.objects.get(id=pk)
    serializer = ProductSerializer(product, many=False)
    user = request.user

    is_in_favorites = Favorite.objects.filter(product_id=product.id, user_id=user.id).exists()
    is_in_comparisons = Comparison.objects.filter(product_id=product.id, user_id=user.id).exists()

    data = serializer.data
    data['isInFavorites'] = is_in_favorites
    data['isInComparisons'] = is_in_comparisons

    return Response(data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def create_product(request):
    user = request.user
    product = Product.objects.create(
        user=user,
        name='Sample Name',
        price=0,
        count_in_stock=0,
        description=''
    )
    serializer = ProductSerializer(product, many=False)

    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def update_product(request, pk):
    data = request.data
    product = Product.objects.get(id=pk)

    product.name = data['name']
    product.price = data['price']
    product.count_in_stock = data['countInStock']
    product.description = data['description']

    if 'brand' in data and data['brand'] is not None:
        brand_id = data['brand']
        brand = Brand.objects.get(id=brand_id)
        product.brand = brand

    if 'category' in data and data['category'] is not None:
        category_id = data['category']
        category = Category.objects.get(id=category_id)
        product.category = category

    discounts_data = data.get('discounts', [])
    product.discounts.clear()
    for discount_id in discounts_data:
        try:
            discount = Discount.objects.get(id=discount_id)
            product.discounts.add(discount)
        except Discount.DoesNotExist:
            return Response({'detail': 'Discount not found'})

    product.save()

    serializer = ProductSerializer(product, many=False)

    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_product(request, pk):
    product = Product.objects.get(id=pk)
    product.delete()
    return Response('Product deleted')


@api_view(['POST'])
def upload_image(request):
    data = request.data
    product_id = data['product_id']
    product = Product.objects.get(id=product_id)

    product.image = request.FILES.get('image')
    product.save()

    return Response('Image uploaded')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_product_review(request, pk):
    user = request.user
    product = Product.objects.get(id=pk)
    data = request.data

    already_exists = product.review_set.filter(user=user).exists()

    if already_exists:
        content = {'detail': 'Product already reviewed'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)
    elif data['rating'] == 0:
        content = {'detail': 'Please select a rating'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)
    elif profanity.contains_profanity(data['comment']):
        content = {'detail': 'Please be polite, profanity is not allowed on our site'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)
    else:
        review = Review.objects.create(
            user=user,
            product=product,
            name=user.first_name,
            rating=data['rating'],
            comment=data['comment']
        )

        reviews = product.review_set.all()
        product.num_reviews = len(reviews)

        total = 0
        for i in reviews:
            total += i.rating

        product.rating = total / len(reviews)
        product.save()

        return Response('Review added')


@api_view(['GET'])
def get_brands(request):
    brands = Brand.objects.all()
    serializer = BrandSerializer(brands, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_discounts(request):
    discounts = Discount.objects.all()
    serializer = DiscountSerializer(discounts, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_testimonials(request):
    testimonials = Testimonial.objects.all()
    serializer = TestimonialSerializer(testimonials, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def send_feedback(request):
    name = request.data.get('name')
    email = request.data.get('email')
    subject_id = request.data.get('subject')
    message = request.data.get('userMessage')

    message_body = (f"You have submitted the following feedback on the ProDigital online shop website:\n\n"
                    f"From: {email}\n"
                    f"Name: {name}\n\n"
                    f"Message:\n{message}\n\n"
                    f"ProDigital Team")
    subject = FeedbackSubject.objects.get(id=subject_id).name

    send_mail(
        subject,
        message_body,
        DEFAULT_FROM_EMAIL,
        [email, DEFAULT_FROM_EMAIL],
        fail_silently=False,
    )

    return Response({'message': 'Thank you for your feedback! We will get back to you soon'},
                    status=status.HTTP_201_CREATED)


@api_view(['GET'])
def get_feedback_subjects(request):
    subjects = FeedbackSubject.objects.all()
    serializer = FeedbackSubjectSerializer(subjects, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def advanced_product_search(request):
    name = request.GET.get('name', '')
    category = request.GET.get('category', '')
    has_discounts = request.GET.get('has_discounts', False)
    if isinstance(has_discounts, str):
        has_discounts = has_discounts.lower() == 'true'
    in_stock = request.GET.get('in_stock', False)
    if isinstance(in_stock, str):
        in_stock = in_stock.lower() == 'true'
    min_price = request.GET.get('min_price', None)
    max_price = request.GET.get('max_price', None)
    min_rating = request.GET.get('min_rating', None)
    max_rating = request.GET.get('max_rating', None)
    selected_brands = request.GET.get('brands', '')
    brands = [int(brand_id) for brand_id in selected_brands.split(',') if brand_id] if isinstance(selected_brands,
                                                                                                  str) else []
    sort_option = request.GET.get('sort_option', '')

    query = Q(name__icontains=name) | Q(description__icontains=name) | Q(brand__name__icontains=name)
    if category:
        query &= Q(category=category)
    if has_discounts:
        today = date.today()
        query &= Q(discounts__start_date__lte=today, discounts__end_date__gte=today)
    if in_stock:
        query &= Q(count_in_stock__gt=0)
    if min_price:
        query &= Q(price__gte=min_price)
    if max_price:
        query &= Q(price__lte=max_price)
    if min_rating:
        query &= Q(rating__gte=min_rating)
    if max_rating:
        query &= Q(rating__lte=max_rating)
    if brands:
        query &= Q(brand__id__in=brands)

    if sort_option == 'price_low_to_high':
        products = Product.objects.filter(query).order_by('price')
    elif sort_option == 'price_high_to_low':
        products = Product.objects.filter(query).order_by('-price')
    elif sort_option == 'rating_low_to_high':
        products = Product.objects.filter(query).order_by('rating')
    elif sort_option == 'rating_high_to_low':
        products = Product.objects.filter(query).order_by('-rating')
    else:
        products = Product.objects.filter(query)

    page = request.query_params.get('page', 1)
    paginator = Paginator(products, 8)

    try:
        paginated_products = paginator.page(page)
    except PageNotAnInteger:
        paginated_products = paginator.page(1)
    except EmptyPage:
        paginated_products = paginator.page(paginator.num_pages)

    serializer = ProductSerializer(paginated_products, many=True)

    return Response({
        'products': serializer.data,
        'page': paginated_products.number,
        'pages': paginator.num_pages,
        'pagination_range': list(paginator.page_range)
    })


@api_view(['GET'])
def get_brands_by_category(request, category_id):
    try:
        products = Product.objects.filter(category=category_id)
        brands = Brand.objects.filter(product__in=products).distinct()
        serializer = BrandSerializer(brands, many=True)
        return Response(serializer.data)
    except Brand.DoesNotExist:
        return Response([])


@api_view(['POST'])
def subscribe(request):
    email = request.data.get('email')

    if email:
        subscriber, created = Subscriber.objects.get_or_create(email=email)

        if not created and subscriber.subscribed:
            return Response({'detail': 'You are already subscribed'}, status=400)

        if not subscriber.subscribed:

            confirmation_url = f"{FRONTEND_SERVER_URL}confirm-subscription/{str(subscriber.id)}/{str(subscriber.confirmation_token)}"
            subject = 'Confirm your subscription'
            message_body = (
                f'Click the following link to confirm your subscription:\n\n'
                f'{confirmation_url}\n\n'
                f'ProDigital Team'
            )

            try:
                send_mail(subject, message_body, DEFAULT_FROM_EMAIL, [email])
                return Response({'message': 'Please check your email to confirm subscription'}, status=202)
            except Exception as e:
                return Response({'detail': 'Subscription failed. Please try again later'}, status=500)

    return Response({'detail': 'Please enter an email to subscribe'}, status=400)


@api_view(['GET'])
def confirm_subscription(request, subscriber_id, token):
    try:
        subscriber = Subscriber.objects.get(id=subscriber_id, confirmation_token=token, subscribed=False)
        subscriber.subscribed = True
        subscriber.save()

        unsubscribe_url = f"{FRONTEND_SERVER_URL}unsubscribe/{str(subscriber.id)}/{str(subscriber.confirmation_token)}"
        subject = 'Subscription Confirmed'
        message_body = (
            f'Your subscription has been confirmed successfully.\n\n'
            f'If you wish to unsubscribe in the future, click the following link:\n\n'
            f'{unsubscribe_url}\n\n'
            f'ProDigital Team'
        )

        try:
            send_mail(subject, message_body, DEFAULT_FROM_EMAIL, [subscriber.email])
            return Response({'message': 'You have been successfully subscribed to our newsletter'})
        except Exception as e:
            return Response({'detail': f'You subscription is confirmed, but the confirmation letter delivery failed.'
                                        f'We apologize for any inconvenience'}, status=500)

    except Subscriber.DoesNotExist:
        return Response({'detail': 'Confirmation link is invalid or expired'}, status=400)


@api_view(['GET'])
def unsubscribe(request, subscriber_id, token):
    try:
        subscriber = Subscriber.objects.get(id=subscriber_id, confirmation_token=token)
        subscriber.delete()

        subject = 'Unsubscription Confirmed'
        message = 'You have been successfully unsubscribed from our newsletter'
        message_body = (
            f'{message}.\n\n'
            f'ProDigital Team'
        )

        try:
            send_mail(subject, message_body, DEFAULT_FROM_EMAIL, [subscriber.email])
            return Response({'message': message})
        except Exception as e:
            error_message = (f'You have been successfully unsubscribed, but the confirmation letter delivery failed.'
                             f'We apologize for any inconvenience')
            return Response({'detail': error_message}, status=500)

    except Subscriber.DoesNotExist:
        return Response({'detail': 'Unsubscribe link is invalid or expired'}, status=400)

