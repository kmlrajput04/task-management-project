import React, { createContext, useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import authService from '../services/auth.service';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const queryClient = useQueryClient();

  // Restore session on application startup
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
          // Query current profile details from backend
          const res = await authService.getCurrentUser();
          if (res.success && res.data) {
            setUser(res.data);
            setIsAuthenticated(true);
          } else {
            handleLogout();
          }
        }
      } catch (err) {
        console.error('Session restore failed:', err);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const handleLogin = (loginData) => {
    localStorage.setItem('token', loginData.token);
    localStorage.setItem('user', JSON.stringify(loginData.user));
    setToken(loginData.token);
    setUser(loginData.user);
    setIsAuthenticated(true);
    
    // Invalidate query caches to pull user-scoped analytics
    queryClient.invalidateQueries();
  };

  const handleLogout = async () => {
    try {
      if (token) {
        await authService.logout();
      }
    } catch (err) {
      console.warn('Logout endpoint call failed:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      
      // Clear React Query cache parameters entirely
      queryClient.clear();
    }
  };

  const refreshUser = async () => {
    try {
      const res = await authService.getCurrentUser();
      if (res.success && res.data) {
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
      }
    } catch (err) {
      console.error('Failed to refresh user profile:', err);
    }
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login: handleLogin,
    logout: handleLogout,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
