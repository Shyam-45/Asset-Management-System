import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Profile from "../pages/Profile";

import DepartmentList from "../pages/department/DepartmentList";
import DepartmentDetails from "../pages/department/DepartmentDetails";
import CreateDepartment from "../pages/department/CreateDepartment";
import EditDepartment from "../pages/department/EditDepartment";

import UserList from "../pages/users/UserList";
import UserDetails from "../pages/users/UserDetails";
import CreateUser from "../pages/users/CreateUser";
import EditUser from "../pages/users/EditUser";

import AssetList from "../pages/assets/AssetList";
import AssetDetails from "../pages/assets/AssetDetails";
import CreateAsset from "../pages/assets/CrerateAsset";
import EditAsset from "../pages/assets/EditAsset";

import AssignmentList from "../pages/assignments/AssignmentList";
import AssignmentDetails from "../pages/assignments/AssignmentDetails";
import AssignAsset from "../pages/assignments/AssignAsset";

import MaintenanceList from "../pages/maintenance/MaintenanceList";
import CreateMaintenanceRequest from "../pages/maintenance/CreateMaintenaceRequest";

import MyAssets from "../pages/employee/MyAssets";
import MyAssetDetails from "../pages/employee/MyAssetDetails";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PrivateRoute";
import NotFound from "../components/common/NotFound";
import MyMaintenance from "../pages/maintenance/MyMaintenanceList";

function AppRoutes() {
  return (
    <Routes>
      {/* <Route path="/" element={<Login />} /> */}
      <Route element={<PublicRoute />}>
        <Route path="/" element={<Login />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/profile" element={<Profile />} />

        {/* Departments */}
        <Route path="/departments" element={<DepartmentList />} />
        <Route path="/departments/create" element={<CreateDepartment />} />
        <Route path="/departments/:id" element={<DepartmentDetails />} />
        <Route path="/departments/:id/edit" element={<EditDepartment />} />

        {/* Users */}
        <Route path="/users" element={<UserList />} />
        <Route path="/users/create" element={<CreateUser />} />
        <Route path="/users/:id" element={<UserDetails />} />
        <Route path="/users/:id/edit" element={<EditUser />} />

        {/* Assets */}
        <Route path="/assets" element={<AssetList />} />
        <Route path="/assets/create" element={<CreateAsset />} />
        <Route path="/assets/:id" element={<AssetDetails />} />
        <Route path="/assets/:id/edit" element={<EditAsset />} />

        {/* Assignments */}
        <Route path="/assignments" element={<AssignmentList />} />
        {/* <Route path="/assignments/create" element={<AssignAsset />} /> */}
        <Route path="/assignments/:id" element={<AssignmentDetails />} />
        <Route path="/assignments/create/:assetId" element={<AssignAsset />} />

        {/* Maintenance */}
        <Route path="/my-maintenance" element={<MyMaintenance />} />
        <Route path="/maintenance" element={<MaintenanceList />} />
        <Route
          path="/maintenance/create/:assetId"
          element={<CreateMaintenanceRequest />}
        />

        {/* Employee */}
        <Route path="/my-assets" element={<MyAssets />} />
        <Route path="/my-assets/:id" element={<MyAssetDetails />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
