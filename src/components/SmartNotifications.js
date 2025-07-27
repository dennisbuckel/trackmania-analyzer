// src/components/SmartNotifications.js
import React, { useState, useEffect } from 'react';
import { getTranslation } from '../i18n/translations';

const SmartNotifications = ({ playerData, onDismiss }) => {
  const [notifications, setNotifications] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  
  // Language is now fixed to English
  const t = (key, params = {}) => getTranslation(key, 'en', params);

  useEffect(() => {
    if (playerData && playerData.length > 0) {
      const newNotifications = generateSmartNotifications(playerData);
      setNotifications(newNotifications);
      setIsVisible(newNotifications.length > 0);
    }
  }, [playerData]);

  const generateSmartNotifications = (data) => {
    const notifications = [];
    
    // Verbesserungstrend erkennen
    if (data.length >= 5) {
      const recent5 = data.slice(0, 5);
      const avgRecent = recent5.reduce((sum, item) => sum + (item.percentile || 50), 0) / recent5.length;
      const previous5 = data.slice(5, 10);
      
      if (previous5.length >= 5) {
        const avgPrevious = previous5.reduce((sum, item) => sum + (item.percentile || 50), 0) / previous5.length;
        const improvement = avgPrevious - avgRecent;
        
        if (improvement > 5) {
          notifications.push({
            id: 'improvement',
            type: 'success',
            icon: '📈',
            title: t('notifications.improvement'),
            message: t('notifications.improvementMsg', { percent: improvement.toFixed(1) }),
            action: 'Show Performance',
            priority: 'high'
          });
        }
      }
    }

    // Division 1 Streak
    const div1Streak = calculateDivisionStreak(data, 1);
    if (div1Streak >= 3) {
      notifications.push({
        id: 'div1-streak',
        type: 'achievement',
        icon: '🏆',
        title: t('notifications.div1Streak'),
        message: t('notifications.div1StreakMsg', { count: div1Streak }),
        action: 'Show Statistics',
        priority: 'high'
      });
    }

    // Persönlicher Rekord
    const bestPercentile = Math.min(...data.map(item => item.percentile || 100));
    const latestBest = data.find(item => item.percentile === bestPercentile);
    if (latestBest && data.indexOf(latestBest) < 3) {
      notifications.push({
        id: 'personal-best',
        type: 'achievement',
        icon: '🎯',
        title: t('notifications.personalBest'),
        message: t('notifications.personalBestMsg', { percent: bestPercentile.toFixed(1), map: latestBest.map }),
        action: 'Show Details',
        priority: 'high'
      });
    }


    // Konsistenz-Warnung
    const recentVariance = calculatePerformanceVariance(data.slice(0, 10));
    if (recentVariance > 15) {
      notifications.push({
        id: 'consistency-warning',
        type: 'warning',
        icon: '⚠️',
        title: t('notifications.consistencyWarning'),
        message: t('notifications.consistencyWarningMsg'),
        action: 'Show Trends',
        priority: 'medium'
      });
    }

    // Qualifikations-Tipp
    const qualiData = data.filter(item => item.qualificationPercentile);
    if (qualiData.length >= 5) {
      const avgQuali = qualiData.slice(0, 5).reduce((sum, item) => sum + item.qualificationPercentile, 0) / 5;
      const avgFinal = qualiData.slice(0, 5).reduce((sum, item) => sum + (item.percentile || 50), 0) / 5;
      
      if (avgQuali < avgFinal - 5) {
        notifications.push({
          id: 'qualification-tip',
          type: 'tip',
          icon: '🎯',
          title: t('notifications.qualificationTip'),
          message: t('notifications.qualificationTipMsg'),
          action: 'Show Quali Stats',
          priority: 'low'
        });
      }
    }

    return notifications.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  const calculateDivisionStreak = (data, targetDivision) => {
    let streak = 0;
    for (const item of data) {
      if (item.division === targetDivision) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };


  const calculatePerformanceVariance = (data) => {
    const percentiles = data.map(item => item.percentile || 50);
    const avg = percentiles.reduce((sum, val) => sum + val, 0) / percentiles.length;
    const variance = percentiles.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / percentiles.length;
    return Math.sqrt(variance);
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (notifications.length <= 1) {
      setIsVisible(false);
      onDismiss?.();
    }
  };

  const dismissAll = () => {
    setNotifications([]);
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible || notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-40 max-w-sm space-y-2">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-3 border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-lg mr-2">🔔</span>
            <h3 className="font-semibold text-gray-800">{t('smartInsights')}</h3>
          </div>
          <button
            onClick={dismissAll}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            {t('dismissAll')}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          className={`bg-white rounded-lg shadow-lg p-4 border-l-4 transform transition-all duration-300 hover:scale-105 ${
            notification.type === 'success' ? 'border-green-500' :
            notification.type === 'achievement' ? 'border-yellow-500' :
            notification.type === 'warning' ? 'border-red-500' :
            'border-blue-500'
          }`}
          style={{
            animationDelay: `${index * 100}ms`,
            animation: 'slideInRight 0.3s ease-out forwards'
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <span className="text-xl mr-2">{notification.icon}</span>
                <h4 className="font-semibold text-gray-800 text-sm">
                  {notification.title}
                </h4>
              </div>
              <p className="text-gray-600 text-xs leading-relaxed mb-3">
                {notification.message}
              </p>
              {notification.action && (
                <button className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                  {notification.action} →
                </button>
              )}
            </div>
            <button
              onClick={() => dismissNotification(notification.id)}
              className="text-gray-400 hover:text-gray-600 ml-2"
            >
              ×
            </button>
          </div>
        </div>
      ))}

      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default SmartNotifications;
