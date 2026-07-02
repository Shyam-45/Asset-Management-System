import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import MainLayout from "../../components/layout/MainLayout";

import { getDepartments } from "../../api/departmentApi";
import { getUsers } from "../../api/userApi";
import { assignAsset } from "../../api/assignmentApi";
import { getAssetById } from "../../api/assetApi";

import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

import { getErrorMessage } from "../../utils/errorUtils";

function AssignAsset() {
  const navigate = useNavigate();
  const location = useLocation();
  const { assetId } = useParams();

  const [asset, setAsset] = useState(location.state?.asset || null);

  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    departmentId: "",
    userId: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError("");

      let assetData = asset;

      if (!assetData && assetId) {
        assetData = await getAssetById(assetId);
      }

      setAsset(assetData);

      const departmentsData = await getDepartments();

      setDepartments(departmentsData);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;

    if (name === "departmentId") {
      try {
        setUsers([]);
        setUsersLoading(true);
        setError("");

        setFormData({
          departmentId: value,
          userId: "",
        });

        const usersData = await getUsers(value);
        // Doing filtering at forntend as separate endpoint will be required
        // setUsers(usersData.filter((user) => user.role === "EMPLOYEE"));
        setUsers(usersData);
      } catch (error) {
        setError(getErrorMessage(error));
      } finally {
        setUsersLoading(false);
      }

      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      await assignAsset({
        assetId: asset.id,
        userId: Number(formData.userId),
      });

      navigate("/assets");
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

  if (error && !asset) {
    return (
      <MainLayout>
        <ErrorMessage message={error} />
      </MainLayout>
    );
  }

  if (!asset) {
    return (
      <MainLayout>
        <ErrorMessage message="Asset not found" />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900">Assign Asset</h1>

          <p className="text-sm text-gray-500 mt-1">
            Assign an available asset.
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Asset Code
              </label>

              <input
                value={asset.assetCode}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Asset Name
              </label>

              <input
                value={asset.name}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>

              <select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleChange}
                disabled={submitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User
              </label>

              <select
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                disabled={!formData.departmentId || usersLoading || submitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
                required
              >
                <option value="">
                  {usersLoading ? "Loading users..." : "Select User"}
                </option>

                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Assigning..." : "Assign Asset"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}

export default AssignAsset;
