from rest_framework import serializers

from apps.core.validators import validate_phone

from .models import Enquiry


class ContactSerializer(serializers.ModelSerializer):
    """Public contact form / patient enquiry."""

    phone = serializers.CharField(max_length=20, required=False, allow_blank=True, validators=[validate_phone])

    class Meta:
        model = Enquiry
        fields = ["id", "name", "email", "phone", "subject", "message", "kind"]

    def validate_name(self, value):
        value = value.strip()
        if len(value) < 2:
            raise serializers.ValidationError("Please enter your name.")
        return value

    def validate_subject(self, value):
        value = value.strip()
        if len(value) < 3:
            raise serializers.ValidationError("Please add a short subject.")
        return value

    def validate_message(self, value):
        value = value.strip()
        if len(value) < 10:
            raise serializers.ValidationError("Message must be at least 10 characters.")
        if len(value) > 1000:
            raise serializers.ValidationError("Message must be 1000 characters or fewer.")
        return value


class EnquirySerializer(serializers.ModelSerializer):
    """Staff view: can only change the status and notes."""

    class Meta:
        model = Enquiry
        fields = [
            "id", "name", "email", "phone", "subject", "message", "kind",
            "status", "admin_notes", "created_at", "updated_at",
        ]
        read_only_fields = ["name", "email", "phone", "subject", "message", "kind", "created_at", "updated_at"]
