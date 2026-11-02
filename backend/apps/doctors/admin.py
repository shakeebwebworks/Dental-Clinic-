from django.contrib import admin

from .models import Doctor


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ("name", "role", "experience_years", "is_active", "order")
    list_editable = ("is_active", "order")
    list_filter = ("is_active", "role")
    search_fields = ("name", "role", "qualification")
    prepopulated_fields = {"slug": ("name",)}
