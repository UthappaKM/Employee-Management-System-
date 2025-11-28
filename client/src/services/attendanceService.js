import api from './api';

const attendanceService = {
  // Get employees viewable by current user (based on role)
  getViewableEmployees: async () => {
    try {
      const response = await api.get('/attendance/employees/viewable');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get all attendance records with optional filters
  getAllAttendance: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.employeeId) params.append('employeeId', filters.employeeId);
      if (filters.status) params.append('status', filters.status);

      const response = await api.get(`/attendance?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get attendance by ID
  getAttendanceById: async (id) => {
    try {
      const response = await api.get(`/attendance/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get attendance summary for an employee
  getAttendanceSummary: async (employeeId, filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await api.get(`/attendance/summary/${employeeId}?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Mark attendance
  markAttendance: async (attendanceData) => {
    try {
      const response = await api.post('/attendance', attendanceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Check-in
  checkIn: async (employeeId) => {
    try {
      const response = await api.post('/attendance/check-in', { employeeId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Check-out
  checkOut: async (employeeId) => {
    try {
      const response = await api.post('/attendance/check-out', { employeeId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update attendance record
  updateAttendance: async (id, attendanceData) => {
    try {
      const response = await api.put(`/attendance/${id}`, attendanceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete attendance record
  deleteAttendance: async (id) => {
    try {
      const response = await api.delete(`/attendance/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Bulk mark attendance
  bulkMarkAttendance: async (bulkData) => {
    try {
      const response = await api.post('/attendance/bulk', bulkData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default attendanceService;
