import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getEmployees } from '../services/employeeService';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const MyProfile = () => {
  const [myProfile, setMyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const employees = await getEmployees();
      if (employees && employees.length > 0) {
        setMyProfile(employees[0]);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="loading">Loading profile...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container dashboard">
        <h1>My Profile</h1>
        
        {myProfile ? (
          <div className="employee-profile-section">
            <div className="card">
              <h2>Personal Information</h2>
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
                  <label>Date of Birth:</label>
                  <span>{myProfile.dateOfBirth ? new Date(myProfile.dateOfBirth).toLocaleDateString() : 'Not provided'}</span>
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
            </div>

            <div className="card" style={{ marginTop: '20px' }}>
              <h2>Employment Details</h2>
              <div className="profile-grid">
                <div className="profile-item">
                  <label>Employee ID:</label>
                  <span>{myProfile.employeeId || 'Not assigned'}</span>
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
                  <label>Days Employed:</label>
                  <span>
                    {myProfile.hireDate 
                      ? `${Math.floor((new Date() - new Date(myProfile.hireDate)) / (1000 * 60 * 60 * 24))} days`
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {myProfile.bankDetails && myProfile.bankDetails.accountNumber && (
              <div className="card" style={{ marginTop: '20px' }}>
                <h2>Bank Details</h2>
                <div className="profile-grid">
                  <div className="profile-item">
                    <label>Account Holder:</label>
                    <span>{myProfile.bankDetails.accountHolderName}</span>
                  </div>
                  <div className="profile-item">
                    <label>Account Number:</label>
                    <span>{myProfile.bankDetails.accountNumber}</span>
                  </div>
                  <div className="profile-item">
                    <label>Bank Name:</label>
                    <span>{myProfile.bankDetails.bankName}</span>
                  </div>
                  <div className="profile-item">
                    <label>IFSC Code:</label>
                    <span>{myProfile.bankDetails.ifscCode}</span>
                  </div>
                  <div className="profile-item">
                    <label>Branch:</label>
                    <span>{myProfile.bankDetails.branch || 'Not provided'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="card">
            <p>No profile found. Please contact your administrator.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default MyProfile;
