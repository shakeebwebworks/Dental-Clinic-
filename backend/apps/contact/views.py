from rest_framework import generics, viewsets
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.throttling import ScopedRateThrottle

from .models import Enquiry
from .serializers import ContactSerializer, EnquirySerializer


class ContactCreateView(generics.CreateAPIView):
    serializer_class = ContactSerializer
    permission_classes = [AllowAny]
    authentication_classes = []  # an old or expired token must never block a public form
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "public_form"


class EnquiryViewSet(viewsets.ModelViewSet):
    queryset = Enquiry.objects.all()
    serializer_class = EnquirySerializer
    permission_classes = [IsAdminUser]
    http_method_names = ["get", "patch", "delete", "head", "options"]
    filterset_fields = ["status", "kind"]
    search_fields = ["name", "email", "subject", "message"]
    ordering_fields = ["created_at", "status"]
