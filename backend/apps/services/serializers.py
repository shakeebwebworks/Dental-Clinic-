from rest_framework import serializers

from .models import Service


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = [
            "id", "title", "slug", "icon", "short_description", "description",
            "duration", "benefits", "is_active", "order",
        ]
        read_only_fields = ["slug"]

    def validate_benefits(self, value):
        if not isinstance(value, list) or not all(isinstance(item, str) for item in value):
            raise serializers.ValidationError("Benefits must be a list of text items.")
        return value
