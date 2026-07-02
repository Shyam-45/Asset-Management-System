import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../../components/layout/MainLayout";

import { getMyAssignments } from "../../api/assignmentApi";

import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

import { getErrorMessage } from "../../utils/errorUtils";
import { formatDateTime } from "../../utils/dateUtils";

function MyAssets() {
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setError("");

      const data = await getMyAssignments();

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
      <div className="max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Assets</h1>
          <p className="text-gray-500 mt-1">
            View assets currently assigned to you.
          </p>
        </div>

        {loading && <Loader />}

        {!loading && error && <ErrorMessage message={error} />}

        {!loading && !error && (
          <>
            {assignments.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                <p className="text-gray-500">
                  No assets are currently assigned to you.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-6 py-4 font-semibold text-gray-700">
                        Asset Code
                      </th>

                      <th className="text-left px-6 py-4 font-semibold text-gray-700">
                        Assigned Date
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {assignments.map((assignment) => (
                      <tr
                        key={assignment.id}
                        onClick={() =>
                          navigate(`/my-assets/${assignment.id}`, {
                            state: { assignment },
                          })
                        }
                        className="border-b last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {assignment.assetCode}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {/* {assignment.assignedDate} */}
                          {formatDateTime(assignment.assignedDate)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}

export default MyAssets;
