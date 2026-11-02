import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { clinic } from "../../data/clinicData";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/doctors", label: "Doctors" },
  { to: "/testimonials", label: "Reviews" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className={`site-nav ${scrolled || open ? "scrolled" : ""}`}>
      <div className="container nav-inner">
        <Link to="/" className="brand" aria-label={`${clinic.name} home`}>
          <span className="brand-mark"><i className="bi bi-heart-pulse-fill" /></span>
          <span className="brand-text">{clinic.name}</span>
        </Link>

        <button
          className="nav-toggle"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>

        <nav className={`nav-menu ${open ? "open" : ""}`} aria-label="Main navigation">
          <ul className="nav-links">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.to === "/"} className="nav-link-item">
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <a href={`tel:${clinic.phoneLink}`} className="nav-phone">
            <Phone size={16} /> {clinic.phone}
          </a>
          <Link to="/appointment" className="btn btn-brand">Book Appointment</Link>
        </nav>
      </div>
    </header>
  );
}
