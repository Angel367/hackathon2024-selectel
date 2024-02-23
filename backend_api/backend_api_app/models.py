import re
import time
import jwt

from datetime import datetime, timedelta

from django.conf import settings
from django.contrib.auth.models import (
    AbstractBaseUser, BaseUserManager, PermissionsMixin
)

from django.db import models
GENDER_CHOICES = (
    ('male', 'Мужской'),
    ('female', 'Женский'),
    ('unknown', 'Неизвестно')
)
BLOOD_GROUP_CHOICES = (
    ('A', 'A'),
    ('B', 'B'),
    ('AB', 'AB'),
    ('O', 'O'),
    ('Unknown', 'Неизвестно')
)
RH_FACTOR_CHOICES = (
    ('Positive', 'Положительный'),
    ('Negative', 'Отрицательный'),
    ('Unknown', 'Неизвестно')
)
KELL_FACTOR_CHOICES = (
    ('Positive', 'Положительный'),
    ('Negative', 'Отрицательный'),
    ('Unknown', 'Неизвестно')
)

DONATION_TYPES_CHOICES = (
    ('blood', 'Цельная кровь'),
    ('plasma', 'Плазма'),
    ('platelets', 'Тромбоциты'),
    ('erythrocytes', 'Эритроциты'),
    ('granulocytes', 'Гранулоциты')
)
DONOR_STATUS_CHOICES = (
    ('Legendary', 'Легендарный'),
    ('Experienced', 'Опытный'),
    ('Novice', 'Новичок'),
    ('Unknown', 'Неизвестно')
)


class UserManager(BaseUserManager):
    """
    Django требует, чтобы кастомные пользователи определяли свой собственный
    класс Manager. Унаследовавшись от BaseUserManager, мы получаем много того
    же самого кода, который Django использовал для создания User (для демонстрации).
    """

    def create_user(self, username=None, password=None):
        """ Создает и возвращает пользователя с имэйлом, паролем и именем. """
        if username is not None:
            phone_pattern = r'^(?:\+7|8)\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2}$'
            email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
            if re.match(phone_pattern, username):
                user = self.model(
                    phone_number=username,
                    username=username
                )
            elif re.match(email_pattern, username):
                user = self.model(
                    email=username,
                    username=username
                )
            else:
                raise ValueError('Поле username не является валидным номером телефона или email')

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
    phone_number = models.CharField(db_index=True, max_length=11, null=True, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    city_id = models.IntegerField(null=True)
    # image = models.ImageField(upload_to='users/', null=True)
    updated_at = models.DateTimeField(auto_now=True)

    first_name = models.CharField(max_length=25, null=True)
    last_name = models.CharField(max_length=25, null=True)
    middle_name = models.CharField(max_length=25, null=True)
    birth_date = models.DateField(null=True)
    gender = models.CharField(choices=GENDER_CHOICES, max_length=10, null=True)
    about = models.TextField(null=True, blank=True, max_length=500)

    is_email_verified = models.BooleanField(default=False)
    is_phone_verified = models.BooleanField(default=False)
    kell_factor = models.CharField(choices=KELL_FACTOR_CHOICES, max_length=20)
    blood_group = models.CharField(choices=BLOOD_GROUP_CHOICES, max_length=20)
    rh_factor = models.CharField(choices=RH_FACTOR_CHOICES, max_length=20)
    donor_status_name = models.CharField(max_length=20, null=True, choices=DONOR_STATUS_CHOICES)
    has_donor_certificate = models.BooleanField(default=False)

    ready_to_donate_blood = models.BooleanField(default=False)
    ready_to_donate_plasma = models.BooleanField(default=False)
    ready_to_donate_platelets = models.BooleanField(default=False)
    ready_to_donate_erythrocytes = models.BooleanField(default=False)
    ready_to_donate_granulocytes = models.BooleanField(default=False)

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


class UserBonus(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    bonus_id = models.IntegerField()
    date_received = models.DateTimeField(auto_now_add=True)
    date_expired = models.DateTimeField()


class BonusFeedback(models.Model):
    user_bonus = models.ForeignKey(UserBonus, on_delete=models.CASCADE)
    feedback = models.TextField(max_length=500)
    date = models.DateTimeField(auto_now_add=True)
    mark = models.IntegerField()


# Events get from api their

class Donation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    is_confirmed = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)
    blood_station_id = models.IntegerField()
    donation_type = models.CharField(max_length=20, choices=DONATION_TYPES_CHOICES, null=False, blank=False)
    is_free = models.BooleanField(default=True)


class PlanDonation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateTimeField()
    blood_station_id = models.IntegerField()
    donation_type = models.CharField(max_length=20, choices=DONATION_TYPES_CHOICES),
    is_free = models.BooleanField(default=True)


class Article(models.Model):
    title = models.CharField(max_length=255)
    text = models.TextField(max_length=1000)
    date = models.DateTimeField(auto_now_add=True)
    # image = models.ImageField(upload_to='articles/', null=True)
    author_name = models.CharField(max_length=25)
    author_surname = models.CharField(max_length=25)
    is_active = models.BooleanField(default=True)


class SpecialProject(models.Model):
    title = models.CharField(max_length=255)
    text = models.TextField(max_length=1000)
    date_start = models.DateTimeField(auto_now_add=True)
    date_end = models.DateTimeField(null=True)
    link = models.CharField(max_length=255, null=True)
    # image = models.ImageField(upload_to='special_projects/', null=True)
    is_active = models.BooleanField(default=True)


class UserEvent(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event_id = models.IntegerField()
    date = models.DateTimeField(auto_now_add=True)



