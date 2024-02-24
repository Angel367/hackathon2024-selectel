"""
Модуль содержит кастомные бэкенды для аутентификации пользователей.
"""
from datetime import datetime

from django.db.models import Q
from django.http import JsonResponse
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .renderers import UserJSONRenderer
from .serializers import *


class RegistrationAPIView(APIView):
    """
    Разрешить всем пользователям (аутентифицированным и нет) доступ к данному эндпоинту.
    """
    renderer_classes = (UserJSONRenderer,)
    permission_classes = (AllowAny,)
    serializer_class = RegistrationSerializer

    def post(self, request):
        """
        Создать нового пользователя. После этого вернуть его данные.
        :param request:
        :return:
        """
        user = request.data.get('user', {})

        # Паттерн создания сериализатора, валидации и сохранения - довольно
        # стандартный, и его можно часто увидеть в реальных проектах.
        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class LoginAPIView(APIView):
    """
    Разрешить всем пользователям (аутентифицированным и нет) доступ к данному эндпоинту.
    """
    # for login
    permission_classes = (AllowAny,)
    renderer_classes = (UserJSONRenderer,)
    serializer_class = LoginSerializer

    def post(self, request):
        """
        Вход пользователя. Создать и вернуть токен.
        :param request:
        :return:
        """
        user = request.data.get('user', {})
        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserRetrieveUpdateAPIView(RetrieveUpdateAPIView):
    """
    Разрешить только аутентифицированным пользователям доступ к данному эндпоинту.
    """
    # for account settings user (retrieve and update)
    permission_classes = (IsAuthenticated,)
    renderer_classes = (UserJSONRenderer,)
    serializer_class = UserSerializer

    def retrieve(self, request, *args, **kwargs):
        """
        Получить данные пользователя.
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        # Здесь нечего валидировать или сохранять. Мы просто хотим, чтобы
        # сериализатор обрабатывал преобразования объекта User во что-то, что
        # можно привести к json и вернуть клиенту.
        serializer = self.serializer_class(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        """
        Обновить данные пользователя.
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        serializer_data = request.data
        # Паттерн сериализации, валидирования и сохранения - то, о чем говорили
        serializer = self.serializer_class(
            request.user, data=serializer_data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)


class DonorCardAPIView(RetrieveUpdateAPIView):
    """
    Разрешить только аутентифицированным пользователям доступ к данному эндпоинту.
    """
    # for donor card (retrieve and update)
    permission_classes = (IsAuthenticated,)
    renderer_classes = (UserJSONRenderer,)
    serializer_class = DonorCardSerializer

    def retrieve(self, request, *args, **kwargs):
        """
        Получить данные донорской карты.
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        serializer = self.serializer_class(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        """
        Обновить данные донорской карты.
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        serializer_data = request.data

        serializer = self.serializer_class(
            request.user, data=serializer_data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class BonusFeedbackAPIView(viewsets.ViewSet):
    """
    Разрешить только аутентифицированным пользователям доступ к данному эндпоинту.
    """
    # for bonus feedback (retrieve)
    permission_classes = (IsAuthenticated,)
    renderer_classes = (UserJSONRenderer,)

    def list(self, request, bonus_id):
        """
        Получить отзывы о бонусах.
        :param request:
        :param bonus_id:
        :return:
        """
        data = {
            "feedback": BonusFeedbackSerializer(BonusFeedback.objects.filter(bonus_id=bonus_id), many=True).data
        }
        return Response(data, status=status.HTTP_200_OK)

    def create(self, request, bonus_id):
        """
        Создать отзыв о бонусе.
        :param request:
        :param bonus_id:
        :return:
        """
        user = request.user
        data = request.data.copy()
        data['user'] = user.id
        data['bonus_id'] = bonus_id
        serializer = BonusFeedbackSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):  # Modify retrieve method to accept pk
        """
        Получить отзыв о бонусе.
        :param request:
        :param pk:
        :return:
        """
        try:
            feedback = BonusFeedback.objects.get(pk=pk)
        except BonusFeedback.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = BonusFeedbackSerializer(feedback)
        return Response(serializer.data)

    def update(self, request, bonus_id):  # Add update method to handle PUT requests
        """
        Обновить отзыв о бонусе.
        :param request:
        :param bonus_id:
        :return:
        """
        pk = request.data.get('id')
        user = request.user
        data = request.data.copy()
        data['user'] = user.id
        data['bonus_id'] = bonus_id
        try:
            feedback = BonusFeedback.objects.get(pk=pk)
        except BonusFeedback.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = BonusFeedbackSerializer(feedback, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['delete'])
    def delete(self, request, bonus_id, pk=None):  # Modify delete method to accept pk
        """

        :param request:
        :param bonus_id:
        :param pk:
        :return:
        """
        pk = request.data.get('id')
        try:
            feedback = BonusFeedback.objects.get(pk=pk)
        except BonusFeedback.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND, data={"Сущность не найдена"})
        feedback.delete()
        return Response(status=status.HTTP_204_NO_CONTENT, data={"Успешно удалено"})



class MyBonusAPIView(APIView):
    """
    Разрешить только аутентифицированным пользователям доступ к данному эндпоинту.
    """
    # for bonus my (retrieve)
    permission_classes = (IsAuthenticated,)
    renderer_classes = (UserJSONRenderer,)

    def get(self, request):
        """
        Получить бонусы пользователя.
        :param request:
        :return:
        """
        user = request.user
        data = {
            "bonus": UserBonusSerializer(UserBonus.objects.filter(user=user), many=True).data
        }
        return Response(data, status=status.HTTP_200_OK)


class MainUserAPIView(APIView):
    """
    Разрешить только аутентифицированным пользователям доступ к данному эндпоинту.
    """
    # for all data (retrieve)
    permission_classes = (IsAuthenticated,)
    renderer_classes = (UserJSONRenderer,)

    def put(self, request):
        """
        Получить все данные пользователя.
        :param request:
        :return:
        """
        user = request.user

        data = UserSerializer(user).data
        donor_card = DonorCardSerializer(user).data
        plan_donation_last = (PlanDonation.objects.filter(user=user, donation_date__gte=datetime.now())
                              .order_by('donation_date').last())
        donor_card.pop('token')
        data.update({
            "donor_card": donor_card,
            "donations": MyDonationSerializer(Donation.objects.filter(user=user), many=True).data,
            "plan_donation_last": plan_donation_last,
            "count_donations_all": Donation.objects.filter(user=user).count(),
            "count_donations_plasma": Donation.objects.filter(user=user, donation_type='plasma').count(),
            "count_donations_blood": Donation.objects.filter(user=user, donation_type='blood').count(),
            "count_donations_platelets": Donation.objects.filter(user=user, donation_type='platelets').count(),
            "count_donations_eritrocytes": Donation.objects.filter(user=user, donation_type='eritrocytes').count(),
            "count_donations_granulocytes": Donation.objects.filter(user=user, donation_type='granulocytes').count(),
            "count_donations_is_free": Donation.objects.filter(user=user, is_free=True).count()
        })
        return Response(data, status=status.HTTP_200_OK)


class UserDonationViewSet(viewsets.ViewSet):
    """
    Разрешить только аутентифицированным пользователям доступ к данному эндпоинту.
    """
    # for donations (list, create, retrieve, update, delete)
    permission_classes = (IsAuthenticated,)  # Требуется авторизация через токен

    def list(self, request):
        """
        Получить все донорские записи пользователя.
        :param request:
        :return:
        """
        donations = Donation.objects.filter(user=request.user)
        serializer = MyDonationSerializer(donations, many=True)
        return Response(serializer.data)

    def create(self, request):
        """
        Создать новую донорскую запись.
        :param request:
        :return:
        """
        user = request.user
        data = request.data.copy()
        data['user'] = user.id
        serializer = MyDonationSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):  # Modify retrieve method to accept pk
        """
        Получить донорскую запись пользователя.
        :param request:
        :param pk:
        :return:
        """
        try:
            donation = Donation.objects.get(pk=pk)
        except Donation.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = MyDonationSerializer(donation)
        return Response(serializer.data)

    def update(self, request, pk=None):  # Add update method to handle PUT requests
        """
        Обновить донорскую запись пользователя.
        :param request:
        :param pk:
        :return:
        """
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
        """
        Удалить донорскую запись пользователя.
        :param request:
        :param pk:
        :return:
        """
        pk = request.data.get('id')
        try:
            donation = Donation.objects.get(pk=pk)
        except Donation.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND, data={"Сущность не найдена"})

        donation.delete()
        return Response(status=status.HTTP_204_NO_CONTENT, data={"Успешно удалено"})


class UserPlanDonationViewSet(viewsets.ViewSet):
    """
    Разрешить только аутентифицированным пользователям доступ к данному эндпоинту.
    """
    permission_classes = (IsAuthenticated,)  # Требуется авторизация через токен

    def list(self, request):
        """
        Получить плановую донорскую запись пользователя.
        :param request:
        :return:
        """
        donations = PlanDonation.objects.get(user_id=request.user.id)
        serializer = UserPlanDonationSerializer(donations, many=False)
        return Response(serializer.data)

    def create(self, request):
        """
        Создать новую плановую донорскую запись.
        :param request:
        :return:
        """
        PlanDonation.objects.filter(user=request.user).delete()
        user = request.user
        data = request.data.copy()
        data['user'] = user.id
        serializer = UserPlanDonationSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):  # Modify retrieve method to accept pk
        """
        Получить плановую донорскую запись пользователя.
        :param request:
        :param pk:
        :return:
        """
        try:
            donation = PlanDonation.objects.get(pk=pk)
        except PlanDonation.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = UserPlanDonationSerializer(donation)
        return Response(serializer.data)

    def update(self, request, pk=None):  # Add update method to handle PUT requests
        """
        Обновить плановую донорскую запись пользователя.
        :param request:
        :param pk:
        :return:
        """
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
    """
    Разрешить всем пользователям (аутентифицированным и нет) доступ к данному эндпоинту.
    """
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
                user = User.objects.get(id=user_id)
                value_to_display = ''
                if user.blood_group == 'A':
                    value_to_display += 'A (II)'
                elif user.blood_group == 'B':
                    value_to_display += 'B (III)'
                elif user.blood_group == 'AB':
                    value_to_display += 'AB (IV)'
                elif user.blood_group == 'O':
                    value_to_display += 'O (I)'

                if user.rh_factor == 'Positive':
                    value_to_display += ' Rh+'
                elif user.rh_factor == 'Negative':
                    value_to_display += ' Rh-'

                user_donations[user_id] = {
                    'user_id': user_id,
                    'name_to_display': user.first_name + ' ' + user.last_name,
                    'value_to_display': value_to_display,
                    'donor_status_name': user.donor_status_name,
                    'total_amount': 0, 'plasma_amount': 0,
                    'blood_amount': 0, 'platelets_amount': 0, 'erythrocytes_amount': 0, 'granulocytes_amount': 0
                }

            # Increment total_amount and specific donation type amount

            if donation_type in donation_types:
                user_donations[user_id]['total_amount'] += 1
                user_donations[user_id][donation_type + '_amount'] += 1

        # Convert dictionary values to list of dictionaries
        grouped_data = sorted(list(user_donations.values()), key=lambda x: x['total_amount'], reverse=True)

        return JsonResponse(grouped_data, status=status.HTTP_200_OK, content_type='application/json', safe=False)


class ArticleViewSet(viewsets.ViewSet):
    """
    Разрешить всем пользователям (аутентифицированным и нет) доступ к данному эндпоинту.
    """
    permission_classes = (AllowAny,)  # Требуется авторизация через токен

    def list(self, request):
        """
        Получить все статьи.
        :param request:
        :return:
        """
        keywords = request.query_params.get('keywords', None)
        if keywords is not None:
            articles = (Article.objects.filter(is_active=True)
                        .filter(Q(text__icontains=keywords) | Q(title__icontains=keywords)))
        else:
            articles = Article.objects.filter(is_active=True)
        serializer = ArticleSerializer(articles, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):  # Modify retrieve method to accept pk
        """
        Получить статью.
        :param request:
        :param pk:
        :return:
        """
        try:
            article = Article.objects.get(pk=pk)
        except Article.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = ArticleSerializer(article)
        return Response(serializer.data)


class SpecialProjectViewSet(viewsets.ViewSet):
    """
    Разрешить всем пользователям (аутентифицированным и нет) доступ к данному эндпоинту.
    """
    permission_classes = (AllowAny,)  # Требуется авторизация через токен

    def list(self, request):
        """
        Получить все специальные проекты.
        :param request:
        :return:
        """
        special_projects = SpecialProject.objects.filter(is_active=True)
        serializer = SpecialProjectSerializer(special_projects, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):  # Modify retrieve method to accept pk
        """
        Получить специальный проект.
        :param request:
        :param pk:
        :return:
        """
        try:
            special_project = SpecialProject.objects.get(pk=pk)
        except SpecialProject.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = ArticleSerializer(special_project)
        return Response(serializer.data)


class CityViewSet(viewsets.ViewSet):
    """
    Разрешить всем пользователям (аутентифицированным и нет) доступ к данному эндпоинту.
    """
    permission_classes = (AllowAny,)  # Требуется авторизация через токен

    def list(self, request):
        """
        Получить все города.
        :param request:
        :return:
        """
        cities = City.objects.all()
        serializer = CitySerializer(cities, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):  # Modify retrieve method to accept pk
        """
        Получить город.
        :param request:
        :param pk:
        :return:
        """
        try:
            city = City.objects.get(pk=pk)
        except City.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = CitySerializer(city)
        return Response(serializer.data)


class BloodStationSearchViewSet(viewsets.ViewSet):
    """
    Разрешить всем пользователям (аутентифицированным и нет) доступ к данному эндпоинту.
    """
    permission_classes = (AllowAny,)  # Требуется авторизация через токен

    def list(self, request):
        """
        Найти ближайшие к введенному тексту центр крови.
        :param request:
        :return:
        """
        search_text = request.query_params.get('search_text', None)
        bss = BloodStation.objects.all()

        bs_titles = []
        for bs in bss:
            bs_titles.append(bs.title)
        nearest_to_search_text_bss = []
        for title in bs_titles:
            if search_text.lower() in title.lower():
                nearest_to_search_text_bss.append(BloodStation.objects.filter(title=title)[0])
        blood_station_serializer = BloodStationSerializer(nearest_to_search_text_bss, many=True)
        return Response(blood_station_serializer.data)

