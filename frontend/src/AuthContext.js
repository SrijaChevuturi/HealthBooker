import React, { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
import axiosWithToken from './axiosWithToken';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const adminFlag = localStorage.getItem('isAdmin') === 'true';
    if (token) {
      setIsLoggedIn(true);
      setIsAdmin(adminFlag);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      if (adminFlag) {
        fetchAdminData();
      } else {
        fetchUserData();
      }
    }
  }, []);

  const login = (token, admin = false) => {
    localStorage.setItem('token', token);
    localStorage.setItem('isAdmin', admin.toString());
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setIsLoggedIn(true);
    setIsAdmin(admin);
    if (admin) {
      fetchAdminData();
    } else {
      fetchUserData();
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  const fetchUserData = async () => {
    try {
      const response = await axiosWithToken.get('http://localhost:3000/user-api/user');
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUser(null);
    }
  };

  const fetchAdminData = async () => {
    try {
      const response = await axiosWithToken.get('http://localhost:3000/admin-api/admin-login');
      setUser(response.data.admin);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
