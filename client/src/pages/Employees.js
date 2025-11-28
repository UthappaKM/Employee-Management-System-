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
                    <th>Name</th>
                    <th>Email</th>
                    <th>Position</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee._id}>
                      <td>{employee.firstName} {employee.lastName}</td>
                      <td>{employee.email}</td>
                      <td>{employee.position}</td>
                      <td>{employee.department?.name}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(employee.status)}`}>
                          {employee.status}
                        </span>
                      </td>
                      <td className="actions">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => navigate(`/employees/${employee._id}`)}
                        >
                          View
                        </button>
                        {isManager() && employee.email !== user?.email && (
                          <>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => navigate(`/employees/${employee._id}/edit`)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(employee._id)}
                            >
                              Delete
                            </button>
                          </>
                        )}
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
