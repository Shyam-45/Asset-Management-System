import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import MainLayout from "../../components/layout/MainLayout";

import { getAssetById } from "../../api/assetApi";
import { createMaintenanceRequest } from "../../api/maintenanceApi";

import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

import { getErrorMessage } from "../../utils/errorUtils";

function CreateMaintenanceRequest() {
  const navigate = useNavigate();
  const location = useLocation();
  const { assetId } = useParams();

  const [asset, setAsset] = useState(null);

  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAsset();
  }, []);

  const loadAsset = async () => {
    try {
      setError("");

      let assetData = location.state;

      if (!assetData) {
        const data = await getAssetById(assetId);

        assetData = {
          assetId: data.id,
          assetCode: data.assetCode,
        };
      }

      setAsset(assetData);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      await createMaintenanceRequest({
        assetId: Number(asset.assetId),
        description,
      });

      navigate("/my-maintenance");
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

  if (!asset) {
    return (
      <MainLayout>
        <ErrorMessage message="Asset not found" />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Create Maintenance Request
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Submit a maintenance issue for the selected asset.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && <ErrorMessage message={error} />}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Asset
              </label>

              <input
                value={asset.assetCode}
                disabled
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issue Description
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="Describe the issue in detail..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 resize-none"
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Request"}
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

export default CreateMaintenanceRequest;
