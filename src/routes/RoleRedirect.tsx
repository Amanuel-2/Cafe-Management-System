import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { roleHomePath } from './paths';

export function RoleRedirect() {
  const user = useAuthStore((state) => state.user);
  return <Navigate to={user ? roleHomePath[user.role] : '/login'} replace />;
}
