from datetime import timedelta

from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.utils import timezone
from rest_framework.test import APITestCase

from apps.doctors.models import Doctor
from apps.services.models import Service

from .models import Appointment

User = get_user_model()
URL = "/api/v1/appointments/"


def upcoming(weekday=None, offset=2):
    """A future date. weekday=None gives the next Monday to Friday; 5 = Saturday, 6 = Sunday."""
    day = timezone.localdate() + timedelta(days=offset)
    while True:
        if weekday is None and day.weekday() <= 4:
            return day
        if weekday is not None and day.weekday() == weekday:
            return day
        day += timedelta(days=1)


class BookingTests(APITestCase):
    def setUp(self):
        cache.clear()
        self.service = Service.objects.create(title="Cleaning", short_description="Clean teeth")
        self.doctor = Doctor.objects.create(name="Dr. Test", role="Dentist", qualification="BDS")
        self.other_doctor = Doctor.objects.create(name="Dr. Other", role="Dentist", qualification="BDS")
        self.staff = User.objects.create_user("staffuser", "staff@example.com", "Str0ng!Pass#1", is_staff=True)
        self.patient = User.objects.create_user("patientuser", "patient@example.com", "Str0ng!Pass#1")

    def book(self, **extra):
        data = {
            "patient_name": "Jane Doe", "email": "jane@example.com", "phone": "9876543210",
            "service": self.service.id, "doctor": self.doctor.id,
            "date": upcoming().isoformat(), "time": "10:00 AM", "message": "",
        }
        data.update(extra)
        return self.client.post(URL, data, format="json")

    # ----- booking rules -----
    def test_guest_can_book(self):
        response = self.book()
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["status"], "pending")
        self.assertTrue(response.data["reference"].startswith("APT-"))

    def test_status_cannot_be_chosen_by_the_patient(self):
        response = self.book(status="confirmed")
        self.assertEqual(response.data["status"], "pending")

    def test_same_dentist_same_time_is_rejected(self):
        self.assertEqual(self.book().status_code, 201)
        second = self.book()
        self.assertEqual(second.status_code, 400)
        self.assertIn("time", second.data)

    def test_other_dentist_same_time_is_allowed(self):
        self.assertEqual(self.book().status_code, 201)
        self.assertEqual(self.book(doctor=self.other_doctor.id).status_code, 201)

    def test_cancelled_slot_can_be_booked_again(self):
        first = self.book()
        Appointment.objects.filter(pk=first.data["id"]).update(status="cancelled")
        self.assertEqual(self.book().status_code, 201)

    def test_booking_without_a_dentist_is_allowed(self):
        self.assertEqual(self.book(doctor=None).status_code, 201)

    def test_sunday_is_rejected(self):
        response = self.book(date=upcoming(weekday=6).isoformat())
        self.assertEqual(response.status_code, 400)
        self.assertIn("date", response.data)

    def test_saturday_last_slot_is_4pm(self):
        saturday = upcoming(weekday=5).isoformat()
        self.assertEqual(self.book(date=saturday, time="04:00 PM").status_code, 201)
        late = self.book(date=saturday, time="05:00 PM", doctor=self.other_doctor.id)
        self.assertEqual(late.status_code, 400)
        self.assertIn("time", late.data)

    def test_past_date_is_rejected(self):
        yesterday = (timezone.localdate() - timedelta(days=1)).isoformat()
        response = self.book(date=yesterday)
        self.assertEqual(response.status_code, 400)
        self.assertIn("date", response.data)

    def test_date_too_far_ahead_is_rejected(self):
        response = self.book(date=(timezone.localdate() + timedelta(days=200)).isoformat())
        self.assertEqual(response.status_code, 400)
        self.assertIn("date", response.data)

    def test_invalid_phone_is_rejected(self):
        response = self.book(phone="abc")
        self.assertEqual(response.status_code, 400)
        self.assertIn("phone", response.data)

    def test_inactive_service_is_rejected(self):
        hidden = Service.objects.create(title="Hidden", short_description="x", is_active=False)
        response = self.book(service=hidden.id)
        self.assertEqual(response.status_code, 400)
        self.assertIn("service", response.data)

    # ----- availability -----
    def test_availability_hides_booked_slot(self):
        day = upcoming().isoformat()
        self.book(date=day)
        response = self.client.get(URL + "availability/", {"date": day, "doctor": self.doctor.id})
        self.assertEqual(response.status_code, 200)
        self.assertNotIn("10:00 AM", response.data["available"])
        self.assertIn("11:00 AM", response.data["available"])
        other = self.client.get(URL + "availability/", {"date": day, "doctor": self.other_doctor.id})
        self.assertIn("10:00 AM", other.data["available"])

    def test_availability_needs_a_valid_date(self):
        self.assertEqual(self.client.get(URL + "availability/", {"date": "nonsense"}).status_code, 400)

    # ----- permissions -----
    def test_only_staff_can_list_appointments(self):
        self.assertEqual(self.client.get(URL).status_code, 401)
        self.client.force_authenticate(self.patient)
        self.assertEqual(self.client.get(URL).status_code, 403)
        self.client.force_authenticate(self.staff)
        self.assertEqual(self.client.get(URL).status_code, 200)

    def test_patient_sees_only_own_appointments(self):
        self.client.force_authenticate(self.patient)
        self.assertEqual(self.book().status_code, 201)
        self.assertEqual(len(self.client.get(URL + "my/").data), 1)
        stranger = User.objects.create_user("stranger", "stranger@example.com", "Str0ng!Pass#1")
        self.client.force_authenticate(stranger)
        self.assertEqual(len(self.client.get(URL + "my/").data), 0)

    def test_my_appointments_requires_login(self):
        self.assertEqual(self.client.get(URL + "my/").status_code, 401)

    def test_staff_can_confirm_but_patient_cannot(self):
        booking_id = self.book().data["id"]
        self.client.force_authenticate(self.patient)
        self.assertEqual(self.client.patch(f"{URL}{booking_id}/", {"status": "confirmed"}, format="json").status_code, 403)
        self.client.force_authenticate(self.staff)
        response = self.client.patch(f"{URL}{booking_id}/", {"status": "confirmed"}, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], "confirmed")

    def test_stats_for_staff(self):
        self.book()
        self.client.force_authenticate(self.staff)
        response = self.client.get(URL + "stats/")
        self.assertEqual(response.data["total"], 1)
        self.assertEqual(response.data["pending"], 1)
        self.client.force_authenticate(None)
        self.assertEqual(self.client.get(URL + "stats/").status_code, 401)
