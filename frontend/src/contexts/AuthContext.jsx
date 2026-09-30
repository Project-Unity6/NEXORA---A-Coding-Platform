import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('nexora-theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nexora-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  /* Try to restore session on mount */
  useEffect(() => {
    authAPI.profile()
      .then(res => setUser(res.data?.user || null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (body) => {
    const res = await authAPI.login(body);
    setUser(res.user);
    return res;
  }, []);

  const register = useCallback(async (body) => {
    const res = await authAPI.register(body);
    setUser(res.user);
    return res;
  }, []);

  const logout = useCallback(async () => {
    await authAPI.logout();
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    user, loading, theme, toggleTheme, login, register, logout,
  }), [user, loading, theme, toggleTheme, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
