import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AlertCircle, CalendarCheck, CheckCircle2, Clock, Loader2, Phone } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Field from "../components/forms/Field";
import ConsentCheckbox from "../components/forms/ConsentCheckbox";
import DataState from "../components/common/DataState";
import useFetch from "../hooks/useFetch";
import { clinic } from "../data/clinicData";
import { getServices } from "../services/servicesService";
import { getDoctors } from "../services/doctorsService";
import { createAppointment, getAvailability } from "../services/appointmentsService";
import { parseApiError } from "../utils/apiErrors";
import { isEmail, isPhone, isSunday, todayISO } from "../utils/validators";

const emptyForm = { name: "", email: "", phone: "", service: "", doctor: "any", date: "", time: "", message: "", consent: false };

const loadLists = async () => {
  const [services, doctors] = await Promise.all([getServices(), getDoctors()]);
  return { services, doctors };
};

function validate(f) {
  const e = {};
  if (f.name.trim().length < 2) e.name = "Please enter your full name.";
  if (!f.email.trim()) e.email = "Email address is required.";
  else if (!isEmail(f.email)) e.email = "Enter a valid email address.";
  if (!f.phone.trim()) e.phone = "Phone number is required.";
  else if (!isPhone(f.phone)) e.phone = "Enter a valid phone number (10-13 digits).";
  if (!f.service) e.service = "Please select a service.";
  if (!f.date) e.date = "Please choose a date.";
  else if (f.date < todayISO()) e.date = "Date cannot be in the past.";
  else if (isSunday(f.date)) e.date = "The clinic is closed on Sundays. Please pick another day.";
  if (!f.time) e.time = "Please choose a time.";
  if (f.message.length > 500) e.message = "Message must be 500 characters or fewer.";
  if (!f.consent) e.consent = "Please agree to the Privacy Policy to continue.";
  return e;
}

export default function Appointment() {
  const [params] = useSearchParams();
  const lists = useFetch(loadLists);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [slots, setSlots] = useState({ loading: false, list: [], error: "" });
  const [slotsKey, setSlotsKey] = useState(0);

  // Preselect the service / dentist when the page is opened from a "Book" button.
  useEffect(() => {
    if (!lists.data) return;
    const svc = lists.data.services.find((s) => s.title === params.get("service"));
    const doc = lists.data.doctors.find((d) => d.name === params.get("doctor"));
    setForm((prev) => ({
      ...prev,
      service: prev.service || (svc ? String(svc.id) : ""),
      doctor: doc ? String(doc.id) : prev.doctor,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lists.data]);

  // Load the free time slots whenever the date or dentist changes.
  useEffect(() => {
    if (!form.date || form.date < todayISO() || isSunday(form.date)) {
      setSlots({ loading: false, list: [], error: "" });
      return undefined;
    }
    let active = true;
    setSlots({ loading: true, list: [], error: "" });
    getAvailability(form.date, form.doctor === "any" ? null : form.doctor)
      .then((list) => {
        if (!active) return;
        setSlots({ loading: false, list, error: "" });
        setForm((prev) => (prev.time && !list.includes(prev.time) ? { ...prev, time: "" } : prev));
      })
      .catch((err) => {
        if (active) setSlots({ loading: false, list: [], error: err.friendlyMessage });
      });
    return () => {
      active = false;
    };
  }, [form.date, form.doctor, slotsKey]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
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
    setServerError("");
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      focusFirst(found);
      return;
    }

    const payload = {
      patient_name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      service: Number(form.service),
      date: form.date,
      time: form.time,
      message: form.message.trim(),
    };
    if (form.doctor !== "any") payload.doctor = Number(form.doctor);

    setLoading(true);
    try {
      const saved = await createAppointment(payload);
      setResult(saved);
    } catch (err) {
      const parsed = parseApiError(err);
      setErrors(parsed.fieldErrors);
      setServerError(parsed.message);
      focusFirst(parsed.fieldErrors);
      if (parsed.fieldErrors.time) setSlotsKey((k) => k + 1); // refresh the free slots
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setForm(emptyForm);
    setErrors({});
    setServerError("");
    setResult(null);
  };

  if (result) {
    const rows = [
      ["Patient", result.patient_name],
      ["Service", result.service_name],
      ["Dentist", result.doctor_name || "First available dentist"],
      ["Date", result.date],
      ["Time", result.time],
      ["Email", result.email],
      ["Phone", result.phone],
    ];
    return (
      <>
        <PageHeader title="Book an Appointment" />
        <section className="section">
          <div className="container" style={{ maxWidth: 680 }}>
            <div className="card card-soft p-4 p-lg-5 text-center" role="status">
              <CheckCircle2 size={64} className="text-success mx-auto mb-3" />
              <h2 className="h3">Appointment request received</h2>
              <p className="text-muted">Reference number: <strong>{result.reference}</strong></p>
              <p className="text-muted">Our team will contact you shortly to confirm your visit.</p>
              <dl className="summary-list text-start">
                {rows.map(([k, v]) => (
                  <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
                ))}
              </dl>
              <div className="d-flex flex-wrap gap-3 justify-content-center">
                <button className="btn btn-brand" onClick={reset}>Book another</button>
                <Link to="/" className="btn btn-outline-brand">Back to Home</Link>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  const timePlaceholder = !form.date
    ? "Pick a date first"
    : slots.loading
      ? "Loading times..."
      : slots.list.length > 0
        ? "Select a time"
        : "No times available";

  return (
    <>
      <PageHeader title="Book an Appointment" subtitle="Choose a service, dentist and time that suits you." />
      <section className="section">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-8">
              <DataState loading={lists.loading} error={lists.error} onRetry={lists.retry}>
                <form className="card card-soft p-4 p-lg-5 form-card" onSubmit={onSubmit} noValidate>
                  {serverError && (
                    <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
                      <AlertCircle size={20} /> {serverError}
                    </div>
                  )}
                  <div className="row">
                    <div className="col-md-6">
                      <Field label="Full name" name="name" error={errors.name} required>
                        <input type="text" autoComplete="name" {...fieldProps("name")} />
                      </Field>
                    </div>
                    <div className="col-md-6">
                      <Field label="Email address" name="email" error={errors.email} required>
                        <input type="email" autoComplete="email" {...fieldProps("email")} />
                      </Field>
                    </div>
                    <div className="col-md-6">
                      <Field label="Phone number" name="phone" error={errors.phone} required>
                        <input type="tel" autoComplete="tel" {...fieldProps("phone")} />
                      </Field>
                    </div>
                    <div className="col-md-6">
                      <Field label="Dental service" name="service" error={errors.service} required>
                        <select {...fieldProps("service")} className={`form-select ${errors.service ? "is-invalid" : ""}`}>
                          <option value="">Select a service</option>
                          {lists.data?.services.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
                        </select>
                      </Field>
                    </div>
                    <div className="col-12">
                      <Field label="Preferred dentist" name="doctor" error={errors.doctor}>
                        <select {...fieldProps("doctor")} className={`form-select ${errors.doctor ? "is-invalid" : ""}`}>
                          <option value="any">First available dentist</option>
                          {lists.data?.doctors.map((d) => <option key={d.id} value={d.id}>{d.name} ({d.role})</option>)}
                        </select>
                      </Field>
                    </div>
                    <div className="col-md-6">
                      <Field label="Date" name="date" error={errors.date} required>
                        <input type="date" min={todayISO()} {...fieldProps("date")} />
                      </Field>
                    </div>
                    <div className="col-md-6">
                      <Field label="Time" name="time" error={errors.time} required>
                        <select
                          {...fieldProps("time")}
                          className={`form-select ${errors.time ? "is-invalid" : ""}`}
                          disabled={!form.date || slots.loading}
                        >
                          <option value="">{timePlaceholder}</option>
                          {slots.list.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                        {slots.error && <div className="field-error">{slots.error}</div>}
                      </Field>
                    </div>
                    <div className="col-12">
                      <Field label="Additional message" name="message" error={errors.message}>
                        <textarea rows="4" placeholder="Tell us about your concern (optional)" {...fieldProps("message")} />
                      </Field>
                    </div>
                  </div>
                  <ConsentCheckbox checked={form.consent} onChange={onChange} error={errors.consent} />
                  <button type="submit" className="btn btn-brand btn-lg align-self-start" disabled={loading}>
                    {loading ? (<><Loader2 size={20} className="spin me-2" /> Submitting...</>) : (<><CalendarCheck size={20} className="me-2" /> Confirm Appointment</>)}
                  </button>
                </form>
              </DataState>
            </div>

            <aside className="col-lg-4">
              <div className="card card-soft p-4 mb-4">
                <h2 className="h5 d-flex align-items-center gap-2"><Clock size={20} /> Opening hours</h2>
                {clinic.hours.map((h) => (
                  <div key={h.days} className="d-flex justify-content-between small py-1">
                    <span>{h.days}</span><strong>{h.time}</strong>
                  </div>
                ))}
              </div>
              <div className="card card-soft p-4">
                <h2 className="h5 d-flex align-items-center gap-2"><Phone size={20} /> Prefer to call?</h2>
                <p className="text-muted small">We are happy to help you book by phone.</p>
                <a href={`tel:${clinic.phoneLink}`} className="btn btn-outline-brand">{clinic.phone}</a>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
