import { ExternalLink } from "lucide-react";
import DataState from "../common/DataState";
import useFetch from "../../hooks/useFetch";
import { getStats } from "../../services/dashboardService";

const adminBase = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/api\/v1\/?$/, "");

const cards = [
  ["total", "Total appointments"],
  ["pending", "Pending"],
  ["confirmed", "Confirmed"],
  ["cancelled", "Cancelled"],
  ["completed", "Completed"],
  ["today", "Today"],
];

export default function OverviewPanel() {
  const { data, loading, error, retry } = useFetch(getStats);

  return (
    <>
      <DataState loading={loading} error={error} onRetry={retry}>
        <div className="row g-3 mb-5">
          {cards.map(([key, label]) => (
            <div className="col-6 col-md-4 col-lg-2" key={key}>
              <div className="stat-card">
                <div className="num">{data?.[key] ?? 0}</div>
                <div className="lbl">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </DataState>

      <div className="card card-soft no-lift p-4">
        <h2 className="h5">Manage clinic content</h2>
        <p className="text-muted">
          Add, edit or remove doctors (with photos) and services in the Django admin. Changes appear on the website immediately.
        </p>
        <div className="d-flex flex-wrap gap-2">
          <a className="btn btn-brand" href={`${adminBase}/admin/doctors/doctor/`} target="_blank" rel="noopener noreferrer">
            Doctors <ExternalLink size={16} className="ms-1" />
          </a>
          <a className="btn btn-brand" href={`${adminBase}/admin/services/service/`} target="_blank" rel="noopener noreferrer">
            Services <ExternalLink size={16} className="ms-1" />
          </a>
          <a className="btn btn-outline-brand" href={`${adminBase}/admin/`} target="_blank" rel="noopener noreferrer">
            Full admin <ExternalLink size={16} className="ms-1" />
          </a>
        </div>
      </div>
    </>
  );
}
