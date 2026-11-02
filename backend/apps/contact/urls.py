from django.urls import path
from rest_framework.routers import SimpleRouter

from .views import ContactCreateView, EnquiryViewSet

router = SimpleRouter()
router.register("enquiries", EnquiryViewSet, basename="enquiry")

urlpatterns = [
    path("contact/", ContactCreateView.as_view(), name="contact-create"),
] + router.urls
