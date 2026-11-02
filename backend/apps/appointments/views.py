from datetime import date as date_type

from django.db.models import Count
from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle

from .models import Appointment
from .scheduling import ACTIVE_STATUSES, TIME_FORMAT, bookable_slots
from .serializers import AppointmentAdminSerializer, AppointmentSerializer


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.select_related("service", "doctor", "user")
    filterset_fields = ["status", "date", "doctor", "service"]
    search_fields = ["patient_name", "email", "phone", "reference"]
    ordering_fields = ["date", "time", "created_at", "status"]

    def get_serializer_class(self):
        user = self.request.user
        if user.is_authenticated and user.is_staff:
            return AppointmentAdminSerializer
        return AppointmentSerializer

    def get_permissions(self):
        if self.action in ("create", "availability"):
            return [AllowAny()]
        if self.action == "my":
            return [IsAuthenticated()]
        return [IsAdminUser()]  # list, retrieve, update, delete, stats

    def get_throttles(self):
        if self.action == "create":
            self.throttle_scope = "public_form"
            return [ScopedRateThrottle()]
        return super().get_throttles()

    @action(detail=False, methods=["get"])
    def availability(self, request):
        """Free time slots for a day. Optional ?doctor=<id> removes that dentist's booked slots."""
        try:
            day = date_type.fromisoformat(request.query_params.get("date", ""))
        except ValueError:
            return Response({"detail": "Provide a valid date as YYYY-MM-DD."}, status=400)

        slots = bookable_slots(day)
        doctor_id = request.query_params.get("doctor", "")
        if doctor_id.isdigit():
            booked = set(
                Appointment.objects.filter(
                    doctor_id=int(doctor_id), date=day, status__in=ACTIVE_STATUSES
                ).values_list("time", flat=True)
            )
            slots = [s for s in slots if s not in booked]
        return Response({"date": day.isoformat(), "available": [s.strftime(TIME_FORMAT) for s in slots]})

    @action(detail=False, methods=["get"])
    def my(self, request):
        """Appointments that belong to the logged-in patient."""
        queryset = Appointment.objects.filter(user=request.user).select_related("service", "doctor")
        serializer = AppointmentSerializer(queryset, many=True, context={"request": request})
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def stats(self, request):
        """Counts for the admin dashboard."""
        counts = dict(
            Appointment.objects.values("status").annotate(n=Count("id")).values_list("status", "n")
        )
        today = timezone.localdate()
        return Response({
            "total": sum(counts.values()),
            "pending": counts.get("pending", 0),
            "confirmed": counts.get("confirmed", 0),
            "cancelled": counts.get("cancelled", 0),
            "completed": counts.get("completed", 0),
            "today": Appointment.objects.filter(date=today).exclude(status="cancelled").count(),
        })
