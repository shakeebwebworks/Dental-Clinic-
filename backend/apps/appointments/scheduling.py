from datetime import time

from django.utils import timezone

# Start times of the bookable one-hour slots.
TIME_SLOTS = [time(9), time(10), time(11), time(12), time(14), time(15), time(16), time(17), time(18)]
SATURDAY_LAST_SLOT = time(16)  # clinic closes at 5 PM on Saturdays
ACTIVE_STATUSES = ["pending", "confirmed"]
TIME_FORMAT = "%I:%M %p"


def bookable_slots(day):
    """Slots that can still be booked on a given calendar day."""
    today = timezone.localdate()
    if day < today or day.weekday() == 6:  # past days and Sundays
        return []
    slots = list(TIME_SLOTS)
    if day.weekday() == 5:
        slots = [s for s in slots if s <= SATURDAY_LAST_SLOT]
    if day == today:
        now = timezone.localtime().time()
        slots = [s for s in slots if s > now]
    return slots
