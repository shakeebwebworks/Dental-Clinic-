import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import DataState from "../common/DataState";
import Pager from "../ui/Pager";
import StatusBadge from "../ui/StatusBadge";
import useDebouncedValue from "../../hooks/useDebouncedValue";
import useList from "../../hooks/useList";
import { deleteEnquiry, listEnquiries, updateEnquiry } from "../../services/dashboardService";
import { formatDateTime } from "../../utils/format";
import { parseApiError } from "../../utils/apiErrors";

const STATUS_OPTIONS = [["new", "New"], ["in_progress", "In progress"], ["resolved", "Resolved"]];

export default function EnquiriesPanel() {
  const [searchInput, setSearchInput] = useState("");
  const search = useDebouncedValue(searchInput);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState(null);
  const [notice, setNotice] = useState("");

  const { data, loading, error, status: errorStatus, refresh } = useList(listEnquiries, { page, search, status });

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    if (errorStatus === 404 && page > 1) setPage(1);
  }, [errorStatus, page]);

  const changeStatus = async (enquiry, next) => {
    setNotice("");
    setBusyId(enquiry.id);
    try {
      await updateEnquiry(enquiry.id, { status: next });
      refresh();
    } catch (err) {
      setNotice(parseApiError(err).message);
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (enquiry) => {
    if (!window.confirm(`Delete the enquiry "${enquiry.subject}"? This cannot be undone.`)) return;
    setNotice("");
    setBusyId(enquiry.id);
    try {
      await deleteEnquiry(enquiry.id);
      refresh();
    } catch (err) {
      setNotice(parseApiError(err).message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <div className="filter-bar">
        <input type="search" className="form-control" placeholder="Search enquiries" aria-label="Search enquiries"
          value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
        <select className="form-select" aria-label="Filter by status" value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>

      {notice && <div className="alert alert-danger" role="alert">{notice}</div>}

      <DataState loading={loading && !data} error={error} onRetry={refresh}>
        {data && (
          <div className={loading ? "loading-bar" : ""}>
            <p className="small text-muted">{data.count} enquiry(ies)</p>
            {data.results.length === 0 && <p className="text-center text-muted py-5">No enquiries found.</p>}
            {data.results.map((e) => (
              <div className="card card-soft no-lift p-4 mb-3" key={e.id}>
                <div className="d-flex flex-wrap justify-content-between gap-2">
                  <div>
                    <h3 className="h6 mb-1">{e.subject}</h3>
                    <div className="small text-muted">
                      {e.name} · <a href={`mailto:${e.email}`}>{e.email}</a>
                      {e.phone && <> · <a href={`tel:${e.phone}`}>{e.phone}</a></>} · {formatDateTime(e.created_at)}
                    </div>
                  </div>
                  <StatusBadge status={e.status} />
                </div>
                <p className="mt-3 mb-3 pre-wrap">{e.message}</p>
                <div className="d-flex flex-wrap gap-2 align-items-center">
                  <select className="form-select form-select-sm w-auto" aria-label="Change status" value={e.status}
                    disabled={busyId === e.id} onChange={(ev) => changeStatus(e, ev.target.value)}>
                    {STATUS_OPTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                  <button type="button" className="btn btn-sm rounded-pill btn-outline-danger"
                    disabled={busyId === e.id} onClick={() => remove(e)}>
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
            <Pager page={page} count={data.count} onChange={setPage} />
          </div>
        )}
      </DataState>
    </>
  );
}
