'use client';

import axios from 'axios';
import { usePathname } from 'next/navigation';
import { createContext, useContext, useState, useEffect } from 'react';

type AuthContextType = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  refreshAccessToken: () => Promise<void>;
};

const noRefreshPaths = ['/login', '/register'];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const refreshAccessToken = async () => {
    console.log('Refreshing access token...');

    try {
      const res = await fetch('/api/auth/refresh', {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        console.log(`New access token: ${data.accessToken}`);
        setAccessToken(data.accessToken);

        if (noRefreshPaths.includes(pathname.slice(3))) {
          window.location.href = '/';
        }
      } else {
        axios.get('/api/auth/logout').then(() => {
          setAccessToken(null);
          if (!noRefreshPaths.includes(pathname.slice(3)))
            window.location.href = '/login';
        }).catch((error) => {
          console.error('Logout error:', error);
        });
      }
    } catch (error) {
      console.error('Error refreshing access token:', error);
      setAccessToken(null);
    }
  };

  useEffect(() => {
    const refresh = async () => {
      await refreshAccessToken();
      setLoading(false);
    }

    refresh();
  }, []);

  if (loading)
    return null

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
