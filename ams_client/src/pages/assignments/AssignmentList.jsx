import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../../components/layout/MainLayout";
import { getAssignments } from "../../api/assignmentApi";

import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import { getErrorMessage } from "../../utils/errorUtils";

function AssignmentList() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setError("");
      const data = await getAssignments();
      setAssignments(data);
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

  if (error) {
    return (
      <MainLayout>
        <ErrorMessage message={error} />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Assignments</h1>

        <p className="text-sm text-gray-500 mt-1">
          View all asset assignment records.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Asset
                </th>

                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Assigned To
                </th>

                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>

                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Assigned Date
                </th>
              </tr>
            </thead>

            <tbody>
              {assignments.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-10 text-gray-500">
                    No assignments found
                  </td>
                </tr>
              ) : (
                assignments.map((assignment) => (
                  <tr
                    key={assignment.id}
                    className="border-b last:border-b-0 hover:bg-gray-50 cursor-pointer transition"
                    onClick={() =>
                      navigate(`/assignments/${assignment.id}`, {
                        state: {
                          assignment,
                        },
                      })
                    }
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {assignment.assetCode}
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {assignment.username}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          assignment.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {assignment.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {assignment.assignedDate
                        ? new Date(assignment.assignedDate).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}

export default AssignmentList;
