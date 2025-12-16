

export enum AppScreen {
  Devotional = 'Início',
  Bible = 'Bíblia',
  Study = 'Perfil', // Re-purposed Study screen as Profile/Settings
  Tracks = 'Jornadas',
  Journal = 'Diário',
}

export interface DevotionalContent {
  verse: string;
  reflection: string;
  prayer: string;
  action: string;
}

export interface BibleBook {
  name: string;
  chapters: number;
}

export interface BibleTranslation {
  id: string;
  name: string;
}

export interface SpiritualTrack {
  id: string;
  title: string;
  description: string;
  progress: number; // 0-100
  icon: string; // SVG path or similar
  imageUrl: string; // URL for background image
  daysCount?: number; // Optional for new design, e.g. "21 Dias"
  category?: string; // Optional for categories like "Ansiedade"
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  tags?: string[]; // New: Tags for categorization (e.g., "Gratidão", "Reflexão")
}

export interface Habit {
  id: string;
  name: string;
  frequency: string;
  completedDates: string[]; // YYYY-MM-DD
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  completed: boolean;
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AppContextType {
  theme: 'light' | 'dark'; // Keep theme for internal logic, but UI will be dark-first
  toggleTheme: () => void;
  activeScreen: AppScreen;
  setActiveScreen: (screen: AppScreen) => void;
  nightModeStory: string | null;
  loadNightModeStory: () => Promise<void>;
  isNightModeStoryLoading: boolean;
  apiKey: string | null;
  getApiKey: () => string | null;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  loginWithGoogle: () => Promise<void>;
  registerWithEmailPassword: (email: string, password: string) => Promise<void>;
  loginWithEmailPassword: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Define the AIStudio interface separately
interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

// Declare window and process types globally within the module context to augment existing global types
interface Window {
  aistudio: AIStudio;
}
// Correct way to extend process.env for TypeScript in a module
namespace NodeJS {
  interface ProcessEnv {
    API_KEY?: string;
  }
}