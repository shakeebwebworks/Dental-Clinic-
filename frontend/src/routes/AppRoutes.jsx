import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ProtectedRoute from "../components/common/ProtectedRoute";

// Each page is downloaded only when it is opened, so the first load is fast.
const Home = lazy(() => import("../pages/Home"));
const About = lazy(() => import("../pages/About"));
const Services = lazy(() => import("../pages/Services"));
const Doctors = lazy(() => import("../pages/Doctors"));
const Appointment = lazy(() => import("../pages/Appointment"));
const Contact = lazy(() => import("../pages/Contact"));
const TestimonialsPage = lazy(() => import("../pages/TestimonialsPage"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const MyAppointments = lazy(() => import("../pages/MyAppointments"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Privacy = lazy(() => import("../pages/Privacy"));
const Terms = lazy(() => import("../pages/Terms"));
const ComingSoon = lazy(() => import("../pages/ComingSoon"));

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/testimonials" element={<TestimonialsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-appointments" element={<ProtectedRoute><MyAppointments /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute staffOnly><Dashboard /></ProtectedRoute>} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<ComingSoon title="Page not found" />} />
      </Route>
    </Routes>
  );
}
