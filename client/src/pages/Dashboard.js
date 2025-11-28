import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import MyAttendance from '../components/MyAttendance';
import { getEmployeeStats, getEmployees } from '../services/employeeService';
import { getPerformanceStats, getPerformanceReviews } from '../services/performanceService';
import salaryService from '../services/salaryService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [employeeStats, setEmployeeStats] = useState(null);
  const [performanceStats, setPerformanceStats] = useState(null);
  const [myProfile, setMyProfile] = useState(null);
  const [myReviews, setMyReviews] = useState([]);
  const [mySalary, setMySalary] = useState(null);
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
      }
      
      // Load profile for all users (including managers and admins who might also be employees)
      const employees = await getEmployees();
      if (employees && employees.length > 0) {
        setMyProfile(employees[0]); // Backend returns only their profile
      }
      
      // Load reviews if not a manager
      if (!isManager()) {
        const reviews = await getPerformanceReviews();
        setMyReviews(reviews);
      }

      // Load salary details for employees
      if (!isManager()) {
        try {
          const salary = await salaryService.getMySalary();
          setMySalary(salary);
        } catch (error) {
          console.log('No salary record found');
        }
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

        {/* My Attendance Widget for all users with employee profile */}
        {myProfile && <MyAttendance employeeId={myProfile._id} />}

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
              <div className="employee-dashboard-section">
                {/* Quick Stats Overview */}
                <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                  <div className="stat-card">
                    <h3>Position</h3>
                    <div className="stat-value" style={{ fontSize: '1.2rem' }}>{myProfile.position}</div>
                    <small style={{ color: '#7f8c8d' }}>{myProfile.department?.name || 'Not assigned'}</small>
                  </div>

                  <div className="stat-card info">
                    <h3>Employment Status</h3>
                    <div className="stat-value" style={{ fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50px' }}>
                      <span className={`badge ${myProfile.status === 'active' ? 'badge-success' : myProfile.status === 'on-leave' ? 'badge-warning' : 'badge-danger'}`} style={{ textTransform: 'uppercase', fontSize: '0.9rem', padding: '8px 16px' }}>
                        {myProfile.status.replace('-', ' ')}
                      </span>
                    </div>
                    <small style={{ color: '#7f8c8d', display: 'block', marginTop: '8px' }}>
                      {myProfile.hireDate 
                        ? `Employed for ${Math.floor((new Date() - new Date(myProfile.hireDate)) / (1000 * 60 * 60 * 24))} days`
                        : 'Hire date not available'}
                    </small>
                  </div>

                  {mySalary && (
                    <div className="stat-card success">
                      <h3>Net Salary</h3>
                      <div className="stat-value" style={{ color: '#4caf50' }}>₹{mySalary.netSalary.toLocaleString()}</div>
                      <small style={{ color: '#7f8c8d' }}>Per month</small>
                    </div>
                  )}

                  <div className="stat-card warning">
                    <h3>Total Reviews</h3>
                    <div className="stat-value">{myReviews.length}</div>
                    <small style={{ color: '#7f8c8d' }}>
                      Avg: {myReviews.length > 0 
                        ? (myReviews.reduce((sum, r) => sum + r.overallRating, 0) / myReviews.length).toFixed(1)
                        : 'N/A'} ⭐
                    </small>
                  </div>
                </div>

                {/* Recent Performance Reviews - Show only latest 3 */}
                {myReviews.length > 0 && (
                  <div className="card" style={{ marginTop: '20px' }}>
                    <div className="card-header">
                      <h2>Recent Performance Reviews</h2>
                      <button 
                        className="btn btn-secondary"
                        onClick={() => navigate('/performance')}
                      >
                        View All
                      </button>
                    </div>
                    <div className="table-responsive">
                      <table>
                        <thead>
                          <tr>
                            <th>Review Period</th>
                            <th>Rating</th>
                            <th>Reviewer</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {myReviews.slice(0, 3).map((review) => (
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
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
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
