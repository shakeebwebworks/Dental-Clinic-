import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import DataState from "./DataState";

export default function ProtectedRoute({ staffOnly = false, children }) {
  const { user, ready } = useAuth();
  const location = useLocation();

  if (!ready) {
    return (
      <div className="page-offset">
        <DataState loading>{null}</DataState>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (staffOnly && !user.is_staff) return <Navigate to="/my-appointments" replace />;
  return children;
}
