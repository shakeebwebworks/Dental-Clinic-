from django.contrib.auth import get_user_model
from django.core.cache import cache
from rest_framework.test import APITestCase

from .models import Doctor

User = get_user_model()
URL = "/api/v1/doctors/"


class DoctorApiTests(APITestCase):
    def setUp(self):
        cache.clear()
        Doctor.objects.create(name="Dr. Visible", role="Dentist", qualification="BDS")
        Doctor.objects.create(name="Dr. Hidden", role="Dentist", qualification="BDS", is_active=False)
        self.staff = User.objects.create_user("staffuser", "staff@example.com", "Str0ng!Pass#1", is_staff=True)
        self.patient = User.objects.create_user("patientuser", "patient@example.com", "Str0ng!Pass#1")

    def test_public_sees_only_active_doctors(self):
        response = self.client.get(URL)
        self.assertEqual([d["name"] for d in response.data], ["Dr. Visible"])
        self.assertEqual(self.client.get(URL + "dr-hidden/").status_code, 404)
        self.assertEqual(self.client.get(URL + "dr-visible/").status_code, 200)

    def test_only_staff_can_create(self):
        data = {"name": "Dr. New", "role": "Orthodontist", "qualification": "BDS", "experience_years": 3}
        self.assertEqual(self.client.post(URL, data, format="json").status_code, 401)
        self.client.force_authenticate(self.patient)
        self.assertEqual(self.client.post(URL, data, format="json").status_code, 403)
        self.client.force_authenticate(self.staff)
        response = self.client.post(URL, data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["slug"], "dr-new")
        self.assertEqual(response.data["experience"], "3 years")
