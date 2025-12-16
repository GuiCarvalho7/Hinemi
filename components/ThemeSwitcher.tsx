import React from 'react';
import { AppContextType } from '../types';

interface ThemeSwitcherProps {
  toggleTheme: AppContextType['toggleTheme'];
  theme: AppContextType['theme'];
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ toggleTheme, theme }) => {
  return (
    <label htmlFor="theme-toggle" className="flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          id="theme-toggle"
          className="sr-only"
          checked={theme === 'dark'}
          onChange={toggleTheme}
        />
        <div className="block bg-surface-dark w-12 h-6 rounded-full dark:bg-surface-dark transition-colors duration-300"></div>
        <div className="dot absolute left-1 top-1 bg-text-white w-4 h-4 rounded-full transition-all duration-300 transform dark:translate-x-6"></div>
      </div>
      <span className="ml-2 text-text-muted text-sm font-sans font-medium">
        {theme === 'dark' ? 'Modo Noite' : 'Modo Dia'}
      </span>
    </label>
  );
};

export default ThemeSwitcher;