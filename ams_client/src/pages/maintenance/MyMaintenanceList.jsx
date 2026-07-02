import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import MainLayout from "../../components/layout/MainLayout";
import { useAuth } from "../../context/AuthContext";

import MaintenanceTable from "../../components/maintenance/MaintenanceTable";
import { getMyMaintenanceRequests } from "../../api/maintenanceApi";

function MyMaintenanceList() {
  const { user } = useAuth();

  const [requests, setRequests] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const urlStatus = searchParams.get("status");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const DEFAULT_STATUS = "PENDING,IN_PROGRESS";

  const loadRequests = async (status) => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyMaintenanceRequests(status);
      setRequests(data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    const status = urlStatus || DEFAULT_STATUS;

    if (!urlStatus) {
      setSearchParams({ status });
    }

    loadRequests(status);
  }, [user, urlStatus]);

  const getStatusOptions = (role) => {
    const base = [
      { label: "Active Requests", value: "PENDING,IN_PROGRESS" },
      { label: "In Progress", value: "IN_PROGRESS" },
      { label: "Resolved", value: "RESOLVED" },
      { label: "Rejected", value: "REJECTED" },
      { label: "All", value: "ALL" },
    ];

    if (role === "EMPLOYEE") {
      return [{ label: "Pending", value: "PENDING" }, ...base];
    }

    return base;
  };

  const options = useMemo(() => getStatusOptions(user?.role), [user?.role]);

  const handleFilterChange = (value) => {
    setSearchParams({ status: value });
  };

  return (
    <MainLayout>
      <div className="p-6">
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            My Maintenance
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track your maintenance requests.
          </p>
        </div>

        {/* DROPDOWN */}
        <div className="mb-6">
          <select
            disabled={loading}
            value={urlStatus || ""}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm w-64"
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* TABLE */}
        <MaintenanceTable
          user={user}
          requests={requests}
          loading={loading}
          error={error}
          showRequestedBy={false}
          showApprovedBy={user?.role === "ADMIN"}
          showResolvedColumn={true}
          showActions={false}
        />
      </div>
    </MainLayout>
  );
}

export default MyMaintenanceList;
