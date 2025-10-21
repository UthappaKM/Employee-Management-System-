import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate, useParams } from 'react-router-dom';
import { createDepartment, updateDepartment, getDepartmentById } from '../services/departmentService';
import { getEmployees } from '../services/employeeService';
import './DepartmentForm.css';

const DepartmentForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    head: '',
    budget: '',
    location: '',
    status: 'active'
  });

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEmployees();
    if (isEditMode) {
      loadDepartment();
    }
  }, [id]);

  const loadEmployees = async () => {
    try {
      const data = await getEmployees({ status: 'active' });
      setEmployees(data);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const loadDepartment = async () => {
    try {
      const data = await getDepartmentById(id);
      setFormData({
        name: data.name || '',
        code: data.code || '',
        description: data.description || '',
        head: data.head?._id || '',
        budget: data.budget || '',
        location: data.location || '',
        status: data.status || 'active'
      });
    } catch (error) {
      setError('Error loading department data');
      console.error(error);
    }
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEditMode) {
        await updateDepartment(id, formData);
      } else {
        await createDepartment(formData);
      }
      navigate('/departments');
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving department');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container department-form-page">
        <div className="page-header">
          <h1>{isEditMode ? 'Edit Department' : 'Add New Department'}</h1>
          <button className="btn btn-secondary" onClick={() => navigate('/departments')}>
            Back to List
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="card">
          <form onSubmit={onSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Department Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={onChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label>Department Code *</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={onChange}
                  className="form-control"
                  required
                  style={{ textTransform: 'uppercase' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={onChange}
                className="form-control"
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Department Head</label>
                <select
                  name="head"
                  value={formData.head}
                  onChange={onChange}
                  className="form-control"
                >
                  <option value="">Select Department Head</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.firstName} {emp.lastName} - {emp.position}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Budget</label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={onChange}
                  className="form-control"
                  min="0"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={onChange}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={onChange}
                  className="form-control"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : isEditMode ? 'Update Department' : 'Create Department'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/departments')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default DepartmentForm;
