
import React, { useState, useEffect } from 'react';
import Login from './frontend/components/Login.tsx';
import Dashboard from './frontend/components/Dashboard.tsx';
import { UserSession } from './backend/types.ts';

const App: React.FC = () => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const handleLogin = (userSession: UserSession) => setSession(userSession);
  const handleLogout = () => setSession(null);
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className={`h-screen w-screen overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
      {!session ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard 
          session={session}
          onLogout={handleLogout} 
          isDarkMode={isDarkMode} 
          toggleTheme={toggleTheme} 
        />
      )}
    </div>
  );
};

export default App;
