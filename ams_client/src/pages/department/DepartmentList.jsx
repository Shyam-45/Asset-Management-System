import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import MainLayout from "../../components/layout/MainLayout";

import { getDepartments } from "../../api/departmentApi";
import { useAuth } from "../../context/AuthContext";

import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

import { getErrorMessage } from "../../utils/errorUtils";

function DepartmentList() {
  const [departments, setDepartments] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDepartments();

      setDepartments(data);
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
            <p className="text-gray-500 mt-1">
              Manage organization departments.
            </p>
          </div>

          {user?.role === "ADMIN" && (
            <Link
              to="/departments/create"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition-colors"
            >
              Create Department
            </Link>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">
                  Code
                </th>

                <th className="text-left px-6 py-4 font-semibold text-gray-700">
                  Name
                </th>

                <th className="text-left px-6 py-4 font-semibold text-gray-700">
                  Description
                </th>
              </tr>
            </thead>

            <tbody>
              {departments.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-12 text-gray-500">
                    No departments found
                  </td>
                </tr>
              ) : (
                departments.map((department) => (
                  <tr
                    key={department.id}
                    onClick={() =>
                      navigate(`/departments/${department.id}`, {
                        state: { department },
                      })
                    }
                    className="border-b last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {department.code}
                    </td>

                    <td className="px-6 py-4">{department.name}</td>

                    <td className="px-6 py-4 text-gray-600">
                      {department.description || "-"}
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

export default DepartmentList;
