import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const USER_KEY = 'brewdesk_user';
const TOKEN_KEY = 'token';

// const STORAGE_KEY = 'brewdesk_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = (userData) => {
    // store what backend returns: id, firstName, email, phone, role
    console.log('AUTHCONTEXT LOGIN:', userData);
    const payload = {
      id: userData.id,
      firstName: userData.firstName,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
    };
    localStorage.setItem(USER_KEY, JSON.stringify(payload));
    localStorage.setItem(TOKEN_KEY, userData.token); // <-- the missing piece
    setUser(payload);
  };

  const logout = () => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY)
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
