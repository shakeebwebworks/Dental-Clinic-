from rest_framework import viewsets

from apps.core.permissions import IsStaffOrReadOnly

from .models import Doctor
from .serializers import DoctorSerializer


class DoctorViewSet(viewsets.ModelViewSet):
    serializer_class = DoctorSerializer
    permission_classes = [IsStaffOrReadOnly]
    lookup_field = "slug"
    pagination_class = None
    search_fields = ["name", "role", "qualification"]

    def get_queryset(self):
        queryset = Doctor.objects.all()
        user = self.request.user
        if not (user.is_authenticated and user.is_staff):
            queryset = queryset.filter(is_active=True)
        return queryset
