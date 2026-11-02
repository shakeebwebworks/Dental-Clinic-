from django.contrib.auth import get_user_model
from django.core.cache import cache
from rest_framework.test import APITestCase

User = get_user_model()
PASSWORD = "Str0ng!Pass#1"


class AuthTests(APITestCase):
    def setUp(self):
        cache.clear()
        self.user = User.objects.create_user("jane", "jane@example.com", PASSWORD)

    def register_data(self, **extra):
        data = {
            "username": "newpatient", "email": "new@example.com",
            "first_name": "New", "last_name": "Patient",
            "password": "Str0ng!Pass#2", "password_confirm": "Str0ng!Pass#2",
        }
        data.update(extra)
        return data

    def test_register_creates_a_normal_patient(self):
        response = self.client.post("/api/v1/auth/register/", self.register_data(is_staff=True), format="json")
        self.assertEqual(response.status_code, 201)
        created = User.objects.get(username="newpatient")
        self.assertFalse(created.is_staff)
        self.assertNotIn("password", response.data)

    def test_register_rejects_duplicate_email(self):
        response = self.client.post(
            "/api/v1/auth/register/", self.register_data(email="JANE@example.com"), format="json"
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("email", response.data)

    def test_register_rejects_password_mismatch(self):
        response = self.client.post(
            "/api/v1/auth/register/", self.register_data(password_confirm="Different!Pass#3"), format="json"
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("password_confirm", response.data)

    def test_register_rejects_weak_password(self):
        response = self.client.post(
            "/api/v1/auth/register/",
            self.register_data(password="12345678", password_confirm="12345678"),
            format="json",
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("password", response.data)

    def test_login_returns_tokens_and_user(self):
        response = self.client.post(
            "/api/v1/auth/login/", {"username": "jane", "password": PASSWORD}, format="json"
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertFalse(response.data["user"]["is_staff"])

    def test_login_with_wrong_password_fails(self):
        response = self.client.post(
            "/api/v1/auth/login/", {"username": "jane", "password": "wrong"}, format="json"
        )
        self.assertEqual(response.status_code, 401)

    def test_me_requires_login(self):
        self.assertEqual(self.client.get("/api/v1/auth/me/").status_code, 401)
        self.client.force_authenticate(self.user)
        response = self.client.get("/api/v1/auth/me/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["username"], "jane")

    def test_logout_blacklists_refresh_token(self):
        login = self.client.post(
            "/api/v1/auth/login/", {"username": "jane", "password": PASSWORD}, format="json"
        )
        refresh = login.data["refresh"]
        self.assertEqual(self.client.post("/api/v1/auth/logout/", {"refresh": refresh}, format="json").status_code, 200)
        again = self.client.post("/api/v1/auth/refresh/", {"refresh": refresh}, format="json")
        self.assertEqual(again.status_code, 401)
