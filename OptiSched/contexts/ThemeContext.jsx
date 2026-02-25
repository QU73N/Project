import { createContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const deviceTheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(deviceTheme === 'dark');

  const colors = {
    light: {
      background: '#f8f9fa',
      card: '#ffffff',
      text: '#1f2937',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
      primary: '#3b82f6',
      primaryDark: '#1d4ed8',
      accent: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      shadow: 'rgba(0, 0, 0, 0.1)',
    },
    dark: {
      background: '#111827',
      card: '#1f2937',
      text: '#f9fafb',
      textSecondary: '#9ca3af',
      border: '#374151',
      primary: '#60a5fa',
      primaryDark: '#3b82f6',
      accent: '#34d399',
      warning: '#fbbf24',
      error: '#f87171',
      shadow: 'rgba(0, 0, 0, 0.3)',
    }
  };

  const currentColors = isDarkMode ? colors.dark : colors.light;

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const setTheme = (theme) => {
    setIsDarkMode(theme === 'dark');
  };

  return (
    <ThemeContext.Provider value={{ 
      isDarkMode, 
      colors: currentColors,
      toggleTheme,
      setTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
}
