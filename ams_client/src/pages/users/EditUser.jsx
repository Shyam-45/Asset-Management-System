import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import MainLayout from "../../components/layout/MainLayout";

import { getUserById, updateUser } from "../../api/userApi";
import { getDepartments } from "../../api/departmentApi";

import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

import { getErrorMessage } from "../../utils/errorUtils";

function EditUser() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    role: "",
    departmentId: null,
  });

  const [changeDepartment, setChangeDepartment] = useState(false);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (changeDepartment && departments.length === 0) {
      loadDepartments();
    }
  }, [changeDepartment]);

  const loadUser = async () => {
    try {
      setLoading(true);
      setError("");

      let userData = location.state?.user;

      if (!userData) {
        userData = await getUserById(id);
      }

      setUser(userData);

      setFormData({
        role: userData.role,
        departmentId: userData.departmentId,
      });
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const loadDepartments = async () => {
    try {
      setError("");

      const data = await getDepartments();

      setDepartments(data);
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "departmentId" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      await updateUser(id, formData);

      navigate(`/users/${id}`, {
        state: {
          user: {
            ...user,
            ...formData,
          },
        },
      });
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

  if (error && !user) {
    return (
      <MainLayout>
        <ErrorMessage message={error} />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Edit</h1>

          <p className="text-sm text-gray-500 mt-1">
            Update user role and department assignment.
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        <div className="bg-white rounded-lg shadow">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="MANAGER">MANAGER</option>
                <option value="EMPLOYEE">EMPLOYEE</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <input
                id="changeDepartment"
                type="checkbox"
                checked={changeDepartment}
                onChange={(e) => setChangeDepartment(e.target.checked)}
                className="h-4 w-4"
              />

              <label
                htmlFor="changeDepartment"
                className="text-sm text-gray-700"
              >
                Change Department
              </label>
            </div>

            {changeDepartment && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>

                <select
                  name="departmentId"
                  value={formData.departmentId || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                >
                  <option value="">Select Department</option>

                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition disabled:opacity-50"
              >
                {submitting ? "Updating..." : "Update User"}
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={submitting}
                className="border border-gray-300 px-5 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}

export default EditUser;
