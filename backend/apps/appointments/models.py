import secrets

from django.conf import settings
from django.db import models
from django.db.models import Q

from .scheduling import ACTIVE_STATUSES


class Appointment(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        CONFIRMED = "confirmed", "Confirmed"
        CANCELLED = "cancelled", "Cancelled"
        COMPLETED = "completed", "Completed"

    reference = models.CharField(max_length=20, unique=True, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True,
        on_delete=models.SET_NULL, related_name="appointments",
    )
    patient_name = models.CharField(max_length=120)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    service = models.ForeignKey("services.Service", on_delete=models.PROTECT, related_name="appointments")
    doctor = models.ForeignKey(
        "doctors.Doctor", null=True, blank=True,
        on_delete=models.SET_NULL, related_name="appointments",
    )
    date = models.DateField()
    time = models.TimeField()
    message = models.TextField(blank=True)
    status = models.CharField(max_length=12, choices=Status.choices, default=Status.PENDING)
    admin_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["date", "time"]),
            models.Index(fields=["status"]),
        ]
        constraints = [
            # Database-level protection: a dentist cannot have two active bookings at the same time.
            models.UniqueConstraint(
                fields=["doctor", "date", "time"],
                condition=Q(status__in=ACTIVE_STATUSES, doctor__isnull=False),
                name="unique_active_slot_per_doctor",
            )
        ]

    @classmethod
    def generate_reference(cls):
        while True:
            reference = f"APT-{secrets.randbelow(900000) + 100000}"
            if not cls.objects.filter(reference=reference).exists():
                return reference

    def save(self, *args, **kwargs):
        if not self.reference:
            self.reference = self.generate_reference()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.reference} - {self.patient_name}"
