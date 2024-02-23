import json

from django.http import JsonResponse
from rest_framework import status, viewsets, permissions
from rest_framework.decorators import action
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .renderers import UserJSONRenderer
from .serializers import *
from .models import Donation, PlanDonation


class RegistrationAPIView(APIView):
    """
    Разрешить всем пользователям (аутентифицированным и нет) доступ к данному эндпоинту.
    """
    renderer_classes = (UserJSONRenderer,)
    permission_classes = (AllowAny,)
    serializer_class = RegistrationSerializer

    def post(self, request):
        user = request.data.get('user', {})

        # Паттерн создания сериализатора, валидации и сохранения - довольно
        # стандартный, и его можно часто увидеть в реальных проектах.
        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class LoginAPIView(APIView):
    # for login
    permission_classes = (AllowAny,)
    renderer_classes = (UserJSONRenderer,)
    serializer_class = LoginSerializer

    def post(self, request):
        user = request.data.get('user', {})
        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserRetrieveUpdateAPIView(RetrieveUpdateAPIView):
    # for account settings user (retrieve and update)
    permission_classes = (IsAuthenticated,)
    renderer_classes = (UserJSONRenderer,)
    serializer_class = UserSerializer

    def retrieve(self, request, *args, **kwargs):
        # Здесь нечего валидировать или сохранять. Мы просто хотим, чтобы
        # сериализатор обрабатывал преобразования объекта User во что-то, что
        # можно привести к json и вернуть клиенту.
        serializer = self.serializer_class(request.user)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        serializer_data = request.data
        # Паттерн сериализации, валидирования и сохранения - то, о чем говорили
        serializer = self.serializer_class(
            request.user, data=serializer_data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)


class DonorCardAPIView(RetrieveUpdateAPIView):
    # for donor card (retrieve and update)
    permission_classes = (IsAuthenticated,)
    renderer_classes = (UserJSONRenderer,)
    serializer_class = DonorCardSerializer

    def retrieve(self, request, *args, **kwargs):
        serializer = self.serializer_class(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        serializer_data = request.data.get('user', {})

        serializer = self.serializer_class(
            request.user, data=serializer_data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class AllDataAPIView(APIView):
    # for all data (retrieve)
    permission_classes = (IsAuthenticated,)
    renderer_classes = (UserJSONRenderer,)

    def get(self, request):
        user = request.user
        data = {
            "user": UserSerializer(user).data,
            "donor_card": DonorCardSerializer(user).data,
            "donations": MyDonationSerializer(Donation.objects.filter(user=user)).data,
            "plan_donations": UserPlanDonationSerializer(PlanDonation.objects.filter(user=user)).data
        }
        return Response(data, status=status.HTTP_200_OK)


class UserDonationViewSet(viewsets.ViewSet):
    # for donations (list, create, retrieve, update, delete)
    permission_classes = (IsAuthenticated,)  # Требуется авторизация через токен

    def list(self, request):
        donations = Donation.objects.filter(user=request.user)
        serializer = MyDonationSerializer(donations, many=True)
        return Response(serializer.data)

    def create(self, request):
        user = request.user
        data = request.data.copy()
        data['user'] = user.id
        serializer = MyDonationSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):  # Modify retrieve method to accept pk
        try:
            donation = Donation.objects.get(pk=pk)
        except Donation.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = MyDonationSerializer(donation)
        return Response(serializer.data)

    def update(self, request, pk=None):  # Add update method to handle PUT requests
        pk = request.data.get('id')
        user = request.user
        data = request.data.copy()
        data['user'] = user.id
        try:
            donation = Donation.objects.get(pk=pk)
        except Donation.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = MyDonationSerializer(donation, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['delete'])
    def delete(self, request, pk=None):  # Modify delete method to accept pk
        pk = request.data.get('id')
        try:
            donation = Donation.objects.get(pk=pk)
        except Donation.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND, data={"Сущность не найдена"})

        donation.delete()
        return Response(status=status.HTTP_204_NO_CONTENT, data={"Успешно удалено"})


class UserPlanDonationViewSet(viewsets.ViewSet):
    permission_classes = (IsAuthenticated,)  # Требуется авторизация через токен

    def list(self, request):
        donations = PlanDonation.objects.filter(user=request.user)
        serializer = UserPlanDonationSerializer(donations, many=True)
        return Response(serializer.data)

    def create(self, request):
        user = request.user
        data = request.data.copy()
        data['user'] = user.id
        serializer = UserPlanDonationSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):  # Modify retrieve method to accept pk
        try:
            donation = PlanDonation.objects.get(pk=pk)
        except PlanDonation.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = UserPlanDonationSerializer(donation)
        return Response(serializer.data)

    def update(self, request, pk=None):  # Add update method to handle PUT requests
        pk = request.data.get('id')
        user = request.user
        data = request.data.copy()
        data['user'] = user.id
        try:
            donation = PlanDonation.objects.get(pk=pk)
        except Donation.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = UserPlanDonationSerializer(donation, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DonationTopApiView(APIView):
    def get(self, request):
        if request.query_params.get('blood_center_id'):
            donations = Donation.objects.filter(
                blood_station_id=request.query_params.get('blood_center_id'),
                is_confirmed=True
            )
        else:
            donations = Donation.objects.filter(is_confirmed=True)

        serializer = DonationForTopSerializer(donations, many=True)
        serializer_return_list = serializer.data

        converted_data = []
        for ordered_dict in serializer_return_list:
            converted_data.append(dict(ordered_dict))

        user_donations = {}
        donation_types = {'plasma', 'blood', 'platelets', 'erythrocytes', 'granulocytes'}
        print(converted_data)
        # Iterate through donations
        for donation in converted_data:
            user_id = donation['user']
            donation_type = donation['donation_type']

            # Initialize user entry if not exists
            if user_id not in user_donations:
                user_donations[user_id] = {
                    'user_id': user_id, 'total_amount': 0, 'plasma_amount': 0,
                    'blood_amount': 0, 'platelets_amount': 0, 'erythrocytes_amount': 0, 'granulocytes_amount': 0
                }

            # Increment total_amount and specific donation type amount

            if donation_type in donation_types:
                user_donations[user_id]['total_amount'] += 1
                user_donations[user_id][donation_type + '_amount'] += 1

        # Convert dictionary values to list of dictionaries
        grouped_data = sorted(list(user_donations.values()), key=lambda x: x['total_amount'], reverse=True)

        return JsonResponse(grouped_data, status=status.HTTP_200_OK, content_type='application/json', safe=False)


