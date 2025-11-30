import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logoutUser, isManager, isAdmin, isHR } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown when route changes
  useEffect(() => {
    setOpenDropdown(null);
  }, [location]);

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
          </svg>
          <span>EMS</span>
        </Link>
        
        <ul className="navbar-menu" ref={dropdownRef}>
          <li>
            <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              Dashboard
            </Link>
          </li>

          {/* Employee Self-Service - Only for non-managers */}
          {!isManager() && (
            <li className="dropdown">
              <button 
                className={`dropdown-toggle ${openDropdown === 'self' ? 'active' : ''}`}
                onClick={() => toggleDropdown('self')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                My Workspace
                <svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {openDropdown === 'self' && (
                <ul className="dropdown-menu">
                  <li><Link to="/my-profile">My Profile</Link></li>
                  <li><Link to="/my-salary">My Salary</Link></li>
                  <li><Link to="/my-leaves">My Leaves</Link></li>
                  <li><Link to="/attendance">Attendance</Link></li>
                </ul>
              )}
            </li>
          )}

          {/* Employees Management - For managers */}
          {isManager() && (
            <li className="dropdown">
              <button 
                className={`dropdown-toggle ${openDropdown === 'employees' ? 'active' : ''}`}
                onClick={() => toggleDropdown('employees')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                Employees
                <svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {openDropdown === 'employees' && (
                <ul className="dropdown-menu">
                  <li><Link to="/employees">All Employees</Link></li>
                  <li><Link to="/departments">Departments</Link></li>
                  <li><Link to="/performance">Performance</Link></li>
                  <li><Link to="/attendance">Attendance</Link></li>
                </ul>
              )}
            </li>
          )}

          {/* Leave Management */}
          <li className="dropdown">
            <button 
              className={`dropdown-toggle ${openDropdown === 'leave' ? 'active' : ''}`}
              onClick={() => toggleDropdown('leave')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Leave
              <svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            {openDropdown === 'leave' && (
              <ul className="dropdown-menu">
                {!isManager() && <li><Link to="/my-leaves">My Leaves</Link></li>}
                {isManager() && <li><Link to="/leave-approvals">Leave Approvals</Link></li>}
                {(isHR() || isAdmin()) && <li><Link to="/leave-management">Leave Management</Link></li>}
              </ul>
            )}
          </li>

          {/* Payroll - HR/Admin only */}
          {(isHR() || isAdmin()) && (
            <li className="dropdown">
              <button 
                className={`dropdown-toggle ${openDropdown === 'payroll' ? 'active' : ''}`}
                onClick={() => toggleDropdown('payroll')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                Payroll
                <svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {openDropdown === 'payroll' && (
                <ul className="dropdown-menu">
                  <li><Link to="/salary">Salary Management</Link></li>
                  <li><Link to="/payroll">Payroll Processing</Link></li>
                </ul>
              )}
            </li>
          )}

          {/* Admin - Admin only */}
          {isAdmin() && (
            <li>
              <Link to="/users" className={isActive('/users') ? 'active' : ''}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 15l-8.5 5.1a1 1 0 0 1-1.5-.9V4.8a1 1 0 0 1 1.5-.9L12 9l8.5-5.1a1 1 0 0 1 1.5.9v14.2a1 1 0 0 1-1.5.9L12 15z"/>
                </svg>
                Admin
              </Link>
            </li>
          )}
        </ul>

        <div className="navbar-actions">
          <div className="user-dropdown">
            <button 
              className="user-menu-btn"
              onClick={() => toggleDropdown('user')}
            >
              <div className="user-avatar">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <span className="user-name">{user?.name}</span>
                <span className="user-role">{user?.role}</span>
              </div>
              <svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            {openDropdown === 'user' && (
              <ul className="user-dropdown-menu">
                <li>
                  <Link to="/change-password">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    Change Password
                  </Link>
                </li>
                <li className="divider"></li>
                <li>
                  <button onClick={handleLogout} className="logout-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
