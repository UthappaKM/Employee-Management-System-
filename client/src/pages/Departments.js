import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getDepartments, deleteDepartment } from '../services/departmentService';
import { useNavigate } from 'react-router-dom';
import './Departments.css';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    location: '',
    budget: '',
    status: 'active'
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (error) {
      console.error('Error loading departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await deleteDepartment(id);
        loadDepartments();
      } catch (error) {
        alert('Error deleting department: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="loading">Loading departments</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container departments-page">
        <div className="page-header">
          <h1>Departments</h1>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/departments/new')}
          >
            + Add Department
          </button>
        </div>

        <div className="departments-grid">
          {departments.length === 0 ? (
            <p className="no-data">No departments found.</p>
          ) : (
            departments.map((dept) => (
              <div key={dept._id} className="department-card">
                <div className="department-header">
                  <h3>{dept.name}</h3>
                  <span className={`badge badge-${dept.status === 'active' ? 'success' : 'danger'}`}>
                    {dept.status}
                  </span>
                </div>
                <div className="department-code">Code: {dept.code}</div>
                {dept.description && (
                  <p className="department-description">{dept.description}</p>
                )}
                <div className="department-info">
                  {dept.location && <div><strong>Location:</strong> {dept.location}</div>}
                  {dept.budget && <div><strong>Budget:</strong> ${dept.budget.toLocaleString()}</div>}
                  {dept.head && (
                    <div><strong>Head:</strong> {dept.head.firstName} {dept.head.lastName}</div>
                  )}
                </div>
                <div className="department-actions">
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => navigate(`/departments/${dept._id}/edit`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(dept._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Departments;
