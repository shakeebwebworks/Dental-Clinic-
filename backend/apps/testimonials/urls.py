from rest_framework.routers import SimpleRouter

from .views import TestimonialViewSet

router = SimpleRouter()
router.register("testimonials", TestimonialViewSet, basename="testimonial")

urlpatterns = router.urls
