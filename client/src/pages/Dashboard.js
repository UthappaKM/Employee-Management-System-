import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getEmployeeStats, getEmployees } from '../services/employeeService';
import { getPerformanceStats, getPerformanceReviews } from '../services/performanceService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [employeeStats, setEmployeeStats] = useState(null);
  const [performanceStats, setPerformanceStats] = useState(null);
  const [myProfile, setMyProfile] = useState(null);
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isManager } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Only admin and managers can see stats
      if (isManager()) {
        const empStats = await getEmployeeStats();
        setEmployeeStats(empStats);

        const perfStats = await getPerformanceStats();
        setPerformanceStats(perfStats);
      } else {
        // For regular employees, load their profile and reviews
        const employees = await getEmployees();
        if (employees && employees.length > 0) {
          setMyProfile(employees[0]); // Backend returns only their profile
        }
        
        const reviews = await getPerformanceReviews();
        setMyReviews(reviews);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="loading">Loading dashboard</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container dashboard">
        <h1>Dashboard</h1>
        <p className="welcome-text">Welcome back, {user?.name}!</p>

        {/* Show stats only for Admin/Manager */}
        {isManager() && employeeStats && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Employees</h3>
                <div className="stat-value">{employeeStats?.totalEmployees || 0}</div>
              </div>

              <div className="stat-card success">
                <h3>Active Employees</h3>
                <div className="stat-value">{employeeStats?.activeEmployees || 0}</div>
              </div>

              <div className="stat-card warning">
                <h3>On Leave</h3>
                <div className="stat-value">{employeeStats?.onLeave || 0}</div>
              </div>

              <div className="stat-card danger">
                <h3>Inactive</h3>
                <div className="stat-value">{employeeStats?.inactiveEmployees || 0}</div>
              </div>
            </div>

            {performanceStats && (
              <div className="performance-section">
                <h2>Performance Overview</h2>
                <div className="stats-grid">
                  <div className="stat-card">
                    <h3>Total Reviews</h3>
                    <div className="stat-value">{performanceStats.totalReviews || 0}</div>
                  </div>

                  <div className="stat-card info">
                    <h3>Average Rating</h3>
                    <div className="stat-value">{performanceStats.averageRating || 0}</div>
                  </div>
                </div>
              </div>
            )}

            {employeeStats?.departmentStats && employeeStats.departmentStats.length > 0 && (
              <div className="department-section">
                <h2>Department Distribution</h2>
                <div className="card">
                  <table>
                    <thead>
                      <tr>
                        <th>Department</th>
                        <th>Employee Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employeeStats.departmentStats.map((dept, index) => (
                        <tr key={index}>
                          <td>{dept.departmentName}</td>
                          <td>{dept.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Message for regular employees */}
        {!isManager() && (
          <>
            {myProfile ? (
              <div className="employee-profile-section">
                <div className="card">
                  <h2>My Profile</h2>
                  <div className="profile-grid">
                    <div className="profile-item">
                      <label>Full Name:</label>
                      <span>{myProfile.firstName} {myProfile.lastName}</span>
                    </div>
                    <div className="profile-item">
                      <label>Email:</label>
                      <span>{myProfile.email}</span>
                    </div>
                    <div className="profile-item">
                      <label>Phone:</label>
                      <span>{myProfile.phone || 'Not provided'}</span>
                    </div>
                    <div className="profile-item">
                      <label>Position:</label>
                      <span>{myProfile.position}</span>
                    </div>
                    <div className="profile-item">
                      <label>Department:</label>
                      <span>{myProfile.department?.name || 'Not assigned'}</span>
                    </div>
                    <div className="profile-item">
                      <label>Manager:</label>
                      <span>
                        {myProfile.manager 
                          ? `${myProfile.manager.firstName} ${myProfile.manager.lastName}`
                          : 'Not assigned'}
                      </span>
                    </div>
                    <div className="profile-item">
                      <label>Hire Date:</label>
                      <span>{myProfile.hireDate ? new Date(myProfile.hireDate).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div className="profile-item">
                      <label>Status:</label>
                      <span className={`badge ${myProfile.status === 'active' ? 'badge-success' : myProfile.status === 'on-leave' ? 'badge-warning' : 'badge-danger'}`}>
                        {myProfile.status}
                      </span>
                    </div>
                    <div className="profile-item">
                      <label>Salary:</label>
                      <span>${myProfile.salary ? myProfile.salary.toLocaleString() : 'N/A'}</span>
                    </div>
                    <div className="profile-item full-width">
                      <label>Address:</label>
                      <span>
                        {myProfile.address && (myProfile.address.street || myProfile.address.city || myProfile.address.state)
                          ? `${myProfile.address.street ? myProfile.address.street + ', ' : ''}${myProfile.address.city ? myProfile.address.city + ', ' : ''}${myProfile.address.state ? myProfile.address.state + ' ' : ''}${myProfile.address.zipCode || ''}${myProfile.address.country ? ', ' + myProfile.address.country : ''}`
                          : 'Not provided'}
                      </span>
                    </div>
                  </div>
                  <div style={{ marginTop: '20px' }}>
                    <button 
                      className="btn btn-primary"
                      onClick={() => navigate(`/employees/${myProfile._id}`)}
                    >
                      View Full Profile
                    </button>
                  </div>
                </div>

                {/* Performance Reviews Section */}
                <div className="card" style={{ marginTop: '20px' }}>
                  <h2>My Performance Reviews</h2>
                  {myReviews.length === 0 ? (
                    <p style={{ color: '#666', marginTop: '10px' }}>No performance reviews yet.</p>
                  ) : (
                    <div className="table-responsive">
                      <table>
                        <thead>
                          <tr>
                            <th>Review Period</th>
                            <th>Rating</th>
                            <th>Reviewer</th>
                            <th>Date</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {myReviews.map((review) => (
                            <tr key={review._id}>
                              <td>{review.reviewPeriod}</td>
                              <td>
                                <span className="rating-badge">
                                  {'⭐'.repeat(review.overallRating)}
                                  {' '}
                                  {review.overallRating}/5
                                </span>
                              </td>
                              <td>{review.reviewer?.name || 'N/A'}</td>
                              <td>{new Date(review.reviewDate).toLocaleDateString()}</td>
                              <td>
                                <span className={`badge ${review.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                                  {review.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Quick Stats for Employee */}
                <div className="stats-grid" style={{ marginTop: '20px' }}>
                  <div className="stat-card info">
                    <h3>Total Reviews</h3>
                    <div className="stat-value">{myReviews.length}</div>
                  </div>
                  <div className="stat-card success">
                    <h3>Average Rating</h3>
                    <div className="stat-value">
                      {myReviews.length > 0 
                        ? (myReviews.reduce((sum, r) => sum + r.overallRating, 0) / myReviews.length).toFixed(1)
                        : 'N/A'}
                    </div>
                  </div>
                  <div className="stat-card warning">
                    <h3>Days Employed</h3>
                    <div className="stat-value">
                      {myProfile.hireDate 
                        ? Math.floor((new Date() - new Date(myProfile.hireDate)) / (1000 * 60 * 60 * 24))
                        : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card">
                <h2>Employee Dashboard</h2>
                <p>No employee profile found. Please contact your administrator to set up your profile.</p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;
