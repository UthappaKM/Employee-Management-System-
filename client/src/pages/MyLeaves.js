import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import leaveService from '../services/leaveService';
import './MyLeaves.css';

const MyLeaves = () => {
  const navigate = useNavigate();
  const [leaveBalance, setLeaveBalance] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    isHalfDay: false,
    halfDaySession: 'morning',
    reason: ''
  });

  useEffect(() => {
    fetchData();
  }, [filterStatus]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [balanceData, typesData, requestsData] = await Promise.all([
        leaveService.getMyLeaveBalance(),
        leaveService.getLeaveTypes(),
        leaveService.getMyLeaveRequests(filterStatus !== 'all' ? { status: filterStatus } : {})
      ]);
      setLeaveBalance(balanceData);
      setLeaveTypes(typesData);
      setLeaveRequests(requestsData);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch leave data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await leaveService.createLeaveRequest(formData);
      setSuccess('Leave request submitted successfully');
      setShowApplyForm(false);
      setFormData({
        leaveType: '',
        startDate: '',
        endDate: '',
        isHalfDay: false,
        halfDaySession: 'morning',
        reason: ''
      });
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit leave request');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this leave request?')) {
      try {
        await leaveService.cancelLeaveRequest(id);
        setSuccess('Leave request cancelled successfully');
        fetchData();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to cancel leave request');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: '#FFA500',
      approved: '#28a745',
      rejected: '#dc3545',
      cancelled: '#6c757d'
    };
    return (
      <span style={{
        backgroundColor: statusColors[status] || '#6c757d',
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="my-leaves-container">
      <div className="page-header">
        <div className="header-left">
          <button className="btn-back" onClick={() => navigate('/dashboard')} title="Back to Dashboard">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back
          </button>
          <h1>My Leaves</h1>
        </div>
        <button className="btn-primary" onClick={() => setShowApplyForm(!showApplyForm)}>
          {showApplyForm ? 'Cancel' : 'Apply for Leave'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Leave Balance Cards */}
      <div className="leave-balance-section">
        <h2>Leave Balance</h2>
        <div className="balance-cards">
          {leaveBalance.map(balance => (
            <div key={balance._id} className="balance-card" style={{ borderLeft: `4px solid ${balance.leaveType?.color || '#007bff'}` }}>
              <div className="balance-header">
                <h3>{balance.leaveType?.name}</h3>
                <span className="leave-code">{balance.leaveType?.code}</span>
              </div>
              <div className="balance-stats">
                <div className="stat">
                  <span className="stat-label">Total</span>
                  <span className="stat-value">{balance.totalQuota}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Available</span>
                  <span className="stat-value highlight">{balance.available}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Used</span>
                  <span className="stat-value">{balance.used}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Pending</span>
                  <span className="stat-value">{balance.pending}</span>
                </div>
              </div>
              {balance.carriedForward > 0 && (
                <div className="carried-forward">
                  + {balance.carriedForward} carried forward
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Apply Leave Form */}
      {showApplyForm && (
        <div className="apply-leave-form">
          <h2>Apply for Leave</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Leave Type *</label>
                <select
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Leave Type</option>
                  {leaveTypes.filter(type => type.isActive).map(type => (
                    <option key={type._id} value={type._id}>
                      {type.name} ({type.code})
                    </option>
                  ))}
                </select>
                {leaveTypes.length === 0 && (
                  <p style={{ fontSize: '12px', color: '#dc3545', marginTop: '4px' }}>
                    No leave types available. Please contact HR to set up leave types.
                  </p>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Date *</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Date *</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isHalfDay"
                    checked={formData.isHalfDay}
                    onChange={handleInputChange}
                  />
                  Half Day Leave
                </label>
              </div>
              {formData.isHalfDay && (
                <div className="form-group">
                  <label>Session</label>
                  <select
                    name="halfDaySession"
                    value={formData.halfDaySession}
                    onChange={handleInputChange}
                  >
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                  </select>
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Reason *</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                rows="4"
                placeholder="Please provide a reason for your leave request"
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">Submit Request</button>
              <button type="button" className="btn-secondary" onClick={() => setShowApplyForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Leave Requests */}
      <div className="leave-requests-section">
        <div className="section-header">
          <h2>Leave Requests</h2>
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
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Applied On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map(request => (
                  <tr key={request._id}>
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
                      {request.isHalfDay && ' (Half Day)'}
                    </td>
                    <td className="reason-cell">{request.reason}</td>
                    <td>{getStatusBadge(request.status)}</td>
                    <td>{formatDate(request.createdAt)}</td>
                    <td>
                      {request.status === 'pending' && (
                        <button
                          className="btn-cancel"
                          onClick={() => handleCancel(request._id)}
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyLeaves;
