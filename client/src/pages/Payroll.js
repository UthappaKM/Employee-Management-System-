import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import payrollService from '../services/payrollService';
import employeeService from '../services/employeeService';
import { useAuth } from '../context/AuthContext';
import './Payroll.css';

const Payroll = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    status: '',
    employeeId: ''
  });
  const [generateData, setGenerateData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    employeeIds: []
  });
  const [paymentData, setPaymentData] = useState({
    paymentMethod: 'Bank Transfer',
    transactionId: '',
    notes: ''
  });

  const { user, isHR, isAdmin, isManager } = useAuth();

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await payrollService.getAllPayrolls(filters);
      setPayrolls(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load payroll');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const data = await employeeService.getEmployees();
      setEmployees(data);
    } catch (err) {
      console.error('Failed to load employees:', err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const clearFilters = () => {
    setFilters({
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      status: '',
      employeeId: ''
    });
  };

  const handleGenerateSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const result = await payrollService.generatePayroll(generateData);
      setSuccess(`Generated ${result.generatedPayrolls.length} payroll records`);
      if (result.errors && result.errors.length > 0) {
        setError(`Some records failed: ${result.errors.length} errors`);
      }
      fetchData();
      setShowGenerateModal(false);
      setTimeout(() => {
        setSuccess('');
        setError('');
      }, 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate payroll');
    }
  };

  const handleApprove = async (id) => {
    try {
      await payrollService.updatePayrollStatus(id, 'Approved');
      setSuccess('Payroll approved successfully');
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve payroll');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleReject = async (id) => {
    if (window.confirm('Are you sure you want to reject this payroll?')) {
      try {
        await payrollService.updatePayrollStatus(id, 'Rejected');
        setSuccess('Payroll rejected');
        fetchData();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to reject payroll');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const openPayModal = (payroll) => {
    setSelectedPayroll(payroll);
    setPaymentData({
      paymentMethod: 'Bank Transfer',
      transactionId: '',
      notes: ''
    });
    setShowPayModal(true);
  };

  const handlePaySubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await payrollService.markAsPaid(selectedPayroll._id, paymentData);
      setSuccess('Payment recorded successfully');
      fetchData();
      setShowPayModal(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record payment');
    }
  };

  const getMonthName = (month) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1];
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'Approved': return 'status-approved';
      case 'Paid': return 'status-paid';
      case 'Rejected': return 'status-rejected';
      default: return '';
    }
  };

  const canManagePayroll = isHR() || isAdmin();

  return (
    <>
      <Navbar />
      <div className="payroll-container">
        <div className="payroll-header">
          <h1>Payroll Management</h1>
          {canManagePayroll && (
            <button className="btn-primary" onClick={() => setShowGenerateModal(true)}>
              + Generate Payroll
            </button>
          )}
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* Filters */}
        <div className="filters-section">
          <h3>Filter Payroll Records</h3>
          <div className="filters-grid">
            <div className="filter-group">
              <label>Month:</label>
              <select name="month" value={filters.month} onChange={handleFilterChange}>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{getMonthName(i + 1)}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Year:</label>
              <select name="year" value={filters.year} onChange={handleFilterChange}>
                {[...Array(5)].map((_, i) => {
                  const year = new Date().getFullYear() - i;
                  return <option key={year} value={year}>{year}</option>;
                })}
              </select>
            </div>

            {canManagePayroll && (
              <div className="filter-group">
                <label>Employee:</label>
                <select name="employeeId" value={filters.employeeId} onChange={handleFilterChange}>
                  <option value="">All Employees</option>
                  {employees.map(emp => (
                    <option key={emp._id} value={emp._id}>
                      {emp.firstName} {emp.lastName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="filter-group">
              <label>Status:</label>
              <select name="status" value={filters.status} onChange={handleFilterChange}>
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Paid">Paid</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <button className="btn-secondary" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        </div>

        {/* Payroll Table */}
        <div className="payroll-table-container">
          <h2>Payroll Records - {getMonthName(filters.month)} {filters.year}</h2>
          {loading ? (
            <p className="loading">Loading payroll records...</p>
          ) : payrolls.length === 0 ? (
            <p className="no-data">No payroll records found</p>
          ) : (
            <table className="payroll-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  {canManagePayroll && <th>Department</th>}
                  <th>Month/Year</th>
                  <th>Working Days</th>
                  <th>Present</th>
                  <th>Gross Salary</th>
                  <th>Net Salary</th>
                  <th>Status</th>
                  {canManagePayroll && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {payrolls.map(payroll => (
                  <tr key={payroll._id}>
                    <td>
                      {payroll.employee?.firstName} {payroll.employee?.lastName}
                      <br />
                      <small>ID: {payroll.employee?.employeeId}</small>
                    </td>
                    {canManagePayroll && <td>{payroll.employee?.department?.name || 'N/A'}</td>}
                    <td>{getMonthName(payroll.month)} {payroll.year}</td>
                    <td>{payroll.workingDays}</td>
                    <td>
                      {payroll.presentDays}
                      {payroll.halfDays > 0 && ` + ${payroll.halfDays} half`}
                      {payroll.lateDays > 0 && ` + ${payroll.lateDays} late`}
                    </td>
                    <td>₹{payroll.grossSalary.toLocaleString()}</td>
                    <td className="net-salary">₹{payroll.netSalary.toLocaleString()}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(payroll.status)}`}>
                        {payroll.status}
                      </span>
                    </td>
                    {canManagePayroll && (
                      <td>
                        {payroll.status === 'Pending' && (
                          <>
                            <button className="btn-approve" onClick={() => handleApprove(payroll._id)}>
                              Approve
                            </button>
                            <button className="btn-reject" onClick={() => handleReject(payroll._id)}>
                              Reject
                            </button>
                          </>
                        )}
                        {payroll.status === 'Approved' && (
                          <button className="btn-pay" onClick={() => openPayModal(payroll)}>
                            Mark as Paid
                          </button>
                        )}
                        {payroll.status === 'Paid' && payroll.paidDate && (
                          <small>
                            Paid on {new Date(payroll.paidDate).toLocaleDateString()}
                          </small>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Generate Payroll Modal */}
        {showGenerateModal && (
          <div className="modal-overlay" onClick={() => setShowGenerateModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowGenerateModal(false)}>&times;</button>
              <h2>Generate Payroll</h2>

              <form onSubmit={handleGenerateSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Month *</label>
                    <select
                      value={generateData.month}
                      onChange={(e) => setGenerateData({ ...generateData, month: parseInt(e.target.value) })}
                      required
                    >
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{getMonthName(i + 1)}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Year *</label>
                    <select
                      value={generateData.year}
                      onChange={(e) => setGenerateData({ ...generateData, year: parseInt(e.target.value) })}
                      required
                    >
                      {[...Array(5)].map((_, i) => {
                        const year = new Date().getFullYear() - i;
                        return <option key={year} value={year}>{year}</option>;
                      })}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Employees (Leave empty for all)</label>
                  <select
                    multiple
                    value={generateData.employeeIds}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, option => option.value);
                      setGenerateData({ ...generateData, employeeIds: selected });
                    }}
                    style={{ height: '200px' }}
                  >
                    {employees.map(emp => (
                      <option key={emp._id} value={emp._id}>
                        {emp.firstName} {emp.lastName} - {emp.employeeId}
                      </option>
                    ))}
                  </select>
                  <small>Hold Ctrl/Cmd to select multiple employees</small>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowGenerateModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Generate Payroll
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPayModal && selectedPayroll && (
          <div className="modal-overlay" onClick={() => setShowPayModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowPayModal(false)}>&times;</button>
              <h2>Mark Payroll as Paid</h2>

              <div className="payroll-summary">
                <p><strong>Employee:</strong> {selectedPayroll.employee?.firstName} {selectedPayroll.employee?.lastName}</p>
                <p><strong>Period:</strong> {getMonthName(selectedPayroll.month)} {selectedPayroll.year}</p>
                <p><strong>Net Salary:</strong> ₹{selectedPayroll.netSalary.toLocaleString()}</p>
              </div>

              <form onSubmit={handlePaySubmit}>
                <div className="form-group">
                  <label>Payment Method *</label>
                  <select
                    value={paymentData.paymentMethod}
                    onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
                    required
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Transaction ID</label>
                  <input
                    type="text"
                    value={paymentData.transactionId}
                    onChange={(e) => setPaymentData({ ...paymentData, transactionId: e.target.value })}
                    placeholder="Enter transaction/reference ID"
                  />
                </div>

                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    value={paymentData.notes}
                    onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
                    rows="3"
                    placeholder="Additional payment notes..."
                  ></textarea>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowPayModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Confirm Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Payroll;
