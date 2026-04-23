import React, { createContext, useState, useContext, useEffect } from 'react';
import { authApi } from '../features/auth/services/authApi';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          const freshUser = await authApi.getCurrentUser();
          setUser(freshUser);
          localStorage.setItem('user', JSON.stringify(freshUser));
        } catch (err) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await authApi.login({ email, password });
      const { token, ...userData } = response;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
      return { success: false, error: err.response?.data?.detail };
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      const response = await authApi.register(userData);
      const { token, ...user } = response;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      return { success: true, user };
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
      return { success: false, error: err.response?.data?.detail };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateProfile = async (userData) => {
    setError(null);
    try {
      const updatedUser = await authApi.updateProfile(userData);
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { success: true, user: updatedUser };
    } catch (err) {
      setError(err.response?.data?.detail || 'Profile update failed');
      return { success: false, error: err.response?.data?.detail };
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};