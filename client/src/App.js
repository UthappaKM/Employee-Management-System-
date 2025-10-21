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
