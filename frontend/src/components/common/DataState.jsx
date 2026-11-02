import { AlertCircle, Loader2 } from "lucide-react";

export default function DataState({ loading, error, onRetry, children }) {
  if (loading) {
    return (
      <div className="data-state" role="status">
        <Loader2 className="spin" size={30} />
        <span>Loading...</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="data-state data-error" role="alert">
        <AlertCircle size={30} />
        <p className="mb-0">{error}</p>
        {onRetry && (
          <button type="button" className="btn btn-outline-brand" onClick={onRetry}>
            Try again
          </button>
        )}
      </div>
    );
  }
  return children;
}
