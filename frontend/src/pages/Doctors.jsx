import { Link } from "react-router-dom";
import { GraduationCap, Briefcase, Languages } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Reveal from "../components/ui/Reveal";
import DoctorAvatar from "../components/ui/DoctorAvatar";
import DataState from "../components/common/DataState";
import useFetch from "../hooks/useFetch";
import { getDoctors } from "../services/doctorsService";

export default function Doctors() {
  const { data, loading, error, retry } = useFetch(getDoctors);

  return (
    <>
      <PageHeader title="Our Doctors" subtitle="Highly qualified specialists dedicated to gentle, outstanding care." />
      <section className="section">
        <div className="container">
          <DataState loading={loading} error={error} onRetry={retry}>
            <div className="row g-4">
              {(data || []).map((d, i) => (
                <div className="col-lg-6" key={d.id}>
                  <Reveal delay={(i % 2) * 80} className="h-100">
                    <article className="card card-soft p-4 h-100">
                      <div className="d-flex gap-4 flex-column flex-sm-row">
                        <DoctorAvatar doctor={d} large />
                        <div>
                          <h2 className="h4 mb-1">{d.name}</h2>
                          <div className="doctor-role">{d.role}</div>
                          <p className="text-muted">{d.bio}</p>
                        </div>
                      </div>
                      <ul className="doctor-meta">
                        <li><GraduationCap size={18} /> {d.qualification}</li>
                        <li><Briefcase size={18} /> {d.experience} of experience</li>
                        {d.languages && <li><Languages size={18} /> {d.languages}</li>}
                      </ul>
                      <div className="mb-4">
                        {(d.specialisations || []).map((s) => (
                          <span className="tag" key={s}>{s}</span>
                        ))}
                      </div>
                      <Link to={`/appointment?doctor=${encodeURIComponent(d.name)}`} className="btn btn-brand mt-auto align-self-start">
                        Book with {d.name.split(" ").slice(0, 2).join(" ")}
                      </Link>
                    </article>
                  </Reveal>
                </div>
              ))}
            </div>
          </DataState>
        </div>
      </section>
    </>
  );
}
