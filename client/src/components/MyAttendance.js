import React, { useState, useEffect } from 'react';
import attendanceService from '../services/attendanceService';
import { useAuth } from '../context/AuthContext';
import './MyAttendance.css';

const MyAttendance = ({ employeeId }) => {
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (employeeId) {
      fetchTodayAttendance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId]);

  // Auto-refresh every 30 seconds to update work duration
  useEffect(() => {
    if (employeeId && todayAttendance?.checkIn && !todayAttendance?.checkOut) {
      const interval = setInterval(() => {
        fetchTodayAttendance();
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId, todayAttendance]);

  const fetchTodayAttendance = async () => {
    try {
      setLoading(true);
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const todayDate = `${year}-${month}-${day}`;
      
      const records = await attendanceService.getAllAttendance({
        employeeId,
        startDate: todayDate,
        endDate: todayDate
      });
      
      if (records && records.length > 0) {
        setTodayAttendance(records[0]);
      } else {
        setTodayAttendance(null);
      }
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setError('Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      setError('');
      await attendanceService.checkIn(employeeId);
      setSuccess('Checked in successfully!');
      
      // Wait a bit then refresh to ensure backend has saved
      setTimeout(() => {
        fetchTodayAttendance();
      }, 500);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to check in');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleCheckOut = async () => {
    try {
      setError('');
      await attendanceService.checkOut(employeeId);
      setSuccess('Checked out successfully!');
      
      // Wait a bit then refresh to ensure backend has saved
      setTimeout(() => {
        fetchTodayAttendance();
      }, 500);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to check out');
      setTimeout(() => setError(''), 3000);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getWorkDuration = () => {
    if (!todayAttendance?.checkIn) return '0h 0m';
    
    const checkIn = new Date(todayAttendance.checkIn);
    const checkOut = todayAttendance.checkOut ? new Date(todayAttendance.checkOut) : new Date();
    const diff = checkOut - checkIn;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return <div className="my-attendance-card">Loading attendance...</div>;
  }

  if (!employeeId) {
    return (
      <div className="my-attendance-card">
        <h3>My Attendance</h3>
        <p className="no-employee">No employee profile linked to your account.</p>
      </div>
    );
  }

  return (
    <div className="my-attendance-card">
      <h3>📅 My Attendance - {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
      
      {error && <div className="alert-error">{error}</div>}
      {success && <div className="alert-success">{success}</div>}

      <div className="attendance-status">
        {todayAttendance ? (
          <div className="status-grid">
            <div className="status-item">
              <span className="status-label">Status:</span>
              <span className={`status-badge status-${todayAttendance.status.toLowerCase().replace(' ', '-')}`}>
                {todayAttendance.status}
              </span>
            </div>
            <div className="status-item">
              <span className="status-label">Check In:</span>
              <span className="status-value">{formatTime(todayAttendance.checkIn)}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Check Out:</span>
              <span className="status-value">{formatTime(todayAttendance.checkOut)}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Work Duration:</span>
              <span className="status-value">{getWorkDuration()}</span>
            </div>
          </div>
        ) : (
          <div className="no-attendance">
            <p>You haven't marked your attendance today</p>
          </div>
        )}
      </div>

      <div className="attendance-actions">
        {!todayAttendance?.checkIn ? (
          <button 
            className="btn-check-in" 
            onClick={handleCheckIn}
          >
            🕐 Check In
          </button>
        ) : !todayAttendance?.checkOut ? (
          <button 
            className="btn-check-out" 
            onClick={handleCheckOut}
          >
            🕐 Check Out
          </button>
        ) : (
          <div className="completed-message">
            ✅ Attendance completed for today
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAttendance;
