import time

import jwt

from datetime import datetime, timedelta

from django.conf import settings
from django.contrib.auth.models import (
    AbstractBaseUser, BaseUserManager, PermissionsMixin
)

from django.db import models


class UserManager(BaseUserManager):
    """
    Django требует, чтобы кастомные пользователи определяли свой собственный
    класс Manager. Унаследовавшись от BaseUserManager, мы получаем много того
    же самого кода, который Django использовал для создания User (для демонстрации).
    """

    def create_user(self, phone_number=None, email=None, password=None):
        """ Создает и возвращает пользователя с имэйлом, паролем и именем. """
        if email is not None:
            if User.objects.filter(email=email).exists():
                raise ValueError('User with this email already exists')
            username = email
            user = self.model(username=username, email=email, phone_number=None)
        elif phone_number is not None:
            if User.objects.filter(phone_number=phone_number).exists():
                raise ValueError('User with this phone number already exists')
            username = phone_number
            user = self.model(username=username, email=None, phone_number=phone_number)
        else:
            raise TypeError('Users must have an email address or phone number.')

        user.set_password(password)
        user.save()

        return user

    def create_superuser(self, username, email, password):
        """ Создает и возввращет пользователя с привилегиями суперадмина. """
        if password is None:
            raise TypeError('Superusers must have a password.')

        user = self.create_user(username, email, password)
        user.is_superuser = True
        user.is_staff = True
        user.save()

        return user


class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(db_index=True, max_length=255, unique=True)
    email = models.EmailField(db_index=True, null=True, unique=True)
    phone_number = models.CharField(db_index=True,  max_length=10, null=True,unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    # Дополнительный поля, необходимые Django
    # при указании кастомной модели пользователя.

    # Свойство USERNAME_FIELD сообщает нам, какое поле мы будем использовать
    # для входа в систему. В данном случае мы хотим использовать почту.
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['']

    # Сообщает Django, что определенный выше класс UserManager
    # должен управлять объектами этого типа.
    objects = UserManager()



    def __str__(self):
        """ Строковое представление модели (отображается в консоли) """
        return self.username

    @property
    def token(self):
        """
        Позволяет получить токен пользователя путем вызова user.token, вместо
        user._generate_jwt_token(). Декоратор @property выше делает это
        возможным. token называется "динамическим свойством".
        """
        return self._generate_jwt_token()

    def get_full_name(self):
        """
        Этот метод требуется Django для таких вещей, как обработка электронной
        почты. Обычно это имя фамилия пользователя, но поскольку мы не
        используем их, будем возвращать username.
        """
        return self.username

    def get_short_name(self):
        """ Аналогично методу get_full_name(). """
        return self.username

    def _generate_jwt_token(self):
        """
        Генерирует веб-токен JSON, в котором хранится идентификатор этого
        пользователя, срок действия токена составляет 1 день от создания
        """
        dt = datetime.now() + timedelta(days=1)

        token = jwt.encode({
            'id': self.pk,
            'exp': int(dt.timestamp())
        }, settings.SECRET_KEY, algorithm='HS256')
        print(token, jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256']))
        return token


class Donation(models.Model):
    DONATION_TYPES_CHOICES = (
        ('blood', 'Цельная кровь'),
        ('plasma', 'Плазма'),
        ('Platelets', 'Тромбоциты'),
        ('Erythrocytes', 'Эритроциты'),
        ('Granulocytes', 'Гранулоциты')
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    is_confirmed = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)
    blood_station_id = models.IntegerField()
    donation_type = models.CharField(max_length=20, choices=DONATION_TYPES_CHOICES),
    is_free = models.BooleanField(default=True)


class PlanDonation(models.Model):
    DONATION_TYPES_CHOICES = (
        ('blood', 'Цельная кровь'),
        ('plasma', 'Плазма'),
        ('Platelets', 'Тромбоциты'),
        ('Erythrocytes', 'Эритроциты'),
        ('Granulocytes', 'Гранулоциты')
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateTimeField()
    blood_station_id = models.IntegerField()
    donation_type = models.CharField(max_length=20, choices=DONATION_TYPES_CHOICES),
    is_free = models.BooleanField(default=True)
