import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getDefaultRoute } from "../utils/routeUtils";

function PublicRoute() {
  const { loading, user } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return <Navigate to={getDefaultRoute(user.role)} replace />;
  }

  return <Outlet />;
}

export default PublicRoute;
