import api from './api';

const payrollService = {
  // Get all payroll records with filters
  getAllPayrolls: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.month) params.append('month', filters.month);
    if (filters.year) params.append('year', filters.year);
    if (filters.status) params.append('status', filters.status);
    if (filters.employeeId) params.append('employeeId', filters.employeeId);

    const response = await api.get(`/payroll?${params.toString()}`);
    return response.data;
  },

  // Get payroll by ID
  getPayrollById: async (id) => {
    const response = await api.get(`/payroll/${id}`);
    return response.data;
  },

  // Generate payroll for a month
  generatePayroll: async (data) => {
    const response = await api.post('/payroll/generate', data);
    return response.data;
  },

  // Update payroll status (Approve/Reject)
  updatePayrollStatus: async (id, status) => {
    const response = await api.put(`/payroll/${id}/status`, { status });
    return response.data;
  },

  // Mark payroll as paid
  markAsPaid: async (id, paymentData) => {
    const response = await api.put(`/payroll/${id}/pay`, paymentData);
    return response.data;
  },

  // Delete payroll record
  deletePayroll: async (id) => {
    const response = await api.delete(`/payroll/${id}`);
    return response.data;
  },

  // Get payroll summary/statistics
  getPayrollSummary: async (month, year) => {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year);

    const response = await api.get(`/payroll/stats/summary?${params.toString()}`);
    return response.data;
  }
};

export default payrollService;
