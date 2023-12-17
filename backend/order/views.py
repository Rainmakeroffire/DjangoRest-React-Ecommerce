from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from base.utils import paginate
from base.models import Product
from .models import Order, OrderItem, ShippingAddress
from base.serializers import ProductSerializer, OrderSerializer
from rest_framework import status
from datetime import datetime


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_order_items(request):
    user = request.user
    data = request.data
    order_items = data['orderItems']

    if order_items and len(order_items) == 0:
        return Response({'detail': 'No Order Items'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        order = Order.objects.create(
            user=user,
            payment_method=data['paymentMethod'],
            shipping_price=data['shippingPrice'],
            total_price=data['totalPrice']
        )

        shipping = ShippingAddress.objects.create(
            order=order,
            address=data['shippingAddress']['address'],
            city=data['shippingAddress']['city'],
            postal_code=data['shippingAddress']['postalCode'],
            country=data['shippingAddress']['country']
        )

        for i in order_items:
            product = Product.objects.get(id=i['product'])

            item = OrderItem.objects.create(
                product=product,
                order=order,
                name=product.name,
                quantity=i['qty'],
                price=i['price'],
                image=product.image.url
            )

            product.count_in_stock -= item.quantity
            product.save()

        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_orders(request):
    user = request.user
    orders = user.order_set.all().order_by('-created_at')

    return Response(paginate(request, orders, 5, 5, OrderSerializer, 'myorders'))


@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_orders(request):
    orders = Order.objects.all().order_by('-created_at')

    return Response(paginate(request, orders, 10, 5, OrderSerializer, 'orders'))


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_order_by_id(request, pk):
    user = request.user

    try:
        order = Order.objects.get(id=pk)

        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            Response({'detail': 'Insufficient rights to view this order'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception:
        return Response({'detail': 'Order does not exist'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_order_to_paid(request, pk):
    order = Order.objects.get(id=pk)
    order.is_paid = True
    order.paid_at = datetime.now()
    order.save()

    return Response('Order was paid')


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def update_order_to_delivered(request, pk):
    order = Order.objects.get(id=pk)
    order.is_delivered = True
    order.delivered_at = datetime.now()
    order.save()

    return Response('Order was delivered')