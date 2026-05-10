import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  email: string | null;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedEmail = localStorage.getItem('expertlink_email');
    if (storedEmail) {
      setEmail(storedEmail);
    }
    setLoading(false);
  }, []);

  const login = (newEmail: string) => {
    setEmail(newEmail);
    localStorage.setItem('expertlink_email', newEmail);
  };

  const logout = () => {
    setEmail(null);
    localStorage.removeItem('expertlink_email');
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
