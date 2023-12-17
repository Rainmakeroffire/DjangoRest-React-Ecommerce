from django.urls import path
from . import views


urlpatterns = [
    path('orders/', views.get_orders, name='orders'),
    path('orders/add/', views.add_order_items, name='add-order'),
    path('orders/myorders/', views.get_my_orders, name='myorders'),
    path('orders/<str:pk>/deliver/', views.update_order_to_delivered, name='order-delivered'),
    path('orders/<str:pk>/', views.get_order_by_id, name='user-order'),
    path('orders/<str:pk>/pay/', views.update_order_to_paid, name='pay'),
]
