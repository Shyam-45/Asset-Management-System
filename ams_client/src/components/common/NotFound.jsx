import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getDefaultRoute } from "../../utils/routeUtils";

function NotFound() {
  const { user } = useAuth();

  const homeRoute = user ? getDefaultRoute(user.role) : "/";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>

      <p className="text-xl mb-6">Page not found</p>

      <Link
        to={homeRoute}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {user ? "Go Home" : "Go to Login"}
      </Link>
    </div>
  );
}

export default NotFound;
