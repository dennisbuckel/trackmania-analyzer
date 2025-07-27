// src/components/KeyboardShortcuts.js
import React, { useState, useEffect } from 'react';
import { getTranslation } from '../i18n/translations';

const KeyboardShortcuts = ({ onAction }) => {
  const [showHelp, setShowHelp] = useState(false);
  const [pressedKeys, setPressedKeys] = useState(new Set());
  
  // Language is now fixed to English
  const t = (key, params = {}) => getTranslation(key, 'en', params);

  const shortcuts = [
    { keys: ['Ctrl', 'K'], action: 'search', description: t('shortcuts.openSearch') },
    { keys: ['Ctrl', 'N'], action: 'add-data', description: t('shortcuts.addNewData') },
    { keys: ['Ctrl', 'E'], action: 'export', description: t('shortcuts.exportData') },
    { keys: ['Ctrl', 'D'], action: 'delete', description: t('shortcuts.deleteAllData') },
    { keys: ['Ctrl', '1'], action: 'view-performance', description: t('shortcuts.performanceView') },
    { keys: ['Ctrl', '2'], action: 'view-division', description: t('shortcuts.divisionView') },
    { keys: ['Ctrl', '3'], action: 'view-progress', description: t('shortcuts.progressView') },
    { keys: ['Ctrl', '4'], action: 'view-points', description: t('shortcuts.pointsView') },
    { keys: ['Ctrl', '5'], action: 'view-rank', description: t('shortcuts.rankView') },
    { keys: ['?'], action: 'help', description: t('shortcuts.showShortcuts') },
    { keys: ['Escape'], action: 'close', description: t('shortcuts.closeDialogs') },
    { keys: ['Ctrl', 'F'], action: 'focus-search', description: t('shortcuts.focusSearch') },
    { keys: ['Ctrl', 'R'], action: 'refresh', description: t('shortcuts.refreshData') },
    { keys: ['Ctrl', 'S'], action: 'save', description: t('shortcuts.saveFilter') }
  ];

  useEffect(() => {
    const handleKeyDown = (event) => {
      const newPressedKeys = new Set(pressedKeys);
      
      // Add modifier keys
      if (event.ctrlKey) newPressedKeys.add('Ctrl');
      if (event.shiftKey) newPressedKeys.add('Shift');
      if (event.altKey) newPressedKeys.add('Alt');
      if (event.metaKey) newPressedKeys.add('Meta');
      
      // Add the actual key
      newPressedKeys.add(event.key);
      
      setPressedKeys(newPressedKeys);

      // Check for shortcuts
      const shortcut = shortcuts.find(s => 
        s.keys.length === newPressedKeys.size &&
        s.keys.every(key => newPressedKeys.has(key))
      );

      if (shortcut) {
        event.preventDefault();
        handleShortcut(shortcut.action);
      }
    };

    const handleKeyUp = () => {
      setPressedKeys(new Set());
    };

    // Don't attach listeners if user is typing in an input
    const handleGlobalKeyDown = (event) => {
      const activeElement = document.activeElement;
      const isTyping = activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.contentEditable === 'true'
      );

      if (!isTyping) {
        handleKeyDown(event);
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [pressedKeys]);

  const handleShortcut = (action) => {
    switch (action) {
      case 'help':
        setShowHelp(!showHelp);
        break;
      case 'close':
        setShowHelp(false);
        onAction?.('close-dialogs');
        break;
      case 'search':
        onAction?.('open-search');
        break;
      case 'add-data':
        onAction?.('add-data');
        break;
      case 'export':
        onAction?.('export-data');
        break;
      case 'delete':
        onAction?.('delete-data');
        break;
      case 'view-performance':
        onAction?.('set-view', 'performance');
        break;
      case 'view-division':
        onAction?.('set-view', 'division');
        break;
      case 'view-progress':
        onAction?.('set-view', 'divisionProgress');
        break;
      case 'view-points':
        onAction?.('set-view', 'points');
        break;
      case 'view-rank':
        onAction?.('set-view', 'divisionRank');
        break;
      case 'focus-search':
        const searchInput = document.querySelector('input[type="text"]');
        if (searchInput) {
          searchInput.focus();
        }
        break;
      case 'refresh':
        onAction?.('refresh-data');
        break;
      case 'save':
        onAction?.('save-filter');
        break;
      default:
        break;
    }
  };

  const formatKeys = (keys) => {
    return keys.map(key => {
      switch (key) {
        case 'Ctrl': return '⌃';
        case 'Shift': return '⇧';
        case 'Alt': return '⌥';
        case 'Meta': return '⌘';
        case 'Escape': return 'Esc';
        default: return key;
      }
    }).join(' + ');
  };

  const groupedShortcuts = {
    [t('navigation')]: shortcuts.filter(s => ['view-performance', 'view-division', 'view-progress', 'view-points', 'view-rank'].includes(s.action)),
    [t('actions')]: shortcuts.filter(s => ['search', 'add-data', 'export', 'delete', 'refresh', 'save'].includes(s.action)),
    [t('general')]: shortcuts.filter(s => ['help', 'close', 'focus-search'].includes(s.action))
  };

  return (
    <>
      {/* Keyboard shortcut indicator */}
      <div className="fixed bottom-4 left-4 z-40">
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors group"
          title={`${t('keyboardShortcuts')} (?)`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {t('keyboardShortcuts')} (?)
          </div>
        </button>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{t('keyboardShortcuts')}</h2>
                  <p className="text-gray-300 mt-1">{t('keyboardShortcutsDesc')}</p>
                </div>
                <button 
                  onClick={() => setShowHelp(false)}
                  className="text-gray-300 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
                <div key={category} className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-1">
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {categoryShortcuts.map((shortcut, index) => (
                      <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <span className="text-gray-700">{shortcut.description}</span>
                        <div className="flex items-center space-x-1">
                          {shortcut.keys.map((key, keyIndex) => (
                            <React.Fragment key={keyIndex}>
                              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono text-gray-800 shadow-sm">
                                {formatKeys([key])}
                              </kbd>
                              {keyIndex < shortcut.keys.length - 1 && (
                                <span className="text-gray-400 text-xs">+</span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Tips */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">{t('tips')}</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  {t('shortcutTips').map((tip, index) => (
                    <li key={index}>• {tip}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 p-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {shortcuts.length} {t('shortcutsAvailable')}
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="btn-primary"
              >
                {t('understood')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Visual feedback for pressed keys (development mode) */}
      {process.env.NODE_ENV === 'development' && pressedKeys.size > 0 && (
        <div className="fixed top-4 left-4 bg-black text-white px-3 py-2 rounded-lg text-sm z-50">
          {Array.from(pressedKeys).map(key => formatKeys([key])).join(' + ')}
        </div>
      )}
    </>
  );
};

export default KeyboardShortcuts;
