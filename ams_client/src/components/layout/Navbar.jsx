import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="h-16 border-b bg-white px-6 flex items-center justify-between shadow-sm">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">
          Asset Management System
        </h1>
        <p className="text-xs text-gray-500">
          {user?.role?.charAt(0) + user?.role?.slice(1).toLowerCase()}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Link
          to="/profile"
          className="px-3 py-2 text-sm font-medium text-gray-700 
             bg-blue-50 hover:bg-blue-100 
             hover:text-gray-900 
             rounded-full border border-gray-300
             shadow-sm transition"
        >
          Profile
        </Link>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
