from django.contrib import admin

from .models import Enquiry


@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):
    list_display = ("subject", "name", "email", "kind", "status", "created_at")
    list_editable = ("status",)
    list_filter = ("status", "kind")
    search_fields = ("name", "email", "subject", "message")
    readonly_fields = ("name", "email", "phone", "subject", "message", "kind", "created_at", "updated_at")
    actions = ["mark_resolved"]

    def has_add_permission(self, request):
        return False

    @admin.action(description="Mark selected as resolved")
    def mark_resolved(self, request, queryset):
        updated = queryset.update(status=Enquiry.Status.RESOLVED)
        self.message_user(request, f"{updated} enquiry(ies) marked as resolved.")
