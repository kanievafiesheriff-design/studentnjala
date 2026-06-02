import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("nunap_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/profile", data),
  uploadProfilePhoto: (file) => {
    const formData = new FormData();
    formData.append("photo", file);
    return api.post("/auth/profile/photo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  forgotPassword: (data) => api.post("/auth/forgot-password", data),
  resetPassword: (token, data) => api.put(`/auth/reset-password/${token}`, data),
};

export const hospitalsAPI = {
  getAll: () => api.get("/hospitals"),
  getOne: (id) => api.get(`/hospitals/${id}`),
};

export const applicationsAPI = {
  create: (data) => api.post("/applications", data),
  mine: () => api.get("/applications/me"),
  getAll: (params) => api.get("/applications", { params }),
  updateStatus: (id, data) => api.patch(`/applications/${id}/status`, data),
  downloadFormTemplate: () =>
    api.get("/applications/form-template", { responseType: "blob" }),
  downloadOne: (id) =>
    api.get(`/applications/${id}/download`, { responseType: "blob" }),
};

export const announcementsAPI = {
  getAll: (params) => api.get("/announcements", { params }),
  getOne: (id) => api.get(`/announcements/${id}`),
  create: (formData) =>
    api.post("/announcements", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, formData) =>
    api.put(`/announcements/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  remove: (id) => api.delete(`/announcements/${id}`),
};

export const modulesAPI = {
  getAll: (params) => api.get("/modules", { params }),
};

export const timetablesAPI = {
  getAll: (params) => api.get("/timetables", { params }),
};

export const leadershipAPI = {
  getAll: () => api.get("/leadership"),
};

export const idCardAPI = {
  getMine: () => api.get("/id-card/me"),
  regenerate: () => api.post("/id-card/regenerate"),
  verify: (code) => api.get(`/id-card/verify/${encodeURIComponent(code)}`),
};

export const chatAPI = {
  getContacts: () => api.get("/chat/contacts"),
  getConversations: () => api.get("/chat/conversations"),
  createConversation: (userId) =>
    api.post("/chat/conversations", { userId }),
  getMessages: (conversationId, params) =>
    api.get(`/chat/conversations/${conversationId}/messages`, { params }),
  sendMessage: (conversationId, text) =>
    api.post(`/chat/conversations/${conversationId}/messages`, { text }),
};

export function saveToken(token) {
  localStorage.setItem("nunap_token", token);
}

export function clearToken() {
  localStorage.removeItem("nunap_token");
}

export default api;
