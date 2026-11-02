export default function Pager({ page, count, pageSize = 10, onChange }) {
  const pages = Math.max(1, Math.ceil(count / pageSize));
  if (pages <= 1) return null;
  return (
    <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
      <span className="small text-muted">Page {page} of {pages}</span>
      <div className="d-flex gap-2">
        <button type="button" className="btn btn-sm btn-outline-brand" disabled={page <= 1} onClick={() => onChange(page - 1)}>
          Previous
        </button>
        <button type="button" className="btn btn-sm btn-outline-brand" disabled={page >= pages} onClick={() => onChange(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
