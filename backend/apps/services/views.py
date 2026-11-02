from rest_framework import viewsets

from apps.core.permissions import IsStaffOrReadOnly

from .models import Service
from .serializers import ServiceSerializer


class ServiceViewSet(viewsets.ModelViewSet):
    serializer_class = ServiceSerializer
    permission_classes = [IsStaffOrReadOnly]
    lookup_field = "slug"
    pagination_class = None
    search_fields = ["title", "short_description"]

    def get_queryset(self):
        queryset = Service.objects.all()
        user = self.request.user
        if not (user.is_authenticated and user.is_staff):
            queryset = queryset.filter(is_active=True)
        return queryset
