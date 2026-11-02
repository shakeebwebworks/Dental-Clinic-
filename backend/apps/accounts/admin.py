from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (("Contact", {"fields": ("phone",)}),)
    add_fieldsets = UserAdmin.add_fieldsets + (
        ("Contact", {"fields": ("email", "phone")}),
    )
    list_display = ("username", "email", "phone", "is_staff", "is_active")
