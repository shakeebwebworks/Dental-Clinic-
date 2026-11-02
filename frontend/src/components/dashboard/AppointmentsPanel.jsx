import { useEffect, useState } from "react";
import { Check, CheckCheck, RotateCcw, Trash2, X } from "lucide-react";
import DataState from "../common/DataState";
import Pager from "../ui/Pager";
import StatusBadge from "../ui/StatusBadge";
import useDebouncedValue from "../../hooks/useDebouncedValue";
import useList from "../../hooks/useList";
import { deleteAppointment, listAppointments, updateAppointment } from "../../services/dashboardService";
import { formatDate } from "../../utils/format";
import { parseApiError } from "../../utils/apiErrors";

const STATUS_OPTIONS = [
  ["", "All statuses"], ["pending", "Pending"], ["confirmed", "Confirmed"],
  ["cancelled", "Cancelled"], ["completed", "Completed"],
];
const SORT_OPTIONS = [
  ["-created_at", "Newest bookings"],
  ["date,time", "Appointment date (soonest)"],
  ["-date,-time", "Appointment date (latest)"],
];
const NEXT_ACTIONS = {
  pending: [["confirmed", "Confirm", "btn-success", Check], ["cancelled", "Cancel", "btn-outline-danger", X]],
  confirmed: [["completed", "Complete", "btn-primary", CheckCheck], ["cancelled", "Cancel", "btn-outline-danger", X]],
  cancelled: [["pending", "Reopen", "btn-outline-secondary", RotateCcw]],
  completed: [],
};

export default function AppointmentsPanel() {
  const [searchInput, setSearchInput] = useState("");
  const search = useDebouncedValue(searchInput);
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const [ordering, setOrdering] = useState("-created_at");
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState(null);
  const [notice, setNotice] = useState("");

  const { data, loading, error, status: errorStatus, refresh } = useList(listAppointments, {
    page, search, status, date, ordering,
  });

  useEffect(() => {
    setPage(1);
  }, [search]);

  // A deleted last row can leave us on an empty page: go back to page 1.
  useEffect(() => {
    if (errorStatus === 404 && page > 1) setPage(1);
  }, [errorStatus, page]);

  const changeStatus = async (appointment, next) => {
    setNotice("");
    setBusyId(appointment.id);
    try {
      await updateAppointment(appointment.id, { status: next });
      refresh();
    } catch (err) {
      const parsed = parseApiError(err);
      setNotice(Object.values(parsed.fieldErrors)[0] || parsed.message);
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (appointment) => {
    if (!window.confirm(`Delete appointment ${appointment.reference} for ${appointment.patient_name}? This cannot be undone.`)) return;
    setNotice("");
    setBusyId(appointment.id);
    try {
      await deleteAppointment(appointment.id);
      refresh();
    } catch (err) {
      setNotice(parseApiError(err).message);
    } finally {
      setBusyId(null);
    }
  };

  const clearFilters = () => {
    setSearchInput("");
    setStatus("");
    setDate("");
    setOrdering("-created_at");
    setPage(1);
  };

  return (
    <>
      <div className="filter-bar">
        <input
          type="search" className="form-control" placeholder="Search name, email, phone, ref"
          aria-label="Search appointments" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
        />
        <select className="form-select" aria-label="Filter by status" value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          {STATUS_OPTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <input type="date" className="form-control" aria-label="Filter by date" value={date}
          onChange={(e) => { setDate(e.target.value); setPage(1); }} />
        <select className="form-select" aria-label="Sort" value={ordering}
          onChange={(e) => { setOrdering(e.target.value); setPage(1); }}>
          {SORT_OPTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <button type="button" className="btn btn-outline-brand btn-sm" onClick={clearFilters}>Clear</button>
      </div>

      {notice && <div className="alert alert-danger" role="alert">{notice}</div>}

      <DataState loading={loading && !data} error={error} onRetry={refresh}>
        {data && (
          <div className={loading ? "loading-bar" : ""}>
            <p className="small text-muted">{data.count} appointment(s)</p>
            {data.results.length === 0 ? (
              <p className="text-center text-muted py-5">No appointments match your filters.</p>
            ) : (
              <div className="table-responsive data-table">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Ref</th><th>Patient</th><th>Service / Dentist</th>
                      <th>When</th><th>Status</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.results.map((a) => (
                      <tr key={a.id}>
                        <td className="small fw-semibold">{a.reference}</td>
                        <td>
                          <div className="fw-semibold">{a.patient_name}</div>
                          <div className="small text-muted">{a.email}</div>
                          <div className="small text-muted">{a.phone}</div>
                          {a.message && <div className="small fst-italic msg-clip" title={a.message}>{a.message}</div>}
                        </td>
                        <td>
                          <div>{a.service_name}</div>
                          <div className="small text-muted">{a.doctor_name || "First available"}</div>
                        </td>
                        <td className="text-nowrap">
                          <div>{formatDate(a.date)}</div>
                          <div className="small text-muted">{a.time}</div>
                        </td>
                        <td><StatusBadge status={a.status} /></td>
                        <td>
                          <div className="row-actions">
                            {NEXT_ACTIONS[a.status].map(([to, label, cls, Icon]) => (
                              <button key={to} type="button" className={`btn btn-sm rounded-pill ${cls}`}
                                disabled={busyId === a.id} onClick={() => changeStatus(a, to)}>
                                <Icon size={14} /> {label}
                              </button>
                            ))}
                            <button type="button" className="btn btn-sm rounded-pill btn-outline-danger"
                              disabled={busyId === a.id} onClick={() => remove(a)} aria-label={`Delete ${a.reference}`}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <Pager page={page} count={data.count} onChange={setPage} />
          </div>
        )}
      </DataState>
    </>
  );
}
