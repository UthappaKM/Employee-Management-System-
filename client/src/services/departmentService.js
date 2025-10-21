import api from './api';

// Get all departments
export const getDepartments = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await api.get(`/departments?${params}`);
  return response.data;
};

// Get department by ID
export const getDepartmentById = async (id) => {
  const response = await api.get(`/departments/${id}`);
  return response.data;
};

// Create new department
export const createDepartment = async (departmentData) => {
  const response = await api.post('/departments', departmentData);
  return response.data;
};

// Update department
export const updateDepartment = async (id, departmentData) => {
  const response = await api.put(`/departments/${id}`, departmentData);
  return response.data;
};

// Delete department
export const deleteDepartment = async (id) => {
  const response = await api.delete(`/departments/${id}`);
  return response.data;
};
