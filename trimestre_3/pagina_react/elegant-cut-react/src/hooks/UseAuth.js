import { useState, useEffect } from 'react';
import { AuthClient } from '../utils/authClient';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = AuthClient.getToken();
    const userData = AuthClient.getUser();
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(userData);
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setLoading(false);
  };

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    AuthClient.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return {
    isAuthenticated,
    user,
    loading,
    checkAuth,
    login,
    logout
  };
}