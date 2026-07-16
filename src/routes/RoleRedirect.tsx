import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { roleHomePath } from './paths';
import { Spinner } from '../components/ui/Spinner';

export function RoleRedirect() {
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore.persist.hasHydrated();
  
  if (!hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-100 dark:bg-stone-900">
        <Spinner className="h-12 w-12 text-stone-400" />
      </div>
    );
  }
  
  return <Navigate to={user ? roleHomePath[user.role] : '/login'} replace />;
}
