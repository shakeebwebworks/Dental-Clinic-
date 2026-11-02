import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Home from "../pages/Home";
import ComingSoon from "../pages/ComingSoon";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<ComingSoon title="About Us" />} />
        <Route path="/services" element={<ComingSoon title="Our Services" />} />
        <Route path="/doctors" element={<ComingSoon title="Our Doctors" />} />
        <Route path="/appointment" element={<ComingSoon title="Book an Appointment" />} />
        <Route path="/contact" element={<ComingSoon title="Contact Us" />} />
        <Route path="/testimonials" element={<ComingSoon title="Patient Testimonials" />} />
        <Route path="*" element={<ComingSoon title="Page not found" />} />
      </Route>
    </Routes>
  );
}
