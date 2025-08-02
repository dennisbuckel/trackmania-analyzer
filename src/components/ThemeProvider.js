import React, { createContext, useContext, useState, useEffect } from 'react';

// Theme definitions - Only default blue and dark mode
const themes = {
  // Light theme - Default Blue
  default: {
    name: 'Light Mode',
    mode: 'light',
    colors: {
      primary: '#3b82f6',
      primaryHover: '#2563eb',
      secondary: '#6b7280',
      secondaryHover: '#4b5563',
      accent: '#8b5cf6',
      accentHover: '#7c3aed',
      success: '#10b981',
      successHover: '#059669',
      warning: '#f59e0b',
      warningHover: '#d97706',
      danger: '#ef4444',
      dangerHover: '#dc2626',
      info: '#06b6d4',
      infoHover: '#0891b2',
      
      // Background colors
      background: '#f8fafc',
      backgroundSecondary: '#f1f5f9',
      surface: '#ffffff',
      surfaceHover: '#f8fafc',
      
      // Text colors
      textPrimary: '#1f2937',
      textSecondary: '#6b7280',
      textMuted: '#9ca3af',
      textInverse: '#ffffff',
      
      // Border colors
      border: '#e5e7eb',
      borderHover: '#d1d5db',
      
      // Glass effect
      glass: 'rgba(255, 255, 255, 0.8)',
      glassHover: 'rgba(255, 255, 255, 0.9)',
      glassBorder: 'rgba(255, 255, 255, 0.2)',
      
      // Gradients
      gradientFrom: '#3b82f6',
      gradientTo: '#8b5cf6',
      backgroundGradient: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)',
    }
  },
  
  // Dark theme
  darkDefault: {
    name: 'Dark Mode',
    mode: 'dark',
    colors: {
      primary: '#60a5fa',
      primaryHover: '#3b82f6',
      secondary: '#9ca3af',
      secondaryHover: '#6b7280',
      accent: '#a78bfa',
      accentHover: '#8b5cf6',
      success: '#34d399',
      successHover: '#10b981',
      warning: '#fbbf24',
      warningHover: '#f59e0b',
      danger: '#f87171',
      dangerHover: '#ef4444',
      info: '#22d3ee',
      infoHover: '#06b6d4',
      
      background: '#0f172a',
      backgroundSecondary: '#1e293b',
      surface: '#334155',
      surfaceHover: '#475569',
      
      textPrimary: '#f8fafc',
      textSecondary: '#e2e8f0',
      textMuted: '#cbd5e1',
      textInverse: '#0f172a',
      
      border: '#64748b',
      borderHover: '#94a3b8',
      
      glass: 'rgba(51, 65, 85, 0.9)',
      glassHover: 'rgba(71, 85, 105, 0.95)',
      glassBorder: 'rgba(96, 165, 250, 0.3)',
      
      gradientFrom: '#60a5fa',
      gradientTo: '#a78bfa',
      backgroundGradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    }
  }
};

// Theme context
const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Initialize theme synchronously to prevent FOUC
  const getInitialTheme = () => {
    try {
      const savedTheme = localStorage.getItem('trackmania-theme');
      const savedDarkMode = localStorage.getItem('trackmania-dark-mode') === 'true';
      
      if (savedTheme && themes[savedTheme]) {
        return { theme: savedTheme, darkMode: savedDarkMode };
      }
      
      // Check system preference if no saved preference
      if (!localStorage.getItem('trackmania-dark-mode')) {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        return { 
          theme: prefersDark ? 'darkDefault' : 'default', 
          darkMode: prefersDark 
        };
      }
      
      return { theme: 'default', darkMode: savedDarkMode };
    } catch (error) {
      // Fallback for test environments or localStorage issues
      return { theme: 'default', darkMode: false };
    }
  };

  const initialState = getInitialTheme();
  const [currentTheme, setCurrentTheme] = useState(initialState.theme);
  const [isDarkMode, setIsDarkMode] = useState(initialState.darkMode);

  // Apply theme immediately on mount to prevent FOUC
  useEffect(() => {
    const applyThemeImmediately = () => {
      const theme = themes[currentTheme];
      if (!theme) return;

      const root = document.documentElement;
      
      // Apply all color variables immediately
      Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value);
      });
      
      // Apply theme class to body immediately
      document.body.className = document.body.className.replace(/theme-\w+/g, '');
      document.body.classList.add(`theme-${currentTheme}`);
      
      // Apply dark/light mode class immediately
      if (theme.mode === 'dark' || isDarkMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    };

    // Apply theme synchronously
    applyThemeImmediately();
  }, []); // Empty dependency array - only run once on mount

  // Apply theme to CSS custom properties
  useEffect(() => {
    const theme = themes[currentTheme];
    if (!theme) return;

    const root = document.documentElement;
    
    // Apply all color variables
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    
    // Apply theme class to body
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${currentTheme}`);
    
    // Apply dark/light mode class
    if (theme.mode === 'dark' || isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    
    // Save to localStorage
    localStorage.setItem('trackmania-theme', currentTheme);
    localStorage.setItem('trackmania-dark-mode', isDarkMode.toString());
  }, [currentTheme, isDarkMode]);

  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
      // Update dark mode state based on theme
      const theme = themes[themeName];
      setIsDarkMode(theme.mode === 'dark');
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    // Switch between default and darkDefault themes
    if (newDarkMode) {
      setCurrentTheme('darkDefault');
    } else {
      setCurrentTheme('default');
    }
  };

  const getThemeColors = () => {
    return themes[currentTheme]?.colors || themes.default.colors;
  };

  const getAvailableThemes = () => {
    return Object.entries(themes).map(([key, theme]) => ({
      key,
      name: theme.name,
      mode: theme.mode,
      colors: theme.colors
    }));
  };

  const getCurrentTheme = () => {
    return themes[currentTheme] || themes.default;
  };

  const value = {
    currentTheme,
    isDarkMode,
    changeTheme,
    toggleDarkMode,
    getThemeColors,
    getAvailableThemes,
    getCurrentTheme,
    themes
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
