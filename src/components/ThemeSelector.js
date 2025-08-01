import React from 'react';
import { useTheme } from './ThemeProvider';

const ThemeSelector = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <div className="relative">
      {/* Simple dark mode toggle button */}
      <button
        onClick={toggleDarkMode}
        className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        style={{
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-textPrimary)',
          border: `1px solid var(--color-border)`
        }}
        title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        <div className="flex items-center gap-2">
          {/* Mode icon */}
          <span className="text-lg">
            {isDarkMode ? '☀️' : '🌙'}
          </span>
          
          <span className="text-sm font-medium">
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </span>
        </div>
      </button>
    </div>
  );
};

export default ThemeSelector;
