import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { roleService } from '../services/roleService';

export function PermissionRoute({ permission, children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (!roleService.userHasPermission(user, permission)) {
    return <Navigate to="/access-denied" replace state={{ from: location.pathname }} />;
  }
  return children;
}

