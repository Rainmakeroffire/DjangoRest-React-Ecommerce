from django.urls import path
from . import views
from .views import initiate_password_reset, confirm_password_reset


urlpatterns = [
    path('users/login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/register/', views.register_user, name='register'),
    path('users/profile/', views.get_user_profile, name='user-profile'),
    path('users/profile/update/', views.update_user_profile, name='user-profile-update'),
    path('users/profile/favorites/', views.get_my_favorites, name='myfavorites'),
    path('users/profile/comparisons/', views.get_my_comparisons, name='mycomparisons'),
    path('users/profile/reviews/', views.get_my_reviews, name='myreviews'),
    path('users/', views.get_users, name='users'),
    path('users/<str:pk>/', views.get_user_by_id, name='user'),
    path('users/update/<str:pk>/', views.update_user, name='user-update'),
    path('users/delete/<str:pk>/', views.delete_user, name='user-delete'),

    path('favorites/add/<str:pk>/', views.add_to_favorites, name='favorite-add'),
    path('favorites/remove/<str:pk>/', views.remove_from_favorites, name='favorite-remove'),

    path('comparisons/add/<str:pk>/', views.add_to_comparisons, name='comparison-add'),
    path('comparisons/remove/<str:pk>/', views.remove_from_comparisons, name='comparison-remove'),

    path('reviews/remove/<str:pk>/', views.remove_review, name='review-remove'),

    path('password_reset/', initiate_password_reset, name='password_reset_initiate'),
    path('reset/<uidb64>/<token>/', confirm_password_reset, name='password_reset_confirm'),
]
