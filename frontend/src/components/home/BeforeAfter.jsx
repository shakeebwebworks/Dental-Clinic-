import { useState } from "react";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import { beforeAfterCases } from "../../data/clinicData";

function CompareCard({ item }) {
  const [pos, setPos] = useState(50);
  const bg = (src) => (src ? { backgroundImage: `url(${src})` } : {});

  return (
    <div className="card card-soft p-3 h-100">
      <div className="ba-wrap">
        <div className="ba-layer ba-after" style={bg(item.after)}>
          <span className="ba-label ba-label-right">After</span>
        </div>
        <div
          className="ba-layer ba-before"
          style={{ ...bg(item.before), clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <span className="ba-label">Before</span>
        </div>
        <div className="ba-handle" style={{ left: `${pos}%` }} aria-hidden="true">
          <span><i className="bi bi-arrows-expand-vertical" /></span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          className="ba-range"
          aria-label={`Compare before and after: ${item.title}`}
        />
      </div>
      <h3 className="h6 text-center mt-3 mb-1">{item.title}</h3>
    </div>
  );
}

export default function BeforeAfter() {
  return (
    <section className="section section-tint">
      <div className="container">
        <SectionHeading
          eyebrow="Smile Gallery"
          title="Before & after transformations"
          subtitle="Drag the slider to see the difference."
        />
        <div className="row g-4">
          {beforeAfterCases.map((c, i) => (
            <div className="col-md-4" key={c.title}>
              <Reveal delay={i * 80} className="h-100">
                <CompareCard item={c} />
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
