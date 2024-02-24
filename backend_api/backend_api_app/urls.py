"""
This file is used to define the urls for the backend_api_app.
"""
from django.urls import path, include

from .views import *
from rest_framework.routers import DefaultRouter

app_name = 'backend_api_app'
router = DefaultRouter()
router.register(r'user/donations', UserDonationViewSet, basename='user_donations')
router.register(r'user/plan_donations', UserPlanDonationViewSet, basename='user_plan_donations')

router.register(r'journal', ArticleViewSet, basename='journal'),
router.register(r'special', SpecialProjectViewSet, basename='special'),
router.register(r'city', CityViewSet, basename='city'),
router.register(r'blood_station_search', BloodStationSearchViewSet, basename='city_search'),

urlpatterns = [
    path('user/account/', UserRetrieveUpdateAPIView.as_view()),
    path('users/', RegistrationAPIView.as_view()),
    path('users/login/', LoginAPIView.as_view()),
    path('user/donor-card/', DonorCardAPIView.as_view()),
    path('user/main/', MainUserAPIView.as_view()),
    path('user/my-bonus/', MyBonusAPIView.as_view()),
    path('donation_top/', DonationTopApiView.as_view(), name='DonationTopApiView'),
    path('bonus/<int:bonus_id>/', BonusFeedbackAPIView.as_view({'get': 'list'})),
    path('', include(router.urls))
]
