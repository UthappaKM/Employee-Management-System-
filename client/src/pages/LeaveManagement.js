import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import leaveService from '../services/leaveService';
import employeeService from '../services/employeeService';
import './LeaveManagement.css';

const LeaveManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('requests'); // 'requests', 'types', 'balances'
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Leave Type Form
  const [showTypeForm, setShowTypeForm] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [typeFormData, setTypeFormData] = useState({
    name: '',
    code: '',
    annualQuota: 0,
    isPaid: true,
    requiresDocumentation: false,
    maxConsecutiveDays: 0,
    color: '#007bff'
  });

  // Balance Initialization
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchData();
  }, [activeTab, filterStatus]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'requests') {
        const data = await leaveService.getAllLeaveRequests(
          filterStatus !== 'all' ? { status: filterStatus } : {}
        );
        setLeaveRequests(data);
      } else if (activeTab === 'types') {
        const data = await leaveService.getLeaveTypes();
        setLeaveTypes(data);
      } else if (activeTab === 'balances') {
        const empData = await employeeService.getAllEmployees();
        setEmployees(empData);
      }
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleTypeFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTypeFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTypeSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingType) {
        await leaveService.updateLeaveType(editingType._id, typeFormData);
        setSuccess('Leave type updated successfully');
      } else {
        await leaveService.createLeaveType(typeFormData);
        setSuccess('Leave type created successfully');
      }
      setShowTypeForm(false);
      setEditingType(null);
      setTypeFormData({
        name: '',
        code: '',
        annualQuota: 0,
        isPaid: true,
        requiresDocumentation: false,
        maxConsecutiveDays: 0,
        color: '#007bff'
      });
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save leave type');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleEditType = (type) => {
    setEditingType(type);
    setTypeFormData({
      name: type.name,
      code: type.code,
      annualQuota: type.annualQuota,
      isPaid: type.isPaid,
      requiresDocumentation: type.requiresDocumentation,
      maxConsecutiveDays: type.maxConsecutiveDays || 0,
      color: type.color || '#007bff'
    });
    setShowTypeForm(true);
  };

  const handleDeleteType = async (id) => {
    if (window.confirm('Are you sure you want to delete this leave type?')) {
      try {
        await leaveService.deleteLeaveType(id);
        setSuccess('Leave type deleted successfully');
        fetchData();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete leave type');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const handleInitializeBalance = async () => {
    if (!selectedEmployee) {
      setError('Please select an employee');
      setTimeout(() => setError(''), 3000);
      return;
    }
    try {
      await leaveService.initializeLeaveBalance(selectedEmployee, selectedYear);
      setSuccess('Leave balance initialized successfully');
      setSelectedEmployee('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initialize leave balance');
      setTimeout(() => setError(''), 3000);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: '#FFA500',
      approved: '#28a745',
      rejected: '#dc3545',
      cancelled: '#6c757d'
    };
    return (
      <span style={{
        backgroundColor: colors[status],
        color: 'white',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 'bold',
        textTransform: 'uppercase'
      }}>
        {status}
      </span>
    );
  };

  return (
    <div className="leave-management-container">
      <div className="page-header">
        <div className="header-left">
          <button className="btn-back" onClick={() => navigate('/dashboard')} title="Back to Dashboard">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back
          </button>
          <h1>Leave Management</h1>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === 'requests' ? 'active' : ''}
          onClick={() => setActiveTab('requests')}
        >
          All Requests
        </button>
        <button
          className={activeTab === 'types' ? 'active' : ''}
          onClick={() => setActiveTab('types')}
        >
          Leave Types
        </button>
        <button
          className={activeTab === 'balances' ? 'active' : ''}
          onClick={() => setActiveTab('balances')}
        >
          Initialize Balances
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          {/* All Requests Tab */}
          {activeTab === 'requests' && (
            <div className="requests-section">
              <div className="section-header">
                <h2>All Leave Requests</h2>
                <div className="filter-buttons">
                  <button
                    className={filterStatus === 'all' ? 'active' : ''}
                    onClick={() => setFilterStatus('all')}
                  >
                    All
                  </button>
                  <button
                    className={filterStatus === 'pending' ? 'active' : ''}
                    onClick={() => setFilterStatus('pending')}
                  >
                    Pending
                  </button>
                  <button
                    className={filterStatus === 'approved' ? 'active' : ''}
                    onClick={() => setFilterStatus('approved')}
                  >
                    Approved
                  </button>
                  <button
                    className={filterStatus === 'rejected' ? 'active' : ''}
                    onClick={() => setFilterStatus('rejected')}
                  >
                    Rejected
                  </button>
                </div>
              </div>

              <div className="requests-table">
                {leaveRequests.length === 0 ? (
                  <p className="no-data">No leave requests found</p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Leave Type</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Days</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Applied On</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaveRequests.map(request => (
                        <tr key={request._id}>
                          <td>{request.employee?.name}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: request.leaveType?.color || '#007bff'
                              }} />
                              {request.leaveType?.name}
                            </div>
                          </td>
                          <td>{formatDate(request.startDate)}</td>
                          <td>{formatDate(request.endDate)}</td>
                          <td>
                            {request.totalDays}
                            {request.isHalfDay && ' (Half)'}
                          </td>
                          <td className="reason-cell">{request.reason}</td>
                          <td>{getStatusBadge(request.status)}</td>
                          <td>{formatDate(request.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* Leave Types Tab */}
          {activeTab === 'types' && (
            <div className="types-section">
              <div className="section-header">
                <h2>Leave Types</h2>
                <button className="btn-primary" onClick={() => setShowTypeForm(!showTypeForm)}>
                  {showTypeForm ? 'Cancel' : 'Add Leave Type'}
                </button>
              </div>

              {showTypeForm && (
                <div className="type-form-card">
                  <h3>{editingType ? 'Edit Leave Type' : 'Create Leave Type'}</h3>
                  <form onSubmit={handleTypeSubmit}>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={typeFormData.name}
                          onChange={handleTypeFormChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Code *</label>
                        <input
                          type="text"
                          name="code"
                          value={typeFormData.code}
                          onChange={handleTypeFormChange}
                          maxLength="5"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Annual Quota *</label>
                        <input
                          type="number"
                          name="annualQuota"
                          value={typeFormData.annualQuota}
                          onChange={handleTypeFormChange}
                          min="0"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Max Consecutive Days</label>
                        <input
                          type="number"
                          name="maxConsecutiveDays"
                          value={typeFormData.maxConsecutiveDays}
                          onChange={handleTypeFormChange}
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Color</label>
                        <input
                          type="color"
                          name="color"
                          value={typeFormData.color}
                          onChange={handleTypeFormChange}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group checkbox-group">
                        <label>
                          <input
                            type="checkbox"
                            name="isPaid"
                            checked={typeFormData.isPaid}
                            onChange={handleTypeFormChange}
                          />
                          Paid Leave
                        </label>
                      </div>
                      <div className="form-group checkbox-group">
                        <label>
                          <input
                            type="checkbox"
                            name="requiresDocumentation"
                            checked={typeFormData.requiresDocumentation}
                            onChange={handleTypeFormChange}
                          />
                          Requires Documentation
                        </label>
                      </div>
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="btn-primary">
                        {editingType ? 'Update' : 'Create'}
                      </button>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => {
                          setShowTypeForm(false);
                          setEditingType(null);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="types-grid">
                {leaveTypes.map(type => (
                  <div
                    key={type._id}
                    className="type-card"
                    style={{ borderLeft: `4px solid ${type.color}` }}
                  >
                    <div className="type-header">
                      <h3>{type.name}</h3>
                      <span className="type-code">{type.code}</span>
                    </div>
                    <div className="type-details">
                      <p><strong>Annual Quota:</strong> {type.annualQuota} days</p>
                      {type.maxConsecutiveDays > 0 && (
                        <p><strong>Max Consecutive:</strong> {type.maxConsecutiveDays} days</p>
                      )}
                      <p><strong>Type:</strong> {type.isPaid ? 'Paid' : 'Unpaid'}</p>
                      <p><strong>Documentation:</strong> {type.requiresDocumentation ? 'Required' : 'Not Required'}</p>
                      <p><strong>Status:</strong> {type.isActive ? 'Active' : 'Inactive'}</p>
                    </div>
                    {user.role === 'admin' && (
                      <div className="type-actions">
                        <button className="btn-edit" onClick={() => handleEditType(type)}>
                          Edit
                        </button>
                        <button className="btn-delete" onClick={() => handleDeleteType(type._id)}>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Initialize Balances Tab */}
          {activeTab === 'balances' && (
            <div className="balances-section">
              <h2>Initialize Leave Balance</h2>
              <div className="balance-form-card">
                <div className="form-row">
                  <div className="form-group">
                    <label>Select Employee *</label>
                    <select
                      value={selectedEmployee}
                      onChange={(e) => setSelectedEmployee(e.target.value)}
                    >
                      <option value="">Choose Employee</option>
                      {employees.map(emp => (
                        <option key={emp._id} value={emp._id}>
                          {emp.name} ({emp.employeeId})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Year *</label>
                    <input
                      type="number"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                      min="2020"
                      max="2100"
                    />
                  </div>
                </div>
                <button className="btn-primary" onClick={handleInitializeBalance}>
                  Initialize Balance
                </button>
                <p className="help-text">
                  This will create leave balance records for all active leave types for the selected employee and year.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LeaveManagement;
