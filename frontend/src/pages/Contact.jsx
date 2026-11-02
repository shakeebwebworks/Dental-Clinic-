import { useState } from "react";
import { AlertCircle, CheckCircle2, Clock, Loader2, Mail, MapPin, Phone, Send } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Field from "../components/forms/Field";
import { clinic } from "../data/clinicData";
import { createEnquiry } from "../services/contactService";
import { parseApiError } from "../utils/apiErrors";
import { isEmail, isPhone } from "../utils/validators";

const emptyForm = { name: "", email: "", phone: "", subject: "", message: "" };

function validate(f) {
  const e = {};
  if (f.name.trim().length < 2) e.name = "Please enter your name.";
  if (!f.email.trim()) e.email = "Email address is required.";
  else if (!isEmail(f.email)) e.email = "Enter a valid email address.";
  if (f.phone.trim() && !isPhone(f.phone)) e.phone = "Enter a valid phone number (10-13 digits).";
  if (f.subject.trim().length < 3) e.subject = "Please add a short subject.";
  if (f.message.trim().length < 10) e.message = "Message must be at least 10 characters.";
  else if (f.message.length > 1000) e.message = "Message must be 1000 characters or fewer.";
  return e;
}

export default function Contact() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const fieldProps = (name) => ({
    id: name,
    name,
    value: form[name],
    onChange,
    className: `form-control ${errors[name] ? "is-invalid" : ""}`,
    "aria-invalid": errors[name] ? "true" : "false",
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  const focusFirst = (found) => {
    const first = Object.keys(found)[0];
    if (first) document.getElementById(first)?.focus();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSent(false);
    setServerError("");
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      focusFirst(found);
      return;
    }

    setLoading(true);
    try {
      await createEnquiry({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
        kind: "general",
      });
      setSent(true);
      setForm(emptyForm);
    } catch (err) {
      const parsed = parseApiError(err);
      setErrors(parsed.fieldErrors);
      setServerError(parsed.message);
      focusFirst(parsed.fieldErrors);
    } finally {
      setLoading(false);
    }
  };

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(clinic.address)}&output=embed`;

  return (
    <>
      <PageHeader title="Contact Us" subtitle="Questions or feedback? We would love to hear from you." />
      <section className="section">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-7">
              <form className="card card-soft p-4 p-lg-5 form-card" onSubmit={onSubmit} noValidate>
                <h2 className="h4 mb-4">Send us a message</h2>
                {sent && (
                  <div className="alert alert-success d-flex align-items-center gap-2" role="status">
                    <CheckCircle2 size={20} /> Thank you! Your message has been sent. We will reply soon.
                  </div>
                )}
                {serverError && (
                  <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
                    <AlertCircle size={20} /> {serverError}
                  </div>
                )}
                <div className="row">
                  <div className="col-md-6">
                    <Field label="Your name" name="name" error={errors.name} required>
                      <input type="text" autoComplete="name" {...fieldProps("name")} />
                    </Field>
                  </div>
                  <div className="col-md-6">
                    <Field label="Email address" name="email" error={errors.email} required>
                      <input type="email" autoComplete="email" {...fieldProps("email")} />
                    </Field>
                  </div>
                  <div className="col-md-6">
                    <Field label="Phone (optional)" name="phone" error={errors.phone}>
                      <input type="tel" autoComplete="tel" {...fieldProps("phone")} />
                    </Field>
                  </div>
                  <div className="col-md-6">
                    <Field label="Subject" name="subject" error={errors.subject} required>
                      <input type="text" {...fieldProps("subject")} />
                    </Field>
                  </div>
                  <div className="col-12">
                    <Field label="Message" name="message" error={errors.message} required>
                      <textarea rows="5" {...fieldProps("message")} />
                    </Field>
                  </div>
                </div>
                <button type="submit" className="btn btn-brand btn-lg align-self-start" disabled={loading}>
                  {loading ? (<><Loader2 size={20} className="spin me-2" /> Sending...</>) : (<><Send size={20} className="me-2" /> Send Message</>)}
                </button>
              </form>
            </div>

            <aside className="col-lg-5">
              <div className="card card-soft p-4 mb-4">
                <ul className="contact-list">
                  <li><MapPin size={22} /><div><strong>Address</strong><p>{clinic.address}</p></div></li>
                  <li><Phone size={22} /><div><strong>Phone</strong><p><a href={`tel:${clinic.phoneLink}`}>{clinic.phone}</a></p></div></li>
                  <li><Mail size={22} /><div><strong>Email</strong><p><a href={`mailto:${clinic.email}`}>{clinic.email}</a></p></div></li>
                  <li>
                    <Clock size={22} />
                    <div>
                      <strong>Opening hours</strong>
                      {clinic.hours.map((h) => <p key={h.days} className="mb-1">{h.days}: {h.time}</p>)}
                    </div>
                  </li>
                </ul>
              </div>
            </aside>
          </div>

          <div className="map-frame mt-4">
            <iframe title="Clinic location on Google Maps" src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          </div>
        </div>
      </section>
    </>
  );
}
