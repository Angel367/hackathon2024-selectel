from django.urls import path, include

from .views import *
from rest_framework.routers import DefaultRouter

app_name = 'backend_api_app'
router = DefaultRouter()
router.register(r'user/donations', UserDonationViewSet, basename='user_donations')
router.register(r'user/plan_donations', UserPlanDonationViewSet, basename='user_plan_donations')


urlpatterns = [
    path('user/', UserRetrieveUpdateAPIView.as_view()),
    path('users/', RegistrationAPIView.as_view()),
    path('users/login/', LoginAPIView.as_view()),
    path('donation_top/', DonationTopApiView.as_view(), name='DonationTopApiView'),
    path('', include(router.urls))
]
