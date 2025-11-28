import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logoutUser, isManager, isAdmin, isHR } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo">
          EMS
        </Link>
        
        <ul className="navbar-menu">
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          {!isManager() && (
            <>
              <li>
                <Link to="/my-profile">My Profile</Link>
              </li>
              <li>
                <Link to="/my-salary">My Salary</Link>
              </li>
            </>
          )}
          {isManager() && (
            <li>
              <Link to="/employees">Employees</Link>
            </li>
          )}
          <li>
            <Link to="/attendance">Attendance</Link>
          </li>
          {(isHR() || isAdmin()) && (
            <>
              <li>
                <Link to="/salary">Salary</Link>
              </li>
              <li>
                <Link to="/payroll">Payroll</Link>
              </li>
            </>
          )}
          {isAdmin() && (
            <li>
              <Link to="/users">Users</Link>
            </li>
          )}
          {isManager() && (
            <>
              <li>
                <Link to="/performance">Performance</Link>
              </li>
              <li>
                <Link to="/departments">Departments</Link>
              </li>
            </>
          )}
        </ul>

        <div className="navbar-user">
          <span className="user-name">
            {user?.name} ({user?.role})
          </span>
          <button onClick={handleLogout} className="btn btn-sm btn-secondary">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
