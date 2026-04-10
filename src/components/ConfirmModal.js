// src/components/ConfirmModal.js
// Beautiful, theme-aware confirmation dialog to replace all window.confirm() calls
import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';

const ConfirmContext = createContext();

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
};

const ConfirmDialog = ({ config, onResolve }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => setIsVisible(true));
    
    // Keyboard handling
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleCancel();
      if (e.key === 'Enter') handleConfirm();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleConfirm = () => {
    setIsExiting(true);
    setTimeout(() => onResolve(true), 200);
  };

  const handleCancel = () => {
    setIsExiting(true);
    setTimeout(() => onResolve(false), 200);
  };

  const getIconBg = () => {
    switch (config.variant) {
      case 'danger': return 'rgba(239, 68, 68, 0.1)';
      case 'warning': return 'rgba(245, 158, 11, 0.1)';
      case 'info': return 'rgba(59, 130, 246, 0.1)';
      default: return 'rgba(59, 130, 246, 0.1)';
    }
  };

  const getIconColor = () => {
    switch (config.variant) {
      case 'danger': return 'var(--color-danger)';
      case 'warning': return 'var(--color-warning)';
      case 'info': return 'var(--color-info)';
      default: return 'var(--color-primary)';
    }
  };

  const getConfirmBg = () => {
    switch (config.variant) {
      case 'danger': return 'var(--color-danger)';
      case 'warning': return 'var(--color-warning)';
      default: return 'var(--color-primary)';
    }
  };

  const renderIcon = () => {
    switch (config.variant) {
      case 'danger':
        return (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      default:
        return (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-all duration-200 ${
        isVisible && !isExiting ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleCancel}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Dialog */}
      <div
        className={`relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-200 ${
          isVisible && !isExiting ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Icon */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: getIconBg(), color: getIconColor() }}
          >
            {config.icon || renderIcon()}
          </div>
          
          {/* Title */}
          <h3 className="text-lg font-bold text-center mb-2" style={{ color: 'var(--color-textPrimary)' }}>
            {config.title || 'Are you sure?'}
          </h3>
          
          {/* Message */}
          <p className="text-sm text-center leading-relaxed mb-6" style={{ color: 'var(--color-textSecondary)' }}>
            {config.message || 'This action cannot be undone.'}
          </p>
          
          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 py-2.5 px-4 rounded-xl font-medium text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                backgroundColor: 'var(--color-backgroundSecondary)',
                color: 'var(--color-textPrimary)',
                border: '1px solid var(--color-border)',
              }}
            >
              {config.cancelLabel || 'Cancel'}
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 py-2.5 px-4 rounded-xl font-medium text-sm transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg"
              style={{
                backgroundColor: getConfirmBg(),
                color: 'white',
              }}
              autoFocus
            >
              {config.confirmLabel || 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ConfirmProvider = ({ children }) => {
  const [confirmState, setConfirmState] = useState(null);

  const confirm = useCallback((config = {}) => {
    return new Promise((resolve) => {
      setConfirmState({
        config: typeof config === 'string' ? { message: config } : config,
        resolve,
      });
    });
  }, []);

  const handleResolve = (result) => {
    if (confirmState) {
      confirmState.resolve(result);
      setConfirmState(null);
    }
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {confirmState && (
        <ConfirmDialog
          config={confirmState.config}
          onResolve={handleResolve}
        />
      )}
    </ConfirmContext.Provider>
  );
};

export default ConfirmProvider;
