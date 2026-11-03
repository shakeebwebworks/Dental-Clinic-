import PageHeader from "../components/ui/PageHeader";
import { clinic } from "../data/clinicData";

export default function Privacy() {
  return (
    <>
      <PageHeader title="Privacy Policy" subtitle="How we handle your personal information." />
      <section className="section">
        <div className="container legal-content">
          <div className="alert alert-warning" role="note">
            Demo notice: this is sample text for a demonstration website. Replace it with a
            policy reviewed by a qualified professional before real use.
          </div>

          <h2>1. Information we collect</h2>
          <p>
            When you book an appointment or contact us, we collect your name, email address,
            phone number, the service you want, your preferred date and time, and any message
            you choose to write. If you create an account, we also store your username.
          </p>

          <h2>2. How we use it</h2>
          <ul>
            <li>To schedule, confirm and manage your appointments.</li>
            <li>To reply to your questions and enquiries.</li>
            <li>To keep our services secure and working properly.</li>
          </ul>

          <h2>3. Sharing</h2>
          <p>
            We do not sell your information. It is seen only by clinic staff who need it to
            help you, and by the technical providers that host this website.
          </p>

          <h2>4. Please avoid sensitive details</h2>
          <p>
            The message boxes on this website are not meant for detailed medical history.
            Please share health details only during your visit or by phone.
          </p>

          <h2>5. Keeping and deleting data</h2>
          <p>
            We keep your information only as long as needed for the purposes above. You can
            ask us to correct or delete it at any time.
          </p>

          <h2>6. Contact</h2>
          <p>
            Questions about your information? Email{" "}
            <a href={`mailto:${clinic.email}`}>{clinic.email}</a> or call{" "}
            <a href={`tel:${clinic.phoneLink}`}>{clinic.phone}</a>.
          </p>
        </div>
      </section>
    </>
  );
}
