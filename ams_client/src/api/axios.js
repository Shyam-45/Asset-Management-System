import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


// Auto log-out after token expiry

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const isLoginRequest =
      error.config?.url?.includes("/auth/login");

// Logout if uunauthorized action attempted
    // if (error.response?.status === 401 && !isLoginRequest) {
    //   localStorage.removeItem("token");
    //   window.location.href = "/";
    // }

    return Promise.reject(error);
  }
);

export default api;
