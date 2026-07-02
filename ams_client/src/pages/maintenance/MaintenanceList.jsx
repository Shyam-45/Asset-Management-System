import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import MainLayout from "../../components/layout/MainLayout";
import { useAuth } from "../../context/AuthContext";

import MaintenanceTable from "../../components/maintenance/MaintenanceTable";

import {
  getMaintenanceRequests,
  approveMaintenanceRequest,
  rejectMaintenanceRequest,
  resolveMaintenanceRequest,
} from "../../api/maintenanceApi";

import ErrorMessage from "../../components/common/ErrorMessage";
import { getErrorMessage } from "../../utils/errorUtils";

function MaintenanceList() {
  const { user } = useAuth();

  const [requests, setRequests] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const urlStatus = searchParams.get("status");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadRequests = async (status) => {
    try {
      setLoading(true);
      setError("");

      const data = await getMaintenanceRequests(status);
      // MANAGER should NOT see their own requests
      const processed =
        user?.role === "MANAGER"
          ? data.filter((r) => r.userId !== user.userId)
          : data;

      setRequests(processed);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    const status =
      urlStatus ||
      (user.role === "EMPLOYEE"
        ? "PENDING,IN_PROGRESS"
        : user.role === "MANAGER"
          ? "PENDING"
          : "IN_PROGRESS");

    setSearchParams({ status });
    loadRequests(status);
  }, [user, urlStatus]);

  const handleFilterChange = (value) => {
    setSearchParams({ status: value });
  };

  const handleApprove = async (id) => {
    try {
      setError("");
      await approveMaintenanceRequest(id);
      loadRequests(urlStatus);
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };

  const handleReject = async (id) => {
    try {
      setError("");
      await rejectMaintenanceRequest(id);
      loadRequests(urlStatus);
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };

  const handleResolve = async (id) => {
    try {
      setError("");
      await resolveMaintenanceRequest(id);
      loadRequests(urlStatus);
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };

  const showActions = user?.role === "MANAGER" || user?.role === "ADMIN";

  const showRequestedBy = user?.role !== "EMPLOYEE";
  const showApprovedBy = user?.role === "ADMIN";
  const showResolvedColumn = user?.role !== "MANAGER";

  return (
    <MainLayout>
      <div className="p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Maintenance Requests
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Review maintenance requests.
            </p>
          </div>
        </div>

        {/* FILTER */}
        <div className="mb-6">
          <select
            disabled={loading}
            value={urlStatus || ""}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm w-64"
          >
            <option value="PENDING,IN_PROGRESS">Active Requests</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="REJECTED">Rejected</option>
            <option value="ALL">All</option>
          </select>
        </div>

        {/* ERROR */}
        {error && <ErrorMessage message={error} />}

        {/* TABLE */}
        <MaintenanceTable
          user={user}
          requests={requests}
          loading={loading}
          error={error}
          showRequestedBy={showRequestedBy}
          showApprovedBy={showApprovedBy}
          showResolvedColumn={showResolvedColumn}
          showActions={showActions}
          onApprove={handleApprove}
          onReject={handleReject}
          onResolve={handleResolve}
        />
      </div>
    </MainLayout>
  );
}

export default MaintenanceList;
