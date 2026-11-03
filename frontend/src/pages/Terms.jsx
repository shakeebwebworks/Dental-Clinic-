import PageHeader from "../components/ui/PageHeader";
import { clinic } from "../data/clinicData";

export default function Terms() {
  return (
    <>
      <PageHeader title="Terms of Use" subtitle="Simple rules for using this website." />
      <section className="section">
        <div className="container legal-content">
          <div className="alert alert-warning" role="note">
            Demo notice: this is sample text for a demonstration website. Replace it with terms
            reviewed by a qualified professional before real use.
          </div>

          <h2>1. Appointment requests</h2>
          <p>
            Booking through this website is a request, not a guaranteed appointment. Your
            appointment is confirmed only after our team contacts you or the status changes
            to confirmed.
          </p>

          <h2>2. Changes and cancellations</h2>
          <p>
            Please call us as early as possible if you need to change or cancel a booking so
            that the time can be offered to another patient.
          </p>

          <h2>3. General information only</h2>
          <p>
            Information on this website is general and is not medical advice. It does not
            replace an examination by a dentist. In an emergency, call your local emergency
            number.
          </p>

          <h2>4. Your account</h2>
          <p>
            If you create an account, keep your password private. You are responsible for
            activity under your account.
          </p>

          <h2>5. Acceptable use</h2>
          <p>
            Please do not submit false information, attempt to disrupt the website, or try to
            access areas you are not authorised to use.
          </p>

          <h2>6. Contact</h2>
          <p>
            Questions about these terms? Email{" "}
            <a href={`mailto:${clinic.email}`}>{clinic.email}</a>.
          </p>
        </div>
      </section>
    </>
  );
}
