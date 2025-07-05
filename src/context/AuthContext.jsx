import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRoles } from '../types/index.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const MOCK_USERS = [
  {
    id: '1',
    role: UserRoles.ADMIN,
    email: 'admin@entnt.in',
    password: 'admin123',
    name: 'Dr. Arya Singh',
    avatar: '👩‍⚕️',
    specialty: 'General Dentistry'
  },
  {
    id: '2',
    role: UserRoles.PATIENT,
    email: 'john@entnt.in',
    password: 'patient123',
    patientId: 'p1',
    name: 'John Doe',
    avatar: '👨'
  },
  {
    id: '3',
    role: UserRoles.PATIENT,
    email: 'jane@entnt.in',
    password: 'patient123',
    patientId: 'p2',
    name: 'Jane Smith',
    avatar: '👩'
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('dental_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('dental_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userToStore = { ...foundUser };
      delete userToStore.password;
      setUser(userToStore);
      localStorage.setItem('dental_user', JSON.stringify(userToStore));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dental_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};