import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import MainLayout from "../../components/layout/MainLayout";

import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

import { getAssetById, updateAsset } from "../../api/assetApi";

import { getErrorMessage } from "../../utils/errorUtils";

function EditAsset() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [asset, setAsset] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    purchaseDate: "",
    description: "",
  });

  useEffect(() => {
    loadAsset();
  }, []);

  const loadAsset = async () => {
    try {
      setError("");

      let assetData = location.state?.asset;

      if (!assetData) {
        assetData = await getAssetById(id);
      }

      setAsset(assetData);

      setFormData({
        name: assetData.name,
        purchaseDate: assetData.purchaseDate,
        description: assetData.description || "",
      });
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      await updateAsset(id, formData);

      navigate(`/assets/${id}`, {
        state: {
          asset: {
            ...asset,
            ...formData,
          },
        },
      });
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setSaving(false);
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

  return (
    <MainLayout>
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900">Edit Asset</h1>

          <p className="text-sm text-gray-500 mt-1">
            Update asset information.
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={saving}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Purchase
              </label>

              <input
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
                disabled={saving}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={saving}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Updating..." : "Update Asset"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}

export default EditAsset;
