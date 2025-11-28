import api from './api';

// Get all employees
export const getEmployees = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await api.get(`/employees?${params}`);
  return response.data;
};

// Get employee by ID
export const getEmployeeById = async (id) => {
  const response = await api.get(`/employees/${id}`);
  return response.data;
};

// Create new employee
export const createEmployee = async (employeeData) => {
  const response = await api.post('/employees', employeeData);
  return response.data;
};

// Update employee
export const updateEmployee = async (id, employeeData) => {
  const response = await api.put(`/employees/${id}`, employeeData);
  return response.data;
};

// Delete employee
export const deleteEmployee = async (id) => {
  const response = await api.delete(`/employees/${id}`);
  return response.data;
};

// Get employee statistics
export const getEmployeeStats = async () => {
  const response = await api.get('/employees/stats/overview');
  return response.data;
};

// Default export for backwards compatibility
const employeeService = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats
};

export default employeeService;
