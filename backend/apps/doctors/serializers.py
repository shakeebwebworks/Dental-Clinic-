from rest_framework import serializers

from .models import Doctor


class DoctorSerializer(serializers.ModelSerializer):
    experience = serializers.SerializerMethodField()

    class Meta:
        model = Doctor
        fields = [
            "id", "name", "slug", "role", "qualification", "experience_years", "experience",
            "bio", "specialisations", "languages", "photo", "is_active", "order",
        ]
        read_only_fields = ["slug"]

    def get_experience(self, obj):
        years = obj.experience_years
        return f"{years} year" if years == 1 else f"{years} years"

    def validate_specialisations(self, value):
        if not isinstance(value, list) or not all(isinstance(item, str) for item in value):
            raise serializers.ValidationError("Specialisations must be a list of text items.")
        return value
