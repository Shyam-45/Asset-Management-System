import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { Link, useNavigate } from "react-router-dom";
import { getAssets } from "../../api/assetApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import { getErrorMessage } from "../../utils/errorUtils";

function AssetList() {
  const [assets, setAssets] = useState([]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAssets();
      setAssets(data);
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Assets</h1>

        <Link
          to="/assets/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          Create Asset
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Code
              </th>

              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Name
              </th>

              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Category
              </th>

              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {assets.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-8 text-gray-500">
                  No assets found
                </td>
              </tr>
            ) : (
              assets.map((asset) => (
                <tr
                  key={asset.id}
                  className="border-b last:border-b-0 cursor-pointer hover:bg-gray-50"
                  onClick={() =>
                    navigate(`/assets/${asset.id}`, {
                      state: { asset },
                    })
                  }
                >
                  <td className="px-4 py-3">{asset.assetCode}</td>

                  <td className="px-4 py-3">{asset.name}</td>

                  <td className="px-4 py-3">{asset.category}</td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        asset.status === "AVAILABLE"
                          ? "bg-green-100 text-green-700"
                          : asset.status === "ASSIGNED"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {asset.status}
                    </span>
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

export default AssetList;
