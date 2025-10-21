import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useParams, useNavigate } from 'react-router-dom';
import { getEmployeeById } from '../services/employeeService';
import { getEmployeeReviews } from '../services/performanceService';
import './EmployeeDetail.css';

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmployeeData();
  }, [id]);

  const loadEmployeeData = async () => {
    try {
      const [empData, reviewsData] = await Promise.all([
        getEmployeeById(id),
        getEmployeeReviews(id)
      ]);
      setEmployee(empData);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error loading employee:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="loading">Loading employee details</div>
        </div>
      </>
    );
  }

  if (!employee) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="alert alert-error">Employee not found</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container employee-detail-page">
        <div className="page-header">
          <h1>Employee Details</h1>
          <button className="btn btn-secondary" onClick={() => navigate('/employees')}>
            Back to List
          </button>
        </div>

        <div className="card">
          <div className="detail-section">
            <h2>{employee.firstName} {employee.lastName}</h2>
            <span className={`badge badge-${employee.status === 'active' ? 'success' : 'danger'}`}>
              {employee.status}
            </span>
          </div>

          <div className="detail-grid">
            <div className="detail-item">
              <strong>Email:</strong>
              <span>{employee.email}</span>
            </div>
            <div className="detail-item">
              <strong>Phone:</strong>
              <span>{employee.phone || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <strong>Position:</strong>
              <span>{employee.position}</span>
            </div>
            <div className="detail-item">
              <strong>Department:</strong>
              <span>{employee.department?.name}</span>
            </div>
            <div className="detail-item">
              <strong>Date of Joining:</strong>
              <span>{employee.dateOfJoining ? new Date(employee.dateOfJoining).toLocaleDateString() : 'N/A'}</span>
            </div>
            <div className="detail-item">
              <strong>Salary:</strong>
              <span>{employee.salary ? `$${employee.salary.toLocaleString()}` : 'N/A'}</span>
            </div>
          </div>

          {employee.address && (employee.address.street || employee.address.city) && (
            <>
              <h3>Address</h3>
              <div className="detail-grid">
                <div className="detail-item full-width">
                  <strong>Street:</strong>
                  <span>{employee.address.street || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <strong>City:</strong>
                  <span>{employee.address.city || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <strong>State:</strong>
                  <span>{employee.address.state || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <strong>Zip Code:</strong>
                  <span>{employee.address.zipCode || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <strong>Country:</strong>
                  <span>{employee.address.country || 'N/A'}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {reviews.length > 0 && (
          <div className="card">
            <h3>Performance Reviews</h3>
            <table>
              <thead>
                <tr>
                  <th>Review Period</th>
                  <th>Overall Rating</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review._id}>
                    <td>
                      {new Date(review.reviewPeriod.startDate).toLocaleDateString()} - {new Date(review.reviewPeriod.endDate).toLocaleDateString()}
                    </td>
                    <td>{review.overallRating}/5</td>
                    <td>
                      <span className={`badge badge-${review.status === 'reviewed' ? 'success' : 'warning'}`}>
                        {review.status}
                      </span>
                    </td>
                    <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default EmployeeDetail;
