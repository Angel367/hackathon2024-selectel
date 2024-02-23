from django.urls import path, include

from .views import *
from rest_framework.routers import DefaultRouter

app_name = 'backend_api_app'
router = DefaultRouter()
router.register(r'plandonations', PlanDonationViewSet)


urlpatterns = [
    path('user', UserRetrieveUpdateAPIView.as_view()),
    path('users/', RegistrationAPIView.as_view()),
    path('users/login/', LoginAPIView.as_view()),
    path('donation/', CreateDonationView.as_view()),
    path('', include(router.urls)),
]