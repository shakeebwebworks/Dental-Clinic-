from django.db import connection
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


@api_view(["GET"])
@permission_classes([AllowAny])
def health_check(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        database = "connected"
    except Exception:
        database = "unavailable"

    return Response(
        {
            "service": "Dental Clinic API",
            "status": "ok" if database == "connected" else "degraded",
            "database": database,
        },
        status=200 if database == "connected" else 503,
    )
