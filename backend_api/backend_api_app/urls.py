from django.urls import path, include

from .views import *
from rest_framework.routers import DefaultRouter

app_name = 'backend_api_app'
router = DefaultRouter()
router.register(r'donations', DonationViewSet, basename='donations')
router.register(r'plan_donations', PlanDonationViewSet, basename='plan_donations')


urlpatterns = [
    path('user', UserRetrieveUpdateAPIView.as_view()),
    path('users/', RegistrationAPIView.as_view()),
    path('users/login/', LoginAPIView.as_view()),
    path('', include(router.urls))
]
