import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { login as loginApi } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { getDefaultRoute } from "../../utils/routeUtils";
import { getErrorMessage } from "../../utils/errorUtils";
import ErrorMessage from "../../components/common/ErrorMessage";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const response = await loginApi({
        username,
        password,
      });

      login(response.token);
      const decoded = jwtDecode(response.token);
      navigate(getDefaultRoute(decoded.role));
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-96 p-6 border rounded-lg shadow"
      >
        <h1 className="text-2xl font-bold mb-6">AMS Login</h1>

        {error && <ErrorMessage message={error} />}

        <input
          type="text"
          placeholder="Username"
          value={username}
          disabled={submitting}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border p-2 mb-4"
          required
        />

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            disabled={submitting}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 pr-10"
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-500 text-white p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
