import { useEffect, useState } from "react";
import { Check, EyeOff, Star, Trash2 } from "lucide-react";
import DataState from "../common/DataState";
import Pager from "../ui/Pager";
import StarRating from "../ui/StarRating";
import useDebouncedValue from "../../hooks/useDebouncedValue";
import useList from "../../hooks/useList";
import { deleteReview, listReviews, updateReview } from "../../services/dashboardService";
import { formatDateTime } from "../../utils/format";
import { parseApiError } from "../../utils/apiErrors";

export default function ReviewsPanel() {
  const [searchInput, setSearchInput] = useState("");
  const search = useDebouncedValue(searchInput);
  const [approved, setApproved] = useState("");
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState(null);
  const [notice, setNotice] = useState("");

  const { data, loading, error, status: errorStatus, refresh } = useList(listReviews, {
    page, search, is_approved: approved,
  });

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    if (errorStatus === 404 && page > 1) setPage(1);
  }, [errorStatus, page]);

  const patch = async (review, changes) => {
    setNotice("");
    setBusyId(review.id);
    try {
      await updateReview(review.id, changes);
      refresh();
    } catch (err) {
      setNotice(parseApiError(err).message);
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (review) => {
    if (!window.confirm(`Delete the review by ${review.name}? This cannot be undone.`)) return;
    setNotice("");
    setBusyId(review.id);
    try {
      await deleteReview(review.id);
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
        <input type="search" className="form-control" placeholder="Search reviews" aria-label="Search reviews"
          value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
        <select className="form-select" aria-label="Filter by approval" value={approved}
          onChange={(e) => { setApproved(e.target.value); setPage(1); }}>
          <option value="">All reviews</option>
          <option value="false">Awaiting approval</option>
          <option value="true">Approved</option>
        </select>
      </div>

      {notice && <div className="alert alert-danger" role="alert">{notice}</div>}

      <DataState loading={loading && !data} error={error} onRetry={refresh}>
        {data && (
          <div className={loading ? "loading-bar" : ""}>
            <p className="small text-muted">{data.count} review(s)</p>
            {data.results.length === 0 && <p className="text-center text-muted py-5">No reviews found.</p>}
            {data.results.map((r) => (
              <div className="card card-soft no-lift p-4 mb-3" key={r.id}>
                <div className="d-flex flex-wrap justify-content-between gap-2">
                  <div>
                    <StarRating rating={r.rating} />
                    <div className="mt-2">
                      <strong>{r.name}</strong>
                      {r.treatment && <span className="text-muted"> · {r.treatment}</span>}
                    </div>
                    <div className="small text-muted">{formatDateTime(r.created_at)}</div>
                  </div>
                  <div className="d-flex gap-2 align-items-start">
                    <span className={`badge rounded-pill ${r.is_approved ? "bg-success" : "bg-warning text-dark"}`}>
                      {r.is_approved ? "Approved" : "Awaiting approval"}
                    </span>
                    {r.is_featured && <span className="badge rounded-pill bg-primary">Featured</span>}
                  </div>
                </div>
                <p className="mt-3 mb-3 pre-wrap">{r.text}</p>
                <div className="d-flex flex-wrap gap-2">
                  {r.is_approved ? (
                    <button type="button" className="btn btn-sm rounded-pill btn-outline-secondary"
                      disabled={busyId === r.id} onClick={() => patch(r, { is_approved: false })}>
                      <EyeOff size={14} /> Hide
                    </button>
                  ) : (
                    <button type="button" className="btn btn-sm rounded-pill btn-success"
                      disabled={busyId === r.id} onClick={() => patch(r, { is_approved: true })}>
                      <Check size={14} /> Approve
                    </button>
                  )}
                  <button type="button" className="btn btn-sm rounded-pill btn-outline-primary"
                    disabled={busyId === r.id} onClick={() => patch(r, { is_featured: !r.is_featured })}>
                    <Star size={14} /> {r.is_featured ? "Unfeature" : "Feature on home"}
                  </button>
                  <button type="button" className="btn btn-sm rounded-pill btn-outline-danger"
                    disabled={busyId === r.id} onClick={() => remove(r)}>
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
