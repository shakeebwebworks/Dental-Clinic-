from django.db import models
from django.utils.text import slugify


class Service(models.Model):
    title = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=140, unique=True, blank=True)
    icon = models.CharField(max_length=50, blank=True, help_text="Lucide icon name, for example Sparkles")
    short_description = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    duration = models.CharField(max_length=60, blank=True)
    benefits = models.JSONField(default=list, blank=True, help_text="List of short benefit texts")
    is_active = models.BooleanField(default=True)
    order = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "title"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
