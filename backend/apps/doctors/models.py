from django.db import models
from django.utils.text import slugify
from PIL import Image


class Doctor(models.Model):
    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=140, unique=True, blank=True)
    role = models.CharField(max_length=120, help_text="For example Orthodontist")
    qualification = models.CharField(max_length=200)
    experience_years = models.PositiveSmallIntegerField(default=0)
    bio = models.TextField(blank=True)
    specialisations = models.JSONField(default=list, blank=True, help_text="List of short specialisation texts")
    languages = models.CharField(max_length=200, blank=True)
    photo = models.ImageField(upload_to="doctors/", blank=True, null=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
        self._shrink_photo()

    def _shrink_photo(self, max_size=800):
        """Keep uploaded photos small so pages load fast."""
        if not self.photo:
            return
        try:
            with Image.open(self.photo.path) as img:
                if max(img.size) <= max_size:
                    return
                image_format = img.format
                img.thumbnail((max_size, max_size))
                img.save(self.photo.path, format=image_format, quality=85, optimize=True)
        except (OSError, ValueError, NotImplementedError):
            pass  # never block saving a doctor because of an image problem

    def __str__(self):
        return self.name
