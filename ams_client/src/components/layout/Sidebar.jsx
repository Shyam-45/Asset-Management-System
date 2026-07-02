import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  const linkClass = (path) =>
    `px-3 py-2 rounded-lg transition ${
      location.pathname.startsWith(path)
        ? "bg-blue-100 text-blue-700 font-medium"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <aside className="w-64 min-h-[calc(100vh-64px)] border-r bg-white p-4">
      <nav className="flex flex-col gap-2">
        {user?.role === "ADMIN" && (
          <>
            <Link to="/departments" className={linkClass("/departments")}>
              Departments
            </Link>

            <Link to="/users" className={linkClass("/users")}>
              Users
            </Link>

            <Link to="/assets" className={linkClass("/assets")}>
              Assets
            </Link>

            <Link to="/assignments" className={linkClass("/assignments")}>
              Assignments
            </Link>

            <Link to="/maintenance" className={linkClass("/maintenance")}>
              Maintenance
            </Link>
          </>
        )}

        {user?.role === "MANAGER" && (
          <>
            <Link to="/users" className={linkClass("/users")}>
              Users
            </Link>

            <Link to="/my-assets" className={linkClass("/my-assets")}>
              My Assets
            </Link>

            <Link to="/maintenance" className={linkClass("/maintenance")}>
              Maintenance
            </Link>

            <Link to="/my-maintenance" className={linkClass("/my-maintenance")}>
              My Maintenance
            </Link>
          </>
        )}

        {user?.role === "EMPLOYEE" && (
          <>
            <Link to="/my-assets" className={linkClass("/my-assets")}>
              My Assets
            </Link>

            {/* <Link to="/maintenance" className={linkClass("/maintenance")}>
              Maintenance
            </Link> */}

            <Link to="/my-maintenance" className={linkClass("/my-maintenance")}>
              My Maintenance
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;
