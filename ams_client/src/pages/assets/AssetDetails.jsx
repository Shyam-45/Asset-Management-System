import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import MainLayout from "../../components/layout/MainLayout";
import ConfirmModal from "../../components/common/ConfirmModal";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

import { useAuth } from "../../context/AuthContext";

import { getAssetById, deleteAsset } from "../../api/assetApi";

import { getErrorMessage } from "../../utils/errorUtils";

function AssetDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { user } = useAuth();

  const [asset, setAsset] = useState(location.state?.asset || null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [loading, setLoading] = useState(!location.state?.asset);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!asset) {
      loadAsset();
    }
  }, []);

  const loadAsset = async () => {
    try {
      setError("");

      const data = await getAssetById(id);

      setAsset(data);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setError("");

      await deleteAsset(asset.id);

      navigate("/assets");
    } catch (error) {
      setError(getErrorMessage(error));
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

  if (error) {
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

  const isAvailable = asset.status === "AVAILABLE";

  return (
    <MainLayout>
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Asset Details</h1>

          <p className="text-gray-500 mt-1">
            View asset information and available actions.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-5">
            <div>
              <h3 className="font-semibold text-gray-700">Code</h3>
              <p>{asset.assetCode}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700">Serial Number</h3>
              <p>{asset.serialNumber}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700">Category</h3>
              <p>{asset.category}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700">Status</h3>
              <p>{asset.status}</p>
            </div>

            {user?.role === "ADMIN" && (
              <div>
                <h3 className="font-semibold text-gray-700">Purchase Date</h3>
                <p>{asset.purchaseDate}</p>
              </div>
            )}

            <div>
              <h3 className="font-semibold text-gray-700">Description</h3>
              <p>{asset.description || "-"}</p>
            </div>
          </div>

          {isAvailable && (
            <div className="flex gap-3 mt-8 pt-6 border-t">
              <button
                onClick={() =>
                  navigate(`/assignments/create/${asset.id}`, {
                    state: { asset },
                  })
                }
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Assign Asset
              </button>

              <button
                onClick={() =>
                  navigate(`/assets/${asset.id}/edit`, {
                    state: { asset },
                  })
                }
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Asset"
        message={`Are you sure you want to delete ${asset.assetCode}?`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </MainLayout>
  );
}

export default AssetDetails;
