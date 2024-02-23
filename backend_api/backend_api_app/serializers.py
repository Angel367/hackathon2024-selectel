from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import Donation, PlanDonation
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
        email = data.get('email', None)
        phone_number = data.get('phone_number', None)
        username = data.get('username', None)

        # Проверить, что предоставлен ли email или номер телефона.
        if email is None and phone_number is None:
            raise serializers.ValidationError(
                'A phone number or email is required to register.'
            )
        if email is not None:
            # Проверить, что предоставленный email уникален.
            if User.objects.filter(email=email).exists():
                raise serializers.ValidationError(
                    'A user with this email already exists.'
                )
        if phone_number is not None:
            # Проверить, что предоставленный номер телефона уникален.
            if User.objects.filter(phone_number=phone_number).exists():
                raise serializers.ValidationError(
                    'A user with this phone number already exists.'
                )
        if username is not None:
            # Проверить, что предоставленный username уникален.
            if User.objects.filter(username=username).exists():
                raise serializers.ValidationError(
                    'A user with this username already exists.'
                )

        return data

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=10, required=False)
    password = serializers.CharField(max_length=128, write_only=True)
    token = serializers.CharField(max_length=255, read_only=True)
    id = serializers.IntegerField(read_only=True)
    email = serializers.EmailField(max_length=255, required=False)

    def validate(self, data):
        email = data.get('email', None)
        phone_number = data.get('phone_number', None)
        password = data.get('password', None)

        # Вызвать исключение, если не предоставлена почта.
        if phone_number is None and email is None:
            raise serializers.ValidationError(
                'An email or phone number is required to log in.'
            )
        # Вызвать исключение, если не предоставлен пароль.
        if password is None:
            raise serializers.ValidationError(
                'A password is required to log in.'
            )
        if phone_number is not None:
            user = authenticate(username=phone_number, password=password)
        elif email is not None:
            user = authenticate(username=email, password=password)
        else:
            user = None
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



class DonorCardSerializer(serializers.ModelSerializer):
    token = serializers.CharField(max_length=255, read_only=True)
    class Meta:
        model = User
        read_only_fields = ('token',)
        fields = ['ready_to_donate_blood', 'ready_to_donate_granulocytes', 'ready_to_donate_platelets',
                  'ready_to_donate_plasma', 'ready_to_donate_erythrocytes', 'kell_factor', 'blood_group', 'id']

    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance



class AllDataUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        read_only_fields = ('token')
        exclude = ('password',  'is_active', 'is_staff', 'created_at',
                   'updated_at', 'is_email_verified', 'is_phone_verified')



class UserSerializer(serializers.ModelSerializer):
    """ Ощуществляет сериализацию и десериализацию объектов User. """

    # Пароль должен содержать от 8 до 128 символов. Это стандартное правило. Мы
    # могли бы переопределить это по-своему, но это создаст лишнюю работу для
    # нас, не добавляя реальных преимуществ, потому оставим все как есть.
    password = serializers.CharField(
        max_length=128,
        min_length=8,
        write_only=True
    )

    class Meta:
        model = User
        fields = ('email', 'username', 'password',
                  'token', 'id', 'phone_number', 'first_name',
                  'last_name', 'middle_name', 'birth_date',
                  'is_email_verified', 'is_phone_verified',
                  'about')

        read_only_fields = ('token',)

    def update(self, instance, validated_data):

        old_password = validated_data.pop('old_password', None)
        new_password = validated_data.pop('new_password', None)
        for key, value in validated_data.items():
            if key == 'email':
                if User.objects.filter(email=value).exists():
                    raise serializers.ValidationError(
                        'A user with this email already exists.'
                    )
            elif key == 'phone_number':
                if User.objects.filter(phone_number=value).exists():
                    raise serializers.ValidationError(
                        'A user with this phone number already exists.'
                    )

            # Для ключей, оставшихся в validated_data мы устанавливаем значения
            # в текущий экземпляр User по одному.
            setattr(instance, key, value)

        if old_password is None and new_password is not None:
            # 'set_password()' решает все вопросы, связанные с безопасностью
            # при обновлении пароля, потому нам не нужно беспокоиться об этом.
            raise serializers.ValidationError(
                'Old password is required to change password.'
            )
        if not instance.check_password(old_password):
            raise serializers.ValidationError(
                'Old password is incorrect.'
            )
        instance.set_password(new_password)

        # После того, как все было обновлено, мы должны сохранить наш экземпляр
        # User. Стоит отметить, что set_password() не сохраняет модель.
        instance.save()

        return instance


class DonationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donation
        fields = '__all__'  # This will include all fields from the Donation model


class PlanDonationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlanDonation
        fields = '__all__'  # This will include all fields from the PlanDonation model
