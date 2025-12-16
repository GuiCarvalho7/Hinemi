import React, { useState, useEffect, createContext, useContext } from 'react';
import Navbar from './Navbar';
import { AppScreen, AppContextType } from '../types';
import { ensureApiKeySelected, generateNightModeStory as serviceGenerateNightModeStory } from '../services/geminiService';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';
import { useAuth } from '../AuthContext'; // Import useAuth

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
  const [theme, setTheme] = useState<'light' | 'dark'>('dark'); // Default to dark mode
  const [activeScreen, setActiveScreen] = useState<AppScreen>(AppScreen.Devotional);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'missing' | 'present'>('checking');
  const [apiError, setApiError] = useState<string | null>(null);
  const [nightModeStory, setNightModeStory] = useState<string | null>(null);
  const [isNightModeStoryLoading, setIsNightModeStoryLoading] = useState<boolean>(false);

  const { isAuthenticated } = useAuth(); // Get isAuthenticated state from AuthContext

  useEffect(() => {
    // Set initial theme to dark mode and ensure class is applied
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');

    const checkAndSelectKey = async () => {
      try {
        setApiKeyStatus('checking');
        const retrievedApiKey = await ensureApiKeySelected();
        if (retrievedApiKey) {
          setApiKey(retrievedApiKey);
          setApiKeyStatus('present');
          setApiError(null);
        } else {
          setApiKey(null);
          setApiKeyStatus('missing');
        }
      } catch (error: any) {
        console.error("Failed to check or select API key:", error);
        setApiKey(null);
        setApiKeyStatus('missing');
        setApiError("Erro ao verificar ou selecionar a chave da API. Por favor, tente novamente.");
      }
    };
    checkAndSelectKey();
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newTheme;
    });
  };

  const loadNightModeStory = async () => {
    if (apiKey && theme === 'dark' && !nightModeStory && !isNightModeStoryLoading) {
      setIsNightModeStoryLoading(true);
      try {
        const story = await serviceGenerateNightModeStory(apiKey);
        setNightModeStory(story);
      } catch (err) {
        console.error('Failed to load night mode story:', err);
        setNightModeStory('Não foi possível carregar a história do modo noite.');
      } finally {
        setIsNightModeStoryLoading(false);
      }
    }
  };

  const handleSelectApiKey = async () => {
    setApiKeyStatus('checking');
    try {
      if (typeof window.aistudio !== 'undefined' && window.aistudio.openSelectKey) {
        await window.aistudio.openSelectKey();
        const updatedApiKey = process.env.API_KEY || null; // Assume process.env.API_KEY is updated by the platform
        setApiKey(updatedApiKey);
        if (updatedApiKey) {
          setApiKeyStatus('present');
          setApiError(null);
        } else {
          setApiKeyStatus('missing');
          setApiError("Chave da API não foi selecionada ou não pôde ser recuperada.");
        }
      } else {
        setApiError("A funcionalidade de seleção de chave da API não está disponível.");
        setApiKeyStatus('missing');
      }
    } catch (error: any) {
      console.error("Error opening API key selection dialog:", error);
      setApiError("Erro ao abrir o diálogo de seleção da chave da API.");
      setApiKeyStatus('missing');
    }
  };

  const getApiKey = () => apiKey;

  const contextValue: AppContextType = {
    theme,
    toggleTheme,
    activeScreen,
    setActiveScreen,
    nightModeStory,
    loadNightModeStory,
    isNightModeStoryLoading,
    apiKey,
    getApiKey,
  };

  // Display API Key setup ONLY if key is missing/checking, regardless of auth state
  if (apiKeyStatus === 'checking') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background-dark text-text-white">
        <LoadingSpinner />
        <p className="mt-4 text-lg font-sans">Verificando chave da API...</p>
      </div>
    );
  }

  if (apiKeyStatus === 'missing') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-background-dark text-text-white text-center">
        <h1 className="text-3xl font-display font-bold mb-4">Chave da API Necessária</h1>
        <p className="mb-6 text-lg font-sans text-text-muted">Para utilizar este aplicativo, por favor, selecione uma chave da API Gemini de um projeto GCP pago.</p>
        <Button onClick={handleSelectApiKey} variant="primary" className="mb-4">
          Selecionar Chave da API
        </Button>
        {apiError && <p className="text-red-500 mt-2 font-sans">{apiError}</p>}
        <p className="text-sm mt-4 text-text-muted font-sans">
          Para mais informações sobre faturamento, visite{' '}
          <a
            href="https://ai.google.dev/gemini-api/docs/billing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-premium-gold hover:underline"
          >
            ai.google.dev/gemini-api/docs/billing
          </a>
        </p>
      </div>
    );
  }

  // If API key is present but user is not authenticated, children (AuthScreen) will handle rendering.
  // If API key is present AND authenticated, render main layout.
  if (!isAuthenticated) {
    // This path means API Key is present, but Auth has not happened yet.
    // App.tsx's AppContent will render AuthScreen, so we just pass children through.
    return (
      <AppContext.Provider value={contextValue}>
        {children}
      </AppContext.Provider>
    );
  }

  return (
    <AppContext.Provider value={contextValue}>
      <div className={`relative flex h-auto min-h-screen w-full flex-col bg-background-dark text-text-white font-sans antialiased`}>
        {/* Background gradient blur effect */}
        <div className="absolute top-0 left-0 w-full h-96 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-premium-gold/10 via-background-dark/50 to-background-dark pointer-events-none z-0"></div>

        {/* Adjusted pb-48 to account for the new floating bar and Navbar height */}
        <div className="flex-1 pb-48 custom-scroll overflow-y-auto z-10">
          {children}
        </div>
        <Navbar activeScreen={activeScreen} setActiveScreen={setActiveScreen} theme={theme} />
      </div>
    </AppContext.Provider>
  );
};

export default Layout;