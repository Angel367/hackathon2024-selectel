"""
Сериализаторы для моделей User, Donation, PlanDonation, UserBonus, Article, SpecialProject, BonusFeedback
"""
import re

from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import *


class RegistrationSerializer(serializers.ModelSerializer):
    """ Сериализация регистрации пользователя и создания нового. """
    phone_number = serializers.CharField(max_length=10, required=False)
    email = serializers.EmailField(max_length=255, required=False)
    username = serializers.CharField(max_length=255, required=False)
    password = serializers.CharField(
        max_length=128,
        min_length=8,
        write_only=True
    )
    token = serializers.CharField(max_length=255, read_only=True)

    class Meta:
        """
        Мета-класс для сериализатора RegistrationSerializer.
        """
        model = User
        # Перечислить все поля, которые могут быть включены в запрос
        # или ответ, включая поля, явно указанные выше.
        fields = ['email', 'username', 'phone_number', 'password', 'token', 'id']

    def validate(self, data):
        """
        Проверка данных, предоставленных пользователем.
        :param data:
        :return:
        """
        username = data.get('username', None)
        phone_pattern = r'^(?:\+7|8)\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2}$'
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

        if username is None:
            raise serializers.ValidationError(
                'A username is required to register.'
            )

        if re.match(phone_pattern, username):
            if User.objects.filter(phone_number=username).exists():
                raise serializers.ValidationError(
                    'A user with this phone number already exists.'
                )
        elif re.match(email_pattern, username):
            if User.objects.filter(email=username).exists():
                raise serializers.ValidationError(
                    'A user with this email already exists.'
                )
        else:
            raise serializers.ValidationError(
                'Поле username не является валидным номером телефона или email'
            )

        return data

    def create(self, validated_data):
        """
        Создание нового пользователя.
        :param validated_data:
        :return:
        """
        return User.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    """
    Сериализация входа пользователя в систему.
    """
    username = serializers.CharField(max_length=255, required=False)
    password = serializers.CharField(max_length=128, write_only=True)
    phone_number = serializers.CharField(max_length=10, required=False)
    token = serializers.CharField(max_length=255, read_only=True)
    id = serializers.IntegerField(read_only=True)
    email = serializers.EmailField(max_length=255, required=False)

    def validate(self, data):
        """
        Проверка данных, предоставленных пользователем.
        :param data:
        :return:
        """
        username = data.get('username', None)
        phone_pattern = r'^(?:\+7|8)\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2}$'
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        password = data.get('password', None)

        # Вызвать исключение, если не предоставлен пароль.
        if password is None:
            raise serializers.ValidationError(
                'A password is required to log in.'
            )

        if username is None:
            raise serializers.ValidationError(
                'A username is required to login.'
            )

        user = authenticate(username=username, password=password)

        if user is None:
            raise serializers.ValidationError(
                'A user with this email and password was not found.'
            )

        # Django предоставляет флаг is_active для модели User. Его цель
        # сообщить, был ли пользователь деактивирован или заблокирован.
        # Проверить стоит, вызвать исключение в случае True.
        if not user.is_active:
            raise serializers.ValidationError(
                'This user has been deactivated.'
            )

        # Метод validate должен возвращать словать проверенных данных. Это
        # данные, которые передются в т.ч. в методы create и update.
        return {
            'email': user.email,
            'phone_number': user.phone_number,
            'username': user.username,
            'token': user.token,
            'id': user.id
        }


class UserBonusSerializer(serializers.ModelSerializer):
    """
    Сериализация бонусов пользователя.
    """
    class Meta:
        """
        Мета-класс для сериализатора UserBonusSerializer.
        """
        model = UserBonus
        fields = ['bonus_id', 'date_expired', 'date_received']


class DonorCardSerializer(serializers.ModelSerializer):
    """
    Сериализация карточки донора.
    """
    class Meta:
        """
        Мета-класс для сериализатора DonorCardSerializer.
        """
        model = User
        read_only_fields = ['token']
        fields = ['token', 'ready_to_donate_blood',
                  'ready_to_donate_granulocytes',
                  'ready_to_donate_platelets',
                  'ready_to_donate_plasma',
                  'ready_to_donate_erythrocytes',
                  'kell_factor', 'rh_factor',
                  'blood_group', 'id']

    def update(self, instance, validated_data):
        """
        Обновление данных карточки донора.
        :param instance:
        :param validated_data:
        :return:
        """
        for key, value in validated_data.items():
            if value == '' or value is None:
                continue
            # print(key, value)
            setattr(instance, key, value)
        instance.save()
        return instance


class UserSerializer(serializers.ModelSerializer):
    """
    Сериализация пользователя.
    """
    password = serializers.CharField(
        max_length=128,
        min_length=8,
        write_only=True
    )
    old_password = serializers.CharField(
        max_length=128,
        min_length=8,
        write_only=True,
        required=False
    )
    new_password = serializers.CharField(
        max_length=128,
        min_length=8,
        write_only=True,
        required=False
    )

    class Meta:
        """
        Мета-класс для сериализатора UserSerializer.
        """
        model = User
        fields = ['email', 'username', 'password',
                  'token', 'id', 'phone_number', 'first_name',
                  'last_name', 'middle_name', 'birth_date', 'gender', 'about',
                  'is_email_verified', 'is_phone_verified', 'kell_factor', 'blood_group', 'rh_factor',
                  'donor_status_name', 'has_donor_certificate', 'ready_to_donate_blood', 'ready_to_donate_plasma',
                  'ready_to_donate_platelets', 'ready_to_donate_erythrocytes', 'ready_to_donate_granulocytes',
                  'old_password', 'new_password']
        read_only_fields = ['token']

    def update(self, instance, validated_data):
        """
        Обновление данных пользователя.
        :param instance:
        :param validated_data:
        :return:
        """
        old_password = validated_data.pop('old_password', None)
        new_password = validated_data.pop('new_password', None)
        for key, value in validated_data.items():
            if value == '' or value is None:
                continue
            if key == 'email':
                if User.objects.filter(email=value).exists():
                    if User.objects.filter(email=value).first().id != instance.id:
                        raise serializers.ValidationError(
                            'A user with this email already exists.'
                        )
            elif key == 'phone_number':
                if User.objects.filter(phone_number=value).exists():
                    if User.objects.filter(phone_number=value).first().id != instance.id:
                        raise serializers.ValidationError(
                            'A user with this phone number already exists.'
                        )
            setattr(instance, key, value)
        if old_password is None and new_password is not None:
            # 'set_password()' решает все вопросы, связанные с безопасностью
            # при обновлении пароля, потому нам не нужно беспокоиться об этом.
            raise serializers.ValidationError(
                'Old password is required to change password.'
            )
        if new_password:
            if not instance.check_password(old_password):
                raise serializers.ValidationError(
                    'Old password is incorrect.'
                )
        if old_password is not None and new_password is not None:
            instance.set_password(new_password)
        instance.save()
        return instance


class DonationForTopSerializer(serializers.ModelSerializer):
    """
    Сериализация пожертвований для топа.
    """
    class Meta:
        """
        Мета-класс для сериализатора DonationForTopSerializer.
        """
        model = Donation
        fields = '__all__'  # This will include all fields from the Donation model
        depth = 4


class BonusFeedbackSerializer(serializers.ModelSerializer):
    """
    Сериализация отзывов о бонусах.
    """
    class Meta:
        """
        Мета-класс для сериализатора BonusFeedbackSerializer.
        """
        model = BonusFeedback
        fields = '__all__'  # This will include all fields from the UserBonus model


class ArticleSerializer(serializers.ModelSerializer):
    """
    Сериализация статей.
    """
    class Meta:
        """
        Мета-класс для сериализатора ArticleSerializer.
        """
        model = Article
        fields = '__all__'


class SpecialProjectSerializer(serializers.ModelSerializer):
    """
    Сериализация специальных проектов.
    """
    class Meta:
        """
        Мета-класс для сериализатора SpecialProjectSerializer.
        """
        model = SpecialProject
        fields = '__all__'


class CitySerializer(serializers.ModelSerializer):
    """
    Сериализация городов.
    """
    class Meta:
        """
        Мета-класс для сериализатора CitySerializer.
        """
        model = City
        fields = '__all__'

class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = ('id', 'dow', 'start', 'end')


class PhoneNumberSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhoneNumber
        fields = ('id', 'phone', 'comment')

class BloodStationSerializer(serializers.ModelSerializer):
    schedules = serializers.SerializerMethodField()
    phone_numbers = serializers.SerializerMethodField()

    class Meta:
        model = BloodStation
        fields = ('id', 'city', 'has_blood_group', 'lat', 'lng', 'blood_status',
                  'title', 'parser_url', 'is_get_from_parser', 'o_plus', 'o_minus',
                  'a_plus', 'a_minus', 'b_plus', 'b_minus', 'ab_plus', 'ab_minus',
                  'blood', 'plasma', 'platelets', 'erythrocytes', 'leukocytes',
                  'address', 'site', 'phones', 'email', 'worktime',
                  'without_registration', 'with_typing', 'for_moscow', 'closed',
                  'priority', 'schedules', 'phone_numbers')

    def get_schedules(self, obj):
        schedules = obj.schedule_set.all()  # Assuming "schedule_set" is the related name
        serializer = ScheduleSerializer(schedules, many=True)
        return serializer.data

    def get_phone_numbers(self, obj):
        phone_numbers = obj.phonenumber_set.all()  # Assuming "phonenumber_set" is the related name
        serializer = PhoneNumberSerializer(phone_numbers, many=True)
        return serializer.data


class MyDonationSerializer(serializers.ModelSerializer):
    """
    Сериализация пожертвований пользователя.
    """
    def update(self, instance, validated_data):
        """
        Обновление данных пожертвования.
        :param instance:
        :param validated_data:
        :return:
        """
        validated_data.pop('is_confirmed', None)
        for key, value in validated_data.items():
            if value == '' or value is None:
                continue
            setattr(instance, key, value)
        instance.save()
        return instance

    def to_representation(self, instance):
        request = self.context.get('request')
        representation = super().to_representation(instance)
        if request and request.method == 'POST':
            blood_station_id = representation.get('blood_station')
            blood_station = BloodStation.objects.get(id=blood_station_id)
            representation['blood_station'] = BloodStationSerializer(blood_station).data
        else:
            representation['blood_station'] = BloodStationSerializer(instance.blood_station).data
        return representation

    class Meta:
        model = Donation
        fields = ['token', 'donation_date', 'blood_station', 'donation_type']

    class Meta:
        """
        Мета-класс для сериализатора MyDonationSerializer.
        """
        model = Donation
        fields = '__all__'  # This will include all fields from the Donation model


class UserPlanDonationSerializer(serializers.ModelSerializer):
    """
    Сериализация планов пожертвований пользователя.
    """
    class Meta:
        """
        Мета-класс для сериализатора UserPlanDonationSerializer.
        """
        model = PlanDonation
        fields = '__all__'  # This will include all fields from the PlanDonation model
