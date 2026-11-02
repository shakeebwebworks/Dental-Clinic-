import Reveal from "./Reveal";

export default function SectionHeading({ eyebrow, title, subtitle, center = true }) {
  return (
    <Reveal className={`section-heading mb-5 ${center ? "text-center" : ""}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </Reveal>
  );
}
