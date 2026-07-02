import api from "./axios";

export const assignAsset = async (data) => {
    const response = await api.post("/assignments", data);
    return response.data;
};

export const getAssignments = async () => {
    const response = await api.get("/assignments");
    return response.data;
};

export const getActiveAssignments = async () => {
    const response = await api.get("/assignments/active");
    return response.data;
};

export const getAssignmentById = async (id) => {
    const response = await api.get(`/assignments/${id}`);
    return response.data;
};

export const returnAsset = async (id) => {
    const response = await api.post(`/assignments/${id}/return`);
    return response.data;
};

export const getMyAssignments = async () => {
  const response = await api.get("/assignments/my");
  return response.data;
};