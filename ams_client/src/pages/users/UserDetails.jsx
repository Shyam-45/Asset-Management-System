import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import MainLayout from "../../components/layout/MainLayout";
import UserDetailsCard from "../../components/users/UserDetailsCard";

import { getUserById, deleteUser } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";
import ConfirmModal from "../../components/common/ConfirmModal";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

import { getErrorMessage } from "../../utils/errorUtils";

function UserDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [user, setUser] = useState(location.state?.user || null);
  const [loading, setLoading] = useState(!location.state?.user);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (user) return;
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getUserById(id);
      setUser(data);
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
      await deleteUser(user.id);
      navigate("/users");
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading)
    return (
      <MainLayout>
        <Loader />
      </MainLayout>
    );
  if (error || !user)
    return (
      <MainLayout>
        <ErrorMessage message={error || "User not found"} />
      </MainLayout>
    );

  return (
    <MainLayout>
      <div className="max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">User Details</h1>
        </div>

        <UserDetailsCard user={user} />

        {currentUser?.role === "ADMIN" && (
          <div className="mt-4 flex gap-3">
            <button
              onClick={() =>
                navigate(`/users/${user.id}/edit`, { state: { user } })
              }
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Edit
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete User"
        message={`Are you sure you want to delete ${user.username}?`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </MainLayout>
  );
}

export default UserDetails;

// import { useEffect, useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";

// import MainLayout from "../../components/layout/MainLayout";

// import { getUserById, deleteUser } from "../../api/userApi";
// import { useAuth } from "../../context/AuthContext";
// import ConfirmModal from "../../components/common/ConfirmModal";
// import Loader from "../../components/common/Loader";
// import ErrorMessage from "../../components/common/ErrorMessage";

// import { getErrorMessage } from "../../utils/errorUtils";

// function UserDetails() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { id } = useParams();

//   const [user, setUser] = useState(location.state?.user || null);

//   const [loading, setLoading] = useState(!location.state?.user);
//   const [deleting, setDeleting] = useState(false);

//   const { user: currentUser } = useAuth();
//   const [error, setError] = useState("");

//   const [showDeleteModal, setShowDeleteModal] = useState(false);

//   useEffect(() => {
//     if (user) return;

//     loadUser();
//   }, []);

//   const loadUser = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const data = await getUserById(id);

//       setUser(data);
//     } catch (error) {
//       setError(getErrorMessage(error));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       setDeleting(true);
//       setError("");

//       await deleteUser(user.id);

//       navigate("/users");
//     } catch (error) {
//       setError(getErrorMessage(error));
//     } finally {
//       setDeleting(false);
//       setShowDeleteModal(false);
//     }
//   };

//   if (loading) {
//     return (
//       <MainLayout>
//         <Loader />
//       </MainLayout>
//     );
//   }

//   if (error && !user) {
//     return (
//       <MainLayout>
//         <ErrorMessage message={error} />
//       </MainLayout>
//     );
//   }

//   if (!user) {
//     return (
//       <MainLayout>
//         <ErrorMessage message="User not found" />
//       </MainLayout>
//     );
//   }

//   return (
//     <MainLayout>
//       <div className="max-w-4xl">
//         <div className="mb-6">
//           <h1 className="text-2xl font-semibold text-gray-900">User Details</h1>

//           <p className="text-sm text-gray-500 mt-1">
//             View user information and department assignment.
//           </p>
//         </div>

//         {error && <ErrorMessage message={error} />}

//         <div className="bg-white shadow rounded-lg overflow-hidden">
//           <div className="p-6 border-b">
//             <h2 className="text-lg font-semibold text-gray-900">
//               Profile Information
//             </h2>
//           </div>

//           <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <p className="text-sm text-gray-500 mb-1">Username</p>
//               <p className="font-medium text-gray-900">{user.username}</p>
//             </div>

//             <div>
//               <p className="text-sm text-gray-500 mb-1">Email</p>
//               <p className="font-medium text-gray-900">{user.email}</p>
//             </div>

//             <div>
//               <p className="text-sm text-gray-500 mb-1">Role</p>

//               <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 rounded-full">
//                 {user.role}
//               </span>
//             </div>

//             <div>
//               <p className="text-sm text-gray-500 mb-1">Department</p>
//               <p className="font-medium text-gray-900">
//                 {user.departmentName || "-"}
//               </p>
//             </div>
//           </div>

//           {currentUser?.role === "ADMIN" && (
//             <div className="p-6 border-t flex gap-3">
//               <button
//                 onClick={() =>
//                   navigate(`/users/${user.id}/edit`, {
//                     state: { user },
//                   })
//                 }
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
//               >
//                 Edit
//               </button>

//               <button
//                 onClick={() => setShowDeleteModal(true)}
//                 disabled={deleting}
//                 className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
//               >
//                 Delete
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       <ConfirmModal
//         isOpen={showDeleteModal}
//         title="Delete User"
//         message={`Are you sure you want to delete ${user.username}?`}
//         onConfirm={handleDelete}
//         onCancel={() => setShowDeleteModal(false)}
//       />
//     </MainLayout>
//   );
// }

// export default UserDetails;
