import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../services/api';

// Create context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      try {
        const data = await auth.getCurrentUser();
        if (data && data.user) {
          setCurrentUser(data.user);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (username, password) => {
    setError(null);
    try {
      const data = await auth.login(username, password);
      if (data.user) {
        setCurrentUser(data.user);
      }
      return data;
    } catch (error) {
      setError(error.response?.data?.error || 'Login gagal. Silakan coba lagi.');
      throw error;
    }
  };

  // Register function
  const register = async (username, email, password) => {
    setError(null);
    try {
      const data = await auth.register(username, email, password);
      return data;
    } catch (error) {
      setError(error.response?.data?.error || 'Pendaftaran gagal. Silakan coba lagi.');
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear user state, even if API call fails
      setCurrentUser(null);
      setError(null);
    }
  };

  // Context value
  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    isAdmin: currentUser?.role === 'admin',
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 