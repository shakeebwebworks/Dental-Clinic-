import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { clinic } from "../../data/clinicData";

const pages = {
  "/": {
    title: "Premium Dental Care",
    description: "Advanced, comfortable dentistry for the whole family: implants, whitening, braces, root canal and more. Book your appointment online.",
  },
  "/about": {
    title: "About Us",
    description: "Learn about our dental clinic, our mission, modern facilities and the specialist team caring for your smile.",
  },
  "/services": {
    title: "Dental Services",
    description: "Teeth whitening, dental implants, root canal treatment, braces and aligners, cleaning, cosmetic and pediatric dentistry.",
  },
  "/doctors": {
    title: "Our Dentists",
    description: "Meet our experienced dental specialists: qualifications, experience and areas of expertise.",
  },
  "/testimonials": {
    title: "Patient Reviews",
    description: "Read genuine reviews and ratings from patients who trusted us with their smile.",
  },
  "/contact": {
    title: "Contact Us",
    description: "Find our address, phone number, opening hours and map, or send us a message.",
  },
  "/appointment": {
    title: "Book an Appointment",
    description: "Book your dental appointment online. Choose your treatment, dentist, date and a free time slot.",
  },
};

const privatePages = {
  "/login": "Login",
  "/register": "Create Account",
  "/my-appointments": "My Appointments",
  "/dashboard": "Staff Dashboard",
};

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export default function PageMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const known = pages[pathname];
    const isPrivate = pathname in privatePages;
    const heading = known?.title || privatePages[pathname] || "Page not found";
    const description = known?.description || "Premium dental care for the whole family.";
    const title = pathname === "/" ? `${clinic.name} | ${heading}` : `${heading} | ${clinic.name}`;

    document.title = title;
    setMeta("name", "description", description);
    setMeta("name", "robots", known ? "index, follow" : "noindex, nofollow");
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", clinic.name);
    if (isPrivate) setMeta("name", "robots", "noindex, nofollow");
  }, [pathname]);

  // Structured data helps search engines show the clinic details.
  useEffect(() => {
    const data = {
      "@context": "https://schema.org",
      "@type": "Dentist",
      name: clinic.name,
      telephone: clinic.phone,
      email: clinic.email,
      address: { "@type": "PostalAddress", streetAddress: clinic.address },
    };
    let el = document.getElementById("ld-clinic");
    if (!el) {
      el = document.createElement("script");
      el.id = "ld-clinic";
      el.type = "application/ld+json";
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);
  }, []);

  return null;
}
