import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import MainLayout from "../../components/layout/MainLayout";
import { useAuth } from "../../context/AuthContext";

import { getUsers } from "../../api/userApi";
import { getDepartments } from "../../api/departmentApi";

import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

import { getErrorMessage } from "../../utils/errorUtils";

function UserList() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    loadUsers();

    if (user?.role !== "MANAGER") {
      loadDepartments();
    }
  }, [user]);

  const loadDepartments = async () => {
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };

  const loadUsers = async (departmentId = "") => {
    try {
      setError("");
      const data = await getUsers(departmentId);
      setUsers(data);
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };

  const handleDepartmentChange = async (e) => {
    const departmentId = e.target.value;
    setSelectedDepartment(departmentId);
    await loadUsers(departmentId);
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

  // ✅ Role-based filtering
  const filteredUsers =
    user?.role === "ADMIN"
      ? users.filter((u) => u.role !== "ADMIN")
      : user?.role === "MANAGER"
        ? users.filter((u) => u.role !== "MANAGER")
        : users;

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage users and view department assignments.
          </p>
        </div>

        {user?.role === "ADMIN" && (
          <Link
            to="/users/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            Create User
          </Link>
        )}
      </div>

      {user?.role !== "MANAGER" && (
        <div className="mb-6">
          <select
            value={selectedDepartment}
            onChange={handleDepartmentChange}
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm"
          >
            <option value="">All Departments</option>

            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Role
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Email
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Department
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-10 text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr
                  key={u.id}
                  className="cursor-pointer hover:bg-gray-50 transition border-t"
                  onClick={() =>
                    navigate(`/users/${u.id}`, {
                      state: { user: u },
                    })
                  }
                >
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 rounded-full">
                      {u.role}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-gray-700">{u.email}</td>

                  <td className="px-4 py-3 text-gray-700">
                    {u.departmentName || "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}

export default UserList;
