import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../contexts/auth-context';

export function ProtectedRoute() {
  const { usuario } = useAuth();
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
