import { useAuth } from "../context/AuthContext";
import MainLayout from "../components/layout/MainLayout";
import UserDetailsCard from "../components/users/UserDetailsCard";

import { useEffect, useState } from "react";

import { getUserById } from "../api/userApi";
import ConfirmModal from "../components/common/ConfirmModal";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

import { getErrorMessage } from "../utils/errorUtils";

function Profile() {
  const { user } = useAuth();
  const id = user?.userId;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    loadUser();
  }, [id]);

  const loadUser = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getUserById(id);
      setProfile(data);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <MainLayout>
        <Loader />
      </MainLayout>
    );
  if (error || !profile)
    return (
      <MainLayout>
        <ErrorMessage message={error || "User not found"} />
      </MainLayout>
    );

  return (
    <MainLayout>
      <div className="max-w-4xl">
        <UserDetailsCard user={profile} />
      </div>
    </MainLayout>
  );
}

export default Profile;
