from django.contrib.auth import get_user_model
from django.core.cache import cache
from rest_framework.test import APITestCase

from .models import Enquiry

User = get_user_model()


class ContactApiTests(APITestCase):
    def setUp(self):
        cache.clear()
        self.staff = User.objects.create_user("staffuser", "staff@example.com", "Str0ng!Pass#1", is_staff=True)

    def data(self, **extra):
        payload = {
            "name": "Ravi Kumar", "email": "ravi@example.com", "phone": "9876543210",
            "subject": "Braces cost", "message": "How much do braces cost for an adult?", "kind": "general",
        }
        payload.update(extra)
        return payload

    def test_guest_can_send_message(self):
        response = self.client.post("/api/v1/contact/", self.data(), format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Enquiry.objects.get().status, "new")

    def test_short_message_is_rejected(self):
        response = self.client.post("/api/v1/contact/", self.data(message="hi"), format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("message", response.data)

    def test_bad_email_is_rejected(self):
        response = self.client.post("/api/v1/contact/", self.data(email="not-an-email"), format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("email", response.data)

    def test_only_staff_can_read_enquiries(self):
        self.client.post("/api/v1/contact/", self.data(), format="json")
        self.assertEqual(self.client.get("/api/v1/enquiries/").status_code, 401)
        self.client.force_authenticate(self.staff)
        listing = self.client.get("/api/v1/enquiries/")
        self.assertEqual(listing.status_code, 200)
        self.assertEqual(listing.data["count"], 1)

    def test_staff_can_change_status(self):
        self.client.post("/api/v1/contact/", self.data(), format="json")
        enquiry = Enquiry.objects.get()
        self.client.force_authenticate(self.staff)
        response = self.client.patch(f"/api/v1/enquiries/{enquiry.id}/", {"status": "resolved"}, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], "resolved")
