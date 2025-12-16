
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User, AppScreen } from './types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check localStorage for existing session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (e) {
        console.error("Failed to parse stored user from localStorage:", e);
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  const saveMockUsers = (users: { [email: string]: string }) => {
    localStorage.setItem('mockUsers', JSON.stringify(users));
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate Google login delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate success
      const mockUser: User = {
        id: 'google-user-123',
        email: 'google.user@example.com',
        name: 'Usuário Google',
      };
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      // alert('Login com Google bem-sucedido!'); 
    } catch (e: any) {
      setError(e.message || 'Falha no login com Google.');
      console.error("Google login error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const registerWithEmailPassword = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate registration delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Read current mockUsers from localStorage to get the latest state
      const currentMockUsers = JSON.parse(localStorage.getItem('mockUsers') || '{}');

      if (currentMockUsers[email]) {
        throw new Error('Este e-mail já está registrado.');
      }

      // Basic validation
      if (password.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres.');
      }

      currentMockUsers[email] = password; // In a real app, hash this password!
      saveMockUsers(currentMockUsers); // Save updated users

      const newUser: User = { id: Date.now().toString(), email: email };
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      alert('Conta criada com sucesso!');
    } catch (e: any) {
      setError(e.message || 'Falha no registro.');
      console.error("Registration error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithEmailPassword = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate login delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Read current mockUsers from localStorage to get the latest state
      const currentMockUsers = JSON.parse(localStorage.getItem('mockUsers') || '{}');

      // DEMO IMPROVEMENT: Auto-register if user does not exist to prevent "Credenciais inválidas" confusion during testing
      if (!currentMockUsers[email]) {
          currentMockUsers[email] = password;
          saveMockUsers(currentMockUsers);
      } else if (currentMockUsers[email] !== password) {
        throw new Error('Credenciais inválidas.');
      }

      const loggedInUser: User = { id: 'email-user-' + email, email: email };
      setUser(loggedInUser);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
      // alert('Login bem-sucedido!');
    } catch (e: any) {
      setError(e.message || 'Falha no login.');
      console.error("Email/Password login error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('currentUser');
    // alert('Você foi desconectado.');
  };

  const authContextValue: AuthContextType = {
    isAuthenticated,
    user,
    isLoading,
    error,
    loginWithGoogle,
    registerWithEmailPassword,
    loginWithEmailPassword,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
