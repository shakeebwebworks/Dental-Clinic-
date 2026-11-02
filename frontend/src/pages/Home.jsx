import Hero from "../components/home/Hero";
import ServicesSection from "../components/home/ServicesSection";
import WhyChooseUs from "../components/home/WhyChooseUs";
import DoctorsSection from "../components/home/DoctorsSection";
import Testimonials from "../components/home/Testimonials";
import BeforeAfter from "../components/home/BeforeAfter";
import ContactInfo from "../components/home/ContactInfo";

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <WhyChooseUs />
      <DoctorsSection />
      <Testimonials />
      <BeforeAfter />
      <ContactInfo />
    </>
  );
}
