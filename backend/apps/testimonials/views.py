from django.db.models import Avg, Count
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle

from .models import Testimonial
from .serializers import TestimonialAdminSerializer, TestimonialSerializer


class TestimonialViewSet(viewsets.ModelViewSet):
    filterset_fields = ["rating", "is_featured", "is_approved"]
    search_fields = ["name", "treatment", "text"]
    ordering_fields = ["created_at", "rating"]

    def _is_staff(self):
        user = self.request.user
        return user.is_authenticated and user.is_staff

    def get_queryset(self):
        queryset = Testimonial.objects.all()
        if not self._is_staff():
            queryset = queryset.filter(is_approved=True)
        return queryset

    def get_serializer_class(self):
        return TestimonialAdminSerializer if self._is_staff() else TestimonialSerializer

    def get_permissions(self):
        if self.action in ("list", "retrieve", "create", "summary"):
            return [AllowAny()]
        return [IsAdminUser()]

    def get_throttles(self):
        if self.action == "create":
            self.throttle_scope = "public_form"
            return [ScopedRateThrottle()]
        return super().get_throttles()

    @action(detail=False, methods=["get"])
    def summary(self, request):
        data = Testimonial.objects.filter(is_approved=True).aggregate(average=Avg("rating"), count=Count("id"))
        return Response({"average": round(data["average"] or 0, 1), "count": data["count"]})
