import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Public Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DestinationsPage from './pages/destinations/DestinationsPage';

// Protected Components
import ProtectedRoute from './components/common/ProtectedRoute';
import UserDashboard from './pages/user/UserDashboard';
import DriverDashboard from './pages/driver/DriverDashboard';
import PaymentCenter from './pages/payment/PaymentCenter';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/destinations" element={<DestinationsPage />} />

          {/* Protected Routes by Role */}
          <Route
            path="/user-dashboard"
            element={<ProtectedRoute allowedRoles={['tourist']}><UserDashboard /></ProtectedRoute>}
          />
          <Route
            path="/driver-dashboard"
            element={<ProtectedRoute allowedRoles={['driver']}><DriverDashboard /></ProtectedRoute>}
          />
          <Route
            path="/payment/:bookingId"
            element={<ProtectedRoute allowedRoles={['tourist']}><PaymentCenter /></ProtectedRoute>}
          />
          <Route
            path="/admin-dashboard"
            element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
