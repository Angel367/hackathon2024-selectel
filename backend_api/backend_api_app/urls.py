from django.urls import path, include

from .views import *
from rest_framework.routers import DefaultRouter

app_name = 'backend_api_app'
router = DefaultRouter()
router.register(r'donations', DonationViewSet, basename='donations')
router.register(r'plan_donations', PlanDonationViewSet, basename='plan_donations')
router.register(r'journal', ArticleViewSet, basename='journal'),
router.register(r'special', SpecialProjectViewSet, basename='special'),

urlpatterns = [
    path('user/account/', UserRetrieveUpdateAPIView.as_view()),
    path('users/', RegistrationAPIView.as_view()),
    path('users/login/', LoginAPIView.as_view()),
    path('user/donor-card/', DonorCardAPIView.as_view()),
    path('user/main/', MainUserAPIView.as_view()),
    path('user/my-bonus/', MyBonusAPIView.as_view()),
    path('bonus/<int:bonus_id>/', BonusFeedbackAPIView.as_view()),
    path('', include(router.urls))
]
