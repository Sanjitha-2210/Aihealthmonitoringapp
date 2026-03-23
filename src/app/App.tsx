import React, { useState, useEffect } from 'react';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { Toaster } from './components/ui/sonner';
import { getSupabaseClient } from './utils/supabase';

export default function App() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const supabase = getSupabaseClient();

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session check error:', error);
      } else if (session) {
        setAccessToken(session.access_token);
        setUser(session.user);
      }
    } catch (error) {
      console.error('Failed to check session:', error);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleAuthSuccess = (token: string, userData: any) => {
    setAccessToken(token);
    setUser(userData);
  };

  const handleLogout = () => {
    setAccessToken(null);
    setUser(null);
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {accessToken && user ? (
        <Dashboard
          accessToken={accessToken}
          user={user}
          onLogout={handleLogout}
        />
      ) : (
        <AuthPage onAuthSuccess={handleAuthSuccess} />
      )}
      <Toaster position="top-right" />
    </>
  );
}