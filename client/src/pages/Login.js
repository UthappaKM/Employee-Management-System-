import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { login } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  useEffect(() => {
    // Check for session expired error
    if (searchParams.get('error') === 'session_expired') {
      setInfo('Your session has expired. Please login again.');
    }
  }, [searchParams]);

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login({ email, password });
      loginUser(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Left Side - Branding */}
      <div className="auth-left">
        <div className="auth-branding">
          <div className="logo-circle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h1 className="brand-title">Employee Management System</h1>
          <p className="brand-subtitle">Streamline your workforce management with our comprehensive platform</p>
          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Role-based Access Control</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Performance Tracking</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Department Management</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p>Login to access your account</p>
          </div>
          
          {info && <div className="alert alert-info">{info}</div>}
          {error && <div className="alert alert-error">{error}</div>}
          
          <form onSubmit={onSubmit} className="auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  className="form-control"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={password}
                  onChange={onChange}
                  className="form-control"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="input-action toggle-visibility"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? (
                    // Eye-off icon
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12c.46-1.06 1.11-2.06 1.93-2.94" />
                      <path d="M10.58 10.58a2 2 0 0 0 2.84 2.84" />
                      <path d="M23 12c-.51 1.12-1.2 2.16-2.06 3.06" />
                      <path d="M3 3l18 18" />
                    </svg>
                  ) : (
                    // Eye icon
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Logging in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          
          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <span 
                className="highlight contact-link" 
                onClick={() => setShowContactModal(true)}
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
              >
                Contact your administrator
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Contact Administrator Modal */}
      {showContactModal && (
        <div className="modal-overlay" onClick={() => setShowContactModal(false)}>
          <div className="modal-content contact-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Contact Administrator</h2>
              <button 
                className="close-btn" 
                onClick={() => setShowContactModal(false)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-intro">
                To request access to the Employee Management System, please contact your HR or System Administrator.
              </p>
              
              <div className="contact-info">
                <div className="contact-item">
                  <div className="contact-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div className="contact-details">
                    <h4>Email</h4>
                    <a href="mailto:hr@company.com">hr@company.com</a>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div className="contact-details">
                    <h4>Phone</h4>
                    <a href="tel:+1234567890">+1 (234) 567-890</a>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div className="contact-details">
                    <h4>Office Hours</h4>
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="info-note">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <p>Please provide your full name, department, and reason for access when contacting the administrator.</p>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowContactModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
