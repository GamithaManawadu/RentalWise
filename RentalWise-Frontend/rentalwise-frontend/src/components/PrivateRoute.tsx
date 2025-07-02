import { Navigate, useLocation } from 'react-router-dom';
import type { JSX } from 'react';
import { useAuth } from '../context/AuthContext'; // ✅ use real context

interface Props {
  children: JSX.Element;
  requiredRole: 'landlord' | 'tenant';
}

export default function PrivateRoute({ children, requiredRole }: Props) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Not logged in → redirect to login and preserve path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = user.role.toLowerCase();

  if (userRole !== requiredRole) {
    // Logged in but wrong role
    return <Navigate to="/" replace />;
  }

  return children;
}
