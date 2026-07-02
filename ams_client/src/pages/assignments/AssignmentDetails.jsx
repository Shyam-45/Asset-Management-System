import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import MainLayout from "../../components/layout/MainLayout";
import { useAuth } from "../../context/AuthContext";

import { getAssignmentById, returnAsset } from "../../api/assignmentApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import { getErrorMessage } from "../../utils/errorUtils";

function AssignmentDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { user } = useAuth();
  const [assignment, setAssignment] = useState(
    location.state?.assignment || null,
  );

  const [loading, setLoading] = useState(!location.state?.assignment);
  const [submitting, setSubmitting] = useState(false);
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

  const handleReturn = async () => {
    try {
      setSubmitting(true);
      setError("");
      await returnAsset(assignment.id);
      navigate("/assignments");
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <Loader />
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <ErrorMessage message={error} />
      </MainLayout>
    );
  }

  if (!assignment) {
    return (
      <MainLayout>
        <ErrorMessage message="Assignment not found" />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900">
            Assignment Details
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            View assignment information and asset status.
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Asset Code</p>
              <p className="font-medium text-gray-900">
                {assignment.assetCode}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Assigned To</p>
              <p className="font-medium text-gray-900">{assignment.username}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Status</p>

              <span
                className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
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
              <p className="font-medium text-gray-900">
                {assignment.assignedDate
                  ? new Date(assignment.assignedDate).toLocaleDateString()
                  : "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Returned Date</p>
              <p className="font-medium text-gray-900">
                {assignment.returnedDate
                  ? new Date(assignment.returnedDate).toLocaleDateString()
                  : "-"}
              </p>
            </div>
          </div>

          {assignment.status === "ACTIVE" && user?.role === "EMPLOYEE" && (
            <div className="mt-8 pt-6 border-t">
              <button
                onClick={handleReturn}
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Returning..." : "Return Asset"}
              </button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default AssignmentDetails;
