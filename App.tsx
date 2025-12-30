
import React from 'react';
import Layout, { useAppContext } from './components/Layout';
import { AppScreen } from './types';
import DevotionalScreen from './components/screens/DevotionalScreen';
import BibleScreen from './components/screens/BibleScreen';
import StudyScreen from './components/screens/StudyScreen';
import TracksScreen from './components/screens/TracksScreen';
import JournalScreen from './components/screens/JournalScreen';
import AuthScreen from './components/screens/AuthScreen';
import { useAuth, AuthProvider } from './AuthContext';

const AppContent: React.FC = () => {
  const { activeScreen, apiKeyStatus } = useAppContext();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  // Se o usuário não está autenticado e o carregamento de autenticação terminou, mostra Auth
  if (!isAuthenticated && !isAuthLoading) {
    return <AuthScreen />;
  }

  // Renderiza a tela ativa. O conteúdo de exemplo é tratado dentro de cada componente de tela.
  const renderScreen = () => {
    switch (activeScreen) {
      case AppScreen.Devotional:
        return <DevotionalScreen />;
      case AppScreen.Bible:
        return <BibleScreen />;
      case AppScreen.Study:
        return <StudyScreen />;
      case AppScreen.Tracks:
        return <TracksScreen />;
      case AppScreen.Journal:
        return <JournalScreen />;
      default:
        return <DevotionalScreen />;
    }
  };

  return (
    <div key={activeScreen} className="min-h-full animate-fade-in">
      {renderScreen()}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Layout>
        <AppContent />
      </Layout>
    </AuthProvider>
  );
};

export default App;
