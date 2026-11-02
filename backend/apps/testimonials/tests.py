from django.contrib.auth import get_user_model
from django.core.cache import cache
from rest_framework.test import APITestCase

from .models import Testimonial

User = get_user_model()
URL = "/api/v1/testimonials/"


class TestimonialApiTests(APITestCase):
    def setUp(self):
        cache.clear()
        self.staff = User.objects.create_user("staffuser", "staff@example.com", "Str0ng!Pass#1", is_staff=True)

    def review(self, **extra):
        data = {"name": "Asha", "treatment": "Cleaning", "rating": 5, "text": "Wonderful and gentle care."}
        data.update(extra)
        return data

    def test_new_review_is_hidden_until_approved(self):
        response = self.client.post(URL, self.review(), format="json")
        self.assertEqual(response.status_code, 201)
        saved = Testimonial.objects.get()
        self.assertFalse(saved.is_approved)
        self.assertEqual(self.client.get(URL).data["count"], 0)
        saved.is_approved = True
        saved.save()
        self.assertEqual(self.client.get(URL).data["count"], 1)

    def test_rating_must_be_between_1_and_5(self):
        response = self.client.post(URL, self.review(rating=6), format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("rating", response.data)

    def test_summary_counts_only_approved_reviews(self):
        Testimonial.objects.create(name="A", rating=5, text="Great visit, very happy.", is_approved=True)
        Testimonial.objects.create(name="B", rating=4, text="Good visit, quite happy.", is_approved=True)
        Testimonial.objects.create(name="C", rating=1, text="Not approved review text.", is_approved=False)
        response = self.client.get(URL + "summary/")
        self.assertEqual(response.data["count"], 2)
        self.assertEqual(response.data["average"], 4.5)

    def test_only_staff_can_delete(self):
        saved = Testimonial.objects.create(name="A", rating=5, text="Great visit, very happy.", is_approved=True)
        self.assertEqual(self.client.delete(f"{URL}{saved.id}/").status_code, 401)
        self.client.force_authenticate(self.staff)
        self.assertEqual(self.client.delete(f"{URL}{saved.id}/").status_code, 204)
