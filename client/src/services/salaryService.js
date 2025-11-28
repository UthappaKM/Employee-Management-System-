import api from './api';

const salaryService = {
  // Get all salary records
  getAllSalaries: async () => {
    const response = await api.get('/salary');
    return response.data;
  },

  // Get salary by employee ID
  getSalaryByEmployee: async (employeeId) => {
    const response = await api.get(`/salary/employee/${employeeId}`);
    return response.data;
  },

  // Get my salary (for logged-in employee)
  getMySalary: async () => {
    const response = await api.get('/salary/my-salary');
    return response.data;
  },

  // Create salary record
  createSalary: async (salaryData) => {
    const response = await api.post('/salary', salaryData);
    return response.data;
  },

  // Update salary record
  updateSalary: async (id, salaryData) => {
    const response = await api.put(`/salary/${id}`, salaryData);
    return response.data;
  },

  // Delete salary record
  deleteSalary: async (id) => {
    const response = await api.delete(`/salary/${id}`);
    return response.data;
  }
};

export default salaryService;
