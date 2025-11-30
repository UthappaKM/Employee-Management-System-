import api from './api';

const leaveService = {
  // Leave Types
  getLeaveTypes: async () => {
    const response = await api.get('/leave-types');
    return response.data;
  },

  createLeaveType: async (leaveTypeData) => {
    const response = await api.post('/leave-types', leaveTypeData);
    return response.data;
  },

  updateLeaveType: async (id, leaveTypeData) => {
    const response = await api.put(`/leave-types/${id}`, leaveTypeData);
    return response.data;
  },

  deleteLeaveType: async (id) => {
    const response = await api.delete(`/leave-types/${id}`);
    return response.data;
  },

  // Leave Balance
  getMyLeaveBalance: async () => {
    const response = await api.get('/leave-balance/my-balance');
    return response.data;
  },

  getEmployeeLeaveBalance: async (employeeId, year) => {
    const response = await api.get(`/leave-balance/employee/${employeeId}`, {
      params: { year }
    });
    return response.data;
  },

  initializeLeaveBalance: async (employeeId, year) => {
    const response = await api.post(`/leave-balance/initialize/${employeeId}`, { year });
    return response.data;
  },

  updateLeaveBalance: async (id, balanceData) => {
    const response = await api.put(`/leave-balance/${id}`, balanceData);
    return response.data;
  },

  // Leave Requests
  createLeaveRequest: async (leaveRequestData) => {
    const response = await api.post('/leave-requests', leaveRequestData);
    return response.data;
  },

  getMyLeaveRequests: async (filters) => {
    const response = await api.get('/leave-requests/my-requests', { params: filters });
    return response.data;
  },

  getPendingApprovals: async () => {
    const response = await api.get('/leave-requests/pending-approvals');
    return response.data;
  },

  getAllLeaveRequests: async (filters) => {
    const response = await api.get('/leave-requests/all', { params: filters });
    return response.data;
  },

  approveLeaveRequest: async (id, comments) => {
    const response = await api.put(`/leave-requests/${id}/approve`, { comments });
    return response.data;
  },

  rejectLeaveRequest: async (id, rejectionReason) => {
    const response = await api.put(`/leave-requests/${id}/reject`, { rejectionReason });
    return response.data;
  },

  cancelLeaveRequest: async (id) => {
    const response = await api.put(`/leave-requests/${id}/cancel`);
    return response.data;
  }
};

export default leaveService;
