from django.contrib import admin, messages
from django.db import IntegrityError

from .models import Appointment


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ("reference", "patient_name", "service", "doctor", "date", "time", "status", "created_at")
    list_editable = ("status",)
    list_filter = ("status", "date", "doctor", "service")
    search_fields = ("reference", "patient_name", "email", "phone")
    date_hierarchy = "date"
    readonly_fields = ("reference", "created_at", "updated_at")
    actions = ["mark_confirmed", "mark_cancelled", "mark_completed"]

    def _set_status(self, request, queryset, status, label):
        try:
            updated = queryset.update(status=status)
        except IntegrityError:
            self.message_user(
                request,
                "Could not update: another active booking already uses one of those time slots.",
                level=messages.ERROR,
            )
            return
        self.message_user(request, f"{updated} appointment(s) marked as {label}.", level=messages.SUCCESS)

    @admin.action(description="Mark selected as confirmed")
    def mark_confirmed(self, request, queryset):
        self._set_status(request, queryset, Appointment.Status.CONFIRMED, "confirmed")

    @admin.action(description="Mark selected as cancelled")
    def mark_cancelled(self, request, queryset):
        self._set_status(request, queryset, Appointment.Status.CANCELLED, "cancelled")

    @admin.action(description="Mark selected as completed")
    def mark_completed(self, request, queryset):
        self._set_status(request, queryset, Appointment.Status.COMPLETED, "completed")
