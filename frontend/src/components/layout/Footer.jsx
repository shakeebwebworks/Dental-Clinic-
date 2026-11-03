import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import { clinic } from "../../data/clinicData";
import useFetch from "../../hooks/useFetch";
import { getServices } from "../../services/servicesService";

export default function Footer() {
  const { data: services } = useFetch(getServices);

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row g-5">
          <div className="col-lg-4">
            <div className="brand brand-light mb-3">
              <span className="brand-mark"><i className="bi bi-heart-pulse-fill" /></span>
              <span className="brand-text">{clinic.name}</span>
            </div>
            <p className="footer-text">{clinic.tagline}. Gentle, modern dentistry for the whole family.</p>
            <div className="social">
              <a href="#" aria-label="Facebook"><i className="bi bi-facebook" /></a>
              <a href="#" aria-label="Instagram"><i className="bi bi-instagram" /></a>
              <a href="#" aria-label="YouTube"><i className="bi bi-youtube" /></a>
            </div>
          </div>

          <div className="col-6 col-lg-2">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-list">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/doctors">Our Doctors</Link></li>
              <li><Link to="/testimonials">Reviews</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="col-6 col-lg-3">
            <h3 className="footer-title">Services</h3>
            <ul className="footer-list">
              {(services || []).slice(0, 5).map((s) => (
                <li key={s.id}><Link to="/services">{s.title}</Link></li>
              ))}
            </ul>
          </div>

          <div className="col-lg-3">
            <h3 className="footer-title">Contact</h3>
            <ul className="footer-list footer-contact">
              <li><MapPin size={18} /> {clinic.address}</li>
              <li><Phone size={18} /> <a href={`tel:${clinic.phoneLink}`}>{clinic.phone}</a></li>
              <li><Mail size={18} /> <a href={`mailto:${clinic.email}`}>{clinic.email}</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} {clinic.name}. All rights reserved.
          <span className="footer-legal">
            <Link to="/privacy">Privacy Policy</Link> · <Link to="/terms">Terms of Use</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
