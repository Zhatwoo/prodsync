'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { cn, generateId } from '../../lib/utils';

// Toast Context
const ToastContext = createContext();

// Toast Provider
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  
  const addToast = useCallback((toast) => {
    const id = generateId('toast');
    const newToast = {
      id,
      type: 'info',
      duration: 5000,
      ...toast
    };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove toast after duration
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
    
    return id;
  }, []);
  
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);
  
  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);
  
  return (
    <ToastContext.Provider value={{ addToast, removeToast, clearAllToasts }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

// Toast Hook
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast Container
const ToastContainer = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

// Individual Toast Item
const ToastItem = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  
  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);
  
  const handleRemove = () => {
    setIsLeaving(true);
    setTimeout(() => onRemove(toast.id), 300);
  };
  
  const getToastStyles = (type) => {
    const styles = {
      success: 'bg-green-50 border-green-200 text-green-800',
      error: 'bg-red-50 border-red-200 text-red-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800'
    };
    return styles[type] || styles.info;
  };
  
  const getIcon = (type) => {
    const icons = {
      success: (
        <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      error: (
        <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      ),
      warning: (
        <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ),
      info: (
        <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      )
    };
    return icons[type] || icons.info;
  };
  
  return (
    <div
      className={cn(
        'max-w-sm w-full rounded-lg border p-4 shadow-lg transition-all duration-300',
        'transform',
        isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
        getToastStyles(toast.type)
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getIcon(toast.type)}
        </div>
        
        <div className="ml-3 flex-1">
          {toast.title && (
            <h3 className="text-sm font-medium">
              {toast.title}
            </h3>
          )}
          
          {toast.message && (
            <p className={cn(
              'text-sm',
              toast.title ? 'mt-1' : ''
            )}>
              {toast.message}
            </p>
          )}
          
          {toast.action && (
            <div className="mt-3">
              {toast.action}
            </div>
          )}
        </div>
        
        <div className="ml-4 flex-shrink-0">
          <button
            type="button"
            onClick={handleRemove}
            className={cn(
              'rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
              'hover:bg-black hover:bg-opacity-10',
              toast.type === 'success' && 'focus:ring-green-500',
              toast.type === 'error' && 'focus:ring-red-500',
              toast.type === 'warning' && 'focus:ring-yellow-500',
              toast.type === 'info' && 'focus:ring-blue-500'
            )}
            aria-label="Close notification"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Toast Component (for manual rendering)
const Toast = ({
  type = 'info',
  title,
  message,
  action,
  duration = 5000,
  onClose,
  className,
  ...props
}) => {
  const { addToast } = useToast();
  
  useEffect(() => {
    const id = addToast({
      type,
      title,
      message,
      action,
      duration,
      onClose
    });
    
    return () => {
      // Cleanup if component unmounts
      if (onClose) {
        onClose(id);
      }
    };
  }, [addToast, type, title, message, action, duration, onClose]);
  
  return null;
};

// Convenience functions
export const toast = {
  success: (message, options = {}) => {
    const { addToast } = useToast();
    return addToast({ type: 'success', message, ...options });
  },
  
  error: (message, options = {}) => {
    const { addToast } = useToast();
    return addToast({ type: 'error', message, ...options });
  },
  
  warning: (message, options = {}) => {
    const { addToast } = useToast();
    return addToast({ type: 'warning', message, ...options });
  },
  
  info: (message, options = {}) => {
    const { addToast } = useToast();
    return addToast({ type: 'info', message, ...options });
  }
};

export { Toast };
