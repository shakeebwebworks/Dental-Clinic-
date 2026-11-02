from datetime import timedelta

from django.db import IntegrityError
from django.utils import timezone
from rest_framework import serializers

from apps.core.validators import validate_phone
from apps.doctors.models import Doctor
from apps.services.models import Service

from .models import Appointment
from .scheduling import ACTIVE_STATUSES, TIME_FORMAT, bookable_slots


class AppointmentSerializer(serializers.ModelSerializer):
    """Used by the public booking form and by patients."""

    phone = serializers.CharField(max_length=20, validators=[validate_phone])
    message = serializers.CharField(max_length=500, required=False, allow_blank=True)
    service = serializers.PrimaryKeyRelatedField(queryset=Service.objects.filter(is_active=True))
    doctor = serializers.PrimaryKeyRelatedField(
        queryset=Doctor.objects.filter(is_active=True), required=False, allow_null=True
    )
    time = serializers.TimeField(input_formats=[TIME_FORMAT, "%H:%M", "%H:%M:%S"], format=TIME_FORMAT)
    service_name = serializers.CharField(source="service.title", read_only=True)
    doctor_name = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = [
            "id", "reference", "patient_name", "email", "phone", "service", "service_name",
            "doctor", "doctor_name", "date", "time", "message", "status", "created_at",
        ]
        read_only_fields = ["reference", "status", "created_at"]

    def get_doctor_name(self, obj):
        return obj.doctor.name if obj.doctor else None

    def validate_patient_name(self, value):
        value = value.strip()
        if len(value) < 2:
            raise serializers.ValidationError("Please enter your full name.")
        return value

    def validate_date(self, value):
        today = timezone.localdate()
        if value < today:
            raise serializers.ValidationError("Date cannot be in the past.")
        if value > today + timedelta(days=180):
            raise serializers.ValidationError("Appointments can be booked up to 6 months ahead.")
        if value.weekday() == 6:
            raise serializers.ValidationError("The clinic is closed on Sundays. Please pick another day.")
        return value

    def validate(self, attrs):
        instance = self.instance
        # Only re-check the schedule when date, time or dentist is being set or changed.
        if not any(key in attrs for key in ("date", "time", "doctor")):
            return attrs

        day = attrs.get("date", getattr(instance, "date", None))
        slot = attrs.get("time", getattr(instance, "time", None))
        doctor = attrs.get("doctor", getattr(instance, "doctor", None))
        status = attrs.get("status", getattr(instance, "status", Appointment.Status.PENDING))
        if day is None or slot is None:
            return attrs

        if slot not in bookable_slots(day):
            raise serializers.ValidationError(
                {"time": "That time is not available on the selected day. Please choose another slot."}
            )

        if doctor and status in ACTIVE_STATUSES:
            clash = Appointment.objects.filter(doctor=doctor, date=day, time=slot, status__in=ACTIVE_STATUSES)
            if instance is not None:
                clash = clash.exclude(pk=instance.pk)
            if clash.exists():
                raise serializers.ValidationError(
                    {"time": "This time is already booked for the selected dentist. Please choose another time."}
                )
        return attrs

    def create(self, validated_data):
        request = self.context.get("request")
        if request is not None and request.user.is_authenticated and not request.user.is_staff:
            validated_data["user"] = request.user
        try:
            return super().create(validated_data)
        except IntegrityError:
            raise serializers.ValidationError(
                {"time": "That time was just booked by someone else. Please choose another."}
            )


class AppointmentAdminSerializer(AppointmentSerializer):
    """Used by staff: can also change the status and add private notes."""

    class Meta(AppointmentSerializer.Meta):
        fields = AppointmentSerializer.Meta.fields + ["admin_notes", "user", "updated_at"]
        read_only_fields = ["reference", "created_at", "updated_at", "user"]

    def update(self, instance, validated_data):
        try:
            return super().update(instance, validated_data)
        except IntegrityError:
            raise serializers.ValidationError(
                {"status": "Another active booking already uses this dentist and time."}
            )
