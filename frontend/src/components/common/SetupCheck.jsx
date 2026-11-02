import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { getHealth } from "../../services/healthService";

export default function SetupCheck() {
  const [state, setState] = useState({ loading: true, data: null, error: null });

  useEffect(() => {
    getHealth()
      .then((data) => setState({ loading: false, data, error: null }))
      .catch((err) =>
        setState({ loading: false, data: null, error: err.friendlyMessage })
      );
  }, []);

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ background: "var(--color-light-blue)" }}
    >
      <div className="card card-soft p-5 text-center" style={{ maxWidth: 480 }}>
        <h1 className="h3 mb-2">Dental Clinic Setup</h1>
        <p className="text-secondary mb-4">Phase 1 – connection check</p>

        {state.loading && (
          <div className="d-flex justify-content-center align-items-center gap-2">
            <Loader2 className="spin" size={22} /> Checking API…
          </div>
        )}

        {state.data && (
          <div className="text-success d-flex flex-column align-items-center gap-2">
            <CheckCircle2 size={40} />
            <strong>Frontend ↔ Backend ↔ PostgreSQL connected</strong>
            <small className="text-secondary">
              API: {state.data.status} · Database: {state.data.database}
            </small>
          </div>
        )}

        {state.error && (
          <div className="text-danger d-flex flex-column align-items-center gap-2">
            <XCircle size={40} />
            <strong>Could not reach the API</strong>
            <small>{state.error}</small>
          </div>
        )}
      </div>
    </div>
  );
}
