'use client';

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
  const pathname = usePathname();

  const refreshAccessToken = async () => {
    try {
      console.log('Refreshing access token...');

      const res = await fetch('/api/auth/refresh', {
        credentials: 'include',
      });

      if (res.ok) {
        console.log('Access token refreshed');
        const data = await res.json();
        console.log(`New access token: ${data.accessToken}`);
        setAccessToken(data.accessToken);
      } else {
        console.error('Failed to refresh access token');
        setAccessToken(null);
      }
    } catch (error) {
      console.error('Error refreshing access token:', error);
      setAccessToken(null);
    }
  };

  useEffect(() => {
    console.log(`[AuthProvider] useEffect called`);
    console.log(`[AuthProvider] pathname: ${pathname} (${pathname.slice(3)})`);

    // if (noRefreshPaths.includes(pathname.slice(3))
    //   || pathname.startsWith('/api')
    //   || pathname.startsWith('/images')
    // )
    //   return;
    refreshAccessToken();
  }, []);

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
