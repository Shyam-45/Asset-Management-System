import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import MainLayout from "../../components/layout/MainLayout";

import ConfirmModal from "../../components/common/ConfirmModal";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

import { getDepartmentById, deleteDepartment } from "../../api/departmentApi";

import { getErrorMessage } from "../../utils/errorUtils";

function DepartmentDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { user } = useAuth();
  const [department, setDepartment] = useState(
    location.state?.department || null,
  );
  const [deleting, setDeleting] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(!location.state?.department);
  const [error, setError] = useState("");

  useEffect(() => {
    if (department) return;
    loadDepartment();
  }, []);

  const loadDepartment = async () => {
    try {
      setError("");
      const data = await getDepartmentById(id);
      setDepartment(data);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      setError("");

      await deleteDepartment(department.id);

      navigate("/departments");
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <Loader />
      </MainLayout>
    );
  }

  if (error && !department) {
    return (
      <MainLayout>
        <ErrorMessage message={error} />
      </MainLayout>
    );
  }

  if (!department) {
    return (
      <MainLayout>
        <ErrorMessage message="Department not found" />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Department Details
          </h1>
          <p className="text-gray-500 mt-1">
            View department information and configuration.
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="grid md:grid-cols-2 gap-6 p-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Department Code</p>
              <p className="font-semibold text-gray-900">{department.code}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Department Name</p>
              <p className="font-semibold text-gray-900">{department.name}</p>
            </div>

            <div className="md:col-span-2">
              <p className="text-sm text-gray-500 mb-1">Description</p>
              <p className="text-gray-900">
                {department.description || "No description available"}
              </p>
            </div>
          </div>

          {user?.role === "ADMIN" && (
            <div className="border-t p-6">
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    navigate(`/departments/${department.id}/edit`, {
                      state: { department },
                    })
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-colors"
                >
                  Edit
                </button>

                <button
                  onClick={() => setShowDeleteModal(true)}
                  disabled={deleting}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Department"
        message={`Are you sure you want to delete ${department.name}?`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </MainLayout>
  );
}

export default DepartmentDetails;
