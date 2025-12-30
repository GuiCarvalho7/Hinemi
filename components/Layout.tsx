
import React, { useState, useEffect, createContext, useContext } from 'react';
import Navbar from './Navbar';
import { AppScreen, AppContextType } from '../types';
import { ensureApiKeySelected, generateNightModeStory as serviceGenerateNightModeStory } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { useAuth } from '../AuthContext';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [activeScreen, setActiveScreen] = useState<AppScreen>(AppScreen.Devotional);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'missing' | 'present'>('checking');
  const [nightModeStory, setNightModeStory] = useState<string | null>(null);
  const [isNightModeStoryLoading, setIsNightModeStoryLoading] = useState<boolean>(false);

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    document.documentElement.classList.add('dark');
    
    const checkKey = async () => {
      try {
        const retrievedApiKey = await ensureApiKeySelected();
        if (retrievedApiKey) {
          setApiKey(retrievedApiKey);
          setApiKeyStatus('present');
        } else {
          setApiKey(null);
          setApiKeyStatus('missing');
        }
      } catch (error) {
        setApiKeyStatus('missing');
      }
    };
    checkKey();
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const loadNightModeStory = async () => {
    if (apiKey && theme === 'dark' && !nightModeStory && !isNightModeStoryLoading) {
      setIsNightModeStoryLoading(true);
      try {
        const story = await serviceGenerateNightModeStory(apiKey);
        setNightModeStory(story);
      } catch (err) {
        setNightModeStory('Descanse em paz. Deus cuida de você enquanto dorme.');
      } finally {
        setIsNightModeStoryLoading(false);
      }
    }
  };

  const handleSelectApiKey = async () => {
    if (typeof window.aistudio !== 'undefined' && window.aistudio.openSelectKey) {
      await window.aistudio.openSelectKey();
      const updatedApiKey = process.env.API_KEY || null;
      setApiKey(updatedApiKey);
      if (updatedApiKey) setApiKeyStatus('present');
    }
  };

  const contextValue: AppContextType = {
    theme,
    toggleTheme,
    activeScreen,
    setActiveScreen,
    nightModeStory,
    loadNightModeStory,
    isNightModeStoryLoading,
    apiKey,
    getApiKey: () => apiKey,
    triggerApiKeySelection: handleSelectApiKey,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {apiKeyStatus === 'checking' ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background-dark text-text-white">
          <LoadingSpinner />
          <p className="mt-4 text-sm font-sans opacity-50 uppercase tracking-widest">Iniciando HINEMI...</p>
        </div>
      ) : !isAuthenticated ? (
        /* If not authenticated, we just render children (which will be AuthScreen via AppContent) */
        <div className="min-h-screen bg-background-dark">
          {children}
        </div>
      ) : (
        /* Main Authenticated Layout */
        <div className="relative flex min-h-screen w-full flex-col bg-background-dark text-text-white font-sans antialiased overflow-x-hidden">
          <div className="absolute top-0 left-0 w-full h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-premium-gold/10 via-background-dark/50 to-background-dark pointer-events-none z-0"></div>
          <div className="flex-1 pb-24 z-10">
            {children}
          </div>
          <Navbar activeScreen={activeScreen} setActiveScreen={setActiveScreen} theme={theme} />
        </div>
      )}
    </AppContext.Provider>
  );
};

export default Layout;
