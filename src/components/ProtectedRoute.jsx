import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = window.localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children || <Outlet />;
}

export default ProtectedRoute;