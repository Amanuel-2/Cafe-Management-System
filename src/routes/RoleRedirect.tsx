import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { roleHomePath } from './access';
import { Spinner } from '../components/ui/Spinner';

export function RoleRedirect() {
  const { user, isReady } = useAuth();
  
  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-100 dark:bg-stone-900">
        <Spinner className="h-12 w-12 text-stone-400" />
      </div>
    );
  }
  
  return <Navigate to={user ? roleHomePath[user.role] : '/login'} replace />;
}
