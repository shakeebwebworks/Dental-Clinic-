import { Quote } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import StarRating from "../ui/StarRating";
import DataState from "../common/DataState";
import useFetch from "../../hooks/useFetch";
import { getFeaturedReviews } from "../../services/testimonialsService";

export default function Testimonials() {
  const { data, loading, error, retry } = useFetch(getFeaturedReviews);

  // Nothing to show: hide the whole section (mark reviews as "featured" in the admin).
  if (!loading && !error && data && data.length === 0) return null;

  return (
    <section className="section">
      <div className="container">
        <SectionHeading
          eyebrow="Patient Stories"
          title="Loved by our patients"
          subtitle="Real experiences from people who trusted us with their smile."
        />
        <DataState loading={loading} error={error} onRetry={retry}>
          <div className="row g-4">
            {(data || []).map((t, i) => (
              <div className="col-lg-4" key={t.id}>
                <Reveal delay={i * 80} className="h-100">
                  <figure className="card card-soft testimonial-card h-100 p-4 mb-0">
                    <Quote size={34} className="quote-icon" />
                    <StarRating rating={t.rating} />
                    <blockquote className="mt-3 mb-4">{t.text}</blockquote>
                    <figcaption>
                      <strong>{t.name}</strong>
                      <div className="small text-muted">{t.treatment}</div>
                    </figcaption>
                  </figure>
                </Reveal>
              </div>
            ))}
          </div>
        </DataState>
      </div>
    </section>
  );
}
