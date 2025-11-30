import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getEmployees, deleteEmployee } from '../services/employeeService';
import { getDepartments } from '../services/departmentService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Employees.css';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const { isManager, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [filterStatus, filterDepartment]);

  const loadData = async () => {
    try {
      const filters = {};
      if (filterStatus) filters.status = filterStatus;
      if (filterDepartment) filters.department = filterDepartment;
      if (searchTerm) filters.search = searchTerm;

      const [empData, deptData] = await Promise.all([
        getEmployees(filters),
        getDepartments()
      ]);

      setEmployees(empData);
      setDepartments(deptData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadData();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteEmployee(id);
        loadData();
      } catch (error) {
        alert('Error deleting employee: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'badge-success',
      inactive: 'badge-danger',
      'on-leave': 'badge-warning',
      terminated: 'badge-danger'
    };
    return badges[status] || 'badge-info';
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="loading">Loading employees</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container employees-page">
        <div className="page-header">
          <h1>{isManager() ? 'Employees' : 'My Profile'}</h1>
          {isManager() && (
            <button
              className="btn btn-primary"
              onClick={() => navigate('/employees/new')}
            >
              + Add Employee
            </button>
          )}
        </div>

        {/* Only show filters for admin/managers */}
        {isManager() && (
          <div className="card filters-card">
            <form onSubmit={handleSearch} className="filters-form">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="form-control"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on-leave">On Leave</option>
                  <option value="terminated">Terminated</option>
                </select>
              </div>

              <div className="form-group">
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="form-control"
                >
                  <option value="">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn btn-primary">
                Search
              </button>
            </form>
          </div>
        )}

        <div className="card">
          {employees.length === 0 ? (
            <p className="no-data">
              {isManager() 
                ? 'No employees found.' 
                : 'No employee profile found. Please contact your administrator.'}
            </p>
          ) : (
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Position</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'center', width: '120px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee._id}>
                      <td>
                        <span className="employee-id-cell">
                          {employee.employeeId || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <div className="employee-name-cell">
                          <div className="name-avatar">
                            {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                          </div>
                          <span>{employee.firstName} {employee.lastName}</span>
                        </div>
                      </td>
                      <td>{employee.email}</td>
                      <td>{employee.position}</td>
                      <td>{employee.department?.name}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(employee.status)}`}>
                          {employee.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="action-btn view-btn"
                            onClick={() => navigate(`/employees/${employee._id}`)}
                            title="View Details"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>
                          {isManager() && employee.email !== user?.email && (
                            <>
                              <button
                                className="action-btn edit-btn"
                                onClick={() => navigate(`/employees/${employee._id}/edit`)}
                                title="Edit Employee"
                              >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                              </button>
                              <button
                                className="action-btn delete-btn"
                                onClick={() => handleDelete(employee._id)}
                                title="Delete Employee"
                              >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                  <line x1="10" y1="11" x2="10" y2="17" />
                                  <line x1="14" y1="11" x2="14" y2="17" />
                                </svg>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Employees;
