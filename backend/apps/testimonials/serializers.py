from rest_framework import serializers

from .models import Testimonial


class TestimonialSerializer(serializers.ModelSerializer):
    """Public: list approved reviews and submit a new one (it waits for approval)."""

    class Meta:
        model = Testimonial
        fields = ["id", "name", "treatment", "rating", "text", "is_featured", "created_at"]
        read_only_fields = ["is_featured", "created_at"]

    def validate_name(self, value):
        value = value.strip()
        if len(value) < 2:
            raise serializers.ValidationError("Please enter your name.")
        return value

    def validate_text(self, value):
        value = value.strip()
        if len(value) < 10:
            raise serializers.ValidationError("Review must be at least 10 characters.")
        if len(value) > 600:
            raise serializers.ValidationError("Review must be 600 characters or fewer.")
        return value


class TestimonialAdminSerializer(TestimonialSerializer):
    class Meta(TestimonialSerializer.Meta):
        fields = TestimonialSerializer.Meta.fields + ["is_approved"]
        read_only_fields = ["created_at"]
