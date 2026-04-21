import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const location = useLocation();
    const userData = localStorage.getItem('user');

    if (!userData) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    const user = JSON.parse(userData);

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Role not authorized
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
