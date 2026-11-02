import { Quote } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import StarRating from "../ui/StarRating";
import { testimonials } from "../../data/clinicData";

export default function Testimonials() {
  return (
    <section className="section">
      <div className="container">
        <SectionHeading
          eyebrow="Patient Stories"
          title="Loved by our patients"
          subtitle="Real experiences from people who trusted us with their smile."
        />
        <div className="row g-4">
          {testimonials.map((t, i) => (
            <div className="col-lg-4" key={t.name}>
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
      </div>
    </section>
  );
}
