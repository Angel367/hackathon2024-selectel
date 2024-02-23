import re

from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import Donation, PlanDonation, UserBonus, Article, SpecialProject
from .models import User


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
        model = User
        # Перечислить все поля, которые могут быть включены в запрос
        # или ответ, включая поля, явно указанные выше.
        fields = ['email', 'username', 'phone_number', 'password', 'token', 'id']

    def validate(self, data):
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
        return User.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=255, required=False)
    password = serializers.CharField(max_length=128, write_only=True)
    phone_number = serializers.CharField(max_length=10, required=False)
    token = serializers.CharField(max_length=255, read_only=True)
    id = serializers.IntegerField(read_only=True)
    email = serializers.EmailField(max_length=255, required=False)

    def validate(self, data):
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
    class Meta:
        model = UserBonus
        fields = ['bonus_id', 'date_expired', 'date_received']


class DonorCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        read_only_fields = ['token']
        fields = ['token', 'ready_to_donate_blood', 'ready_to_donate_granulocytes', 'ready_to_donate_platelets',
                  'ready_to_donate_plasma', 'ready_to_donate_erythrocytes', 'kell_factor', 'blood_group', 'id']

    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            # print(key, value)
            setattr(instance, key, value)
        instance.save()
        return instance


class UserSerializer(serializers.ModelSerializer):
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
        model = User
        fields = ['email', 'username', 'password',
                  'token', 'id', 'phone_number', 'first_name',
                  'last_name', 'middle_name', 'birth_date',
                  'is_email_verified', 'is_phone_verified',
                  'about', 'old_password', 'new_password']
        read_only_fields = ['token']

    def update(self, instance, validated_data):
        old_password = validated_data.pop('old_password', None)
        new_password = validated_data.pop('new_password', None)
        for key, value in validated_data.items():
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
        else:
            instance.set_password(new_password)
        instance.save()
        return instance


class MyDonationSerializer(serializers.ModelSerializer):
    def update(self, instance, validated_data):
        validated_data.pop('is_confirmed', None)
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance

    class Meta:
        model = Donation
        fields = '__all__'  # This will include all fields from the Donation model


class UserPlanDonationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlanDonation
        fields = '__all__'  # This will include all fields from the PlanDonation model


class DonationForTopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donation
        fields = '__all__'  # This will include all fields from the Donation model


class BonusFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserBonus
        fields = '__all__'  # This will include all fields from the UserBonus model


class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = '__all__'


class SpecialProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpecialProject
        fields = '__all__'

