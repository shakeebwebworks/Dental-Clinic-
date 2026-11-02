import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import Reveal from "../ui/Reveal";
import { clinic } from "../../data/clinicData";

export default function ContactInfo() {
  return (
    <section className="section">
      <div className="container">
        <Reveal>
          <div className="cta-panel">
            <div className="row g-5 align-items-center">
              <div className="col-lg-5">
                <h2 className="cta-title">Ready for a brighter smile?</h2>
                <p className="cta-text">Book your visit today. We will confirm your appointment quickly.</p>
                <Link to="/appointment" className="btn btn-light btn-lg fw-semibold">Book Appointment</Link>
              </div>
              <div className="col-lg-7">
                <div className="row g-4">
                  <div className="col-sm-6 contact-item">
                    <MapPin size={22} />
                    <div><strong>Address</strong><p>{clinic.address}</p></div>
                  </div>
                  <div className="col-sm-6 contact-item">
                    <Phone size={22} />
                    <div><strong>Phone</strong><p><a href={`tel:${clinic.phoneLink}`}>{clinic.phone}</a></p></div>
                  </div>
                  <div className="col-sm-6 contact-item">
                    <Mail size={22} />
                    <div><strong>Email</strong><p><a href={`mailto:${clinic.email}`}>{clinic.email}</a></p></div>
                  </div>
                  <div className="col-sm-6 contact-item">
                    <Clock size={22} />
                    <div>
                      <strong>Opening hours</strong>
                      {clinic.hours.map((h) => (
                        <p key={h.days} className="mb-1">{h.days}: {h.time}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
