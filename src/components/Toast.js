// src/components/Toast.js
// Beautiful, non-blocking notification system to replace all alert() calls
import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Icons for each toast type
const ToastIcon = ({ type }) => {
  switch (type) {
    case 'success':
      return (
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)' }}>
          <svg className="w-5 h-5" style={{ color: 'var(--color-success)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      );
    case 'error':
      return (
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)' }}>
          <svg className="w-5 h-5" style={{ color: 'var(--color-danger)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      );
    case 'warning':
      return (
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)' }}>
          <svg className="w-5 h-5" style={{ color: 'var(--color-warning)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
      );
    case 'info':
    default:
      return (
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)' }}>
          <svg className="w-5 h-5" style={{ color: 'var(--color-info)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      );
  }
};

const getBorderColor = (type) => {
  switch (type) {
    case 'success': return 'var(--color-success)';
    case 'error': return 'var(--color-danger)';
    case 'warning': return 'var(--color-warning)';
    case 'info': default: return 'var(--color-info)';
  }
};

// Single Toast Item
const ToastItem = ({ toast, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (toast.duration === 0) return; // Persistent toast
    
    const duration = toast.duration || 4000;
    const startTime = Date.now();
    
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      
      if (remaining <= 0) {
        clearInterval(progressInterval);
      }
    }, 50);
    
    const timer = setTimeout(() => {
      handleDismiss();
    }, duration);
    
    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [toast.duration]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => onDismiss(toast.id), 300);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl shadow-2xl mb-3 transform transition-all duration-300 ${
        isExiting ? 'translate-x-full opacity-0 scale-95' : 'translate-x-0 opacity-100 scale-100'
      }`}
      style={{
        backgroundColor: 'var(--color-surface)',
        border: `1px solid var(--color-border)`,
        borderLeft: `4px solid ${getBorderColor(toast.type)}`,
        maxWidth: '420px',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="flex items-start gap-3 p-4">
        <ToastIcon type={toast.type} />
        
        <div className="flex-1 min-w-0">
          {toast.title && (
            <p className="font-semibold text-sm" style={{ color: 'var(--color-textPrimary)' }}>
              {toast.title}
            </p>
          )}
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-textSecondary)' }}>
            {toast.message}
          </p>
          
          {/* Action buttons */}
          {toast.actions && (
            <div className="flex gap-2 mt-3">
              {toast.actions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => { action.onClick(); handleDismiss(); }}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                  style={{
                    backgroundColor: idx === 0 ? 'var(--color-primary)' : 'transparent',
                    color: idx === 0 ? 'var(--color-textInverse)' : 'var(--color-primary)',
                    border: idx === 0 ? 'none' : '1px solid var(--color-border)',
                  }}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 rounded-lg p-1 transition-colors hover:bg-opacity-10"
          style={{ color: 'var(--color-textMuted)' }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-backgroundSecondary)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Progress bar */}
      {toast.duration !== 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}>
          <div
            className="h-full transition-all duration-100 ease-linear"
            style={{
              width: `${progress}%`,
              backgroundColor: getBorderColor(toast.type),
              opacity: 0.6,
            }}
          />
        </div>
      )}
    </div>
  );
};

// Toast Provider & Container
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((options) => {
    const id = Date.now() + Math.random();
    const toast = {
      id,
      type: options.type || 'info',
      title: options.title || null,
      message: options.message || '',
      duration: options.duration !== undefined ? options.duration : 4000,
      actions: options.actions || null,
    };
    setToasts(prev => [...prev, toast]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Convenience methods
  const success = useCallback((message, options = {}) => {
    return addToast({ type: 'success', message, ...options });
  }, [addToast]);

  const error = useCallback((message, options = {}) => {
    return addToast({ type: 'error', message, duration: 6000, ...options });
  }, [addToast]);

  const warning = useCallback((message, options = {}) => {
    return addToast({ type: 'warning', message, duration: 5000, ...options });
  }, [addToast]);

  const info = useCallback((message, options = {}) => {
    return addToast({ type: 'info', message, ...options });
  }, [addToast]);

  const value = { addToast, removeToast, success, error, warning, info };

  return (
    <ToastContext.Provider value={value}>
      {children}
      
      {/* Toast Container - Fixed position */}
      <div className="fixed top-4 right-4 z-[100] pointer-events-none" style={{ maxWidth: '420px', width: '100%' }}>
        <div className="flex flex-col items-end pointer-events-auto">
          {toasts.map(toast => (
            <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
