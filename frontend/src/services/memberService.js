import api from "./api";

const memberService = {
  getAllMembers: () => api.get("/members"),
  getDashboardData: () => api.get("/members/dashboard"),
  createMember: (data) => api.post("/members", data),
  updateMember: (id, data) => api.put(`/members/${id}`, data),
  deleteMember: (id) => api.delete(`/members/${id}`),

  getMemberProfile: () => api.get("/members/profile"),
  getMemberAttendance: () => api.get("/members/attendance"),

  uploadProfileImage: (formData) =>
    api.post("/members/profile-image", formData, {
      headers: { "Content-Type": "multipart/form-data" }, // Authorization sudah otomatis lewat interceptor
    }),
};

export default memberService;
