from django.db import models


class Enquiry(models.Model):
    class Kind(models.TextChoices):
        GENERAL = "general", "General question"
        TREATMENT = "treatment", "Treatment enquiry"
        APPOINTMENT = "appointment", "Appointment enquiry"
        FEEDBACK = "feedback", "Feedback"

    class Status(models.TextChoices):
        NEW = "new", "New"
        IN_PROGRESS = "in_progress", "In progress"
        RESOLVED = "resolved", "Resolved"

    name = models.CharField(max_length=120)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    kind = models.CharField(max_length=20, choices=Kind.choices, default=Kind.GENERAL)
    status = models.CharField(max_length=12, choices=Status.choices, default=Status.NEW)
    admin_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "enquiries"

    def __str__(self):
        return f"{self.subject} - {self.name}"
