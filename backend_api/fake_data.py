import os
import django
import random
from django.utils import timezone
from faker import Faker
from mimesis import Person
from mimesis.enums import Gender
from mimesis import Internet

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_api.settings')
django.setup()

from backend_api_app.models import User, UserBonus, BonusFeedback, Donation, PlanDonation, Article, SpecialProject, UserEvent

fake = Faker()
person = Person('en')
internet = Internet()

# Create 10 users
for _ in range(50):
    gender = random.choice([Gender.MALE, Gender.FEMALE])
    user = User.objects.create(
        username=fake.user_name(),
        email=fake.email(),
        phone_number=fake.phone_number(),
        is_active=True,
        city_id=random.randint(1, 100),
        image_url=internet.stock_image_url(width=200, height=200, keywords=['portrait']),
        first_name=fake.first_name(),
        last_name=fake.last_name(),
        middle_name=fake.first_name(),
        birth_date=fake.date_of_birth(minimum_age=18, maximum_age=90),
        gender=gender,
        about=fake.text(max_nb_chars=500),
        is_email_verified=fake.boolean(),
        is_phone_verified=fake.boolean(),
        kell_factor=random.choice(['Positive', 'Negative', 'Unknown']),
        blood_group=random.choice(['A', 'B', 'AB', 'O', 'Unknown']),
        rh_factor=random.choice(['Positive', 'Negative', 'Unknown']),
        donor_status_name=random.choice(['Legendary', 'Experienced', 'Novice', 'Unknown']),
        has_donor_certificate=fake.boolean(),
        ready_to_donate_blood=fake.boolean(),
        ready_to_donate_plasma=fake.boolean(),
        ready_to_donate_platelets=fake.boolean(),
        ready_to_donate_erythrocytes=fake.boolean(),
        ready_to_donate_granulocytes=fake.boolean()
    )

    # Create user bonuses
    for _ in range(250):
        UserBonus.objects.create(
            user=user,
            bonus_id=random.randint(1, 100),
            date_received=fake.date_time_this_year(),
            date_expired=fake.date_time_between(start_date='+1d', end_date='+1y')
        )

    # Create bonus feedbacks
    for _ in range(250):
        BonusFeedback.objects.create(
            user=user,
            bonus_id=random.randint(1, 100),
            feedback=fake.text(max_nb_chars=500),
            date=fake.date_time_this_year(),
            mark=random.randint(1, 5)
        )

    # Create donations
    for _ in range(250):
        Donation.objects.create(
            user=user,
            is_confirmed=fake.boolean(),
            donation_date=fake.date_time_this_year(),
            blood_station_id=random.randint(1, 100),
            donation_type=random.choice(['blood', 'plasma', 'platelets', 'erythrocytes', 'granulocytes']),
            is_free=fake.boolean()
        )

    # Create plan donations
    for _ in range(250):
        PlanDonation.objects.create(
            user=user,
            donation_date=fake.date_time_this_year(),
            blood_station_id=random.randint(1, 100),
            donation_type=random.choice(['blood', 'plasma', 'platelets', 'erythrocytes', 'granulocytes']),
            is_free=fake.boolean()
        )

# Create articles
for _ in range(250):
    Article.objects.create(
        title=fake.sentence(),
        text=fake.text(max_nb_chars=1000),
        date=fake.date_time_this_year(),
        author_name=fake.first_name(),
        author_surname=fake.last_name(),
        is_active=True
    )

# Create special projects
for _ in range(250):
    SpecialProject.objects.create(
        title=fake.sentence(),
        text=fake.text(max_nb_chars=1000),
        date_start=fake.date_time_this_year(),
        date_end=fake.date_time_between(start_date='+1d', end_date='+1y'),
        link=fake.url(),
        is_active=True
    )

# Create user events
for _ in range(250):
    UserEvent.objects.create(
        user=User.objects.order_by('?').first(),
        event_id=random.randint(1, 100),
        date=fake.date_time_this_year()
    )
