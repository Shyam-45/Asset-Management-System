function UserDetailsCard({ user }) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold text-gray-900">
          Profile Information
        </h2>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-gray-500 mb-1">Username</p>
          <p className="font-medium text-gray-900">{user.username}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">Email</p>
          <p className="font-medium text-gray-900">{user.email}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">Role</p>
          <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 rounded-full">
            {user.role}
          </span>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">Department</p>
          <p className="font-medium text-gray-900">
            {user.departmentName || "-"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserDetailsCard;
