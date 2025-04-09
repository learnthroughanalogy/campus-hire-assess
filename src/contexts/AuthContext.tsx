import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'administrator' | 'recruiter' | 'candidate' | 'sme' | 'university_spoc' | 'hr' | 'student' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdministrator: boolean;
  isRecruiter: boolean;
  isCandidate: boolean;
  isSME: boolean;
  isUniversitySPOC: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock users for demonstration
const MOCK_USERS = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', password: 'password', role: 'administrator' as UserRole },
  { id: '2', name: 'Recruiter User', email: 'recruiter@example.com', password: 'password', role: 'recruiter' as UserRole },
  { id: '3', name: 'John Candidate', email: 'candidate@example.com', password: 'password', role: 'candidate' as UserRole },
  { id: '4', name: 'Expert SME', email: 'sme@example.com', password: 'password', role: 'sme' as UserRole },
  { id: '5', name: 'University SPOC', email: 'university@example.com', password: 'password', role: 'university_spoc' as UserRole },
  
  // Keep backward compatibility for existing users
  { id: '6', name: 'HR Manager', email: 'hr@example.com', password: 'password', role: 'hr' as UserRole },
  { id: '7', name: 'John Student', email: 'student@example.com', password: 'password', role: 'student' as UserRole },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const matchedUser = MOCK_USERS.find(u => u.email === email && u.password === password);
      
      if (!matchedUser) {
        throw new Error('Invalid credentials');
      }
      
      const { password: _, ...userWithoutPassword } = matchedUser;
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdministrator: user?.role === 'administrator',
    isRecruiter: user?.role === 'recruiter' || user?.role === 'hr', // For backward compatibility
    isCandidate: user?.role === 'candidate' || user?.role === 'student', // For backward compatibility
    isSME: user?.role === 'sme',
    isUniversitySPOC: user?.role === 'university_spoc',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
