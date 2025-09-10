'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MOCK_USERS } from '../lib/mockUsers';
import { ROLES } from '../lib/roles';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, this would check for a valid JWT token
        const token = localStorage.getItem('auth_token');
        if (token) {
          // Mock token validation - in real app, decode and validate JWT
          const userData = localStorage.getItem('user_data');
          if (userData) {
            setUser(JSON.parse(userData));
          }
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        // Clear invalid tokens
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signIn = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find user in mock data
      const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }

      // Create mock JWT token
      const token = `mock_jwt_${Date.now()}_${foundUser.id}`;
      
      // Store token and user data (in real app, token would be httpOnly cookie)
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify({
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
        company: foundUser.company
      }));

      setUser({
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
        company: foundUser.company
      });

      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user already exists
      const existingUser = MOCK_USERS.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email: userData.email,
        password: userData.password,
        name: userData.name,
        role: 'user',
        company: userData.company || 'Unknown Company'
      };

      // In a real app, this would be sent to the backend
      MOCK_USERS.push(newUser);

      // Auto sign in after successful registration
      const token = `mock_jwt_${Date.now()}_${newUser.id}`;
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify({
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        company: newUser.company
      }));

      setUser({
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        company: newUser.company
      });

      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (email) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user exists
      const existingUser = MOCK_USERS.find(u => u.email === email);
      if (!existingUser) {
        throw new Error('No account found with this email address');
      }

      // In a real app, this would send a password reset email
      console.log(`Password reset email would be sent to: ${email}`);
      
      return { success: true, message: 'Password reset instructions have been sent to your email' };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Role switching functionality for testing
  const switchRole = useCallback(async (newRole) => {
    try {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find user with new role
      const newUserData = MOCK_USERS.find(u => u.role === newRole);
      if (!newUserData) {
        throw new Error('Role not found');
      }
      
      // Create new user object with current user's email and company
      const newUser = {
        ...newUserData,
        email: user?.email || newUserData.email,
        company: user?.company || newUserData.company
      };
      
      // Update user state
      setUser(newUser);
      
      // Update localStorage
      localStorage.setItem('user_data', JSON.stringify(newUser));
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [user]);

  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    clearError,
    switchRole,
    setUser, // Expose setUser for role switching
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Export mock users for testing
export { MOCK_USERS };
