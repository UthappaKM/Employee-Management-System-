import api from './api';

// Get all performance reviews
export const getPerformanceReviews = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await api.get(`/performance?${params}`);
  return response.data;
};

// Get reviews for specific employee
export const getEmployeeReviews = async (employeeId) => {
  const response = await api.get(`/performance/employee/${employeeId}`);
  return response.data;
};

// Get performance review by ID
export const getPerformanceById = async (id) => {
  const response = await api.get(`/performance/${id}`);
  return response.data;
};

// Create new performance review
export const createPerformanceReview = async (reviewData) => {
  const response = await api.post('/performance', reviewData);
  return response.data;
};

// Update performance review
export const updatePerformanceReview = async (id, reviewData) => {
  const response = await api.put(`/performance/${id}`, reviewData);
  return response.data;
};

// Delete performance review
export const deletePerformanceReview = async (id) => {
  const response = await api.delete(`/performance/${id}`);
  return response.data;
};

// Get performance statistics
export const getPerformanceStats = async () => {
  const response = await api.get('/performance/stats/overview');
  return response.data;
};
