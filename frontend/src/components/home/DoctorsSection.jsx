import { Link } from "react-router-dom";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import { doctors } from "../../data/clinicData";

const initials = (name) =>
  name.replace("Dr. ", "").split(" ").map((p) => p[0]).join("");

export default function DoctorsSection() {
  return (
    <section className="section section-tint">
      <div className="container">
        <SectionHeading
          eyebrow="Meet Our Dentists"
          title="Experienced specialists you can trust"
          subtitle="Highly qualified doctors dedicated to gentle, outstanding care."
        />
        <div className="row g-4">
          {doctors.map((d, i) => (
            <div className="col-sm-6 col-lg-3" key={d.name}>
              <Reveal delay={i * 80} className="h-100">
                <div className="card card-soft doctor-card h-100 text-center p-4">
                  <div className="doctor-avatar">{initials(d.name)}</div>
                  <h3 className="h5 mb-1">{d.name}</h3>
                  <div className="doctor-role">{d.role}</div>
                  <p className="small text-muted mb-1">{d.qualification}</p>
                  <p className="small fw-semibold mb-0">{d.experience} experience</p>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
        <div className="text-center mt-5">
          <Link to="/doctors" className="btn btn-outline-brand">View all doctors</Link>
        </div>
      </div>
    </section>
  );
}
