const styles = {
  pending: "bg-warning text-dark",
  confirmed: "bg-primary",
  cancelled: "bg-danger",
  completed: "bg-success",
  new: "bg-primary",
  in_progress: "bg-warning text-dark",
  resolved: "bg-success",
};

const labels = { in_progress: "In progress" };

export default function StatusBadge({ status }) {
  const label = labels[status] || status.charAt(0).toUpperCase() + status.slice(1);
  return <span className={`badge rounded-pill ${styles[status] || "bg-secondary"}`}>{label}</span>;
}
