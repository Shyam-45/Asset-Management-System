import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import MainLayout from "../../components/layout/MainLayout";

import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

import { getAssignmentById } from "../../api/assignmentApi";
import { getErrorMessage } from "../../utils/errorUtils";

import { formatDateTime } from "../../utils/dateUtils";

function MyAssetDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [assignment, setAssignment] = useState(
    location.state?.assignment || null,
  );

  const [loading, setLoading] = useState(!location.state?.assignment);

  const [error, setError] = useState("");

  useEffect(() => {
    if (assignment) {
      return;
    }

    loadAssignment();
  }, []);

  const loadAssignment = async () => {
    try {
      setError("");

      const data = await getAssignmentById(id);

      setAssignment(data);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <Loader />
      </MainLayout>
    );
  }

  if (error && !assignment) {
    return (
      <MainLayout>
        <ErrorMessage message={error} />
      </MainLayout>
    );
  }

  if (!assignment) {
    return (
      <MainLayout>
        <ErrorMessage message="Asset not found" />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Asset Details</h1>
          <p className="text-gray-500 mt-1">
            Information about your assigned asset.
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="grid md:grid-cols-2 gap-6 p-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Asset Code</p>
              <p className="font-semibold text-gray-900">
                {assignment.assetCode}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Assigned User</p>
              <p className="font-semibold text-gray-900">
                {assignment.username}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Status</p>

              <span
                className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  assignment.status === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {assignment.status}
              </span>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Assigned Date</p>
              <p className="font-semibold text-gray-900">
                {/* {assignment.assignedDate} */}
                {formatDateTime(assignment.assignedDate)}
              </p>
            </div>
          </div>

          {assignment.status === "ACTIVE" && (
            <div className="border-t p-6">
              <button
                onClick={() =>
                  navigate(`/maintenance/create/${assignment.assetId}`, {
                    state: {
                      assetId: assignment.assetId,
                      assetCode: assignment.assetCode,
                    },
                  })
                }
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-colors"
              >
                Raise Maintenance Request
              </button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default MyAssetDetails;
