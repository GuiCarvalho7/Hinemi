import React from 'react';
import { AppScreen } from '../types';

interface NavbarProps {
  activeScreen: AppScreen;
  setActiveScreen: (screen: AppScreen) => void;
  theme: 'light' | 'dark'; // Keep theme prop for potential future theme-specific icon logic, though main UI is dark
}

const Navbar: React.FC<NavbarProps> = ({ activeScreen, setActiveScreen }) => { // Removed theme from destructuring as it's not directly used for icon color logic in new design
  const navItems = [
    {
      screen: AppScreen.Devotional,
      label: 'Início',
      icon: 'home_app_logo',
    },
    {
      screen: AppScreen.Tracks,
      label: 'Jornadas',
      icon: 'explore',
    },
    {
      screen: AppScreen.Bible,
      label: 'Bíblia',
      icon: 'auto_stories',
    },
    {
      screen: AppScreen.Journal,
      label: 'Diário',
      icon: 'edit_note',
    },
    {
      screen: AppScreen.Study, // Mapped StudyScreen to Profile
      label: 'Perfil',
      icon: 'person',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/5 bg-background-dark/95 backdrop-blur-xl pb-6 pt-2">
      <div className="mx-auto flex max-w-md items-center justify-around px-2">
        {navItems.map((item) => (
          <a
            key={item.screen}
            onClick={() => setActiveScreen(item.screen)}
            className={`group flex flex-col items-center gap-1 p-2 cursor-pointer ${
              activeScreen === item.screen ? 'text-premium-gold' : 'text-text-muted hover:text-text-white'
            } transition-colors`}
          >
            <span
              className={`material-symbols-outlined text-2xl transition-transform group-hover:-translate-y-0.5 ${
                activeScreen === item.screen ? 'icon-filled drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]' : ''
              }`}
            >
              {item.icon}
            </span>
            <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;