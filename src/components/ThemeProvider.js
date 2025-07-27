import React, { createContext, useContext, useState, useEffect } from 'react';

// Theme definitions
const themes = {
  // Light themes
  default: {
    name: 'Default Blue',
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
  
  ocean: {
    name: 'Ocean Breeze',
    mode: 'light',
    colors: {
      primary: '#0ea5e9',
      primaryHover: '#0284c7',
      secondary: '#64748b',
      secondaryHover: '#475569',
      accent: '#06b6d4',
      accentHover: '#0891b2',
      success: '#059669',
      successHover: '#047857',
      warning: '#f59e0b',
      warningHover: '#d97706',
      danger: '#e11d48',
      dangerHover: '#be185d',
      info: '#3b82f6',
      infoHover: '#2563eb',
      
      background: '#f0f9ff',
      backgroundSecondary: '#e0f2fe',
      surface: '#ffffff',
      surfaceHover: '#f0f9ff',
      
      textPrimary: '#0c4a6e',
      textSecondary: '#0369a1',
      textMuted: '#0284c7',
      textInverse: '#ffffff',
      
      border: '#bae6fd',
      borderHover: '#7dd3fc',
      
      glass: 'rgba(240, 249, 255, 0.8)',
      glassHover: 'rgba(240, 249, 255, 0.9)',
      glassBorder: 'rgba(14, 165, 233, 0.2)',
      
      gradientFrom: '#0ea5e9',
      gradientTo: '#06b6d4',
      backgroundGradient: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
    }
  },
  
  forest: {
    name: 'Forest Green',
    mode: 'light',
    colors: {
      primary: '#059669',
      primaryHover: '#047857',
      secondary: '#6b7280',
      secondaryHover: '#4b5563',
      accent: '#84cc16',
      accentHover: '#65a30d',
      success: '#22c55e',
      successHover: '#16a34a',
      warning: '#eab308',
      warningHover: '#ca8a04',
      danger: '#dc2626',
      dangerHover: '#b91c1c',
      info: '#0891b2',
      infoHover: '#0e7490',
      
      background: '#f0fdf4',
      backgroundSecondary: '#dcfce7',
      surface: '#ffffff',
      surfaceHover: '#f0fdf4',
      
      textPrimary: '#14532d',
      textSecondary: '#166534',
      textMuted: '#22c55e',
      textInverse: '#ffffff',
      
      border: '#bbf7d0',
      borderHover: '#86efac',
      
      glass: 'rgba(240, 253, 244, 0.8)',
      glassHover: 'rgba(240, 253, 244, 0.9)',
      glassBorder: 'rgba(5, 150, 105, 0.2)',
      
      gradientFrom: '#059669',
      gradientTo: '#84cc16',
      backgroundGradient: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
    }
  },
  
  sunset: {
    name: 'Sunset Orange',
    mode: 'light',
    colors: {
      primary: '#ea580c',
      primaryHover: '#dc2626',
      secondary: '#78716c',
      secondaryHover: '#57534e',
      accent: '#f59e0b',
      accentHover: '#d97706',
      success: '#16a34a',
      successHover: '#15803d',
      warning: '#eab308',
      warningHover: '#ca8a04',
      danger: '#dc2626',
      dangerHover: '#b91c1c',
      info: '#0891b2',
      infoHover: '#0e7490',
      
      background: '#fff7ed',
      backgroundSecondary: '#fed7aa',
      surface: '#ffffff',
      surfaceHover: '#fff7ed',
      
      textPrimary: '#9a3412',
      textSecondary: '#c2410c',
      textMuted: '#ea580c',
      textInverse: '#ffffff',
      
      border: '#fed7aa',
      borderHover: '#fdba74',
      
      glass: 'rgba(255, 247, 237, 0.8)',
      glassHover: 'rgba(255, 247, 237, 0.9)',
      glassBorder: 'rgba(234, 88, 12, 0.2)',
      
      gradientFrom: '#ea580c',
      gradientTo: '#f59e0b',
      backgroundGradient: 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)',
    }
  },
  
  purple: {
    name: 'Royal Purple',
    mode: 'light',
    colors: {
      primary: '#7c3aed',
      primaryHover: '#6d28d9',
      secondary: '#6b7280',
      secondaryHover: '#4b5563',
      accent: '#a855f7',
      accentHover: '#9333ea',
      success: '#10b981',
      successHover: '#059669',
      warning: '#f59e0b',
      warningHover: '#d97706',
      danger: '#ef4444',
      dangerHover: '#dc2626',
      info: '#06b6d4',
      infoHover: '#0891b2',
      
      background: '#faf5ff',
      backgroundSecondary: '#f3e8ff',
      surface: '#ffffff',
      surfaceHover: '#faf5ff',
      
      textPrimary: '#581c87',
      textSecondary: '#7c2d92',
      textMuted: '#a855f7',
      textInverse: '#ffffff',
      
      border: '#e9d5ff',
      borderHover: '#d8b4fe',
      
      glass: 'rgba(250, 245, 255, 0.8)',
      glassHover: 'rgba(250, 245, 255, 0.9)',
      glassBorder: 'rgba(124, 58, 237, 0.2)',
      
      gradientFrom: '#7c3aed',
      gradientTo: '#a855f7',
      backgroundGradient: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
    }
  },
  
  // Dark themes
  darkDefault: {
    name: 'Dark Blue',
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
  },
  
  darkOcean: {
    name: 'Dark Ocean',
    mode: 'dark',
    colors: {
      primary: '#38bdf8',
      primaryHover: '#0ea5e9',
      secondary: '#9ca3af',
      secondaryHover: '#6b7280',
      accent: '#22d3ee',
      accentHover: '#06b6d4',
      success: '#2dd4bf',
      successHover: '#14b8a6',
      warning: '#fbbf24',
      warningHover: '#f59e0b',
      danger: '#fb7185',
      dangerHover: '#f43f5e',
      info: '#60a5fa',
      infoHover: '#3b82f6',
      
      background: '#0f172a',
      backgroundSecondary: '#1e293b',
      surface: '#334155',
      surfaceHover: '#475569',
      
      textPrimary: '#f0f9ff',
      textSecondary: '#e2e8f0',
      textMuted: '#cbd5e1',
      textInverse: '#0f172a',
      
      border: '#64748b',
      borderHover: '#94a3b8',
      
      glass: 'rgba(51, 65, 85, 0.9)',
      glassHover: 'rgba(71, 85, 105, 0.95)',
      glassBorder: 'rgba(56, 189, 248, 0.3)',
      
      gradientFrom: '#38bdf8',
      gradientTo: '#22d3ee',
      backgroundGradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    }
  },
  
  darkForest: {
    name: 'Dark Forest',
    mode: 'dark',
    colors: {
      primary: '#4ade80',
      primaryHover: '#22c55e',
      secondary: '#9ca3af',
      secondaryHover: '#6b7280',
      accent: '#a3e635',
      accentHover: '#84cc16',
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
      
      textPrimary: '#f0fdf4',
      textSecondary: '#e2e8f0',
      textMuted: '#cbd5e1',
      textInverse: '#0f172a',
      
      border: '#64748b',
      borderHover: '#94a3b8',
      
      glass: 'rgba(51, 65, 85, 0.9)',
      glassHover: 'rgba(71, 85, 105, 0.95)',
      glassBorder: 'rgba(74, 222, 128, 0.3)',
      
      gradientFrom: '#4ade80',
      gradientTo: '#a3e635',
      backgroundGradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    }
  },
  
  darkSunset: {
    name: 'Dark Sunset',
    mode: 'dark',
    colors: {
      primary: '#fb923c',
      primaryHover: '#f97316',
      secondary: '#9ca3af',
      secondaryHover: '#6b7280',
      accent: '#fbbf24',
      accentHover: '#f59e0b',
      success: '#34d399',
      successHover: '#10b981',
      warning: '#fcd34d',
      warningHover: '#fbbf24',
      danger: '#f87171',
      dangerHover: '#ef4444',
      info: '#22d3ee',
      infoHover: '#06b6d4',
      
      background: '#0f172a',
      backgroundSecondary: '#1e293b',
      surface: '#334155',
      surfaceHover: '#475569',
      
      textPrimary: '#fff7ed',
      textSecondary: '#e2e8f0',
      textMuted: '#cbd5e1',
      textInverse: '#0f172a',
      
      border: '#64748b',
      borderHover: '#94a3b8',
      
      glass: 'rgba(51, 65, 85, 0.9)',
      glassHover: 'rgba(71, 85, 105, 0.95)',
      glassBorder: 'rgba(251, 146, 60, 0.3)',
      
      gradientFrom: '#fb923c',
      gradientTo: '#fbbf24',
      backgroundGradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    }
  },
  
  darkPurple: {
    name: 'Dark Purple',
    mode: 'dark',
    colors: {
      primary: '#a78bfa',
      primaryHover: '#8b5cf6',
      secondary: '#9ca3af',
      secondaryHover: '#6b7280',
      accent: '#c084fc',
      accentHover: '#a855f7',
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
      
      textPrimary: '#faf5ff',
      textSecondary: '#e2e8f0',
      textMuted: '#cbd5e1',
      textInverse: '#0f172a',
      
      border: '#64748b',
      borderHover: '#94a3b8',
      
      glass: 'rgba(51, 65, 85, 0.9)',
      glassHover: 'rgba(71, 85, 105, 0.95)',
      glassBorder: 'rgba(167, 139, 250, 0.3)',
      
      gradientFrom: '#a78bfa',
      gradientTo: '#c084fc',
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
  const [currentTheme, setCurrentTheme] = useState('default');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('trackmania-theme');
    const savedDarkMode = localStorage.getItem('trackmania-dark-mode') === 'true';
    
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
    
    setIsDarkMode(savedDarkMode);
    
    // Check system preference if no saved preference
    if (!localStorage.getItem('trackmania-dark-mode')) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

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
    
    // Switch to corresponding dark/light theme
    const currentThemeData = themes[currentTheme];
    if (!currentThemeData) return;
    
    if (newDarkMode) {
      // Switch to dark version
      const baseName = currentTheme.replace('dark', '');
      const darkThemeName = baseName === 'default' ? 'darkDefault' : `dark${baseName.charAt(0).toUpperCase() + baseName.slice(1)}`;
      if (themes[darkThemeName]) {
        setCurrentTheme(darkThemeName);
      } else {
        // Fallback to darkDefault
        setCurrentTheme('darkDefault');
      }
    } else {
      // Switch to light version
      if (currentTheme.startsWith('dark')) {
        const baseName = currentTheme.replace('dark', '').toLowerCase();
        const lightThemeName = baseName === 'default' ? 'default' : baseName;
        if (themes[lightThemeName]) {
          setCurrentTheme(lightThemeName);
        } else {
          // Fallback to default
          setCurrentTheme('default');
        }
      }
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
