import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getPerformanceReviews, deletePerformanceReview } from '../services/performanceService';
import { useNavigate } from 'react-router-dom';
import './Performance.css';

const Performance = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const data = await getPerformanceReviews();
      setReviews(data);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this performance review?')) {
      try {
        await deletePerformanceReview(id);
        loadReviews();
      } catch (error) {
        alert('Error deleting review: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      draft: 'badge-warning',
      submitted: 'badge-info',
      reviewed: 'badge-success',
      acknowledged: 'badge-success'
    };
    return badges[status] || 'badge-info';
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="loading">Loading performance reviews</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container performance-page">
        <div className="page-header">
          <h1>Performance Reviews</h1>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/performance/new')}
          >
            + Create Review
          </button>
        </div>

        <div className="card">
          {reviews.length === 0 ? (
            <p className="no-data">No performance reviews found.</p>
          ) : (
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Review Period</th>
                    <th>Overall Rating</th>
                    <th>Reviewer</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review) => (
                    <tr key={review._id}>
                      <td>
                        {review.employee?.firstName} {review.employee?.lastName}
                      </td>
                      <td>
                        {new Date(review.reviewPeriod.startDate).toLocaleDateString()} - <br />
                        {new Date(review.reviewPeriod.endDate).toLocaleDateString()}
                      </td>
                      <td>
                        <span className="rating-badge">{review.overallRating}/5</span>
                      </td>
                      <td>{review.reviewer?.name}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(review.status)}`}>
                          {review.status}
                        </span>
                      </td>
                      <td className="actions">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => navigate(`/performance/${review._id}`)}
                        >
                          View
                        </button>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => navigate(`/performance/${review._id}/edit`)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(review._id)}
                        >
                          Delete
                        </button>
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

export default Performance;
