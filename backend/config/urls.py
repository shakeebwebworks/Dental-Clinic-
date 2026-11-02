from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

admin.site.site_header = "BrightSmile Dental Admin"
admin.site.site_title = "BrightSmile Admin"
admin.site.index_title = "Clinic dashboard"

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include("apps.core.urls")),
    path("api/v1/", include("apps.accounts.urls")),
    path("api/v1/", include("apps.services.urls")),
    path("api/v1/", include("apps.doctors.urls")),
    path("api/v1/", include("apps.appointments.urls")),
    path("api/v1/", include("apps.contact.urls")),
    path("api/v1/", include("apps.testimonials.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
