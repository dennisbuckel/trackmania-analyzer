// src/components/QuickActions.js
import React, { useState } from 'react';
import { getTranslation } from '../i18n/translations';

const QuickActions = ({ playerData, onAction }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Language is now fixed to English
  const t = (key, params = {}) => getTranslation(key, 'en', params);

  const quickActions = [
    {
      id: 'add-data',
      icon: '➕',
      label: t('quickActions.addData'),
      description: t('quickActions.addDataDesc'),
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => onAction('add-data')
    },
    {
      id: 'export-data',
      icon: '📤',
      label: t('quickActions.exportData'),
      description: t('quickActions.exportDataDesc'),
      color: 'bg-green-500 hover:bg-green-600',
      action: () => onAction('export-data')
    },
    {
      id: 'view-trends',
      icon: '📊',
      label: t('quickActions.viewTrends'),
      description: t('quickActions.viewTrendsDesc'),
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => onAction('view-trends')
    },
    {
      id: 'best-performance',
      icon: '🏆',
      label: t('quickActions.bestPerformance'),
      description: t('quickActions.bestPerformanceDesc'),
      color: 'bg-yellow-500 hover:bg-yellow-600',
      action: () => onAction('best-performance')
    },
    {
      id: 'map-analysis',
      icon: '🗺️',
      label: t('quickActions.mapAnalysis'),
      description: t('quickActions.mapAnalysisDesc'),
      color: 'bg-indigo-500 hover:bg-indigo-600',
      action: () => onAction('map-analysis')
    },
    {
      id: 'share-stats',
      icon: '🔗',
      label: t('quickActions.shareStats'),
      description: t('quickActions.shareStatsDesc'),
      color: 'bg-pink-500 hover:bg-pink-600',
      action: () => onAction('share-stats')
    }
  ];

  const toggleExpanded = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsExpanded(!isExpanded);
      setIsAnimating(false);
    }, 150);
  };

  const handleActionClick = (action) => {
    action.action();
    setIsExpanded(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Quick Action Buttons */}
      <div className={`mb-4 space-y-2 transition-all duration-300 ${
        isExpanded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4 pointer-events-none'
      }`}>
        {quickActions.map((action, index) => (
          <div
            key={action.id}
            className={`transform transition-all duration-300 ${
              isExpanded ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
            }`}
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <button
              onClick={() => handleActionClick(action)}
              className={`${action.color} text-white p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 flex items-center group`}
            >
              <span className="text-xl">{action.icon}</span>
              
              {/* Tooltip */}
              <div className="absolute right-full mr-3 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="font-medium">{action.label}</div>
                <div className="text-xs text-gray-300">{action.description}</div>
                
                {/* Arrow */}
                <div className="absolute top-1/2 left-full transform -translate-y-1/2 border-l-4 border-l-gray-800 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Main FAB Button */}
      <button
        onClick={toggleExpanded}
        className={`bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 ${
          isExpanded ? 'rotate-45 scale-110' : 'rotate-0 scale-100'
        } ${isAnimating ? 'scale-95' : ''}`}
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
          />
        </svg>
      </button>

      {/* Background overlay when expanded */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 -z-10"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
};

export default QuickActions;
