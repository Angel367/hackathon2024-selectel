import json
from backend_api_app.models import Country, Region, City, Schedule, PhoneNumber, DonationCenter
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    name = 'import_data'
    def handle(self, *args, **kwargs):
        with open('backend_api_app/management/commands/single_results_unique.json', 'r', encoding='utf-8') as file:
            data = json.load(file)

        for item in data:
            try:
                country_data = item['city']['country']
                country, _ = Country.objects.get_or_create(
                    id=country_data['id'],
                    title=country_data['title']
                )

                region_data = item['city']['region']
                if region_data:
                    region, _ = Region.objects.get_or_create(
                        id=region_data['id'],
                        title=region_data['title']
                    )

                city_data = item['city']
                city, _ = City.objects.get_or_create(
                    id=city_data['id'],
                    title=city_data['title'],
                    slug=city_data['slug'],
                    region=region,
                    country=country,
                    priority=city_data['priority'],
                    lat=city_data['lat'],
                    lng=city_data['lng']
                )

                schedule_data = item['schedule']
                for schedule_item in schedule_data:
                    Schedule.objects.get_or_create(
                        id=schedule_item['id'],
                        dow=schedule_item['dow'],
                        start=schedule_item['start'],
                        end=schedule_item['end']
                    )

                phone_numbers_data = item['phone_numbers']
                for phone_number_item in phone_numbers_data:
                    PhoneNumber.objects.get_or_create(
                        id=phone_number_item['id'],
                        phone=phone_number_item['phone'],
                        comment=phone_number_item['comment']
                    )
                if item['blood_status'] is None:
                    blood_status = "unknown"
                else:
                    blood_status = item['blood_status']
                DonationCenter.objects.get_or_create(
                    id=item['id'],
                    city=city,
                    has_blood_group=item['has_blood_group'],
                    lat=item['lat'],
                    lng=item['lng'],
                    blood_status=blood_status,
                    title=item['title'],
                    parser_url=item['parser_url'],
                    is_get_from_parser=item['is_get_from_parser'],
                    o_plus=item['o_plus'],
                    o_minus=item['o_minus'],
                    a_plus=item['a_plus'],
                    a_minus=item['a_minus'],
                    b_plus=item['b_plus'],
                    b_minus=item['b_minus'],
                    ab_plus=item['ab_plus'],
                    ab_minus=item['ab_minus'],
                    blood=item['blood'],
                    plasma=item['plasma'],
                    platelets=item['platelets'],
                    erythrocytes=item['erythrocytes'],
                    leukocytes=item['leukocytes'],
                    address=item['address'],
                    site=item['site'],
                    phones=item['phones'],
                    email=item['email'],
                    worktime=item['worktime'],
                    without_registration=item['without_registration'],
                    with_typing=item['with_typing'],
                    for_moscow=item['for_moscow'],
                    closed=item['closed'],
                    priority=item['priority']
                )
            except Exception as e:
                print(e)
                continue
