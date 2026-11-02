import { Link } from "react-router-dom";
import { CalendarCheck, ShieldCheck, Star, Smile } from "lucide-react";
import { clinic } from "../../data/clinicData";

export default function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <span className="eyebrow">Welcome to {clinic.name}</span>
            <h1 className="hero-title">Your healthiest, most confident smile starts here</h1>
            <p className="hero-text">
              Experience advanced, comfortable dentistry in a calm, modern clinic. From routine
              check-ups to complete smile makeovers, our specialists care for every detail.
            </p>
            <div className="d-flex flex-wrap gap-3 mb-5">
              <Link to="/appointment" className="btn btn-brand btn-lg">
                <CalendarCheck size={20} className="me-2" />Book Appointment
              </Link>
              <Link to="/services" className="btn btn-outline-brand btn-lg">Our Services</Link>
            </div>
            <div className="row g-4 hero-stats">
              {clinic.stats.map((s) => (
                <div className="col-4" key={s.label}>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-lg-6">
            <div className="hero-visual">
              <div className="hero-circle">
                <Smile size={150} strokeWidth={1.2} />
              </div>
              <div className="hero-badge badge-top">
                <ShieldCheck size={22} /> <span>Hospital-grade hygiene</span>
              </div>
              <div className="hero-badge badge-bottom">
                <Star size={22} fill="currentColor" /> <span>4.9 patient rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
