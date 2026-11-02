import { Link } from "react-router-dom";
import { CheckCircle2, Clock, ArrowRight } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Reveal from "../components/ui/Reveal";
import DataState from "../components/common/DataState";
import useFetch from "../hooks/useFetch";
import { getServices } from "../services/servicesService";
import { getServiceIcon } from "../utils/iconMap";

export default function Services() {
  const { data, loading, error, retry } = useFetch(getServices);

  return (
    <>
      <PageHeader title="Our Services" subtitle="Advanced treatments delivered with precision, comfort and care." />
      <section className="section">
        <div className="container">
          <DataState loading={loading} error={error} onRetry={retry}>
            <div className="row g-4">
              {(data || []).map((s, i) => {
                const Icon = getServiceIcon(s.icon);
                return (
                  <div className="col-lg-6" key={s.id} id={s.slug}>
                    <Reveal delay={(i % 2) * 80} className="h-100">
                      <div className="card card-soft p-4 p-lg-5 h-100">
                        <div className="d-flex align-items-center gap-3 mb-3">
                          <div className="icon-bubble mb-0"><Icon size={28} /></div>
                          <div>
                            <h2 className="h4 mb-1">{s.title}</h2>
                            {s.duration && (
                              <span className="small text-muted d-inline-flex align-items-center gap-1">
                                <Clock size={14} /> {s.duration}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-muted">{s.description || s.short_description}</p>
                        <ul className="check-list">
                          {(s.benefits || []).map((b) => (
                            <li key={b}><CheckCircle2 size={18} /> {b}</li>
                          ))}
                        </ul>
                        <Link to={`/appointment?service=${encodeURIComponent(s.title)}`} className="btn btn-brand mt-auto align-self-start">
                          Book this treatment <ArrowRight size={18} className="ms-2" />
                        </Link>
                      </div>
                    </Reveal>
                  </div>
                );
              })}
            </div>
          </DataState>
        </div>
      </section>
    </>
  );
}
