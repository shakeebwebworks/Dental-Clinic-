import { Link } from "react-router-dom";
import { CalendarDays, Clock, Stethoscope, User } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Reveal from "../components/ui/Reveal";
import StatusBadge from "../components/ui/StatusBadge";
import DataState from "../components/common/DataState";
import useAuth from "../hooks/useAuth";
import useFetch from "../hooks/useFetch";
import { getMyAppointments } from "../services/appointmentsService";
import { formatDate } from "../utils/format";

export default function MyAppointments() {
  const { user } = useAuth();
  const { data, loading, error, retry } = useFetch(getMyAppointments);

  return (
    <>
      <PageHeader title="My Appointments" subtitle={`Welcome, ${user.first_name || user.username}.`} />
      <section className="section">
        <div className="container">
          <DataState loading={loading} error={error} onRetry={retry}>
            {data && data.length === 0 ? (
              <div className="text-center">
                <p className="text-muted mb-4">
                  You have no appointments yet. Bookings made while you are logged in appear here.
                </p>
                <Link to="/appointment" className="btn btn-brand">Book an appointment</Link>
              </div>
            ) : (
              <div className="row g-4">
                {(data || []).map((a, i) => (
                  <div className="col-md-6" key={a.id}>
                    <Reveal delay={(i % 2) * 80} className="h-100">
                      <div className="card card-soft no-lift p-4 h-100">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <h2 className="h5 mb-1">{a.service_name}</h2>
                            <span className="small text-muted">Ref: {a.reference}</span>
                          </div>
                          <StatusBadge status={a.status} />
                        </div>
                        <ul className="doctor-meta mb-0">
                          <li><CalendarDays size={18} /> {formatDate(a.date)}</li>
                          <li><Clock size={18} /> {a.time}</li>
                          <li><Stethoscope size={18} /> {a.doctor_name || "First available dentist"}</li>
                          <li><User size={18} /> {a.patient_name}</li>
                        </ul>
                      </div>
                    </Reveal>
                  </div>
                ))}
              </div>
            )}
          </DataState>
          <p className="text-center text-muted small mt-5 mb-0">
            Need to change or cancel a booking? Please call us on the number in the footer.
          </p>
        </div>
      </section>
    </>
  );
}
