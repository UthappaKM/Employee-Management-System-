import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate, useParams } from 'react-router-dom';
import { createEmployee, updateEmployee, getEmployeeById } from '../services/employeeService';
import { getDepartments } from '../services/departmentService';
import './EmployeeForm.css';

const EmployeeForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    dateOfJoining: '',
    dateOfBirth: '',
    salary: '',
    status: 'active',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    // User account fields
    createUserAccount: true,
    userRole: 'employee',
    temporaryPassword: ''
  });

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDepartments();
    if (isEditMode) {
      loadEmployee();
    }
  }, [id]);

  const loadDepartments = async () => {
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (error) {
      console.error('Error loading departments:', error);
    }
  };

  const loadEmployee = async () => {
    try {
      const data = await getEmployeeById(id);
      setFormData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        phone: data.phone || '',
        position: data.position || '',
        department: data.department?._id || '',
        dateOfJoining: data.dateOfJoining ? data.dateOfJoining.split('T')[0] : '',
        dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
        salary: data.salary || '',
        status: data.status || 'active',
        address: data.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        }
      });
    } catch (error) {
      setError('Error loading employee data');
      console.error(error);
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEditMode) {
        await updateEmployee(id, formData);
        navigate('/employees');
      } else {
        // If creating user account, use special endpoint
        if (formData.createUserAccount) {
          const response = await fetch('/api/employees/create-with-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(formData)
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create employee');
          }

          const data = await response.json();
          
          // Show success message with password
          alert(
            `Employee created successfully!\n\n` +
            `Login Email: ${data.employee.email}\n` +
            `Temporary Password: ${data.temporaryPassword}\n\n` +
            `Please provide these credentials to the employee.`
          );
        } else {
          // Regular employee creation without user account
          await createEmployee(formData);
        }
        navigate('/employees');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error saving employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container employee-form-page">
        <div className="page-header">
          <h1>{isEditMode ? 'Edit Employee' : 'Add New Employee'}</h1>
          <button className="btn btn-secondary" onClick={() => navigate('/employees')}>
            Back to List
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="card">
          <form onSubmit={onSubmit}>
            <h3>Personal Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={onChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label>Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={onChange}
                  className="form-control"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={onChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={onChange}
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={onChange}
                  className="form-control"
                />
              </div>
            </div>

            <h3>Employment Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Position *</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={onChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label>Department *</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={onChange}
                  className="form-control"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date of Joining</label>
                <input
                  type="date"
                  name="dateOfJoining"
                  value={formData.dateOfJoining}
                  onChange={onChange}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Salary</label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={onChange}
                  className="form-control"
                  min="0"
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
                  <option value="on-leave">On Leave</option>
                  <option value="terminated">Terminated</option>
                </select>
              </div>
            </div>

            <h3>Address</h3>
            <div className="form-group">
              <label>Street</label>
              <input
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={onChange}
                className="form-control"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={onChange}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="address.state"
                  value={formData.address.state}
                  onChange={onChange}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Zip Code</label>
                <input
                  type="text"
                  name="address.zipCode"
                  value={formData.address.zipCode}
                  onChange={onChange}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  name="address.country"
                  value={formData.address.country}
                  onChange={onChange}
                  className="form-control"
                />
              </div>
            </div>

            {/* User Account Section - Only show when creating new employee */}
            {!isEditMode && (
              <>
                <h3>User Account Settings</h3>
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="createUserAccount"
                      checked={formData.createUserAccount}
                      onChange={(e) => setFormData({ ...formData, createUserAccount: e.target.checked })}
                    />
                    <span style={{ marginLeft: '8px' }}>Create user account for login access</span>
                  </label>
                  <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
                    If checked, this employee will be able to login to the system
                  </small>
                </div>

                {formData.createUserAccount && (
                  <div className="user-account-fields" style={{ 
                    padding: '20px', 
                    background: '#f8f9fa', 
                    borderRadius: '8px',
                    marginTop: '15px'
                  }}>
                    <div className="form-row">
                      <div className="form-group">
                        <label>User Role *</label>
                        <select
                          name="userRole"
                          value={formData.userRole}
                          onChange={onChange}
                          className="form-control"
                          required={formData.createUserAccount}
                        >
                          <option value="employee">Employee</option>
                          <option value="manager">Manager</option>
                          <option value="hr">HR</option>
                        </select>
                        <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
                          Employee: View own data | Manager: Manage department | HR: Manage all employees
                        </small>
                      </div>

                      <div className="form-group">
                        <label>Temporary Password *</label>
                        <input
                          type="text"
                          name="temporaryPassword"
                          value={formData.temporaryPassword}
                          onChange={onChange}
                          className="form-control"
                          placeholder="Min 6 characters"
                          required={formData.createUserAccount}
                          minLength="6"
                        />
                        <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
                          Provide this password to the employee for their first login
                        </small>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : isEditMode ? 'Update Employee' : 'Create Employee'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/employees')}
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

export default EmployeeForm;
