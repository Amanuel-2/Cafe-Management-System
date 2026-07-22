import { useCallback, useMemo, useState } from 'react';
import { authService } from '../services/authService';
import { AuthContext } from './auth-context';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getSession());

  const login = useCallback(async (credentials) => {
    const authenticatedUser = await authService.login(credentials);
    authService.saveSession(authenticatedUser);
    setUser(authenticatedUser);
    return authenticatedUser;
  }, []);

  const logout = useCallback(() => {
    authService.logout(user);
    setUser(null);
  }, [user]);

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    isReady: true,
    login,
    logout,
  }), [login, logout, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
