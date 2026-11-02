import { Target, Eye, Building2, Armchair, Microscope, Scan, ShieldCheck, Sparkles } from "lucide-react";

export const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM",
];

export const aboutText = {
  intro: [
    "BrightSmile Dental Clinic was founded with one belief: great dentistry should feel calm, clear and comfortable. For over 15 years we have cared for families across the city with gentle techniques and honest advice.",
    "Every treatment plan is explained in plain language, priced transparently and tailored to your goals, from a routine check-up to a complete smile makeover.",
  ],
  mission: "To deliver safe, comfortable and technologically advanced dental care that helps every patient keep a healthy, confident smile for life.",
  vision: "To be the most trusted dental clinic in our community, known for clinical excellence, genuine kindness and outstanding patient experience.",
  stats: [
    { value: "15+", label: "Years of experience" },
    { value: "12,000+", label: "Patients treated" },
    { value: "4", label: "Specialist dentists" },
    { value: "98%", label: "Patient satisfaction" },
  ],
};

export const missionVision = [
  { icon: Target, title: "Our Mission", key: "mission" },
  { icon: Eye, title: "Our Vision", key: "vision" },
];

export const facilities = [
  { icon: Building2, title: "Modern Clinic", text: "Bright, spacious treatment rooms designed to keep you relaxed." },
  { icon: Scan, title: "Digital X-Ray & 3D Scan", text: "Low-radiation imaging for precise diagnosis and planning." },
  { icon: ShieldCheck, title: "Sterilisation Suite", text: "Hospital-grade autoclaves and single-use instruments." },
  { icon: Microscope, title: "In-house Lab", text: "Crowns, veneers and aligners made with faster turnaround." },
  { icon: Armchair, title: "Comfort Lounge", text: "Quiet waiting area with refreshments and free Wi-Fi." },
  { icon: Sparkles, title: "Laser Dentistry", text: "Minimally invasive treatments with quicker healing." },
];

export const serviceDetails = {
  "Teeth Whitening": { duration: "45-60 min", benefits: ["Up to 8 shades brighter", "Safe for enamel", "Results in one visit"], details: "Professional in-clinic whitening removes stains from coffee, tea and ageing using a gentle, enamel-safe gel." },
  "Dental Implants": { duration: "Multiple visits", benefits: ["Looks and feels natural", "Lasts for decades", "Protects jawbone health"], details: "Titanium implants replace the tooth root and are topped with a custom crown, giving a permanent solution for missing teeth." },
  "Root Canal Treatment": { duration: "60-90 min", benefits: ["Relieves tooth pain", "Saves your natural tooth", "Comfortable with modern anaesthesia"], details: "We remove infected tissue, clean the canals and seal the tooth, usually in one or two visits." },
  "Braces & Aligners": { duration: "6-24 months", benefits: ["Metal, ceramic and clear options", "Corrects crowding and bite", "Suitable for teens and adults"], details: "A personalised plan straightens your teeth using traditional braces or nearly invisible clear aligners." },
  "Teeth Cleaning": { duration: "30-45 min", benefits: ["Removes plaque and tartar", "Prevents gum disease", "Fresher breath"], details: "Ultrasonic scaling and polishing keep your gums healthy. We recommend a cleaning every six months." },
  "Cosmetic Dentistry": { duration: "Varies", benefits: ["Veneers and smile design", "Fix chips, gaps and shape", "Natural-looking results"], details: "From bonding to porcelain veneers, we design a smile that suits your face and personality." },
  "Tooth Extraction": { duration: "20-40 min", benefits: ["Gentle, careful technique", "Minimal discomfort", "Clear aftercare guidance"], details: "When a tooth cannot be saved, we remove it comfortably and discuss replacement options." },
  "Pediatric Dentistry": { duration: "30-45 min", benefits: ["Child-friendly environment", "Preventive sealants and fluoride", "Builds lifelong good habits"], details: "Our paediatric specialist makes dental visits fun, calm and fear-free for children of all ages." },
};

export const doctorDetails = {
  "Dr. Ananya Rao": { bio: "Leads our implant and prosthodontic care with a focus on natural, long-lasting restorations.", specialisations: ["Dental Implants", "Crowns & Bridges", "Full-mouth Rehabilitation"], languages: "English, Hindi, Kannada" },
  "Dr. Rohan Mehta": { bio: "Creates beautifully aligned smiles for teens and adults using braces and clear aligners.", specialisations: ["Braces", "Clear Aligners", "Bite Correction"], languages: "English, Hindi, Gujarati" },
  "Dr. Priya Nair": { bio: "Known for gentle, precise root canal treatment that saves teeth and relieves pain.", specialisations: ["Root Canal Treatment", "Re-treatment", "Dental Trauma"], languages: "English, Malayalam, Tamil" },
  "Dr. Karthik Iyer": { bio: "A caring paediatric dentist who turns first dental visits into a positive experience.", specialisations: ["Child Dentistry", "Preventive Care", "Habit Correction"], languages: "English, Tamil, Kannada" },
};

export const allReviews = [
  { name: "Meera S.", treatment: "Teeth Whitening", rating: 5, text: "The whole experience felt like a luxury spa. My smile has never looked better, and the team made me feel completely at ease." },
  { name: "Arjun K.", treatment: "Dental Implants", rating: 5, text: "I was nervous about implants, but the doctor explained every step. Painless, professional and the results look completely natural." },
  { name: "Sana R.", treatment: "Pediatric Care", rating: 5, text: "My 6-year-old actually asks to go back to the dentist! Wonderful, patient staff and a very clean clinic." },
  { name: "Vikram P.", treatment: "Root Canal", rating: 4, text: "I expected a painful procedure and it was nothing of the sort. Quick, comfortable and well explained." },
  { name: "Divya M.", treatment: "Clear Aligners", rating: 5, text: "Eight months in and my teeth are perfectly straight. The follow-ups were easy to book and the results exceeded my hopes." },
  { name: "Rahul T.", treatment: "Teeth Cleaning", rating: 5, text: "Spotless clinic, on-time appointment and a gentle cleaning. This is now my family's dentist." },
];
