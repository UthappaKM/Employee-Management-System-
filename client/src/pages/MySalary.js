import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import salaryService from '../services/salaryService';
import './Dashboard.css';

const MySalary = () => {
  const [mySalary, setMySalary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSalary();
  }, []);

  const loadSalary = async () => {
    try {
      const salary = await salaryService.getMySalary();
      setMySalary(salary);
    } catch (error) {
      setError('No salary record found. Please contact HR.');
      console.error('Error loading salary:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="loading">Loading salary details...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container dashboard">
        <h1>My Salary Details</h1>
        
        {error ? (
          <div className="card">
            <p style={{ color: '#e74c3c' }}>{error}</p>
          </div>
        ) : mySalary ? (
          <>
            {/* Salary Overview */}
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Basic Salary</h3>
                <div className="stat-value">₹{mySalary.basicSalary.toLocaleString()}</div>
                <small style={{ color: '#7f8c8d' }}>Base pay</small>
              </div>
              <div className="stat-card info">
                <h3>Gross Salary</h3>
                <div className="stat-value">₹{mySalary.grossSalary.toLocaleString()}</div>
                <small style={{ color: '#7f8c8d' }}>Before deductions</small>
              </div>
              <div className="stat-card warning">
                <h3>Total Deductions</h3>
                <div className="stat-value">₹{mySalary.totalDeductions.toLocaleString()}</div>
                <small style={{ color: '#7f8c8d' }}>All deductions</small>
              </div>
              <div className="stat-card success">
                <h3>Net Salary</h3>
                <div className="stat-value" style={{ color: '#4caf50' }}>₹{mySalary.netSalary.toLocaleString()}</div>
                <small style={{ color: '#7f8c8d' }}>Take home pay</small>
              </div>
            </div>

            {/* Salary Details */}
            <div className="card" style={{ marginTop: '2rem' }}>
              <h2>Payment Information</h2>
              <div className="profile-grid">
                <div className="profile-item">
                  <label>Payment Mode:</label>
                  <span>{mySalary.paymentMode}</span>
                </div>
                <div className="profile-item">
                  <label>Currency:</label>
                  <span>{mySalary.currency || 'USD'}</span>
                </div>
                <div className="profile-item">
                  <label>Effective Date:</label>
                  <span>{new Date(mySalary.effectiveDate).toLocaleDateString()}</span>
                </div>
                <div className="profile-item">
                  <label>Last Updated:</label>
                  <span>{new Date(mySalary.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Allowances */}
            {mySalary.allowances && mySalary.allowances.length > 0 && (
              <div className="card" style={{ marginTop: '2rem' }}>
                <h2>Allowances</h2>
                <div className="table-responsive">
                  <table>
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mySalary.allowances.map((allowance, index) => (
                        <tr key={index}>
                          <td>{allowance.name || allowance.type}</td>
                          <td>₹{allowance.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                      <tr style={{ fontWeight: 'bold', background: '#f8f9fa' }}>
                        <td>Total Allowances</td>
                        <td style={{ color: '#4caf50' }}>
                          ₹{mySalary.allowances.reduce((sum, a) => sum + a.amount, 0).toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Deductions */}
            {mySalary.deductions && mySalary.deductions.length > 0 && (
              <div className="card" style={{ marginTop: '2rem' }}>
                <h2>Deductions</h2>
                <div className="table-responsive">
                  <table>
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mySalary.deductions.map((deduction, index) => (
                        <tr key={index}>
                          <td>{deduction.name || deduction.type}</td>
                          <td>₹{deduction.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                      <tr style={{ fontWeight: 'bold', background: '#f8f9fa' }}>
                        <td>Total Deductions</td>
                        <td style={{ color: '#e74c3c' }}>
                          ₹{mySalary.deductions.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Bank Details */}
            {mySalary.bankDetails && mySalary.bankDetails.accountNumber && (
              <div className="card" style={{ marginTop: '2rem' }}>
                <h2>Bank Details for Salary Payment</h2>
                <div className="profile-grid">
                  <div className="profile-item">
                    <label>Account Holder Name:</label>
                    <span>{mySalary.bankDetails.accountHolderName}</span>
                  </div>
                  <div className="profile-item">
                    <label>Account Number:</label>
                    <span>{mySalary.bankDetails.accountNumber}</span>
                  </div>
                  <div className="profile-item">
                    <label>Bank Name:</label>
                    <span>{mySalary.bankDetails.bankName}</span>
                  </div>
                  <div className="profile-item">
                    <label>IFSC Code:</label>
                    <span>{mySalary.bankDetails.ifscCode}</span>
                  </div>
                  {mySalary.bankDetails.branch && (
                    <div className="profile-item">
                      <label>Branch:</label>
                      <span>{mySalary.bankDetails.branch}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            {mySalary.notes && (
              <div className="card" style={{ marginTop: '2rem' }}>
                <h2>Additional Notes</h2>
                <p style={{ color: '#7f8c8d', marginTop: '10px' }}>{mySalary.notes}</p>
              </div>
            )}
          </>
        ) : (
          <div className="card">
            <p>No salary information available.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default MySalary;
