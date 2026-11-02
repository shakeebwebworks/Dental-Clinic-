import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import DataState from "../common/DataState";
import useFetch from "../../hooks/useFetch";
import { getServices } from "../../services/servicesService";
import { getServiceIcon } from "../../utils/iconMap";

export default function ServicesSection() {
  const { data, loading, error, retry } = useFetch(getServices);

  return (
    <section className="section section-tint">
      <div className="container">
        <SectionHeading
          eyebrow="Our Services"
          title="Complete dental care under one roof"
          subtitle="Advanced treatments delivered with precision, comfort and care."
        />
        <DataState loading={loading} error={error} onRetry={retry}>
          <div className="row g-4">
            {(data || []).map((s, i) => {
              const Icon = getServiceIcon(s.icon);
              return (
                <div className="col-md-6 col-lg-3" key={s.id}>
                  <Reveal delay={i * 60} className="h-100">
                    <div className="card card-soft service-card h-100 p-4">
                      <div className="icon-bubble"><Icon size={28} /></div>
                      <h3 className="h5">{s.title}</h3>
                      <p className="text-muted mb-0">{s.short_description}</p>
                    </div>
                  </Reveal>
                </div>
              );
            })}
          </div>
        </DataState>
        <div className="text-center mt-5">
          <Link to="/services" className="btn btn-brand">
            View all services <ArrowRight size={18} className="ms-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
