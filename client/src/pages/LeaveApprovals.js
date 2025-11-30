import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import leaveService from '../services/leaveService';
import './LeaveApprovals.css';

const LeaveApprovals = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionComments, setActionComments] = useState('');
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState(''); // 'approve' or 'reject'

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const fetchPendingApprovals = async () => {
    try {
      setLoading(true);
      const data = await leaveService.getPendingApprovals();
      setPendingApprovals(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch pending approvals');
    } finally {
      setLoading(false);
    }
  };

  const openActionModal = (request, type) => {
    setSelectedRequest(request);
    setActionType(type);
    setActionComments('');
    setShowActionModal(true);
  };

  const closeActionModal = () => {
    setSelectedRequest(null);
    setActionType('');
    setActionComments('');
    setShowActionModal(false);
  };

  const handleApprove = async () => {
    try {
      await leaveService.approveLeaveRequest(selectedRequest._id, actionComments);
      setSuccess('Leave request approved successfully');
      closeActionModal();
      fetchPendingApprovals();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve leave request');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleReject = async () => {
    if (!actionComments.trim()) {
      setError('Please provide a reason for rejection');
      setTimeout(() => setError(''), 3000);
      return;
    }
    try {
      await leaveService.rejectLeaveRequest(selectedRequest._id, actionComments);
      setSuccess('Leave request rejected');
      closeActionModal();
      fetchPendingApprovals();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject leave request');
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

  const getApprovalStage = (request) => {
    const currentStage = request.approvalChain.find(a => a.approver?.toString() === user.id);
    return currentStage?.role || '';
  };

  const getApprovalHistory = (request) => {
    return request.approvalChain.filter(a => a.status !== 'pending');
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="leave-approvals-container">
      <div className="page-header">
        <div className="header-left">
          <button className="btn-back" onClick={() => navigate('/dashboard')} title="Back to Dashboard">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back
          </button>
          <h1>Leave Approvals</h1>
        </div>
        <button className="btn-refresh" onClick={fetchPendingApprovals}>
          Refresh
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {pendingApprovals.length === 0 ? (
        <div className="no-approvals">
          <p>No pending leave approvals</p>
        </div>
      ) : (
        <div className="approvals-grid">
          {pendingApprovals.map(request => (
            <div key={request._id} className="approval-card">
              <div className="card-header">
                <div className="employee-info">
                  <h3>{request.employee?.name}</h3>
                  <span className="employee-id">{request.employee?.employeeId}</span>
                </div>
                <div className="approval-stage">
                  <span className="stage-badge">{getApprovalStage(request)}</span>
                </div>
              </div>

              <div className="card-body">
                <div className="leave-info">
                  <div className="info-row">
                    <span className="label">Leave Type:</span>
                    <span className="value">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          backgroundColor: request.leaveType?.color || '#007bff'
                        }} />
                        {request.leaveType?.name}
                      </div>
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="label">Duration:</span>
                    <span className="value">
                      {formatDate(request.startDate)} - {formatDate(request.endDate)}
                      {request.isHalfDay && ` (Half Day - ${request.halfDaySession})`}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="label">Total Days:</span>
                    <span className="value">{request.totalDays}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Reason:</span>
                    <span className="value reason-text">{request.reason}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Applied On:</span>
                    <span className="value">{formatDate(request.createdAt)}</span>
                  </div>
                </div>

                {getApprovalHistory(request).length > 0 && (
                  <div className="approval-history">
                    <h4>Approval History</h4>
                    {getApprovalHistory(request).map((approval, index) => (
                      <div key={index} className="history-item">
                        <div className="history-header">
                          <span className="approver-role">{approval.role}</span>
                          <span className={`approval-status ${approval.status}`}>
                            {approval.status}
                          </span>
                        </div>
                        {approval.comments && (
                          <p className="approval-comments">{approval.comments}</p>
                        )}
                        <span className="approval-date">
                          {formatDate(approval.actionDate)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="card-actions">
                <button
                  className="btn-approve"
                  onClick={() => openActionModal(request, 'approve')}
                >
                  Approve
                </button>
                <button
                  className="btn-reject"
                  onClick={() => openActionModal(request, 'reject')}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Modal */}
      {showActionModal && (
        <div className="modal-overlay" onClick={closeActionModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{actionType === 'approve' ? 'Approve' : 'Reject'} Leave Request</h2>
              <button className="close-btn" onClick={closeActionModal}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="request-summary">
                <p><strong>Employee:</strong> {selectedRequest?.employee?.name}</p>
                <p><strong>Leave Type:</strong> {selectedRequest?.leaveType?.name}</p>
                <p><strong>Duration:</strong> {formatDate(selectedRequest?.startDate)} - {formatDate(selectedRequest?.endDate)}</p>
                <p><strong>Total Days:</strong> {selectedRequest?.totalDays}</p>
              </div>
              <div className="form-group">
                <label>
                  Comments {actionType === 'reject' && <span className="required">*</span>}
                </label>
                <textarea
                  value={actionComments}
                  onChange={(e) => setActionComments(e.target.value)}
                  rows="4"
                  placeholder={actionType === 'approve' ? 'Add optional comments' : 'Provide reason for rejection'}
                />
              </div>
            </div>
            <div className="modal-actions">
              {actionType === 'approve' ? (
                <button className="btn-approve" onClick={handleApprove}>
                  Confirm Approval
                </button>
              ) : (
                <button className="btn-reject" onClick={handleReject}>
                  Confirm Rejection
                </button>
              )}
              <button className="btn-cancel" onClick={closeActionModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveApprovals;
