import { Link } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import SectionHeading from "../components/ui/SectionHeading";
import Reveal from "../components/ui/Reveal";
import DoctorsSection from "../components/home/DoctorsSection";
import { aboutText, missionVision, facilities } from "../data/pageData";

export default function About() {
  return (
    <>
      <PageHeader title="About Us" subtitle="Gentle, modern dentistry for the whole family." />

      <section className="section">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <Reveal>
                <span className="eyebrow">Our Story</span>
                <h2 className="section-title">A clinic built around your comfort</h2>
                {aboutText.intro.map((p) => (
                  <p key={p} className="text-muted">{p}</p>
                ))}
                <Link to="/appointment" className="btn btn-brand mt-2">Book Appointment</Link>
              </Reveal>
            </div>
            <div className="col-lg-6">
              <Reveal delay={100}>
                <div className="row g-3">
                  {aboutText.stats.map((s) => (
                    <div className="col-6" key={s.label}>
                      <div className="about-stat">
                        <div className="stat-value">{s.value}</div>
                        <div className="stat-label">{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-tint">
        <div className="container">
          <div className="row g-4">
            {missionVision.map((m, i) => {
              const Icon = m.icon;
              return (
                <div className="col-md-6" key={m.title}>
                  <Reveal delay={i * 100} className="h-100">
                    <div className="card card-soft p-4 p-lg-5 h-100">
                      <div className="icon-bubble"><Icon size={28} /></div>
                      <h2 className="h3">{m.title}</h2>
                      <p className="text-muted mb-0">{aboutText[m.key]}</p>
                    </div>
                  </Reveal>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Our Facilities" title="Technology and comfort, together" subtitle="Everything you need for safe, precise and relaxing treatment." />
          <div className="row g-4">
            {facilities.map((f, i) => {
              const Icon = f.icon;
              return (
                <div className="col-md-6 col-lg-4" key={f.title}>
                  <Reveal delay={i * 60} className="h-100">
                    <div className="reason-card h-100">
                      <div className="reason-icon"><Icon size={26} /></div>
                      <div>
                        <h3 className="h5">{f.title}</h3>
                        <p className="text-muted mb-0">{f.text}</p>
                      </div>
                    </div>
                  </Reveal>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <DoctorsSection
        eyebrow="Our Team"
        title="Meet the dental team"
        subtitle="Specialists who combine skill with a genuinely caring approach."
      />
    </>
  );
}
