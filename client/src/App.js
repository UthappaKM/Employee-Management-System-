import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import EmployeeForm from './pages/EmployeeForm';
import EmployeeDetail from './pages/EmployeeDetail';
import Departments from './pages/Departments';
import DepartmentForm from './pages/DepartmentForm';
import Performance from './pages/Performance';
import Users from './pages/Users';
import Attendance from './pages/Attendance';
import Salary from './pages/Salary';
import Payroll from './pages/Payroll';
import MyProfile from './pages/MyProfile';
import MySalary from './pages/MySalary';
import MyLeaves from './pages/MyLeaves';
import LeaveApprovals from './pages/LeaveApprovals';
import LeaveManagement from './pages/LeaveManagement';
import ChangePassword from './pages/ChangePassword';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Private Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* Employee Routes */}
          <Route
            path="/employees"
            element={
              <PrivateRoute>
                <Employees />
              </PrivateRoute>
            }
          />
          <Route
            path="/employees/new"
            element={
              <PrivateRoute managerOnly>
                <EmployeeForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/employees/:id"
            element={
              <PrivateRoute>
                <EmployeeDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/employees/:id/edit"
            element={
              <PrivateRoute managerOnly>
                <EmployeeForm />
              </PrivateRoute>
            }
          />

          {/* Department Routes */}
          <Route
            path="/departments"
            element={
              <PrivateRoute managerOnly>
                <Departments />
              </PrivateRoute>
            }
          />
          <Route
            path="/departments/new"
            element={
              <PrivateRoute managerOnly>
                <DepartmentForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/departments/:id/edit"
            element={
              <PrivateRoute managerOnly>
                <DepartmentForm />
              </PrivateRoute>
            }
          />

          {/* Performance Routes */}
          <Route
            path="/performance"
            element={
              <PrivateRoute managerOnly>
                <Performance />
              </PrivateRoute>
            }
          />

          {/* Attendance Routes */}
          <Route
            path="/attendance"
            element={
              <PrivateRoute>
                <Attendance />
              </PrivateRoute>
            }
          />

          {/* My Profile Route (Employees only) */}
          <Route
            path="/my-profile"
            element={
              <PrivateRoute>
                <MyProfile />
              </PrivateRoute>
            }
          />

          {/* My Salary Route (Employees only) */}
          <Route
            path="/my-salary"
            element={
              <PrivateRoute>
                <MySalary />
              </PrivateRoute>
            }
          />

          {/* Leave Routes */}
          <Route
            path="/my-leaves"
            element={
              <PrivateRoute>
                <MyLeaves />
              </PrivateRoute>
            }
          />
          <Route
            path="/leave-approvals"
            element={
              <PrivateRoute managerOnly>
                <LeaveApprovals />
              </PrivateRoute>
            }
          />
          <Route
            path="/leave-management"
            element={
              <PrivateRoute hrOnly>
                <LeaveManagement />
              </PrivateRoute>
            }
          />

          {/* Change Password Route (All users) */}
          <Route
            path="/change-password"
            element={
              <PrivateRoute>
                <ChangePassword />
              </PrivateRoute>
            }
          />

          {/* Salary Routes */}
          <Route
            path="/salary"
            element={
              <PrivateRoute>
                <Salary />
              </PrivateRoute>
            }
          />

          {/* Payroll Routes */}
          <Route
            path="/payroll"
            element={
              <PrivateRoute>
                <Payroll />
              </PrivateRoute>
            }
          />

          {/* User Management Routes */}
          <Route
            path="/users"
            element={
              <PrivateRoute adminOnly>
                <Users />
              </PrivateRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
