import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import { reasons } from "../../data/clinicData";

export default function WhyChooseUs() {
  return (
    <section className="section">
      <div className="container">
        <SectionHeading
          eyebrow="Why Choose Us"
          title="Care that feels as good as it looks"
          subtitle="Six reasons thousands of families trust us with their smiles."
        />
        <div className="row g-4">
          {reasons.map((r, i) => {
            const Icon = r.icon;
            return (
              <div className="col-md-6 col-lg-4" key={r.title}>
                <Reveal delay={i * 60} className="h-100">
                  <div className="reason-card h-100">
                    <div className="reason-icon"><Icon size={26} /></div>
                    <div>
                      <h3 className="h5">{r.title}</h3>
                      <p className="text-muted mb-0">{r.text}</p>
                    </div>
                  </div>
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
