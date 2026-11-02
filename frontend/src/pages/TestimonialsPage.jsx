import { Quote } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Reveal from "../components/ui/Reveal";
import StarRating from "../components/ui/StarRating";
import DataState from "../components/common/DataState";
import useFetch from "../hooks/useFetch";
import { getAllReviews, getReviewSummary } from "../services/testimonialsService";

const loadReviews = async () => {
  const [reviews, summary] = await Promise.all([getAllReviews(), getReviewSummary()]);
  return { reviews, summary };
};

export default function TestimonialsPage() {
  const { data, loading, error, retry } = useFetch(loadReviews);
  const reviews = data?.reviews || [];
  const summary = data?.summary;

  return (
    <>
      <PageHeader title="Patient Testimonials" subtitle="Real experiences from people who trusted us with their smile." />
      <section className="section">
        <div className="container">
          <DataState loading={loading} error={error} onRetry={retry}>
            {summary && summary.count > 0 && (
              <Reveal>
                <div className="rating-summary">
                  <div className="rating-number">{summary.average.toFixed(1)}</div>
                  <div>
                    <StarRating rating={Math.round(summary.average)} />
                    <div className="text-muted small mt-1">Based on {summary.count} patient reviews</div>
                  </div>
                </div>
              </Reveal>
            )}
            {reviews.length === 0 ? (
              <p className="text-center text-muted">No reviews yet. Check back soon.</p>
            ) : (
              <div className="row g-4">
                {reviews.map((t, i) => (
                  <div className="col-md-6 col-lg-4" key={t.id}>
                    <Reveal delay={(i % 3) * 80} className="h-100">
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
            )}
          </DataState>
        </div>
      </section>
    </>
  );
}
