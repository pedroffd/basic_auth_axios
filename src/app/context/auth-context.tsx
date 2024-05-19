'use client'
import { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
const api_url = process.env.NEXT_PUBLIC_API_URL
interface AuthContextType {
  user: any | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  getSession: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  getSession: async () => {},
  isAuthenticated: false,
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const login = async (token: string) => {
    setIsLoading(true);
    try {
      // Set the token in cookies
      Cookies.set('token', token); 
  
      // Fetch user session (add your API URL)
      await getSession();
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    setIsAuthenticated(false);
  };
  
  const getSession = async () => {
    setIsLoading(true);
    try {
      const token = Cookies.get('token');
  
      if (token) {
        const res = await axios.get(`${api_url}/api/auth/session`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("usaer",res.data.user)
        setUser(res.data.user);
        setIsAuthenticated(true);
      } 
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch session data on mount
  useEffect(() => {
    getSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, getSession, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
