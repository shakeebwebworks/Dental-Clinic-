import re

from django.core.exceptions import ValidationError


def validate_phone(value):
    """Accept 10-13 digits with optional +, spaces, brackets and dashes."""
    value = (value or "").strip()
    if not re.fullmatch(r"[+0-9\s()\-]+", value):
        raise ValidationError("Enter a valid phone number.")
    digits = re.sub(r"\D", "", value)
    if not 10 <= len(digits) <= 13:
        raise ValidationError("Phone number must have 10 to 13 digits.")
    return value
