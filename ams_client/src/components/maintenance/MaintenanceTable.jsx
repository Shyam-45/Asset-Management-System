import Loader from "../common/Loader";
import ErrorMessage from "../common/ErrorMessage";

function MaintenanceTable({
  user,
  requests,
  loading,
  error,
  showRequestedBy,
  showApprovedBy,
  showResolvedColumn,
  showActions,
  onApprove,
  onReject,
  onResolve,
}) {
  const formatDateTime = (dateTime) => {
    if (!dateTime) return "-";

    return new Date(dateTime).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";

      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";

      case "RESOLVED":
        return "bg-green-100 text-green-800";

      case "REJECTED":
        return "bg-red-100 text-red-800";

      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (requests.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-10 text-center text-gray-500">
        No maintenance requests found.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Asset Code
            </th>

            {showRequestedBy && (
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Requested By
              </th>
            )}

            {showApprovedBy && (
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Approved By
              </th>
            )}

            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Description
            </th>

            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Status
            </th>

            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Processed At
            </th>

            {showResolvedColumn && (
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Resolved At
              </th>
            )}

            {showActions && (
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Actions
              </th>
            )}
          </tr>
        </thead>

        <tbody>
          {requests.map((request) => {
            const canApprove =
              showActions &&
              user?.role === "MANAGER" &&
              request.status === "PENDING";

            const canResolve =
              showActions &&
              user?.role === "ADMIN" &&
              request.status === "IN_PROGRESS";

            return (
              <tr key={request.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{request.assetCode}</td>

                {showRequestedBy && (
                  <td className="px-4 py-3">{request.username}</td>
                )}

                {showApprovedBy && (
                  <td className="px-4 py-3">
                    {request.approvedByUsername || "-"}
                  </td>
                )}

                <td className="px-4 py-3 max-w-md truncate">
                  {request.description}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(
                      request.status,
                    )}`}
                  >
                    {request.status}
                  </span>
                </td>

                <td className="px-4 py-3">
                  {request.status !== "PENDING"
                    ? formatDateTime(request.approvedAt)
                    : "-"}
                </td>

                {showResolvedColumn && (
                  <td className="px-4 py-3">
                    {request.status === "RESOLVED"
                      ? formatDateTime(request.resolvedAt)
                      : "-"}
                  </td>
                )}

                {showActions && (
                  <td className="px-4 py-3">
                    {canApprove ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => onApprove(request.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg transition"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => onReject(request.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition"
                        >
                          Reject
                        </button>
                      </div>
                    ) : canResolve ? (
                      <button
                        onClick={() => onResolve(request.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition"
                      >
                        Resolve
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default MaintenanceTable;
