import React from 'react';
import Layout, { useAppContext } from './components/Layout';
import { AppScreen } from './types';
import DevotionalScreen from './components/screens/DevotionalScreen';
import BibleScreen from './components/screens/BibleScreen';
import StudyScreen from './components/screens/StudyScreen';
import TracksScreen from './components/screens/TracksScreen';
import JournalScreen from './components/screens/JournalScreen';
import AuthScreen from './components/screens/AuthScreen'; // Import the new AuthScreen
import { useAuth, AuthProvider } from './AuthContext'; // Import AuthProvider and useAuth

const AppContent: React.FC = () => {
  const { activeScreen, apiKeyStatus } = useAppContext(); // Get apiKeyStatus from AppContext
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth(); // Get auth state

  // If API key is being checked or is missing, show the API key setup flow first
  if (apiKeyStatus === 'checking' || apiKeyStatus === 'missing') {
    // Layout component already handles this, so AppContent will simply not render its children
    return null;
  }

  // If API key is present but user is not authenticated, show AuthScreen
  if (!isAuthenticated && !isAuthLoading) {
    return <AuthScreen />;
  }

  // If authenticated, render the main app content
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
    // Add a key to force remounting and trigger CSS animation on screen change
    <div key={activeScreen} className="min-h-full animate-fade-in">
      {renderScreen()}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider> {/* Wrap Layout with AuthProvider */}
      <Layout>
        <AppContent />
      </Layout>
    </AuthProvider>
  );
};

export default App;