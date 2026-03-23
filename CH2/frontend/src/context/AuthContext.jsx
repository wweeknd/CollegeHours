import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, microsoftProvider } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize Auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      setUser(data.user);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (name, email, password, role) => {
      try {
        const { data } = await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role });
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true };
      } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Registration failed' };
      }
  };

  const socialLogin = async (providerName) => {
    try {
      const provider = providerName === 'google' ? googleProvider : microsoftProvider;
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      const idToken = await firebaseUser.getIdToken();

      // Send Firebase ID token to our backend
      const { data } = await axios.post('http://localhost:5000/api/auth/social', {
        idToken,
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL,
      });

      setUser(data.user);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return { success: true };
    } catch (error) {
      console.error('Social login error:', error);
      // Handle specific Firebase errors
      if (error.code === 'auth/popup-closed-by-user') {
        return { success: false, message: 'Sign-in popup was closed.' };
      }
      if (error.code === 'auth/account-exists-with-different-credential') {
        return { success: false, message: 'An account already exists with this email using a different sign-in method.' };
      }
      return { success: false, message: error.response?.data?.message || error.message || 'Social login failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, socialLogin, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

