import api from "./axios";

export const getMaintenanceRequests = async (status = "ALL") => {
    // 'ALL' here acts as a default status filter
  const response = await api.get(`/maintenance?status=${status}`);
  return response.data;
};

export const createMaintenanceRequest = async (data) => {
  const response = await api.post("/maintenance", data);
  return response.data;
};

export const approveMaintenanceRequest = async (id) => {
  const response = await api.put(`/maintenance/${id}/approve`);
  return response.data;
};

export const rejectMaintenanceRequest = async (id) => {
  const response = await api.put(`/maintenance/${id}/reject`);
  return response.data;
};

export const resolveMaintenanceRequest = async (id) => {
  const response = await api.put(`/maintenance/${id}/resolve`);
  return response.data;
};

export const getMyMaintenanceRequests = async (status = "ALL") => {
    // 'ALL' here acts as a default status filter
  const response = await api.get(`/maintenance/my?status=${status}`);
  return response.data;
};