from django.core.management.base import BaseCommand

from apps.doctors.models import Doctor
from apps.services.models import Service
from apps.testimonials.models import Testimonial

SERVICES = [
    {
        "title": "Teeth Whitening", "icon": "Sparkles", "duration": "45-60 min",
        "short_description": "Professional whitening for a visibly brighter smile in a single visit.",
        "description": "Professional in-clinic whitening removes stains from coffee, tea and ageing using a gentle, enamel-safe gel.",
        "benefits": ["Up to 8 shades brighter", "Safe for enamel", "Results in one visit"],
    },
    {
        "title": "Dental Implants", "icon": "Gem", "duration": "Multiple visits",
        "short_description": "Permanent, natural-looking replacements for missing teeth.",
        "description": "Titanium implants replace the tooth root and are topped with a custom crown, giving a permanent solution for missing teeth.",
        "benefits": ["Looks and feels natural", "Lasts for decades", "Protects jawbone health"],
    },
    {
        "title": "Root Canal Treatment", "icon": "Stethoscope", "duration": "60-90 min",
        "short_description": "Gentle, pain-free treatment that saves your natural tooth.",
        "description": "We remove infected tissue, clean the canals and seal the tooth, usually in one or two visits.",
        "benefits": ["Relieves tooth pain", "Saves your natural tooth", "Comfortable with modern anaesthesia"],
    },
    {
        "title": "Braces & Aligners", "icon": "Smile", "duration": "6-24 months",
        "short_description": "Modern metal, ceramic and clear aligner options for every age.",
        "description": "A personalised plan straightens your teeth using traditional braces or nearly invisible clear aligners.",
        "benefits": ["Metal, ceramic and clear options", "Corrects crowding and bite", "Suitable for teens and adults"],
    },
    {
        "title": "Teeth Cleaning", "icon": "ShieldCheck", "duration": "30-45 min",
        "short_description": "Deep scaling and polishing to keep gums and teeth healthy.",
        "description": "Ultrasonic scaling and polishing keep your gums healthy. We recommend a cleaning every six months.",
        "benefits": ["Removes plaque and tartar", "Prevents gum disease", "Fresher breath"],
    },
    {
        "title": "Cosmetic Dentistry", "icon": "Crown", "duration": "Varies",
        "short_description": "Veneers, smile design and bonding for a confident smile.",
        "description": "From bonding to porcelain veneers, we design a smile that suits your face and personality.",
        "benefits": ["Veneers and smile design", "Fix chips, gaps and shape", "Natural-looking results"],
    },
    {
        "title": "Tooth Extraction", "icon": "Syringe", "duration": "20-40 min",
        "short_description": "Comfortable, careful extractions with fast recovery.",
        "description": "When a tooth cannot be saved, we remove it comfortably and discuss replacement options.",
        "benefits": ["Gentle, careful technique", "Minimal discomfort", "Clear aftercare guidance"],
    },
    {
        "title": "Pediatric Dentistry", "icon": "Baby", "duration": "30-45 min",
        "short_description": "Friendly, fear-free dental care for children.",
        "description": "Our paediatric specialist makes dental visits fun, calm and fear-free for children of all ages.",
        "benefits": ["Child-friendly environment", "Preventive sealants and fluoride", "Builds lifelong good habits"],
    },
]

DOCTORS = [
    {
        "name": "Dr. Ananya Rao", "role": "Implantologist", "qualification": "BDS, MDS (Prosthodontics)",
        "experience_years": 14, "languages": "English, Hindi, Kannada",
        "bio": "Leads our implant and prosthodontic care with a focus on natural, long-lasting restorations.",
        "specialisations": ["Dental Implants", "Crowns & Bridges", "Full-mouth Rehabilitation"],
    },
    {
        "name": "Dr. Rohan Mehta", "role": "Orthodontist", "qualification": "BDS, MDS (Orthodontics)",
        "experience_years": 11, "languages": "English, Hindi, Gujarati",
        "bio": "Creates beautifully aligned smiles for teens and adults using braces and clear aligners.",
        "specialisations": ["Braces", "Clear Aligners", "Bite Correction"],
    },
    {
        "name": "Dr. Priya Nair", "role": "Endodontist", "qualification": "BDS, MDS (Endodontics)",
        "experience_years": 9, "languages": "English, Malayalam, Tamil",
        "bio": "Known for gentle, precise root canal treatment that saves teeth and relieves pain.",
        "specialisations": ["Root Canal Treatment", "Re-treatment", "Dental Trauma"],
    },
    {
        "name": "Dr. Karthik Iyer", "role": "Pediatric Dentist", "qualification": "BDS, MDS (Pedodontics)",
        "experience_years": 8, "languages": "English, Tamil, Kannada",
        "bio": "A caring paediatric dentist who turns first dental visits into a positive experience.",
        "specialisations": ["Child Dentistry", "Preventive Care", "Habit Correction"],
    },
]

REVIEWS = [
    ("Meera S.", "Teeth Whitening", 5, "The whole experience felt like a luxury spa. My smile has never looked better, and the team made me feel completely at ease."),
    ("Arjun K.", "Dental Implants", 5, "I was nervous about implants, but the doctor explained every step. Painless, professional and the results look completely natural."),
    ("Sana R.", "Pediatric Care", 5, "My 6-year-old actually asks to go back to the dentist! Wonderful, patient staff and a very clean clinic."),
    ("Vikram P.", "Root Canal", 4, "I expected a painful procedure and it was nothing of the sort. Quick, comfortable and well explained."),
    ("Divya M.", "Clear Aligners", 5, "Eight months in and my teeth are perfectly straight. The follow-ups were easy to book and the results exceeded my hopes."),
    ("Rahul T.", "Teeth Cleaning", 5, "Spotless clinic, on-time appointment and a gentle cleaning. This is now my family's dentist."),
]


class Command(BaseCommand):
    help = "Create sample services, doctors and reviews. Safe to run more than once (never overwrites your edits)."

    def handle(self, *args, **options):
        for order, item in enumerate(SERVICES, start=1):
            defaults = {k: v for k, v in item.items() if k != "title"}
            defaults["order"] = order
            Service.objects.get_or_create(title=item["title"], defaults=defaults)

        for order, item in enumerate(DOCTORS, start=1):
            defaults = {k: v for k, v in item.items() if k != "name"}
            defaults["order"] = order
            Doctor.objects.get_or_create(name=item["name"], defaults=defaults)

        for index, (name, treatment, rating, text) in enumerate(REVIEWS):
            Testimonial.objects.get_or_create(
                name=name, text=text,
                defaults={"treatment": treatment, "rating": rating, "is_approved": True, "is_featured": index < 3},
            )

        self.stdout.write(self.style.SUCCESS(
            f"Sample data ready: {Service.objects.count()} services, "
            f"{Doctor.objects.count()} doctors, {Testimonial.objects.count()} reviews."
        ))
