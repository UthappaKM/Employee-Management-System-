import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import MyAttendance from '../components/MyAttendance';
import attendanceService from '../services/attendanceService';
import { useAuth } from '../context/AuthContext';
import './Attendance.css';

const Attendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [viewableEmployees, setViewableEmployees] = useState([]);
  const [myProfile, setMyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const { user, isAdmin, isManager, isHR } = useAuth();

  useEffect(() => {
    fetchViewableEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (viewableEmployees.length > 0) {
      fetchAttendance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewableEmployees, selectedEmployee, startDate, endDate, statusFilter]);

  const fetchViewableEmployees = async () => {
    try {
      setLoading(true);
      const employees = await attendanceService.getViewableEmployees();
      setViewableEmployees(employees);
      
      // Set myProfile as the first employee if user is employee role
      if (employees.length === 1) {
        setMyProfile(employees[0]);
        setSelectedEmployee(employees[0]._id);
      }
    } catch (err) {
      setError('Failed to load employees');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const filters = {
        employeeId: selectedEmployee,
        startDate,
        endDate,
        status: statusFilter
      };

      const data = await attendanceService.getAllAttendance(filters);
      setAttendanceRecords(data);
    } catch (err) {
      setError('Failed to load attendance records');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceSummary = async (employeeId) => {
    try {
      const filters = { startDate, endDate };
      const summary = await attendanceService.getAttendanceSummary(employeeId, filters);
      setAttendanceSummary(summary);
      setShowSummaryModal(true);
    } catch (err) {
      setError('Failed to load summary');
      console.error(err);
      setTimeout(() => setError(''), 3000);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short'
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Present': return 'status-present';
      case 'Absent': return 'status-absent';
      case 'Late': return 'status-late';
      case 'Half Day': return 'status-halfday';
      case 'Leave': return 'status-leave';
      default: return '';
    }
  };

  const calculateWorkHours = (record) => {
    if (!record.checkIn) return '0.00';
    
    const checkIn = new Date(record.checkIn);
    const checkOut = record.checkOut ? new Date(record.checkOut) : new Date();
    const diff = checkOut - checkIn;
    const hours = diff / (1000 * 60 * 60);
    
    return hours.toFixed(2);
  };

  const canViewMultipleEmployees = isAdmin() || isManager() || isHR();

  return (
    <>
      <Navbar />
      <div className="attendance-container">
        <div className="attendance-header">
          <h1>
            {canViewMultipleEmployees ? 'Team Attendance Management' : 'My Attendance'}
          </h1>
          <div className="role-badge">
            {user?.role?.toUpperCase()} View
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {/* My Attendance Widget - Show for all users */}
        {myProfile && <MyAttendance employeeId={myProfile._id} />}

        {/* Filters Section - Only for Admin, Manager, HR */}
        {canViewMultipleEmployees && (
          <div className="filters-section">
            <h3>Filter Attendance Records</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'flex-end' }}>
              <div className="filter-group">
                <label>Employee:</label>
                <select 
                  value={selectedEmployee} 
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                >
                  <option value="">All Employees</option>
                  {viewableEmployees.map(emp => (
                    <option key={emp._id} value={emp._id}>
                      {emp.firstName} {emp.lastName}
                      {emp.userId && ` - ${emp.userId.role}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Status:</label>
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late">Late</option>
                  <option value="Half Day">Half Day</option>
                  <option value="Leave">Leave</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Start Date:</label>
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="filter-group">
                <label>End Date:</label>
                <input 
                  type="date" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <button 
                className="btn-secondary" 
                onClick={() => {
                  setSelectedEmployee('');
                  setStatusFilter('');
                  setStartDate('');
                  setEndDate('');
                }}
              >
                Clear Filters
              </button>

              {selectedEmployee && (
                <button 
                  className="btn-info" 
                  onClick={() => fetchAttendanceSummary(selectedEmployee)}
                >
                  View Summary
                </button>
              )}
            </div>
          </div>
        )}

        {/* Simple filters for employees */}
        {!canViewMultipleEmployees && (
          <div className="filters-section">
            <h3>Filter My History</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'flex-end' }}>
              <div className="filter-group">
                <label>Start Date:</label>
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="filter-group">
                <label>End Date:</label>
                <input 
                  type="date" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <button 
                className="btn-secondary" 
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                }}
              >
                Clear Filters
              </button>

              {myProfile && (
                <button 
                  className="btn-info" 
                  onClick={() => fetchAttendanceSummary(myProfile._id)}
                >
                  View My Summary
                </button>
              )}
            </div>
          </div>
        )}

        {/* Attendance Records Table */}
        <div className="attendance-table-container">
          <h2>
            {selectedEmployee 
              ? `Attendance Records - ${viewableEmployees.find(e => e._id === selectedEmployee)?.firstName || ''} ${viewableEmployees.find(e => e._id === selectedEmployee)?.lastName || ''}`
              : canViewMultipleEmployees 
                ? 'All Attendance Records' 
                : 'My Attendance History'}
          </h2>
          {loading ? (
            <p className="loading">Loading attendance records...</p>
          ) : attendanceRecords.length === 0 ? (
            <p className="no-data">No attendance records found</p>
          ) : (
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Day</th>
                  {canViewMultipleEmployees && <th>Employee</th>}
                  {canViewMultipleEmployees && <th>Department</th>}
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Work Hours</th>
                  <th>Status</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map(record => (
                  <tr key={record._id}>
                    <td>{formatDate(record.date)}</td>
                    <td>{new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' })}</td>
                    {canViewMultipleEmployees && (
                      <td>
                        {record.employee?.firstName} {record.employee?.lastName}
                        <br />
                        <small style={{ color: '#6c757d' }}>ID: {record.employee?.employeeId}</small>
                      </td>
                    )}
                    {canViewMultipleEmployees && (
                      <td>{record.employee?.department?.name || 'N/A'}</td>
                    )}
                    <td>{formatTime(record.checkIn)}</td>
                    <td>{formatTime(record.checkOut)}</td>
                    <td>{calculateWorkHours(record)} hrs</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td>{record.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Summary Modal */}
        {showSummaryModal && attendanceSummary && (
          <div className="modal-overlay" onClick={() => setShowSummaryModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowSummaryModal(false)}>
                &times;
              </button>
              <div className="summary-modal">
                <h2>Attendance Summary</h2>
                <div className="summary-grid">
                  <div className="summary-item">
                    <span className="summary-label">Total Days:</span>
                    <span className="summary-value">{attendanceSummary.totalDays}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Present:</span>
                    <span className="summary-value status-present">{attendanceSummary.present}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Absent:</span>
                    <span className="summary-value status-absent">{attendanceSummary.absent}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Late:</span>
                    <span className="summary-value status-late">{attendanceSummary.late}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Half Day:</span>
                    <span className="summary-value status-halfday">{attendanceSummary.halfDay}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Leave:</span>
                    <span className="summary-value status-leave">{attendanceSummary.leave}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Total Work Hours:</span>
                    <span className="summary-value">{attendanceSummary.totalWorkHours.toFixed(2)} hrs</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Average Work Hours:</span>
                    <span className="summary-value">{attendanceSummary.averageWorkHours} hrs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Attendance;
