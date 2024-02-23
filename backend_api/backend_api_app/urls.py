from django.urls import path

from .views import (
     LoginAPIView, RegistrationAPIView, UserRetrieveUpdateAPIView
)

app_name = 'backend_api_app'

urlpatterns = [
    path('user', UserRetrieveUpdateAPIView.as_view()),
    path('users', RegistrationAPIView.as_view()),
    path('users/login', LoginAPIView.as_view()),
    # path('users/login-email', LoginEmailAPIView.as_view()),

]
