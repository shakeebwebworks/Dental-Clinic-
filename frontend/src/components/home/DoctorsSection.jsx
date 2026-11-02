import { Link } from "react-router-dom";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import DoctorAvatar from "../ui/DoctorAvatar";
import DataState from "../common/DataState";
import useFetch from "../../hooks/useFetch";
import { getDoctors } from "../../services/doctorsService";

export default function DoctorsSection({
  eyebrow = "Meet Our Dentists",
  title = "Experienced specialists you can trust",
  subtitle = "Highly qualified doctors dedicated to gentle, outstanding care.",
}) {
  const { data, loading, error, retry } = useFetch(getDoctors);

  return (
    <section className="section section-tint">
      <div className="container">
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
        <DataState loading={loading} error={error} onRetry={retry}>
          <div className="row g-4">
            {(data || []).map((d, i) => (
              <div className="col-sm-6 col-lg-3" key={d.id}>
                <Reveal delay={i * 80} className="h-100">
                  <div className="card card-soft doctor-card h-100 text-center p-4">
                    <DoctorAvatar doctor={d} />
                    <h3 className="h5 mb-1">{d.name}</h3>
                    <div className="doctor-role">{d.role}</div>
                    <p className="small text-muted mb-1">{d.qualification}</p>
                    <p className="small fw-semibold mb-0">{d.experience} experience</p>
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
        </DataState>
        <div className="text-center mt-5">
          <Link to="/doctors" className="btn btn-outline-brand">View all doctors</Link>
        </div>
      </div>
    </section>
  );
}
