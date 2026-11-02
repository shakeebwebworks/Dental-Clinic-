import {
  Sparkles, Gem, Stethoscope, Smile, ShieldCheck, Crown, Syringe, Baby,
  Award, HeartPulse, Clock, Users,
} from "lucide-react";

// EDIT THIS FILE: change the clinic details to your real information.
export const clinic = {
  name: "BrightSmile Dental Clinic",
  tagline: "Premium dental care, designed around you",
  phone: "+91 98765 43210",
  phoneLink: "+919876543210",
  whatsapp: "919876543210",
  email: "hello@brightsmile.example",
  address: "12, Residency Road, Bengaluru, Karnataka 560025",
  hours: [
    { days: "Monday – Friday", time: "9:00 AM – 7:00 PM" },
    { days: "Saturday", time: "9:00 AM – 5:00 PM" },
    { days: "Sunday", time: "Closed" },
  ],
  stats: [
    { value: "15+", label: "Years of experience" },
    { value: "12k+", label: "Happy patients" },
    { value: "4.9", label: "Average rating" },
  ],
};

export const services = [
  { icon: Sparkles, title: "Teeth Whitening", text: "Professional whitening for a visibly brighter smile in a single visit." },
  { icon: Gem, title: "Dental Implants", text: "Permanent, natural-looking replacements for missing teeth." },
  { icon: Stethoscope, title: "Root Canal Treatment", text: "Gentle, pain-free treatment that saves your natural tooth." },
  { icon: Smile, title: "Braces & Aligners", text: "Modern metal, ceramic and clear aligner options for every age." },
  { icon: ShieldCheck, title: "Teeth Cleaning", text: "Deep scaling and polishing to keep gums and teeth healthy." },
  { icon: Crown, title: "Cosmetic Dentistry", text: "Veneers, smile design and bonding for a confident smile." },
  { icon: Syringe, title: "Tooth Extraction", text: "Comfortable, careful extractions with fast recovery." },
  { icon: Baby, title: "Pediatric Dentistry", text: "Friendly, fear-free dental care for children." },
];

export const reasons = [
  { icon: Award, title: "Expert Specialists", text: "Experienced dentists across every major specialty." },
  { icon: HeartPulse, title: "Pain-Free Care", text: "Modern anaesthesia and gentle techniques for your comfort." },
  { icon: ShieldCheck, title: "Strict Hygiene", text: "Hospital-grade sterilisation for every patient, every time." },
  { icon: Clock, title: "Flexible Timings", text: "Early, late and weekend appointments that fit your life." },
  { icon: Users, title: "Family Friendly", text: "One clinic for children, adults and seniors." },
  { icon: Sparkles, title: "Latest Technology", text: "Digital X-rays, 3D scanning and laser dentistry." },
];

// Sample doctors: replace with your real team.
export const doctors = [
  { name: "Dr. Ananya Rao", role: "Implantologist", qualification: "BDS, MDS (Prosthodontics)", experience: "14 years" },
  { name: "Dr. Rohan Mehta", role: "Orthodontist", qualification: "BDS, MDS (Orthodontics)", experience: "11 years" },
  { name: "Dr. Priya Nair", role: "Endodontist", qualification: "BDS, MDS (Endodontics)", experience: "9 years" },
  { name: "Dr. Karthik Iyer", role: "Pediatric Dentist", qualification: "BDS, MDS (Pedodontics)", experience: "8 years" },
];

// Sample reviews: replace with real patient feedback.
export const testimonials = [
  { name: "Meera S.", treatment: "Teeth Whitening", rating: 5, text: "The whole experience felt like a luxury spa. My smile has never looked better, and the team made me feel completely at ease." },
  { name: "Arjun K.", treatment: "Dental Implants", rating: 5, text: "I was nervous about implants, but the doctor explained every step. Painless, professional and the results look completely natural." },
  { name: "Sana R.", treatment: "Pediatric Care", rating: 5, text: "My 6-year-old actually asks to go back to the dentist! Wonderful, patient staff and a very clean clinic." },
];

// Add real photos later: put images in src/assets/images and set before/after to the imported file.
export const beforeAfterCases = [
  { title: "Smile Whitening", before: null, after: null },
  { title: "Braces & Alignment", before: null, after: null },
  { title: "Cosmetic Veneers", before: null, after: null },
];
