from django.contrib.auth import get_user_model
from django.core.cache import cache
from rest_framework.test import APITestCase

from .models import Service

User = get_user_model()
URL = "/api/v1/services/"


class ServiceApiTests(APITestCase):
    def setUp(self):
        cache.clear()
        Service.objects.create(title="Visible Service", short_description="Shown")
        Service.objects.create(title="Hidden Service", short_description="Not shown", is_active=False)
        self.staff = User.objects.create_user("staffuser", "staff@example.com", "Str0ng!Pass#1", is_staff=True)
        self.patient = User.objects.create_user("patientuser", "patient@example.com", "Str0ng!Pass#1")

    def test_public_sees_only_active_services(self):
        response = self.client.get(URL)
        self.assertEqual(response.status_code, 200)
        self.assertEqual([s["title"] for s in response.data], ["Visible Service"])

    def test_staff_sees_all_services(self):
        self.client.force_authenticate(self.staff)
        self.assertEqual(len(self.client.get(URL).data), 2)

    def test_only_staff_can_create(self):
        data = {"title": "New Service", "short_description": "Brand new"}
        self.assertEqual(self.client.post(URL, data, format="json").status_code, 401)
        self.client.force_authenticate(self.patient)
        self.assertEqual(self.client.post(URL, data, format="json").status_code, 403)
        self.client.force_authenticate(self.staff)
        response = self.client.post(URL, data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["slug"], "new-service")
