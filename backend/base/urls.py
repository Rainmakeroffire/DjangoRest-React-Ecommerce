from django.urls import path
from . import views


urlpatterns = [
    path('products/', views.get_products, name='products'),
    path('products/top/', views.get_top_products, name='products-top'),
    path('products/latest/', views.get_latest_products, name='products-latest'),
    path('products/create/', views.create_product, name='product-create'),
    path('products/upload/', views.upload_image, name='image-upload'),
    path('products/advanced-search/', views.advanced_product_search, name='advanced-search'),
    path('products/<str:pk>/reviews/', views.create_product_review, name='create-review'),
    path('products/<str:pk>/', views.get_product, name='product'),
    path('products/update/<str:pk>/', views.update_product, name='product-update'),
    path('products/delete/<str:pk>/', views.delete_product, name='product-delete'),
    path('get-brands-by-category/<str:category_id>/', views.get_brands_by_category, name='get-brands-by-category'),
    path('brands/', views.get_brands, name='get-brands'),
    path('subjects/', views.get_feedback_subjects, name='get-subjects'),
    path('categories/', views.get_categories, name='get-categories'),
    path('discounts/', views.get_discounts, name='get-discounts'),
    path('testimonials/', views.get_testimonials, name='get-testimonials'),
    path('send-feedback/', views.send_feedback, name='send_feedback'),
    path('subscribe/', views.subscribe, name='subscribe'),
    path('confirm-subscription/<str:subscriber_id>/<uuid:token>/', views.confirm_subscription, name='confirm-subscription'),
    path('unsubscribe/<str:subscriber_id>/<uuid:token>/', views.unsubscribe, name='unsubscribe'),
]
