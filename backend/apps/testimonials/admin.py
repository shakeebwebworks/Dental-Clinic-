from django.contrib import admin

from .models import Testimonial


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ("name", "treatment", "rating", "is_approved", "is_featured", "created_at")
    list_editable = ("is_approved", "is_featured")
    list_filter = ("is_approved", "is_featured", "rating")
    search_fields = ("name", "treatment", "text")
    actions = ["approve", "unapprove"]

    @admin.action(description="Approve selected reviews")
    def approve(self, request, queryset):
        updated = queryset.update(is_approved=True)
        self.message_user(request, f"{updated} review(s) approved.")

    @admin.action(description="Hide selected reviews")
    def unapprove(self, request, queryset):
        updated = queryset.update(is_approved=False)
        self.message_user(request, f"{updated} review(s) hidden.")
