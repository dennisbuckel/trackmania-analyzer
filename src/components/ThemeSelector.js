import React, { useState } from 'react';
import { useTheme } from './ThemeProvider';

const ThemeSelector = () => {
  const { 
    currentTheme, 
    isDarkMode, 
    changeTheme, 
    toggleDarkMode, 
    getAvailableThemes, 
    getCurrentTheme 
  } = useTheme();
  
  const [isOpen, setIsOpen] = useState(false);
  const availableThemes = getAvailableThemes();
  const currentThemeData = getCurrentTheme();

  // Group themes by mode
  const lightThemes = availableThemes.filter(theme => theme.mode === 'light');
  const darkThemes = availableThemes.filter(theme => theme.mode === 'dark');

  const handleThemeChange = (themeKey) => {
    changeTheme(themeKey);
    setIsOpen(false);
  };

  const ThemePreview = ({ theme, isSelected, onClick }) => (
    <button
      onClick={() => onClick(theme.key)}
      className={`
        relative w-full p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105
        ${isSelected 
          ? 'border-blue-500 shadow-lg ring-2 ring-blue-200' 
          : 'border-gray-200 hover:border-gray-300'
        }
      `}
      style={{
        background: theme.colors.backgroundGradient,
        color: theme.colors.textPrimary
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-sm">{theme.name}</span>
        {isSelected && (
          <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white"></div>
          </div>
        )}
      </div>
      
      {/* Color palette preview */}
      <div className="flex gap-1 mb-2">
        <div 
          className="w-4 h-4 rounded-full border border-white/20"
          style={{ backgroundColor: theme.colors.primary }}
        ></div>
        <div 
          className="w-4 h-4 rounded-full border border-white/20"
          style={{ backgroundColor: theme.colors.accent }}
        ></div>
        <div 
          className="w-4 h-4 rounded-full border border-white/20"
          style={{ backgroundColor: theme.colors.success }}
        ></div>
        <div 
          className="w-4 h-4 rounded-full border border-white/20"
          style={{ backgroundColor: theme.colors.warning }}
        ></div>
      </div>
      
      {/* Mini UI preview */}
      <div className="space-y-1">
        <div 
          className="h-2 rounded"
          style={{ backgroundColor: theme.colors.surface }}
        ></div>
        <div className="flex gap-1">
          <div 
            className="h-1.5 rounded flex-1"
            style={{ backgroundColor: theme.colors.primary }}
          ></div>
          <div 
            className="h-1.5 rounded w-8"
            style={{ backgroundColor: theme.colors.secondary }}
          ></div>
        </div>
      </div>
    </button>
  );

  return (
    <div className="relative">
      {/* Theme selector button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        style={{
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-textPrimary)',
          border: `1px solid var(--color-border)`
        }}
      >
        <div className="flex items-center gap-2">
          {/* Current theme indicator */}
          <div className="flex gap-1">
            <div 
              className="w-3 h-3 rounded-full border border-white/20"
              style={{ backgroundColor: 'var(--color-primary)' }}
            ></div>
            <div 
              className="w-3 h-3 rounded-full border border-white/20"
              style={{ backgroundColor: 'var(--color-accent)' }}
            ></div>
          </div>
          
          <span className="text-sm font-medium">
            {currentThemeData.name}
          </span>
          
          {/* Dark mode indicator */}
          {currentThemeData.mode === 'dark' && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-white">
              Dark
            </span>
          )}
        </div>
        
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Theme selector dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          ></div>
          
          {/* Dropdown content */}
          <div 
            className="absolute top-full right-0 mt-2 w-80 rounded-xl shadow-2xl border z-50 max-h-96 overflow-y-auto"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 
                  className="text-lg font-semibold"
                  style={{ color: 'var(--color-textPrimary)' }}
                >
                  🎨 Choose Theme
                </h3>
                
                {/* Dark mode toggle */}
                <button
                  onClick={toggleDarkMode}
                  className={`
                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    ${isDarkMode ? 'bg-blue-600' : 'bg-gray-300'}
                  `}
                >
                  <span
                    className={`
                      inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200
                      ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}
                    `}
                  />
                  <span className="sr-only">Toggle dark mode</span>
                </button>
              </div>

              {/* Light themes */}
              <div className="mb-6">
                <h4 
                  className="text-sm font-medium mb-3 flex items-center gap-2"
                  style={{ color: 'var(--color-textSecondary)' }}
                >
                  ☀️ Light Themes
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {lightThemes.map((theme) => (
                    <ThemePreview
                      key={theme.key}
                      theme={theme}
                      isSelected={currentTheme === theme.key && !isDarkMode}
                      onClick={handleThemeChange}
                    />
                  ))}
                </div>
              </div>

              {/* Dark themes */}
              <div>
                <h4 
                  className="text-sm font-medium mb-3 flex items-center gap-2"
                  style={{ color: 'var(--color-textSecondary)' }}
                >
                  🌙 Dark Themes
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {darkThemes.map((theme) => (
                    <ThemePreview
                      key={theme.key}
                      theme={theme}
                      isSelected={currentTheme === theme.key && isDarkMode}
                      onClick={handleThemeChange}
                    />
                  ))}
                </div>
              </div>

              {/* Quick actions */}
              <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      // Reset to system preference
                      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                      if (prefersDark) {
                        changeTheme('darkDefault');
                      } else {
                        changeTheme('default');
                      }
                      setIsOpen(false);
                    }}
                    className="flex-1 px-3 py-2 text-xs rounded-lg transition-colors duration-200 hover:opacity-80"
                    style={{
                      backgroundColor: 'var(--color-secondary)',
                      color: 'var(--color-textInverse)'
                    }}
                  >
                    🔄 System Default
                  </button>
                  
                  <button
                    onClick={() => {
                      // Random theme
                      const randomTheme = availableThemes[Math.floor(Math.random() * availableThemes.length)];
                      changeTheme(randomTheme.key);
                      setIsOpen(false);
                    }}
                    className="flex-1 px-3 py-2 text-xs rounded-lg transition-colors duration-200 hover:opacity-80"
                    style={{
                      backgroundColor: 'var(--color-accent)',
                      color: 'var(--color-textInverse)'
                    }}
                  >
                    🎲 Surprise Me
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSelector;
